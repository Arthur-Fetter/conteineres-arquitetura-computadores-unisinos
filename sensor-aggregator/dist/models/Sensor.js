"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorModel = void 0;
const database_1 = require("../config/database");
class SensorModel {
    static async create(sensorData) {
        const client = await database_1.pool.connect();
        try {
            const result = await client.query(`INSERT INTO sensors (sensor_id, name, location, sensor_type, is_active) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`, [
                sensorData.sensor_id,
                sensorData.name,
                sensorData.location,
                sensorData.sensor_type || 'temperature',
                sensorData.is_active !== undefined ? sensorData.is_active : true
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
    static async findById(id) {
        const client = await database_1.pool.connect();
        try {
            const result = await client.query('SELECT * FROM sensors WHERE id = $1', [id]);
            return result.rows[0] || null;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async findBySensorId(sensorId) {
        const client = await database_1.pool.connect();
        try {
            const result = await client.query('SELECT * FROM sensors WHERE sensor_id = $1', [sensorId]);
            return result.rows[0] || null;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async findAllActive() {
        const client = await database_1.pool.connect();
        try {
            const result = await client.query('SELECT * FROM sensors WHERE is_active = true ORDER BY name');
            return result.rows;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async findAll() {
        const client = await database_1.pool.connect();
        try {
            const result = await client.query('SELECT * FROM sensors ORDER BY name');
            return result.rows;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async findWithLatestReadings() {
        const client = await database_1.pool.connect();
        try {
            const result = await client.query(`
        SELECT 
          s.*,
          tr.temperature as latest_temperature,
          tr.timestamp as latest_reading_time,
          tr.unit as latest_unit
        FROM sensors s
        LEFT JOIN LATERAL (
          SELECT temperature, timestamp, unit
          FROM temperature_readings 
          WHERE sensor_id = s.sensor_id 
          ORDER BY timestamp DESC 
          LIMIT 1
        ) tr ON true
        ORDER BY s.name
      `);
            return result.rows;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async update(sensorId, sensorData) {
        const client = await database_1.pool.connect();
        try {
            const setClause = Object.keys(sensorData)
                .map((key, index) => `${key} = $${index + 2}`)
                .join(', ');
            const values = [sensorId, ...Object.values(sensorData)];
            const result = await client.query(`UPDATE sensors SET ${setClause} WHERE sensor_id = $1 RETURNING *`, values);
            return result.rows[0] || null;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async deactivate(sensorId) {
        const client = await database_1.pool.connect();
        try {
            const result = await client.query('UPDATE sensors SET is_active = false WHERE sensor_id = $1', [sensorId]);
            if (result.rowCount != null) {
                return result.rowCount > 0;
            }
            return false;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    static async delete(sensorId) {
        const client = await database_1.pool.connect();
        try {
            const result = await client.query('DELETE FROM sensors WHERE sensor_id = $1', [sensorId]);
            if (result.rowCount != null) {
                return result.rowCount > 0;
            }
            return false;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
}
exports.SensorModel = SensorModel;
