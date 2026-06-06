import Database from "@tauri-apps/plugin-sql";

export const dbPromise = Database.load("sqlite:workstation.db");

