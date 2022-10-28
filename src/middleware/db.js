/** This section for test db connection otherwise I'm using MongoDB */
import path from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const appRoot = path.join(process.cwd());

// Configure LowDB to use JSON file
const adapter = new JSONFile(`${appRoot}/db/db.json`);
const db = new Low(adapter);

export default db;