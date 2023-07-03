
import { join } from "node:path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const file = join('/tmp', "db.json");

let cached = global.lowDb;

if (!cached) {
    cached = global.lowDb = { conn: null };
}

export async function dbConnect() {
    if (!cached.conn) {
        const adapter = new JSONFile(file);
        const db = new Low(adapter);
        cached.conn = db;
    }

    cached.conn.data ||= {messageHistory: {}};

    return cached.conn;
}