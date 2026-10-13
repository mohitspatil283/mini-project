import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import facilitiesRouter from './routes/facilities';
import servicesRouter from './routes/services';
import costsRouter from './routes/costs';
import savedFacilitiesRouter from './routes/savedFacilities';
import reportsRouter from './routes/reports';
import repRouter from './routes/rep';
import adminRouter from './routes/admin';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'MediGuide API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    disclaimer:
      'Information shown on MediGuide is for navigation and informational purposes. Approximate costs may change. Always confirm details, availability and final charges with the healthcare facility.',
  });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/facilities', facilitiesRouter);
app.use('/api/services', servicesRouter);
app.use('/api/costs', costsRouter);
app.use('/api/saved-facilities', savedFacilitiesRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/rep', repRouter);
app.use('/api/admin', adminRouter);

// Centralized error handler
app.use(errorHandler);

export default app;
