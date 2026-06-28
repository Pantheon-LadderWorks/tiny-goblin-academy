use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GameStatus {
    pub game_id: String,
    pub slug: String,
    pub listed: bool,
    pub source_directory_exists: bool,
    pub package_json_exists: bool,
    pub workspace_member: bool,
    pub node_modules_exists: bool,
    pub has_dev_script: bool,
    pub has_build_script: bool,
    pub has_preview_script: bool,
    pub dist_exists: bool,
    pub dist_has_index_html: bool,
    pub dist_asset_count: u32,
    pub build_status: String,
    
    // Dev Action Model
    pub dev_launch_available: bool,
    pub dev_install_deps_available: bool,
    pub dev_uninstall_deps_available: bool,
    pub dev_launch_blocked_reason: Option<String>,

    // Prod Action Model
    pub production_install_available: bool,
    pub production_uninstall_available: bool,
    pub production_launch_available: bool,
    pub production_update_available: bool,
    pub production_action_blocked_reason: Option<String>,

    // H3.4 Compatibility fields
    pub source_available: bool,
    pub dependencies_installed: bool,
    pub dev_runnable: bool,
    pub build_available: bool,

    pub installed: bool,
    pub installable: bool,
    pub playable_available: bool,
    pub playable_mode: String,
    pub runtime_managed: bool,
    pub distribution_ready: bool,
    pub update_available: bool,
    pub installed_version: Option<String>,
    pub available_version: Option<String>,
    pub install_size: Option<u64>,
    pub last_checked: Option<String>,
    pub last_played: Option<String>,
    pub error_state: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct InstallDevDependenciesResult {
    pub game_id: String,
    pub ok: bool,
    pub command_label: String,
    pub started_at: String,
    pub finished_at: String,
    pub exit_code: Option<i32>,
    pub stdout_tail: String,
    pub stderr_tail: String,
    pub dependencies_installed_after: bool,
    pub error_state: Option<String>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HubRuntimeStatus {
    pub runtime_mode: String,
}
