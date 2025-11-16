use crate::models::Task;
use anyhow::Result;

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
