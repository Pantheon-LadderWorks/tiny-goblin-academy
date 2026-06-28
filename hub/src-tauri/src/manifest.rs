use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GameManifestEntry {
    pub id: String,
    pub tier: u32,
    pub level: u32,
    pub title: String,
    pub slug: String,
    pub source_path: Option<String>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AcademyManifest {
    pub schema_version: String,
    pub manifest_type: String,
    pub games: Vec<GameManifestEntry>,
}
