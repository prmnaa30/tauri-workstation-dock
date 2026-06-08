use tauri_plugin_opener::OpenerExt;
use tauri::Manager;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri_plugin_sql::{Migration, MigrationKind};
use std::fs;

#[tauri::command]
async fn execute_shortcut(app: tauri::AppHandle, path: String, shortcut_type: String, browser: Option<String>) -> Result<(), String> {
    match shortcut_type.as_str() {
        "web" => {
            if let Some(browser_exe) = browser {
                #[cfg(target_os = "windows")]
                if !browser_exe.trim().is_empty() {
                    let _ = std::process::Command::new("cmd")
                        .args(["/c", "start", "", &browser_exe, &path])
                        .spawn()
                        .map_err(|e| format!("Failed to open browser: {}", e))?;
                    return Ok(());
                }

                #[cfg(not(target_os = "windows"))]
                let _ = std::process::Command::new(&browser_exe)
                        .arg(&path)
                        .spawn()
                        .map_err(|e| format!("Failed to open browser: {}", e))?;
                    return Ok(());
            }

            app.opener().open_url(&path, None::<&str>).map_err(|e| e.to_string())?;
        }

        "folder" | "file" => {
            app.opener().open_path(&path, None::<&str>).map_err(|e| e.to_string())?;
        }

        _ => return Err("Tipe shortcut tidak dikenali".to_string()),
    }

    Ok(())
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "init_schema",
            sql: include_str!("../migrations/01_init-schema.sql"),
            kind: MigrationKind::Up
        },
        Migration {
            version: 2,
            description: "add_favorites",
            sql: include_str!("../migrations/02_add_favorites.sql"),
            kind: MigrationKind::Up
        }
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:workstation.db", migrations)
                .build()
        )

        .setup(|app| {
            if let Ok(home_dir) = app.path().home_dir() {
                let notes_dir = home_dir.join(".workstation_data").join("notes");
                if !notes_dir.exists() {
                    fs::create_dir_all(&notes_dir)
                        .expect("Gagal membuat direktori penyimpanan notes")
                }
            }

            let show_i = MenuItem::with_id(app, "show", "Open Dashboard", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "Quit Dock", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &quit_i])?;

            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .build(app)?;

            Ok(())
        })

        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                window.hide().unwrap();
                api.prevent_close();
            }
        })
        .invoke_handler(tauri::generate_handler![greet, execute_shortcut])
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
