use std::process::Command;

pub async fn launch_ollama_app() -> Result<bool, String> {
    #[cfg(target_os = "macos")]
    {
        let result = Command::new("open")
            .arg("-a")
            .arg("Ollama")
            .spawn();

        match result {
            Ok(_) => Ok(true),
            Err(e) => Err(format!("Failed to launch Ollama: {}", e)),
        }
    }

    #[cfg(target_os = "windows")]
    {
        let local_app_data = std::env::var("LOCALAPPDATA")
            .unwrap_or_else(|_| "C:\\Users\\Default\\AppData\\Local".to_string());
        let ollama_path = format!("{}\\Programs\\Ollama\\Ollama.exe", local_app_data);

        let result = Command::new("cmd")
            .args(&["/C", "start", "", &ollama_path])
            .spawn();

        match result {
            Ok(_) => Ok(true),
            Err(_) => {
                // Fallback: try from PATH
                let result = Command::new("ollama").spawn();
                match result {
                    Ok(_) => Ok(true),
                    Err(e) => Err(format!("Failed to launch Ollama: {}", e)),
                }
            }
        }
    }

    #[cfg(target_os = "linux")]
    {
        // Try to find ollama in PATH
        let which_result = Command::new("which")
            .arg("ollama")
            .output();

        match which_result {
            Ok(output) if output.status.success() => {
                let result = Command::new("ollama")
                    .arg("serve")
                    .spawn();

                match result {
                    Ok(_) => Ok(true),
                    Err(e) => Err(format!("Failed to launch Ollama: {}", e)),
                }
            }
            _ => Err("Ollama not found in PATH".to_string()),
        }
    }

    #[cfg(not(any(target_os = "macos", target_os = "windows", target_os = "linux")))]
    {
        Err("Unsupported platform".to_string())
    }
}
