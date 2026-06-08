use crate::ws_server::AppState;
use tauri_plugin_opener::OpenerExt;

#[tauri::command]
pub async fn execute_shortcut(
    app: tauri::AppHandle,
    path: String,
    shortcut_type: String,
    browser: Option<String>,
    state: tauri::State<'_, AppState>,
) -> Result<(), String> {
    match shortcut_type.as_str() {
        "web" => {
            let msg = serde_json::json!({
                "action": "open_or_focus",
                "url": path
            })
            .to_string();

            if state.ws_sender.receiver_count() > 0 {
                let _ = state.ws_sender.send(msg);
                return Ok(());
            }

            if let Some(browser_exe) = browser {
                if !browser_exe.trim().is_empty() {
                    let _ = std::process::Command::new(browser_exe)
                        .arg(&path)
                        .spawn()
                        .map_err(|e| format!("Failed to open browser: {}", e))?;
                    return Ok(());
                }
            }

            app.opener()
                .open_url(&path, None::<&str>)
                .map_err(|e| e.to_string())?;
        }

        "folder" | "file" => {
            app.opener()
                .open_path(&path, None::<&str>)
                .map_err(|e| e.to_string())?;
        }

        _ => return Err("Tipe shortcut tidak dikenali".to_string()),
    }

    Ok(())
}

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
