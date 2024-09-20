import { DB_NAME } from '@/constants/db';
import Database from 'better-sqlite3';
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';

const tasksDb = new Database(DB_NAME);
export const db: BetterSQLite3Database = drizzle(tasksDb);
