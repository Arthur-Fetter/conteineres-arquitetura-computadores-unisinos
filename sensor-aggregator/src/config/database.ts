import { Pool } from 'pg';
import * as path from 'path';
import * as dotenv from 'dotenv';

// dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'yb-tservers.yb-demo.svc.cluster.local',
  port: parseInt(process.env.DB_PORT || '5433'),
  database: process.env.DB_NAME || 'yugabyte',
  user: process.env.DB_USER || 'yugabyte',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new Pool(dbConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing database connections...');
  await pool.end();
  process.exit(0);
});


