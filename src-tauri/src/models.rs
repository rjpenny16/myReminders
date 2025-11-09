use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum TaskSection {
    Today,
    Upcoming,
    Someday,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum TaskAction {
    None,
    EmailDraft,
    Custom,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Recurrence {
    pub cron: Option<String>,
    pub tz: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub notes: Option<String>,
    pub section: TaskSection,
    #[serde(rename = "dueAt")]
    pub due_at: Option<String>,
    #[serde(rename = "remindAt")]
    pub remind_at: Option<Vec<String>>,
    pub recurrence: Option<Recurrence>,
    pub tags: Option<Vec<String>>,
    pub priority: Option<i32>,
    #[serde(rename = "completedAt")]
    pub completed_at: Option<String>,
    pub action: Option<TaskAction>,
    #[serde(rename = "aiModel")]
    pub ai_model: Option<String>,
    #[serde(rename = "aiPrompt")]
    pub ai_prompt: Option<String>,
    #[serde(rename = "customCommand")]
    pub custom_command: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskInput {
    pub title: String,
    pub notes: Option<String>,
    pub section: TaskSection,
    #[serde(rename = "dueAt")]
    pub due_at: Option<String>,
    #[serde(rename = "remindAt")]
    pub remind_at: Option<Vec<String>>,
    pub recurrence: Option<Recurrence>,
    pub tags: Option<Vec<String>>,
    pub priority: Option<i32>,
    pub action: Option<TaskAction>,
    #[serde(rename = "aiModel")]
    pub ai_model: Option<String>,
    #[serde(rename = "aiPrompt")]
    pub ai_prompt: Option<String>,
    #[serde(rename = "customCommand")]
    pub custom_command: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    // General
    #[serde(rename = "autoStartOnLogin")]
    pub auto_start_on_login: bool,
    #[serde(rename = "alwaysOnTop")]
    pub always_on_top: bool,
    #[serde(rename = "enableBurnInMitigation")]
    pub enable_burn_in_mitigation: bool,

    // AI
    #[serde(rename = "aiMode")]
    pub ai_mode: String, // "embedded" | "external"
    #[serde(rename = "aiModel")]
    pub ai_model: String,
    #[serde(rename = "aiTemperature")]
    pub ai_temperature: f32,
    #[serde(rename = "aiBaseUrl")]
    pub ai_base_url: String,

    // Email
    #[serde(rename = "emailClientAction")]
    pub email_client_action: String, // "mailto" | "default" | "custom"
    #[serde(rename = "emailCustomCommand")]
    pub email_custom_command: Option<String>,

    // Display
    #[serde(rename = "resolutionProfile")]
    pub resolution_profile: String, // "1920x480" | "1280x400" | "1024x256" | "auto"
    #[serde(rename = "fontSizeScale")]
    pub font_size_scale: f32,

    // Theme
    pub theme: Option<serde_json::Value>,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            auto_start_on_login: false,
            always_on_top: false,
            enable_burn_in_mitigation: false,
            ai_mode: "embedded".to_string(),
            ai_model: "llama3.1".to_string(),
            ai_temperature: 0.5,
            ai_base_url: "http://127.0.0.1:11434".to_string(),
            email_client_action: "mailto".to_string(),
            email_custom_command: None,
            resolution_profile: "auto".to_string(),
            font_size_scale: 1.0,
            theme: None,
        }
    }
}
