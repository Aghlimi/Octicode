import Database from "better-sqlite3";

const db: Database.Database  = new Database(process.env.SQLITE_PATH ?? "database.sqlite");

// basic safety
db.pragma("journal_mode = WAL");

export default db;
