use crate::models::{AppSettings, Task, TaskInput};
use crate::utils;
use tauri::Window;

// NOTE: Database operations are handled via tauri-plugin-sql from the frontend
// These commands are placeholders for non-DB operations or future enhancements

#[tauri::command]
pub async fn get_tasks() -> Result<Vec<Task>, String> {
    // Database queries are now handled from the frontend using tauri-plugin-sql
    // This command can be removed or used for additional backend logic
    Ok(vec![])
}

#[tauri::command]
pub async fn create_task(_task_input: TaskInput) -> Result<Task, String> {
    // Database inserts are now handled from the frontend using tauri-plugin-sql
    // This is a placeholder
    Err("Use tauri-plugin-sql from frontend".to_string())
}

#[tauri::command]
pub async fn update_task(_task: Task) -> Result<Task, String> {
    // Database updates are now handled from the frontend using tauri-plugin-sql
    Err("Use tauri-plugin-sql from frontend".to_string())
}

#[tauri::command]
pub async fn delete_task(_id: String) -> Result<(), String> {
    // Database deletes are now handled from the frontend using tauri-plugin-sql
    Err("Use tauri-plugin-sql from frontend".to_string())
}

#[tauri::command]
pub async fn complete_task(_id: String) -> Result<(), String> {
    // Database updates are now handled from the frontend using tauri-plugin-sql
    Err("Use tauri-plugin-sql from frontend".to_string())
}

#[tauri::command]
pub async fn snooze_task(_id: String, _minutes: i32) -> Result<(), String> {
    // Database updates are now handled from the frontend using tauri-plugin-sql
    Err("Use tauri-plugin-sql from frontend".to_string())
}

#[tauri::command]
pub async fn get_settings() -> Result<AppSettings, String> {
    // Database queries are now handled from the frontend using tauri-plugin-sql
    // Return default for now
    Ok(AppSettings::default())
}

#[tauri::command]
pub async fn set_settings(_patch: serde_json::Value) -> Result<(), String> {
    // Database updates are now handled from the frontend using tauri-plugin-sql
    Err("Use tauri-plugin-sql from frontend".to_string())
}

#[tauri::command]
pub async fn launch_ollama_app() -> Result<bool, String> {
    utils::launch_ollama_app().await
}

#[tauri::command]
pub async fn clipboard_copy(_text: String) -> Result<(), String> {
    // Clipboard operations are now handled by tauri-plugin-clipboard-manager from frontend
    // This command can be used for additional logic if needed
    Ok(())
}

#[tauri::command]
pub async fn toggle_always_on_top(window: Window) -> Result<bool, String> {
    let is_on_top = window.is_always_on_top().map_err(|e| e.to_string())?;
    window
        .set_always_on_top(!is_on_top)
        .map_err(|e| e.to_string())?;
    Ok(!is_on_top)
}
