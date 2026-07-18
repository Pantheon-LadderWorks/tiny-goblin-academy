pub mod runtime_status;
pub mod manifest;

use runtime_status::{GameStatus, HubRuntimeStatus, InstallDevDependenciesResult, UninstallDevDependenciesResult, DevGameProcessStatus, LaunchDevGameResult, StopDevGameResult};
use manifest::{AcademyManifest, GameManifestEntry};
use std::path::{Path, PathBuf};
use std::fs;
use std::process::{Command, Child, Stdio};
use std::sync::Mutex;
use std::collections::HashMap;
use tauri::{State, Manager, RunEvent, WindowEvent};

const ACADEMY_GAMES_MANIFEST_PATH: &str = "manifests/academy/core/academy.games.json";

#[cfg(target_os = "windows")]
mod process_group {
    use std::ffi::c_void;
    use std::mem::size_of;
    use std::process::Child;
    use std::ptr::null_mut;
    use std::os::windows::io::AsRawHandle;

    type Handle = *mut c_void;
    type Bool = i32;
    type Dword = u32;

    const JOB_OBJECT_EXTENDED_LIMIT_INFORMATION_CLASS: i32 = 9;
    const JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE: Dword = 0x0000_2000;

    #[repr(C)]
    struct IoCounters {
        read_operation_count: u64,
        write_operation_count: u64,
        other_operation_count: u64,
        read_transfer_count: u64,
        write_transfer_count: u64,
        other_transfer_count: u64,
    }

    #[repr(C)]
    struct JobObjectBasicLimitInformation {
        per_process_user_time_limit: i64,
        per_job_user_time_limit: i64,
        limit_flags: Dword,
        minimum_working_set_size: usize,
        maximum_working_set_size: usize,
        active_process_limit: Dword,
        affinity: usize,
        priority_class: Dword,
        scheduling_class: Dword,
    }

    #[repr(C)]
    struct JobObjectExtendedLimitInformation {
        basic_limit_information: JobObjectBasicLimitInformation,
        io_info: IoCounters,
        process_memory_limit: usize,
        job_memory_limit: usize,
        peak_process_memory_used: usize,
        peak_job_memory_used: usize,
    }

    #[link(name = "kernel32")]
    extern "system" {
        fn CreateJobObjectW(lp_job_attributes: *mut c_void, lp_name: *const u16) -> Handle;
        fn SetInformationJobObject(
            job: Handle,
            job_object_information_class: i32,
            job_object_information: *const c_void,
            job_object_information_length: Dword,
        ) -> Bool;
        fn AssignProcessToJobObject(job: Handle, process: Handle) -> Bool;
        fn TerminateJobObject(job: Handle, exit_code: u32) -> Bool;
        fn CloseHandle(handle: Handle) -> Bool;
    }

    pub struct ProcessGroup {
        job_handle: usize,
    }

    unsafe impl Send for ProcessGroup {}

    impl ProcessGroup {
        pub fn new() -> Result<Self, String> {
            let handle = unsafe { CreateJobObjectW(null_mut(), std::ptr::null()) };
            if handle.is_null() {
                return Err(format!("CreateJobObjectW failed: {}", std::io::Error::last_os_error()));
            }

            let mut limits = JobObjectExtendedLimitInformation {
                basic_limit_information: JobObjectBasicLimitInformation {
                    per_process_user_time_limit: 0,
                    per_job_user_time_limit: 0,
                    limit_flags: JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE,
                    minimum_working_set_size: 0,
                    maximum_working_set_size: 0,
                    active_process_limit: 0,
                    affinity: 0,
                    priority_class: 0,
                    scheduling_class: 0,
                },
                io_info: IoCounters {
                    read_operation_count: 0,
                    write_operation_count: 0,
                    other_operation_count: 0,
                    read_transfer_count: 0,
                    write_transfer_count: 0,
                    other_transfer_count: 0,
                },
                process_memory_limit: 0,
                job_memory_limit: 0,
                peak_process_memory_used: 0,
                peak_job_memory_used: 0,
            };

            let ok = unsafe {
                SetInformationJobObject(
                    handle,
                    JOB_OBJECT_EXTENDED_LIMIT_INFORMATION_CLASS,
                    &mut limits as *mut _ as *const c_void,
                    size_of::<JobObjectExtendedLimitInformation>() as Dword,
                )
            };

            if ok == 0 {
                let err = std::io::Error::last_os_error();
                unsafe {
                    CloseHandle(handle);
                }
                return Err(format!("SetInformationJobObject failed: {}", err));
            }

            Ok(Self {
                job_handle: handle as usize,
            })
        }

        pub fn assign_child(&self, child: &Child) -> Result<(), String> {
            let process_handle = child.as_raw_handle() as Handle;
            let ok = unsafe { AssignProcessToJobObject(self.job_handle as Handle, process_handle) };
            if ok == 0 {
                return Err(format!("AssignProcessToJobObject failed: {}", std::io::Error::last_os_error()));
            }
            Ok(())
        }

        pub fn terminate(&self) -> Result<(), String> {
            let ok = unsafe { TerminateJobObject(self.job_handle as Handle, 1) };
            if ok == 0 {
                return Err(format!("TerminateJobObject failed: {}", std::io::Error::last_os_error()));
            }
            Ok(())
        }
    }

    impl Drop for ProcessGroup {
        fn drop(&mut self) {
            if self.job_handle != 0 {
                unsafe {
                    CloseHandle(self.job_handle as Handle);
                }
                self.job_handle = 0;
            }
        }
    }
}

#[cfg(not(target_os = "windows"))]
mod process_group {
    use std::process::Child;

    pub struct ProcessGroup;

    impl ProcessGroup {
        pub fn new() -> Result<Self, String> {
            Ok(Self)
        }

        pub fn assign_child(&self, _child: &Child) -> Result<(), String> {
            Ok(())
        }

        pub fn terminate(&self) -> Result<(), String> {
            Ok(())
        }
    }
}

use process_group::ProcessGroup;

pub struct TrackedProcess {
    pub status: String,
    pub child: Option<Child>,
    pub process_group: Option<ProcessGroup>,
    pub port: u16,
    pub started_at: String,
    pub package_name: String,
    pub error_state: Option<String>,
    pub updated_at: Option<String>,
    pub command_label: Option<String>,
    pub workspace_root: Option<String>,
    pub cwd_used: Option<String>,
    pub spawn_attempted: bool,
    pub spawn_succeeded: bool,
    pub readiness_attempts: u32,
    pub last_readiness_error: Option<String>,
    pub stdout_tail: String,
    pub stderr_tail: String,
    pub blocked_reason: Option<String>,
}

pub struct DevProcessManager {
    pub processes: Mutex<HashMap<String, TrackedProcess>>,
    pub shutdown_in_progress: Mutex<bool>,
}

fn get_workspace_root() -> Option<PathBuf> {
    // 1. Try resolving from current_dir
    if let Ok(mut current) = std::env::current_dir() {
        for _ in 0..6 {
            if current.join(ACADEMY_GAMES_MANIFEST_PATH).exists() {
                return Some(current);
            }
            if !current.pop() {
                break;
            }
        }
    }
    
    // 2. Fallback to current_exe() path
    if let Ok(mut exe_path) = std::env::current_exe() {
        exe_path.pop(); // remove executable name
        for _ in 0..6 {
            if exe_path.join(ACADEMY_GAMES_MANIFEST_PATH).exists() {
                return Some(exe_path);
            }
            if !exe_path.pop() {
                break;
            }
        }
    }

    // 3. Local developer release builds may place app.exe outside the repository.
    // Cargo still provides the source manifest directory used to compile the Hub,
    // so validate that path against the canonical Academy manifest before using it.
    let mut source_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    for _ in 0..6 {
        if source_path.join(ACADEMY_GAMES_MANIFEST_PATH).exists() {
            return source_path.canonicalize().ok().or(Some(source_path));
        }
        if !source_path.pop() {
            break;
        }
    }
    
    None
}

fn load_manifest() -> Option<AcademyManifest> {
    let root = get_workspace_root()?;
    let manifest_path = root.join(ACADEMY_GAMES_MANIFEST_PATH);
    let content = fs::read_to_string(manifest_path).ok()?;
    serde_json::from_str(&content).ok()
}

fn compute_game_status(root: &Path, entry: &GameManifestEntry) -> GameStatus {
    let mut source_directory_exists = false;
    let mut package_json_exists = false;
    let mut workspace_member = false;
    let mut node_modules_exists = false;
    let mut has_dev_script = false;
    let mut has_build_script = false;
    let mut has_preview_script = false;
    let mut dist_exists = false;
    let mut dist_has_index_html = false;
    let mut dist_asset_count = 0;

    if let Some(source_path) = &entry.source_path {
        let full_path = root.join(source_path);
        source_directory_exists = full_path.exists();
        
        let package_json_path = full_path.join("package.json");
        package_json_exists = package_json_path.exists();
        workspace_member = package_json_exists;
        
        if full_path.join("node_modules").exists() {
            node_modules_exists = true;
        }
        
        if let Ok(content) = fs::read_to_string(&package_json_path) {
            if let Ok(pkg) = serde_json::from_str::<serde_json::Value>(&content) {
                if let Some(scripts) = pkg.get("scripts") {
                    if scripts.get("dev").is_some() {
                        has_dev_script = true;
                    }
                    if scripts.get("build").is_some() {
                        has_build_script = true;
                    }
                    if scripts.get("preview").is_some() {
                        has_preview_script = true;
                    }
                }
            }
        }
        
        let dist_path = full_path.join("dist");
        if dist_path.exists() {
            dist_exists = true;
            if dist_path.join("index.html").exists() {
                dist_has_index_html = true;
            }
            if let Ok(entries) = fs::read_dir(&dist_path) {
                for _ in entries {
                    dist_asset_count += 1;
                }
            }
        }
    }

    let build_status = if package_json_exists {
        if dist_has_index_html {
            "built".to_string()
        } else if dist_exists {
            "incomplete".to_string()
        } else {
            "not-built".to_string()
        }
    } else {
        "not-applicable".to_string()
    };

    // Compatibility variables
    let source_available = source_directory_exists;
    let dependencies_installed = node_modules_exists;
    let dev_runnable = has_dev_script;
    let build_available = build_status == "built";

    // Action Model Computation
    let dev_install_deps_available = source_directory_exists && !node_modules_exists;
    let dev_uninstall_deps_available = node_modules_exists;
    
    let mut dev_launch_available = false;
    let mut dev_launch_blocked_reason = None;
    if !source_directory_exists {
        dev_launch_blocked_reason = Some("Source code missing".to_string());
    } else if !node_modules_exists {
        dev_launch_blocked_reason = Some("Dependencies not installed".to_string());
    } else if !has_dev_script {
        dev_launch_blocked_reason = Some("No dev script found in package.json".to_string());
    } else {
        dev_launch_available = true;
    }

    GameStatus {
        game_id: entry.id.clone(),
        slug: entry.slug.clone(),
        listed: true,
        source_directory_exists,
        package_json_exists,
        workspace_member,
        node_modules_exists,
        has_dev_script,
        has_build_script,
        has_preview_script,
        dist_exists,
        dist_has_index_html,
        dist_asset_count,
        build_status,

        // Dev Action Model
        dev_launch_available,
        dev_install_deps_available,
        dev_uninstall_deps_available,
        dev_launch_blocked_reason,

        // Prod Action Model
        production_install_available: false,
        production_uninstall_available: false,
        production_launch_available: false,
        production_update_available: false,
        production_action_blocked_reason: Some("Production mode not implemented".to_string()),
        
        // H3.4 Compatibility fields
        source_available,
        dependencies_installed,
        dev_runnable,
        build_available,

        installed: false,
        installable: false,
        playable_available: build_available,
        playable_mode: if build_available { "static".to_string() } else { "none".to_string() },
        runtime_managed: false,
        distribution_ready: false,
        update_available: false,
        installed_version: None,
        available_version: None,
        install_size: None,
        last_checked: None,
        last_played: None,
        error_state: None,
    }
}

#[tauri::command]
fn get_runtime_status() -> HubRuntimeStatus {
    HubRuntimeStatus {
        runtime_mode: "developer".to_string(),
    }
}

#[tauri::command]
fn get_game_status(game_id: String) -> Result<GameStatus, String> {
    let manifest = load_manifest().ok_or_else(|| "Failed to load manifest".to_string())?;
    let entry = manifest.games.iter().find(|g| g.id == game_id).ok_or_else(|| "Game not found".to_string())?;
    let root = get_workspace_root().unwrap();
    Ok(compute_game_status(&root, entry))
}

#[tauri::command]
fn list_game_statuses() -> Result<Vec<GameStatus>, String> {
    let manifest = load_manifest().ok_or_else(|| "Failed to load manifest".to_string())?;
    let root = get_workspace_root().unwrap();
    let mut statuses = Vec::new();
    for entry in &manifest.games {
        statuses.push(compute_game_status(&root, entry));
    }
    Ok(statuses)
}

#[tauri::command]
fn get_diagnostic_info() -> String {
    format!(
        "Tauri bridge online. Platform: {}, Timestamp: {}",
        std::env::consts::OS,
        std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs()
    )
}

#[tauri::command]
fn install_dev_dependencies(game_id: String) -> Result<InstallDevDependenciesResult, String> {
    let manifest = load_manifest().ok_or_else(|| "Failed to load manifest".to_string())?;
    let entry = manifest.games.iter().find(|g| g.id == game_id).ok_or_else(|| "Game not found".to_string())?;
    let root = get_workspace_root().unwrap();
    let status = compute_game_status(&root, entry);

    if !status.dev_install_deps_available {
        return Err("Dependencies are already installed or source is missing".to_string());
    }

    let package_json_path = root.join(entry.source_path.as_ref().unwrap()).join("package.json");
    let content = fs::read_to_string(&package_json_path).map_err(|_| "Failed to read package.json".to_string())?;
    let pkg: serde_json::Value = serde_json::from_str(&content).map_err(|_| "Failed to parse package.json".to_string())?;
    let package_name = pkg.get("name").and_then(|n| n.as_str()).ok_or_else(|| "No name in package.json".to_string())?;

    let started_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs()
        .to_string();

    #[cfg(target_os = "windows")]
    let mut cmd = Command::new("cmd");
    #[cfg(target_os = "windows")]
    cmd.args(["/C", "pnpm", "--filter", package_name, "install"]);

    #[cfg(not(target_os = "windows"))]
    let mut cmd = Command::new("pnpm");
    #[cfg(not(target_os = "windows"))]
    cmd.args(["--filter", package_name, "install"]);

    cmd.current_dir(&root);

    let output = cmd.output().map_err(|e| format!("Failed to spawn pnpm: {}", e))?;

    let finished_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs()
        .to_string();

    let stdout_full = String::from_utf8_lossy(&output.stdout);
    let stderr_full = String::from_utf8_lossy(&output.stderr);

    let stdout_tail = stdout_full.chars().rev().take(2000).collect::<String>().chars().rev().collect::<String>();
    let stderr_tail = stderr_full.chars().rev().take(2000).collect::<String>().chars().rev().collect::<String>();

    let new_status = compute_game_status(&root, entry);

    Ok(InstallDevDependenciesResult {
        game_id,
        ok: output.status.success(),
        command_label: format!("pnpm --filter {} install", package_name),
        started_at,
        finished_at,
        exit_code: output.status.code(),
        stdout_tail,
        stderr_tail,
        dependencies_installed_after: new_status.dependencies_installed,
        error_state: if output.status.success() { None } else { Some("pnpm install failed".to_string()) },
    })
}
#[tauri::command]
fn uninstall_dev_dependencies(game_id: String) -> Result<UninstallDevDependenciesResult, String> {
    let started_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs()
        .to_string();

    let mut result = UninstallDevDependenciesResult {
        game_id: game_id.clone(),
        ok: false,
        uninstall_attempted: false,
        started_at,
        finished_at: "".to_string(),
        target_label: "".to_string(),
        dependency_path_was_present: false,
        dependency_path_removed: false,
        dependencies_installed_after: false,
        blocked_reason: None,
        error_state: None,
    };

    let manifest = match load_manifest() {
        Some(m) => m,
        None => {
            result.blocked_reason = Some("Failed to load manifest".to_string());
            result.finished_at = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs().to_string();
            return Ok(result);
        }
    };

    let entry = match manifest.games.iter().find(|g| g.id == game_id) {
        Some(g) => g,
        None => {
            result.blocked_reason = Some("Game not found in manifest".to_string());
            result.finished_at = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs().to_string();
            return Ok(result);
        }
    };

    let root = match get_workspace_root() {
        Some(r) => r,
        None => {
            result.blocked_reason = Some("Failed to find workspace root".to_string());
            result.finished_at = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs().to_string();
            return Ok(result);
        }
    };

    let source_path_str = match &entry.source_path {
        Some(p) => p,
        None => {
            result.blocked_reason = Some("Game has no source path defined".to_string());
            result.finished_at = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs().to_string();
            return Ok(result);
        }
    };

    // Verify it's within games/tier-1/
    if !source_path_str.starts_with("games/tier-1/") {
        result.blocked_reason = Some("Source path is outside trusted tier-1 sandbox".to_string());
        result.finished_at = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs().to_string();
        return Ok(result);
    }

    let full_source_path = root.join(source_path_str);
    if !full_source_path.exists() {
        result.blocked_reason = Some("Source directory does not exist".to_string());
        result.finished_at = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs().to_string();
        return Ok(result);
    }

    let node_modules_path = full_source_path.join("node_modules");
    result.target_label = format!("{}/node_modules", source_path_str);

    if !node_modules_path.exists() {
        result.blocked_reason = Some("Dependencies are not currently installed".to_string());
        result.finished_at = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs().to_string();
        return Ok(result);
    }
    
    result.dependency_path_was_present = true;

    // Verify it's a directory and not a symlink/junction outside.
    if let Ok(meta) = fs::symlink_metadata(&node_modules_path) {
        if meta.file_type().is_symlink() {
            result.blocked_reason = Some("node_modules is a symlink. Unsafe to delete.".to_string());
            result.finished_at = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs().to_string();
            return Ok(result);
        }
    }

    result.uninstall_attempted = true;
    match fs::remove_dir_all(&node_modules_path) {
        Ok(_) => {
            result.ok = true;
            result.dependency_path_removed = true;
        }
        Err(e) => {
            result.error_state = Some(format!("Failed to delete node_modules: {}", e));
        }
    }

    result.finished_at = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs().to_string();

    let new_status = compute_game_status(&root, entry);
    result.dependencies_installed_after = new_status.dependencies_installed;

    Ok(result)
}

#[tauri::command]
fn launch_dev_game(
    game_id: String,
    state: State<'_, DevProcessManager>,
    app_handle: tauri::AppHandle,
) -> Result<LaunchDevGameResult, String> {
    let mut result = LaunchDevGameResult {
        game_id: game_id.clone(),
        ok: false,
        launch_attempted: false,
        command_label: "".to_string(),
        pid: None,
        url: None,
        port: None,
        started_at: None,
        stdout_tail: "".to_string(),
        stderr_tail: "".to_string(),
        blocked_reason: None,
        error_state: None,
    };

    let manifest = match load_manifest() {
        Some(m) => m,
        None => {
            result.blocked_reason = Some("Failed to load manifest".to_string());
            return Ok(result);
        }
    };

    let entry = match manifest.games.iter().find(|g| g.id == game_id) {
        Some(g) => g,
        None => {
            result.blocked_reason = Some("Game not found in manifest".to_string());
            return Ok(result);
        }
    };

    let root = match get_workspace_root() {
        Some(r) => r,
        None => {
            result.blocked_reason = Some("Failed to find workspace root".to_string());
            return Ok(result);
        }
    };

    let status = compute_game_status(&root, entry);
    if !status.dev_launch_available {
        result.blocked_reason = status.dev_launch_blocked_reason.or(Some("Launch not available".to_string()));
        return Ok(result);
    }

    let source_path_str = entry.source_path.as_ref().unwrap();
    if !source_path_str.starts_with("games/tier-1/") {
        result.blocked_reason = Some("Source path is outside trusted tier-1 sandbox".to_string());
        return Ok(result);
    }

    let package_json_path = root.join(source_path_str).join("package.json");
    let content = match fs::read_to_string(&package_json_path) {
        Ok(c) => c,
        Err(_) => {
            result.blocked_reason = Some("Failed to read package.json".to_string());
            return Ok(result);
        }
    };
    
    let pkg: serde_json::Value = match serde_json::from_str(&content) {
        Ok(p) => p,
        Err(_) => {
            result.blocked_reason = Some("Failed to parse package.json".to_string());
            return Ok(result);
        }
    };

    let package_name = match pkg.get("name").and_then(|n| n.as_str()) {
        Some(n) => n.to_string(),
        None => {
            result.blocked_reason = Some("No name in package.json".to_string());
            return Ok(result);
        }
    };

    {
        let mut processes = state.processes.lock().unwrap();

        if let Some(tracked) = processes.get_mut(&game_id) {
            if tracked.status == "launching" || tracked.status == "running" {
                let mut is_running = true;
                if let Some(child) = &mut tracked.child {
                    if let Ok(Some(_)) = child.try_wait() {
                        is_running = false;
                    }
                } else if tracked.status != "launching" {
                    is_running = false;
                }
                
                if is_running {
                    result.blocked_reason = Some(format!("Game dev server is already {}", tracked.status));
                    return Ok(result);
                }
            }
        }
    }

    let port = if game_id.starts_with("tga-") {
        let parts: Vec<&str> = game_id.split('-').collect();
        if parts.len() >= 2 {
            if let Ok(num) = parts[1].parse::<u16>() {
                5100 + num
            } else {
                result.blocked_reason = Some(format!("Failed to parse level number from game ID '{}'", game_id));
                return Ok(result);
            }
        } else {
            result.blocked_reason = Some(format!("Invalid game ID format '{}'", game_id));
            return Ok(result);
        }
    } else {
        result.blocked_reason = Some(format!("Unrecognized game ID prefix '{}'", game_id));
        return Ok(result);
    };

    // Pre-check if port is already in use
    if std::net::TcpStream::connect(("127.0.0.1", port)).is_ok() {
        result.blocked_reason = Some(format!("Port {} is already in use", port));
        return Ok(result);
    }

    let started_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs()
        .to_string();

    let command_label = format!("pnpm --filter {} dev -- --host 127.0.0.1 --port {} --strictPort", package_name, port);
    result.command_label = command_label.clone();
    result.launch_attempted = true;
    result.ok = true; // Indicates job was accepted

    {
        let mut processes = state.processes.lock().unwrap();
        processes.insert(game_id.clone(), TrackedProcess {
            status: "launching".to_string(),
            child: None,
            process_group: None,
            port,
            started_at: started_at.clone(),
            package_name: package_name.clone(),
            error_state: None,
            updated_at: Some(started_at.clone()),
            command_label: Some(command_label),
            workspace_root: Some(root.to_string_lossy().to_string()),
            cwd_used: Some(root.to_string_lossy().to_string()),
            spawn_attempted: false,
            spawn_succeeded: false,
            readiness_attempts: 0,
            last_readiness_error: None,
            stdout_tail: "".to_string(),
            stderr_tail: "".to_string(),
            blocked_reason: None,
        });
    }

    let g_id = game_id.clone();
    
    std::thread::spawn(move || {
        let state = app_handle.state::<DevProcessManager>();
        
        {
            let mut processes = state.processes.lock().unwrap();
            if let Some(tracked) = processes.get_mut(&g_id) {
                tracked.spawn_attempted = true;
            }
        }

        #[cfg(target_os = "windows")]
        let mut cmd = Command::new("cmd");
        #[cfg(target_os = "windows")]
        cmd.args(["/C", "pnpm"]);
        #[cfg(not(target_os = "windows"))]
        let mut cmd = Command::new("pnpm");

        cmd.args(["--filter", &package_name, "exec", "vite", "--host", "127.0.0.1", "--port", &port.to_string(), "--strictPort"]);

        #[cfg(target_os = "windows")]
        {
            use std::os::windows::process::CommandExt;
            cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW
        }

        cmd.current_dir(&root);
        let log_dir = root.join("hub/src-tauri/.dev-runtime-logs");
        let _ = std::fs::create_dir_all(&log_dir);
        let log_out_path = log_dir.join(format!("{}_out.log", g_id));
        let log_err_path = log_dir.join(format!("{}_err.log", g_id));

        if let Ok(f) = std::fs::File::create(&log_out_path) {
            cmd.stdout(Stdio::from(f));
        } else {
            cmd.stdout(Stdio::null());
        }

        if let Ok(f) = std::fs::File::create(&log_err_path) {
            cmd.stderr(Stdio::from(f));
        } else {
            cmd.stderr(Stdio::null());
        }

        fn read_tail(path: &PathBuf) -> String {
            if let Ok(content) = std::fs::read_to_string(path) {
                let limit = 2000;
                if content.len() > limit {
                    format!("...{}", &content[content.len() - limit..])
                } else {
                    content
                }
            } else {
                "".to_string()
            }
        }

        match cmd.spawn() {
            Ok(mut child) => {
                let process_group = match ProcessGroup::new() {
                    Ok(group) => {
                        if let Err(e) = group.assign_child(&child) {
                            #[cfg(target_os = "windows")]
                            {
                                use std::os::windows::process::CommandExt;
                                let _ = Command::new("taskkill")
                                    .args(["/PID", &child.id().to_string(), "/T", "/F"])
                                    .creation_flags(0x08000000)
                                    .output();
                            }
                            let _ = child.kill();
                            let _ = child.wait();

                            let mut processes = state.processes.lock().unwrap();
                            if let Some(tracked) = processes.get_mut(&g_id) {
                                tracked.status = "failed".to_string();
                                tracked.error_state = Some(format!("Failed to assign process to Academy-owned process group: {}", e));
                                tracked.last_readiness_error = Some("Process ownership setup failed".to_string());
                            }
                            return;
                        }
                        Some(group)
                    }
                    Err(e) => {
                        #[cfg(target_os = "windows")]
                        {
                            use std::os::windows::process::CommandExt;
                            let _ = Command::new("taskkill")
                                .args(["/PID", &child.id().to_string(), "/T", "/F"])
                                .creation_flags(0x08000000)
                                .output();
                        }
                        let _ = child.kill();
                        let _ = child.wait();

                        let mut processes = state.processes.lock().unwrap();
                        if let Some(tracked) = processes.get_mut(&g_id) {
                            tracked.status = "failed".to_string();
                            tracked.error_state = Some(format!("Failed to create Academy-owned process group: {}", e));
                            tracked.last_readiness_error = Some("Process ownership setup failed".to_string());
                        }
                        return;
                    }
                };

                {
                    let mut processes = state.processes.lock().unwrap();
                    if let Some(tracked) = processes.get_mut(&g_id) {
                        tracked.spawn_succeeded = true;
                    }
                }

                let mut ready = false;
                let mut exit_status = None;
                for i in 1..=30 {
                    {
                        let mut processes = state.processes.lock().unwrap();
                        if let Some(tracked) = processes.get_mut(&g_id) {
                            tracked.readiness_attempts = i;
                        }
                    }

                    std::thread::sleep(std::time::Duration::from_millis(500));
                    if std::net::TcpStream::connect(("127.0.0.1", port)).is_ok() {
                        ready = true;
                        break;
                    }
                    if let Ok(Some(status)) = child.try_wait() {
                        exit_status = Some(status);
                        break;
                    }
                }

                if ready {
                    let mut processes = state.processes.lock().unwrap();
                    if let Some(tracked) = processes.get_mut(&g_id) {
                        tracked.child = Some(child);
                        tracked.process_group = process_group;
                        tracked.status = "running".to_string();
                    }
                } else {
                    if let Some(group) = process_group {
                        let _ = group.terminate();
                    }
                    #[cfg(target_os = "windows")]
                    {
                        use std::os::windows::process::CommandExt;
                        let _ = Command::new("taskkill")
                            .args(["/PID", &child.id().to_string(), "/T", "/F"])
                            .creation_flags(0x08000000)
                            .output();
                    }
                    let _ = child.kill();
                    let _ = child.wait();
                    
                    let out_tail = read_tail(&log_out_path);
                    let err_tail = read_tail(&log_err_path);

                    let mut processes = state.processes.lock().unwrap();
                    if let Some(tracked) = processes.get_mut(&g_id) {
                        tracked.status = "failed".to_string();
                        tracked.stdout_tail = out_tail;
                        tracked.stderr_tail = err_tail;
                        if let Some(status) = exit_status {
                            tracked.error_state = Some(format!("Process exited early with status: {}", status));
                            tracked.last_readiness_error = Some("Process exited instead of binding to port".to_string());
                        } else {
                            tracked.error_state = Some("Dev server failed to become ready on expected port within 15 seconds".to_string());
                            tracked.last_readiness_error = Some("Timeout waiting for TCP port".to_string());
                        }
                    }
                }
            }
            Err(e) => {
                let mut processes = state.processes.lock().unwrap();
                if let Some(tracked) = processes.get_mut(&g_id) {
                    tracked.status = "failed".to_string();
                    tracked.error_state = Some(format!("Failed to spawn process: {}", e));
                    tracked.last_readiness_error = Some(e.to_string());
                }
            }
        }
    });

    Ok(result)
}

#[tauri::command]
fn stop_dev_game(
    game_id: String,
    state: State<'_, DevProcessManager>,
) -> Result<StopDevGameResult, String> {
    Ok(stop_dev_game_inner(game_id, &state))
}

fn stop_dev_game_inner(
    game_id: String,
    manager: &DevProcessManager,
) -> StopDevGameResult {
    let mut result = StopDevGameResult {
        game_id: game_id.clone(),
        ok: false,
        stop_attempted: false,
        pid: None,
        stopped_at: None,
        blocked_reason: None,
        error_state: None,
    };

    let mut processes = manager.processes.lock().unwrap();
    if let Some(mut tracked) = processes.remove(&game_id) {
        if let Some(group) = tracked.process_group.take() {
            result.stop_attempted = true;
            if let Err(e) = group.terminate() {
                result.error_state = Some(e);
            }
            // Dropping the job handle is the Windows safety net:
            // JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE terminates any descendants
            // still associated with this Academy-owned runtime.
            drop(group);
        }

        if let Some(mut child) = tracked.child {
            result.pid = Some(child.id());
            result.stop_attempted = true;

            #[cfg(target_os = "windows")]
            {
                use std::os::windows::process::CommandExt;
                let _ = Command::new("taskkill")
                    .args(["/PID", &child.id().to_string(), "/T", "/F"])
                    .creation_flags(0x08000000)
                    .output();
            }

            match child.kill() {
                Ok(_) => {
                    let _ = child.wait(); // reap
                    result.ok = true;
                    result.stopped_at = Some(std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs().to_string());
                }
                Err(e) => {
                    if child.try_wait().map(|v| v.is_some()).unwrap_or(false) {
                        result.ok = true;
                        result.stopped_at = Some(std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs().to_string());
                    } else {
                        let prior_error = result.error_state.take();
                        result.error_state = Some(match prior_error {
                            Some(existing) => format!("{}; Failed to kill process: {}", existing, e),
                            None => format!("Failed to kill process: {}", e),
                        });
                        tracked.child = Some(child);
                        tracked.status = "failed".to_string();
                        processes.insert(game_id, tracked);
                    }
                }
            }
        } else {
            // It was launching or failed, just remove it
            result.stop_attempted = true;
            result.ok = true;
        }
    } else {
        result.blocked_reason = Some("No tracked process running for this game".to_string());
    }

    result
}

fn stop_all_dev_games_inner(manager: &DevProcessManager) -> Vec<StopDevGameResult> {
    let game_ids: Vec<String> = {
        let processes = manager.processes.lock().unwrap();
        processes.keys().cloned().collect()
    };

    game_ids
        .into_iter()
        .map(|game_id| stop_dev_game_inner(game_id, manager))
        .collect()
}

#[tauri::command]
fn stop_all_dev_games(state: State<'_, DevProcessManager>) -> Result<Vec<StopDevGameResult>, String> {
    Ok(stop_all_dev_games_inner(&state))
}

#[tauri::command]
fn list_dev_game_processes(state: State<'_, DevProcessManager>) -> Result<Vec<DevGameProcessStatus>, String> {
    let mut processes = state.processes.lock().unwrap();
    let mut statuses = Vec::new();
    let mut dead = Vec::new();

    for (game_id, tracked) in processes.iter_mut() {
        let mut child_exited = false;
        if let Some(child) = &mut tracked.child {
            if let Ok(Some(_)) = child.try_wait() {
                child_exited = true;
            }
        }

        if child_exited && tracked.status == "running" {
            tracked.status = "failed".to_string();
            tracked.error_state = Some("Process exited unexpectedly".to_string());
        }

        let pid = tracked.child.as_ref().map(|c| c.id());

        statuses.push(DevGameProcessStatus {
            game_id: game_id.clone(),
            status: tracked.status.clone(),
            running: tracked.status == "running",
            pid,
            url: Some(format!("http://127.0.0.1:{}", tracked.port)),
            port: Some(tracked.port),
            started_at: Some(tracked.started_at.clone()),
            package_name: Some(tracked.package_name.clone()),
            error_state: tracked.error_state.clone(),
            updated_at: tracked.updated_at.clone(),
            command_label: tracked.command_label.clone(),
            workspace_root: tracked.workspace_root.clone(),
            cwd_used: tracked.cwd_used.clone(),
            spawn_attempted: tracked.spawn_attempted,
            spawn_succeeded: tracked.spawn_succeeded,
            readiness_attempts: tracked.readiness_attempts,
            last_readiness_error: tracked.last_readiness_error.clone(),
            stdout_tail: tracked.stdout_tail.clone(),
            stderr_tail: tracked.stderr_tail.clone(),
            blocked_reason: tracked.blocked_reason.clone(),
        });

        if tracked.status == "stopped" || (tracked.status == "failed" && child_exited) {
            // For now, let's keep failed states around so the UI can see them.
            // But if the user navigates away and comes back, they might get stuck.
            // To ensure cleanup, if the frontend sees a failed state, it should ideally ack it.
            // Without an ack, we'll leave it here. 
            // Wait, actually, let's auto-clean failed processes if they have no child to avoid infinite list growth.
            // On second thought, let's remove dead children from our tracked list if they are failed.
            if child_exited {
                dead.push(game_id.clone());
            }
        }
    }

    for d in dead {
        processes.remove(&d);
    }

    Ok(statuses)
}

fn has_tracked_dev_games(manager: &DevProcessManager) -> bool {
    let processes = manager.processes.lock().unwrap();
    !processes.is_empty()
}

fn begin_exit_cleanup(app_handle: tauri::AppHandle) -> bool {
    let manager = app_handle.state::<DevProcessManager>();

    {
        let mut shutdown_in_progress = manager.shutdown_in_progress.lock().unwrap();
        if *shutdown_in_progress {
            return false;
        }

        if !has_tracked_dev_games(&manager) {
            return false;
        }

        *shutdown_in_progress = true;
    }

    std::thread::spawn(move || {
        let manager = app_handle.state::<DevProcessManager>();
        let _ = stop_all_dev_games_inner(&manager);
        app_handle.exit(0);
    });

    true
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let builder = tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        get_diagnostic_info,
        get_runtime_status,
        get_game_status,
        list_game_statuses,
        install_dev_dependencies,
        uninstall_dev_dependencies,
        launch_dev_game,
        stop_dev_game,
        stop_all_dev_games,
        list_dev_game_processes
    ])
    .on_window_event(|window, event| {
        if let WindowEvent::CloseRequested { api, .. } = event {
            let app_handle = window.app_handle().clone();
            if begin_exit_cleanup(app_handle) {
                api.prevent_close();
            }
        }
    })
    .setup(|app| {
      app.manage(DevProcessManager {
          processes: Mutex::new(HashMap::new()),
          shutdown_in_progress: Mutex::new(false),
      });
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    });

  let app = builder
    .build(tauri::generate_context!())
    .expect("error while building tauri application");

  app.run(|app_handle, event| {
      match event {
          RunEvent::ExitRequested { api, .. } => {
              if begin_exit_cleanup(app_handle.clone()) {
                  api.prevent_exit();
              }
          }
          RunEvent::Exit => {
              let manager = app_handle.state::<DevProcessManager>();
              let _ = stop_all_dev_games_inner(&manager);
          }
          _ => {}
      }
  });
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn resolves_workspace_when_process_is_launched_outside_repository() {
        let original_dir = std::env::current_dir().expect("current directory should resolve");
        let external_dir = std::env::temp_dir().join(format!(
            "tiny-goblin-academy-external-launch-{}",
            std::process::id()
        ));
        fs::create_dir_all(&external_dir).expect("external launch directory should exist");

        std::env::set_current_dir(&external_dir)
            .expect("test should simulate launching outside the repository");
        let resolved = get_workspace_root();
        std::env::set_current_dir(&original_dir).expect("original directory should be restored");
        fs::remove_dir_all(&external_dir).expect("test launch directory should be removed");

        let expected = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("../..")
            .canonicalize()
            .expect("compiled Hub source workspace should resolve");
        assert_eq!(resolved, Some(expected));
    }
}
