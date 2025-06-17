"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemperatureReadingModel = void 0;
const database_1 = require("../config/database");
class TemperatureReadingModel {
    static async create(readingData) {
        const client = await database_1.pool.connect();
        try {
            const result = await client.query(`INSERT INTO temperature_readings (sensor_id, temperature, unit, timestamp) 
         VALUES ($1, $2, $3, $4) RETURNING *`, [
                readingData.sensor_id,
                readingData.temperature,
                readingData.unit || 'celsius',
                readingData.timestamp || new Date()
            ]);
            return result.rows[0];
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async createBatch(readings) {
        const client = await database_1.pool.connect();
        try {
            const values = [];
            const placeholders = [];
            readings.forEach((reading, index) => {
                const baseIndex = index * 4;
                placeholders.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`);
                values.push(reading.sensor_id, reading.temperature, reading.unit || 'celsius', reading.timestamp || new Date());
            });
            const query = `
        INSERT INTO temperature_readings (sensor_id, temperature, unit, timestamp)
        VALUES ${placeholders.join(', ')}
        RETURNING *
      `;
            const result = await client.query(query, values);
            return result.rows;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async findBySensorId(sensorId, limit = 100, offset = 0) {
        const client = await database_1.pool.connect();
        try {
            const result = await client.query(`SELECT * FROM temperature_readings 
         WHERE sensor_id = $1 
         ORDER BY timestamp DESC 
         LIMIT $2 OFFSET $3`, [sensorId, limit, offset]);
            return result.rows;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async findByTimeRange(sensorId, startTime, endTime) {
        const client = await database_1.pool.connect();
        try {
            const result = await client.query(`SELECT * FROM temperature_readings 
         WHERE sensor_id = $1 AND timestamp BETWEEN $2 AND $3 
         ORDER BY timestamp ASC`, [sensorId, startTime, endTime]);
            return result.rows;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async findLatest(sensorId) {
        const client = await database_1.pool.connect();
        try {
            const result = await client.query(`SELECT * FROM temperature_readings 
         WHERE sensor_id = $1 
         ORDER BY timestamp DESC 
         LIMIT 1`, [sensorId]);
            return result.rows[0] || null;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async getAverageTemperature(sensorId, startTime, endTime) {
        const client = await database_1.pool.connect();
        try {
            const result = await client.query(`SELECT AVG(temperature) as avg_temp 
         FROM temperature_readings 
         WHERE sensor_id = $1 AND timestamp BETWEEN $2 AND $3`, [sensorId, startTime, endTime]);
            return result.rows[0]?.avg_temp ? parseFloat(result.rows[0].avg_temp) : null;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async deleteOldReadings(olderThanDays) {
        const client = await database_1.pool.connect();
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
            const result = await client.query('DELETE FROM temperature_readings WHERE created_at < $1', [cutoffDate]);
            return result.rowCount || 0;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
}
exports.TemperatureReadingModel = TemperatureReadingModel;
