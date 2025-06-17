"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTables = createTables;
const database_1 = require("../config/database");
async function createTables() {
    const client = await database_1.pool.connect();
    try {
        // Create sensors table
        await client.query(`
      CREATE TABLE IF NOT EXISTS sensors (
        id SERIAL PRIMARY KEY,
        sensor_id VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        sensor_type VARCHAR(100) DEFAULT 'temperature',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
        // Create temperature_readings table
        await client.query(`
      CREATE TABLE IF NOT EXISTS temperature_readings (
        id SERIAL PRIMARY KEY,
        sensor_id VARCHAR(100) NOT NULL REFERENCES sensors(sensor_id) ON DELETE CASCADE,
        temperature DECIMAL(5,2) NOT NULL,
        unit VARCHAR(10) DEFAULT 'celsius' CHECK (unit IN ('celsius', 'fahrenheit')),
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
        // Create indexes for better performance
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_temperature_readings_sensor_id ON temperature_readings(sensor_id)
    `);
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_temperature_readings_timestamp ON temperature_readings(timestamp DESC)
    `);
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_temperature_readings_sensor_timestamp ON temperature_readings(sensor_id, timestamp DESC)
    `);
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_sensors_active ON sensors(is_active) WHERE is_active = true
    `);
        // Create function to update updated_at timestamp
        await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);
        // Create trigger for sensors table
        await client.query(`
      DROP TRIGGER IF EXISTS update_sensors_updated_at ON sensors;
      CREATE TRIGGER update_sensors_updated_at
        BEFORE UPDATE ON sensors
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `);
        console.log('Sensor temperature tables created successfully');
    }
    catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
