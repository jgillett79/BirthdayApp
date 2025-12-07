import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { environment } from './config/environment';
import { errorHandler } from './middleware/errorHandler';
import { authenticateToken } from './middleware/auth';

// Import routes
import authRoutes from './routes/auth.routes';
import householdRoutes from './routes/household.routes';
import peopleRoutes from './routes/people.routes';
import yearlyEventsRoutes from './routes/yearlyEvents.routes';
import syncRoutes from './routes/sync.routes';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: environment.corsOrigins,
  credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/household', authenticateToken, householdRoutes);
app.use('/api/people', authenticateToken, peopleRoutes);
app.use('/api/yearly-events', authenticateToken, yearlyEventsRoutes);
app.use('/api/sync', authenticateToken, syncRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
