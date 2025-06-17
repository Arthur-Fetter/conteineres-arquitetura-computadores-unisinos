"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { createTables } from './database/migrations';
// import { SensorModel } from './models/Sensor';
// import { TemperatureReadingModel } from './models/TemperatureReading';
const app = (0, express_1.default)();
app.use(express_1.default.json());
// async function initDatabase() {
//   try {
//     await createTables();
//     console.log('Sensor database initialized successfully');
//   } catch (error) {
//     console.error('Failed to initialize database:', error);
//     process.exit(1);
//   }
// }
//
// app.get('/sensors', async (req, res) => {
//   try {
//     const sensors = await SensorModel.findWithLatestReadings();
//     res.json(sensors);
//   } catch (error) {
//     console.error('Error fetching sensors:', error);
//     res.status(500).json({ error: 'Failed to fetch sensors' });
//   }
// });
//
// app.get('/sensors/:sensorId', async (req, res) => {
//   try {
//     const sensor = await SensorModel.findBySensorId(req.params.sensorId);
//     if (!sensor) {
//       return res.status(404).json({ error: 'Sensor not found' });
//     }
//     res.json(sensor);
//   } catch (error) {
//     console.error('Error fetching sensor:', error);
//     res.status(500).json({ error: 'Failed to fetch sensor' });
//   }
// });
//
// app.post('/sensors', async (req, res) => {
//   try {
//     const sensor = await SensorModel.create(req.body);
//     res.status(201).json(sensor);
//   } catch (error) {
//     console.error('Error creating sensor:', error);
//     res.status(400).json({ error: 'Failed to create sensor' });
//   }
// });
//
// // Temperature reading routes
// app.post('/temperature-readings', async (req, res) => {
//   try {
//     // Check if sensor exists
//     const sensor = await SensorModel.findBySensorId(req.body.sensor_id);
//     if (!sensor) {
//       return res.status(404).json({ error: 'Sensor not found' });
//     }
//
//     if (!sensor.is_active) {
//       return res.status(400).json({ error: 'Sensor is not active' });
//     }
//
//     const reading = await TemperatureReadingModel.create(req.body);
//     res.status(201).json(reading);
//   } catch (error) {
//     console.error('Error creating temperature reading:', error);
//     res.status(400).json({ error: 'Failed to create temperature reading' });
//   }
// });
//
// // Batch temperature readings endpoint
// app.post('/temperature-readings/batch', async (req, res) => {
//   try {
//     const { readings } = req.body;
//
//     if (!Array.isArray(readings) || readings.length === 0) {
//       return res.status(400).json({ error: 'Readings array is required' });
//     }
//
//     // Validate all sensors exist and are active
//     const sensorIds = [...new Set(readings.map(r => r.sensor_id))];
//     const sensors = await Promise.all(
//       sensorIds.map(id => SensorModel.findBySensorId(id))
//     );
//
//     const invalidSensors = sensors.filter(s => !s || !s.is_active);
//     if (invalidSensors.length > 0) {
//       return res.status(400).json({ error: 'Some sensors are invalid or inactive' });
//     }
//
//     const createdReadings = await TemperatureReadingModel.createBatch(readings);
//     res.status(201).json({ 
//       message: `Created ${createdReadings.length} temperature readings`,
//       readings: createdReadings 
//     });
//   } catch (error) {
//     console.error('Error creating batch temperature readings:', error);
//     res.status(400).json({ error: 'Failed to create temperature readings' });
//   }
// });
//
// app.get('/sensors/:sensorId/readings', async (req, res) => {
//   try {
//     const { limit = '100', offset = '0', start_time, end_time } = req.query;
//     const sensorId = req.params.sensorId;
//
//     let readings;
//     if (start_time && end_time) {
//       readings = await TemperatureReadingModel.findByTimeRange(
//         sensorId,
//         new Date(start_time as string),
//         new Date(end_time as string)
//       );
//     } else {
//       readings = await TemperatureReadingModel.findBySensorId(
//         sensorId,
//         parseInt(limit as string),
//         parseInt(offset as string)
//       );
//     }
//
//     res.json(readings);
//   } catch (error) {
//     console.error('Error fetching temperature readings:', error);
//     res.status(500).json({ error: 'Failed to fetch temperature readings' });
//   }
// });
//
// app.get('/sensors/:sensorId/readings/latest', async (req, res) => {
//   try {
//     const reading = await TemperatureReadingModel.findLatest(req.params.sensorId);
//     if (!reading) {
//       return res.status(404).json({ error: 'No readings found for this sensor' });
//     }
//     res.json(reading);
//   } catch (error) {
//     console.error('Error fetching latest reading:', error);
//     res.status(500).json({ error: 'Failed to fetch latest reading' });
//   }
// });
//
// app.get('/sensors/:sensorId/average', async (req, res) => {
//   try {
//     const { start_time, end_time } = req.query;
//
//     if (!start_time || !end_time) {
//       return res.status(400).json({ error: 'start_time and end_time are required' });
//     }
//
//     const avgTemp = await TemperatureReadingModel.getAverageTemperature(
//       req.params.sensorId,
//       new Date(start_time as string),
//       new Date(end_time as string)
//     );
//
//     res.json({ 
//       sensor_id: req.params.sensorId,
//       average_temperature: avgTemp,
//       start_time,
//       end_time
//     });
//   } catch (error) {
//     console.error('Error calculating average temperature:', error);
//     res.status(500).json({ error: 'Failed to calculate average temperature' });
//   }
// });
//
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'sensor-temperature-aggregator' });
});
// Start server
const PORT = process.env.PORT || 3000;
async function startServer() {
    // await initDatabase();
    app.listen(PORT, () => {
        console.log(`Sensor Temperature Service running on port ${PORT}`);
    });
}
startServer().catch(console.error);
exports.default = app;
