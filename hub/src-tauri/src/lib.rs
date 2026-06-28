pub mod runtime_status;
pub mod manifest;

use runtime_status::{GameStatus, HubRuntimeStatus, InstallDevDependenciesResult, UninstallDevDependenciesResult, DevGameProcessStatus, LaunchDevGameResult, StopDevGameResult};
use manifest::{AcademyManifest, GameManifestEntry};
use std::path::{Path, PathBuf};
use std::fs;
use std::process::{Command, Child, Stdio};
use std::sync::Mutex;
use std::collections::HashMap;
use tauri::{State, Manager};

pub struct TrackedProcess {
    pub child: Child,
    pub port: u16,
    pub started_at: String,
    pub package_name: String,
}

pub struct DevProcessManager {
    pub processes: Mutex<HashMap<String, TrackedProcess>>,
}

fn get_workspace_root() -> Option<PathBuf> {
    // 1. Try resolving from current_dir
    if let Ok(mut current) = std::env::current_dir() {
        for _ in 0..6 {
            if current.join("manifests/academy.games.json").exists() {
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
            if exe_path.join("manifests/academy.games.json").exists() {
                return Some(exe_path);
            }
            if !exe_path.pop() {
                break;
            }
        }
    }
    
    None
}

fn load_manifest() -> Option<AcademyManifest> {
    let root = get_workspace_root()?;
    let manifest_path = root.join("manifests/academy.games.json");
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

    let mut processes = state.processes.lock().unwrap();

    if let Some(tracked) = processes.get_mut(&game_id) {
        if let Ok(Some(_)) = tracked.child.try_wait() {
            // exited
        } else {
            result.blocked_reason = Some("Game dev server is already running".to_string());
            return Ok(result);
        }
    }

    let port = if game_id.starts_with("level-") {
        if let Ok(num) = game_id["level-".len()..].parse::<u16>() {
            5100 + num
        } else {
            5100
        }
    } else {
        5100
    };

    let started_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs()
        .to_string();

    #[cfg(target_os = "windows")]
    let mut cmd = Command::new("cmd");
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        cmd.args(["/C", "pnpm", "--filter", &package_name, "dev", "--", "--host", "127.0.0.1", "--port", &port.to_string()]);
        cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW
    }

    #[cfg(not(target_os = "windows"))]
    let mut cmd = Command::new("pnpm");
    #[cfg(not(target_os = "windows"))]
    cmd.args(["--filter", &package_name, "dev", "--", "--host", "127.0.0.1", "--port", &port.to_string()]);

    cmd.current_dir(&root);
    cmd.stdout(Stdio::null());
    cmd.stderr(Stdio::null());

    result.command_label = format!("pnpm --filter {} dev -- --host 127.0.0.1 --port {}", package_name, port);
    result.launch_attempted = true;

    match cmd.spawn() {
        Ok(child) => {
            result.ok = true;
            result.pid = Some(child.id());
            result.port = Some(port);
            result.url = Some(format!("http://127.0.0.1:{}", port));
            result.started_at = Some(started_at.clone());
            
            processes.insert(game_id.clone(), TrackedProcess {
                child,
                port,
                started_at,
                package_name,
            });
        }
        Err(e) => {
            result.error_state = Some(format!("Failed to spawn process: {}", e));
        }
    }

    Ok(result)
}

#[tauri::command]
fn stop_dev_game(
    game_id: String,
    state: State<'_, DevProcessManager>,
) -> Result<StopDevGameResult, String> {
    let mut result = StopDevGameResult {
        game_id: game_id.clone(),
        ok: false,
        stop_attempted: false,
        pid: None,
        stopped_at: None,
        blocked_reason: None,
        error_state: None,
    };

    let mut processes = state.processes.lock().unwrap();
    if let Some(mut tracked) = processes.remove(&game_id) {
        result.pid = Some(tracked.child.id());
        result.stop_attempted = true;

        #[cfg(target_os = "windows")]
        let _ = Command::new("taskkill").args(["/PID", &tracked.child.id().to_string(), "/T", "/F"]).output();

        match tracked.child.kill() {
            Ok(_) => {
                let _ = tracked.child.wait(); // reap
                result.ok = true;
                result.stopped_at = Some(std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs().to_string());
            }
            Err(e) => {
                // Ignore if it's already dead, especially since taskkill might have worked
                if tracked.child.try_wait().map(|v| v.is_some()).unwrap_or(false) {
                    result.ok = true;
                    result.stopped_at = Some(std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs().to_string());
                } else {
                    result.error_state = Some(format!("Failed to kill process: {}", e));
                    processes.insert(game_id, tracked);
                }
            }
        }
    } else {
        result.blocked_reason = Some("No tracked process running for this game".to_string());
    }

    Ok(result)
}

#[tauri::command]
fn list_dev_game_processes(state: State<'_, DevProcessManager>) -> Result<Vec<DevGameProcessStatus>, String> {
    let mut processes = state.processes.lock().unwrap();
    let mut statuses = Vec::new();
    let mut dead = Vec::new();

    for (game_id, tracked) in processes.iter_mut() {
        let running = match tracked.child.try_wait() {
            Ok(Some(_)) => false,
            Ok(None) => true,
            Err(_) => false,
        };

        if !running {
            dead.push(game_id.clone());
        } else {
            statuses.push(DevGameProcessStatus {
                game_id: game_id.clone(),
                running: true,
                pid: Some(tracked.child.id()),
                url: Some(format!("http://127.0.0.1:{}", tracked.port)),
                port: Some(tracked.port),
                started_at: Some(tracked.started_at.clone()),
                package_name: Some(tracked.package_name.clone()),
                error_state: None,
            });
        }
    }

    for d in dead {
        processes.remove(&d);
    }

    Ok(statuses)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        get_diagnostic_info,
        get_runtime_status,
        get_game_status,
        list_game_statuses,
        install_dev_dependencies,
        uninstall_dev_dependencies,
        launch_dev_game,
        stop_dev_game,
        list_dev_game_processes
    ])
    .setup(|app| {
      app.manage(DevProcessManager {
          processes: Mutex::new(HashMap::new()),
      });
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
