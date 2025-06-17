import express from 'express';
import { createTables } from './database/migrations';
import { pool } from './config/database';

const app = express();
app.use(express.json());

async function initDatabase() {
  try {
    await createTables();
    console.log('Sensor database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

// Record Metric
app.post('/temperature', async (req, res) => {
  const { temperature } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO readings (temperature) VALUES ($1) RETURNING *',
      [temperature]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error loggin temperature:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'sensor-temperature-aggregator' });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  await initDatabase();
  
  app.listen(PORT, () => {
    console.log(`Sensor Temperature Service running on port ${PORT}`);
  });
}

startServer().catch(console.error);

export default app;
