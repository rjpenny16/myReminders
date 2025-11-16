pub mod commands;
pub mod db;
pub mod models;
pub mod scheduler;
pub mod utils;

use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "
                CREATE TABLE IF NOT EXISTS tasks (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    notes TEXT,
                    section TEXT NOT NULL,
                    due_at TEXT,
                    remind_at TEXT,
                    recurrence TEXT,
                    tags TEXT,
                    priority INTEGER,
                    completed_at TEXT,
                    action TEXT,
                    ai_model TEXT,
                    ai_prompt TEXT,
                    custom_command TEXT,
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS settings (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                );

                CREATE INDEX IF NOT EXISTS idx_tasks_section ON tasks(section);
                CREATE INDEX IF NOT EXISTS idx_tasks_completed_at ON tasks(completed_at);
                CREATE INDEX IF NOT EXISTS idx_tasks_due_at ON tasks(due_at);
            ",
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:ultrawide_todo.db", migrations)
                .build()
        )
        .plugin(tauri_plugin_clipboard_manager::init())
        .setup(|app| {
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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
