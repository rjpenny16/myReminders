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

#[tauri::command]
pub async fn export_tasks(
    app: AppHandle,
    section: Option<String>,
    completed_only: bool,
) -> Result<String, String> {
    use tauri_plugin_dialog::DialogExt;

    // Get all tasks from database
    // For now using placeholder, in production would query DB
    let tasks: Vec<Task> = vec![]; // Would be: db::get_all_tasks(&app).await?

    // Filter based on parameters
    let filtered_tasks: Vec<Task> = tasks
        .into_iter()
        .filter(|t| {
            let section_match = section
                .as_ref()
                .map(|s| t.section == s.as_str())
                .unwrap_or(true);
            let completed_match = if completed_only {
                t.completed_at.is_some()
            } else {
                true
            };
            section_match && completed_match
        })
        .collect();

    // Generate JSON with timestamp
    let now = chrono::Local::now();
    let timestamp = now.format("%Y%m%d_%H%M%S");
    let default_filename = format!("ultrawide_todo_backup_{}.json", timestamp);

    // Serialize tasks to JSON
    let json_data = serde_json::to_string_pretty(&filtered_tasks).map_err(|e| e.to_string())?;

    // Show save dialog with automatic filename
    let file_path = app
        .dialog()
        .file()
        .set_title("Export Tasks")
        .set_file_name(&default_filename)
        .add_filter("JSON", &["json"])
        .blocking_save_file();

    if let Some(path) = file_path {
        std::fs::write(&path, json_data).map_err(|e| e.to_string())?;
        Ok(path.to_string_lossy().to_string())
    } else {
        Err("Export cancelled".to_string())
    }
}

#[tauri::command]
pub async fn export_tasks_auto(app: AppHandle) -> Result<String, String> {
    // Automatic export without dialog (for auto-backup)
    let tasks: Vec<Task> = vec![]; // Would be: db::get_all_tasks(&app).await?

    let now = chrono::Local::now();
    let timestamp = now.format("%Y%m%d_%H%M%S");

    // Get app data directory for auto-backups
    let backup_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("backups");

    // Create backups directory if it doesn't exist
    std::fs::create_dir_all(&backup_dir).map_err(|e| e.to_string())?;

    let filename = format!("auto_backup_{}.json", timestamp);
    let file_path = backup_dir.join(&filename);

    let json_data = serde_json::to_string_pretty(&tasks).map_err(|e| e.to_string())?;
    std::fs::write(&file_path, json_data).map_err(|e| e.to_string())?;

    // Keep only last 10 auto-backups
    cleanup_old_backups(&backup_dir, 10)?;

    Ok(file_path.to_string_lossy().to_string())
}

#[tauri::command]
pub async fn import_tasks(app: AppHandle, file_path: Option<String>) -> Result<usize, String> {
    use tauri_plugin_dialog::DialogExt;

    let path = if let Some(p) = file_path {
        std::path::PathBuf::from(p)
    } else {
        // Show open dialog
        let selected = app
            .dialog()
            .file()
            .set_title("Import Tasks")
            .add_filter("JSON", &["json"])
            .blocking_pick_file();

        match selected {
            Some(path) => path,
            None => return Err("Import cancelled".to_string()),
        }
    };

    // Read and parse JSON file
    let json_data = std::fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let tasks: Vec<Task> = serde_json::from_str(&json_data).map_err(|e| e.to_string())?;

    let count = tasks.len();

    // Import tasks into database
    // For each task, insert or update
    // Placeholder: db::import_tasks(&app, tasks).await?

    Ok(count)
}

fn cleanup_old_backups(backup_dir: &std::path::Path, keep_count: usize) -> Result<(), String> {
    let mut backups: Vec<_> = std::fs::read_dir(backup_dir)
        .map_err(|e| e.to_string())?
        .filter_map(|entry| entry.ok())
        .filter(|entry| {
            entry
                .path()
                .extension()
                .and_then(|s| s.to_str())
                .map(|s| s == "json")
                .unwrap_or(false)
        })
        .collect();

    // Sort by modified time, newest first
    backups.sort_by(|a, b| {
        let time_a = a.metadata().and_then(|m| m.modified()).ok();
        let time_b = b.metadata().and_then(|m| m.modified()).ok();
        time_b.cmp(&time_a)
    });

    // Remove old backups
    for backup in backups.into_iter().skip(keep_count) {
        let _ = std::fs::remove_file(backup.path());
    }

    Ok(())
}
