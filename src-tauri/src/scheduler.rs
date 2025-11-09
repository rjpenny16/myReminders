use anyhow::Result;
use tauri::{AppHandle, Emitter};
use tokio_cron_scheduler::{Job, JobScheduler};

pub async fn start_scheduler(app: AppHandle) -> Result<()> {
    let sched = JobScheduler::new().await?;

    // Example job - check for due reminders every minute
    let app_clone = app.clone();
    let job = Job::new_async("0 * * * * *", move |_uuid, _l| {
        let app = app_clone.clone();
        Box::pin(async move {
            check_due_reminders(app).await;
        })
    })?;

    sched.add(job).await?;
    sched.start().await?;

    // Keep scheduler alive
    tokio::spawn(async move {
        loop {
            tokio::time::sleep(tokio::time::Duration::from_secs(60)).await;
        }
    });

    Ok(())
}

async fn check_due_reminders(app: AppHandle) {
    // Query database for tasks with remind_at <= now
    // For each due reminder:
    //   1. Emit event to frontend
    //   2. Show native notification
    //   3. Update task's remind_at (if snoozed) or mark as reminded

    // Placeholder implementation
    let now = chrono::Utc::now();

    // Example: emit event
    let _ = app.emit("reminder-due", serde_json::json!({
        "taskId": "example-id",
        "title": "Example task",
        "time": now.to_rfc3339()
    }));
}
