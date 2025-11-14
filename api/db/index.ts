import { sql } from '@vercel/postgres';

export { sql };

/**
 * Initialize database tables
 * This should be run once during setup
 */
export async function initDatabase() {
  try {
    // Read and execute schema
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await sql.query(schema);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

/**
 * Helper function to handle database errors
 */
export function handleDbError(error: any): never {
  console.error('Database error:', error);
  throw new Error('Database operation failed');
}
