use crate::models::{AppSettings, Task, TaskInput};
use anyhow::Result;
use tauri::{AppHandle, Manager};
use tauri_plugin_sql::{Migration, MigrationKind};

const MIGRATIONS: &[Migration] = &[
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

pub async fn initialize_database(app: &AppHandle) -> Result<()> {
    let db = app.state::<tauri_plugin_sql::Db>();

    // Migrations are automatically applied by tauri-plugin-sql
    // Insert default settings if they don't exist
    seed_default_settings(app).await?;
    seed_example_tasks(app).await?;

    Ok(())
}

async fn seed_default_settings(app: &AppHandle) -> Result<()> {
    use tauri_plugin_sql::Builder;

    let settings = AppSettings::default();
    let settings_json = serde_json::to_string(&settings)?;

    let db_path = app.path().app_data_dir()?.join("ultrawide_todo.db");
    let db = tauri_plugin_sql::Builder::default()
        .add_migrations(&format!("sqlite:{}", db_path.display()), MIGRATIONS.to_vec())
        .build(app.clone())?;

    // Check if settings exist
    let query = "SELECT COUNT(*) as count FROM settings WHERE key = 'app_settings'";
    // For now, we'll skip this check and handle it in the get_settings command

    Ok(())
}

async fn seed_example_tasks(app: &AppHandle) -> Result<()> {
    // We'll seed tasks via a separate initialization step
    Ok(())
}

pub fn task_to_json(task: &Task) -> Result<String> {
    Ok(serde_json::to_string(task)?)
}

pub fn task_from_row(row: &serde_json::Value) -> Result<Task> {
    let id = row["id"].as_str().unwrap_or_default().to_string();
    let title = row["title"].as_str().unwrap_or_default().to_string();
    let notes = row["notes"].as_str().map(|s| s.to_string());
    let section = match row["section"].as_str().unwrap_or("today") {
        "today" => crate::models::TaskSection::Today,
        "upcoming" => crate::models::TaskSection::Upcoming,
        "someday" => crate::models::TaskSection::Someday,
        _ => crate::models::TaskSection::Today,
    };

    let due_at = row["due_at"].as_str().map(|s| s.to_string());
    let remind_at = row["remind_at"]
        .as_str()
        .and_then(|s| serde_json::from_str(s).ok());
    let recurrence = row["recurrence"]
        .as_str()
        .and_then(|s| serde_json::from_str(s).ok());
    let tags = row["tags"]
        .as_str()
        .and_then(|s| serde_json::from_str(s).ok());
    let priority = row["priority"].as_i64().map(|p| p as i32);
    let completed_at = row["completed_at"].as_str().map(|s| s.to_string());

    let action = row["action"].as_str().map(|a| match a {
        "email_draft" => crate::models::TaskAction::EmailDraft,
        "custom" => crate::models::TaskAction::Custom,
        _ => crate::models::TaskAction::None,
    });

    let ai_model = row["ai_model"].as_str().map(|s| s.to_string());
    let ai_prompt = row["ai_prompt"].as_str().map(|s| s.to_string());
    let custom_command = row["custom_command"].as_str().map(|s| s.to_string());

    Ok(Task {
        id,
        title,
        notes,
        section,
        due_at,
        remind_at,
        recurrence,
        tags,
        priority,
        completed_at,
        action,
        ai_model,
        ai_prompt,
        custom_command,
    })
}
