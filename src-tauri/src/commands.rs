use crate::models::{AppSettings, Task, TaskInput};
use crate::utils;
use tauri::{AppHandle, Manager, State, Window};
use uuid::Uuid;

#[tauri::command]
pub async fn get_tasks(app: AppHandle) -> Result<Vec<Task>, String> {
    let db_path = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("ultrawide_todo.db");

    // Use tauri-plugin-sql to query
    // For simplicity, we'll use a direct SQL approach
    // In production, you'd want proper error handling

    let query = "SELECT * FROM tasks WHERE completed_at IS NULL ORDER BY priority DESC, due_at ASC";

    // Placeholder - actual implementation would use tauri-plugin-sql's query mechanism
    // For now, return empty array
    Ok(vec![])
}

#[tauri::command]
pub async fn create_task(task_input: TaskInput, app: AppHandle) -> Result<Task, String> {
    let id = Uuid::new_v4().to_string();

    let task = Task {
        id: id.clone(),
        title: task_input.title,
        notes: task_input.notes,
        section: task_input.section,
        due_at: task_input.due_at,
        remind_at: task_input.remind_at,
        recurrence: task_input.recurrence,
        tags: task_input.tags,
        priority: task_input.priority,
        completed_at: None,
        action: task_input.action,
        ai_model: task_input.ai_model,
        ai_prompt: task_input.ai_prompt,
        custom_command: task_input.custom_command,
    };

    // Insert into database
    // Placeholder for actual SQL insert

    Ok(task)
}

#[tauri::command]
pub async fn update_task(task: Task, app: AppHandle) -> Result<Task, String> {
    // Update task in database
    // Placeholder
    Ok(task)
}

#[tauri::command]
pub async fn delete_task(id: String, app: AppHandle) -> Result<(), String> {
    // Delete task from database
    // Placeholder
    Ok(())
}

#[tauri::command]
pub async fn complete_task(id: String, app: AppHandle) -> Result<(), String> {
    let now = chrono::Utc::now().to_rfc3339();
    // Update task.completed_at in database
    // Placeholder
    Ok(())
}

#[tauri::command]
pub async fn snooze_task(id: String, minutes: i32, app: AppHandle) -> Result<(), String> {
    // Calculate new remind_at time and update task
    // Placeholder
    Ok(())
}

#[tauri::command]
pub async fn get_settings(app: AppHandle) -> Result<AppSettings, String> {
    // Fetch settings from database or return default
    Ok(AppSettings::default())
}

#[tauri::command]
pub async fn set_settings(patch: serde_json::Value, app: AppHandle) -> Result<(), String> {
    // Update settings in database
    // Merge patch with existing settings
    Ok(())
}

#[tauri::command]
pub async fn launch_ollama_app() -> Result<bool, String> {
    utils::launch_ollama_app().await
}

#[tauri::command]
pub async fn clipboard_copy(text: String, app: AppHandle) -> Result<(), String> {
    use tauri_plugin_clipboard_manager::ClipboardExt;

    app.clipboard()
        .write_text(text)
        .map_err(|e| e.to_string())?;

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
