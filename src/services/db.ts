import Database from "@tauri-apps/plugin-sql";

const dbPromise = Database.load("sqlite:workstation.db");

export interface Workspace {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export async function getWorkspaces(): Promise<Workspace[]> {
  const db = await dbPromise;
  return await db.select("SELECT * FROM workspaces ORDER BY id DESC");
}

export async function addWorkspace(name: string, description: string): Promise<void> {
  const db = await dbPromise;
  await db.execute(
    "INSERT INTO workspaces (name, description) VALUES ($1, $2)",
    [name, description]
  );
}

export async function updateWorkspace(id: number, name: string, description: string): Promise<void> {
  const db = await dbPromise;
  await db.execute(
    "UPDATE workspaces SET name = $1, description = $2 WHERE id = $3",
    [name, description, id]
  )
}

export async function deleteWorkspace(id: number): Promise<void> {
  const db = await dbPromise;
  await db.execute("DELETE FROM workspaces WHERE id = $1", [id]);
}
