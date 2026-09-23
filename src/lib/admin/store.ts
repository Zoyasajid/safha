import { promises as fs } from "fs";
import path from "path";
import { buildSeed } from "@/lib/admin/seed";
import type { AdminDB } from "@/lib/admin/types";

const FILE = path.join(process.cwd(), ".data", "admin-db.json");

let memory: AdminDB | null = null;
let writeQueue: Promise<void> = Promise.resolve();

async function ensureLoaded(): Promise<AdminDB> {
  if (memory) return memory;
  try {
    const raw = await fs.readFile(FILE, "utf8");
    memory = JSON.parse(raw) as AdminDB;
    return memory;
  } catch {
    memory = buildSeed();
    await persist(memory);
    return memory;
  }
}

async function persist(db: AdminDB) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 2), "utf8");
}

export async function readDb(): Promise<AdminDB> {
  return ensureLoaded();
}

export async function updateDb<T>(mutator: (db: AdminDB) => T): Promise<T> {
  const run = writeQueue.then(async () => {
    const db = await ensureLoaded();
    const result = mutator(db);
    memory = db;
    await persist(db);
    return result;
  });
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}
