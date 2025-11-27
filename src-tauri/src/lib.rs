pub mod commands;
pub mod db;
pub mod models;
pub mod scheduler;
pub mod utils;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let app_handle = app.handle().clone();

            // Initialize database
            tauri::async_runtime::spawn(async move {
                if let Err(e) = db::initialize_database(&app_handle).await {
                    eprintln!("Failed to initialize database: {}", e);
                }
            });

            // Start scheduler
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = scheduler::start_scheduler(app_handle).await {
                    eprintln!("Failed to start scheduler: {}", e);
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_tasks,
            commands::create_task,
            commands::update_task,
            commands::delete_task,
            commands::complete_task,
            commands::snooze_task,
            commands::get_settings,
            commands::set_settings,
            commands::launch_ollama_app,
            commands::clipboard_copy,
            commands::toggle_always_on_top,
            commands::export_tasks,
            commands::export_tasks_auto,
            commands::import_tasks,
            commands::check_for_updates,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
