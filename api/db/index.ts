import { Pool, QueryResult } from 'pg';

// Create a connection pool
// Support both POSTGRES_URL (Vercel) and DATABASE_URL (Railway)
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('⚠️  No database URL configured. Set POSTGRES_URL or DATABASE_URL environment variable.');
}

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

/**
 * Execute a SQL query with parameters
 */
export async function query(text: string, params?: any[]): Promise<QueryResult> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Template literal helper for SQL queries (similar to Vercel Postgres sql``)
 * Usage: sql`SELECT * FROM users WHERE id = ${userId}`
 */
export function sql(strings: TemplateStringsArray, ...values: any[]) {
  // Build parameterized query
  let text = '';
  const params: any[] = [];

  strings.forEach((string, i) => {
    text += string;
    if (i < values.length) {
      params.push(values[i]);
      text += `$${params.length}`;
    }
  });

  return query(text, params);
}

// Add query method to sql for compatibility
(sql as any).query = query;

/**
 * Get a client from the pool for transactions
 */
export async function getClient() {
  return pool.connect();
}

/**
 * Initialize database tables
 * This should be run once during setup
 */
export async function initDatabase() {
  try {
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await query(schema);
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

export { pool };
