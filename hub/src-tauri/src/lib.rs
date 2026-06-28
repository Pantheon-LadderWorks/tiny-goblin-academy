pub mod runtime_status;
pub mod manifest;

use runtime_status::{GameStatus, HubRuntimeStatus};
use manifest::{AcademyManifest, GameManifestEntry};
use std::path::{Path, PathBuf};
use std::fs;

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
    let mut source_available = false;
    let mut workspace_member = false;
    let mut dependencies_installed = false;
    let mut dev_runnable = false;
    let mut build_available = false;

    if let Some(source_path) = &entry.source_path {
        let full_path = root.join(source_path);
        source_available = full_path.exists();
        
        let package_json_path = full_path.join("package.json");
        workspace_member = package_json_path.exists();
        
        if full_path.join("node_modules").exists() {
            dependencies_installed = true;
        }
        
        if let Ok(content) = fs::read_to_string(&package_json_path) {
            if let Ok(pkg) = serde_json::from_str::<serde_json::Value>(&content) {
                if let Some(scripts) = pkg.get("scripts") {
                    if scripts.get("dev").is_some() {
                        dev_runnable = true;
                    }
                }
            }
        }
        
        if full_path.join("dist").exists() {
            build_available = true;
        }
    }

    GameStatus {
        game_id: entry.id.clone(),
        listed: true,
        source_available,
        workspace_member,
        dependencies_installed,
        dev_runnable,
        build_available,
        installed: false,
        installable: false,
        playable_available: build_available,
        playable_mode: if build_available { "dev".to_string() } else { "none".to_string() },
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        get_diagnostic_info,
        get_runtime_status,
        get_game_status,
        list_game_statuses
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
