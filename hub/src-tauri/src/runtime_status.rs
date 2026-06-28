use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GameStatus {
    pub game_id: String,
    pub listed: bool,
    pub source_available: bool,
    pub workspace_member: bool,
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

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HubRuntimeStatus {
    pub runtime_mode: String,
}
