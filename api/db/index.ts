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

    // Get the directory where this file is located
    const currentDir = __dirname || process.cwd();
    const schemaPath = path.join(currentDir, 'schema.sql');

    // Verify schema file exists
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema as a single statement
    await pool.query(schema);
    console.log('✅ Database schema initialized successfully');

  } catch (error: any) {
    // If it's a "table already exists" error, that's fine - it means the DB is already initialized
    if (error.code === '42P07') {
      console.log('✅ Database tables already exist');
      return;
    }
    console.error('❌ Error initializing database:', error.message);
    throw error;
  }
}

/**
 * Initialize database on startup if needed
 */
export async function ensureDatabaseInitialized() {
  try {
    // Test database connection
    const result = await query('SELECT 1');
    if (result) {
      console.log('✅ Database connection successful');

      // Try to initialize schema (idempotent due to IF NOT EXISTS)
      await initDatabase();
    }
  } catch (error: any) {
    console.error('❌ Database initialization failed:', error.message);
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
