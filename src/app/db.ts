import type { Todo } from "./types";

const isVercel = !!process.env.POSTGRES_URL;

async function getLocalDb() {
  const Database = (await import("better-sqlite3")).default;
  const path = await import("path");
  const dbPath = path.join(process.cwd(), "todos.db");
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return db;
}

export async function getTodos(): Promise<Todo[]> {
  if (isVercel) {
    const { sql } = await import("@vercel/postgres");
    await sql`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    const { rows } = await sql`SELECT * FROM todos ORDER BY created_at DESC`;
    return rows as Todo[];
  }

  const db = await getLocalDb();
  const rows = db.prepare("SELECT * FROM todos ORDER BY created_at DESC").all() as any[];
  return rows.map((r) => ({ id: r.id, text: r.text, completed: !!r.completed }));
}

export async function insertTodo(text: string) {
  if (isVercel) {
    const { sql } = await import("@vercel/postgres");
    await sql`INSERT INTO todos (text) VALUES (${text})`;
    return;
  }

  const db = await getLocalDb();
  db.prepare("INSERT INTO todos (text) VALUES (?)").run(text);
}

export async function toggleTodoById(id: number) {
  if (isVercel) {
    const { sql } = await import("@vercel/postgres");
    await sql`UPDATE todos SET completed = NOT completed WHERE id = ${id}`;
    return;
  }

  const db = await getLocalDb();
  db.prepare("UPDATE todos SET completed = NOT completed WHERE id = ?").run(id);
}

export async function deleteTodoById(id: number) {
  if (isVercel) {
    const { sql } = await import("@vercel/postgres");
    await sql`DELETE FROM todos WHERE id = ${id}`;
    return;
  }

  const db = await getLocalDb();
  db.prepare("DELETE FROM todos WHERE id = ?").run(id);
}
