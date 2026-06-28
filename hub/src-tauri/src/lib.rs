pub mod runtime_status;
pub mod manifest;

use runtime_status::{GameStatus, HubRuntimeStatus, InstallDevDependenciesResult};
use manifest::{AcademyManifest, GameManifestEntry};
use std::path::{Path, PathBuf};
use std::fs;
use std::process::Command;

fn get_workspace_root() -> Option<PathBuf> {
    // If running in dev mode via Tauri, current_dir is likely hub/src-tauri
    // The workspace root is two levels up.
    if let Ok(mut current) = std::env::current_dir() {
        // Try current_dir
        if current.join("manifests/academy.games.json").exists() {
            return Some(current);
        }
        // Try 1 level up (if running from hub)
        current.pop();
        if current.join("manifests/academy.games.json").exists() {
            return Some(current);
        }
        // Try 2 levels up (if running from hub/src-tauri)
        current.pop();
        if current.join("manifests/academy.games.json").exists() {
            return Some(current);
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        get_diagnostic_info,
        get_runtime_status,
        get_game_status,
        list_game_statuses,
        install_dev_dependencies
    ])
    .setup(|app| {
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
