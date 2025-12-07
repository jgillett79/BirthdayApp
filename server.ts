import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { verifyToken, extractToken } from './api/utils/auth';
import loginHandler from './api/auth/login';
import registerHandler from './api/auth/register';
import meHandler from './api/auth/me';
import eventsHandler from './api/events';
import upcomingHandler from './api/events/upcoming';
import familyMembersHandler from './api/family-members';
import giftsHandler from './api/gifts';
import suggestionsHandler from './api/gifts/suggestions';

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req: Request, res: Response, next) => {
  const corsOrigins = process.env.CORS_ORIGINS || '*';
  res.setHeader('Access-Control-Allow-Origin', corsOrigins);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Authentication middleware for Express
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req.headers.authorization as string);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token provided',
      });
    }

    const payload = verifyToken(token) as any;
    (req as any).userId = payload.userId || payload.id;
    (req as any).userEmail = payload.email;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

// Vercel handler wrapper to work with Express
const vercelToExpress = (handler: any) => {
  return async (req: Request, res: Response) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: 'Internal server error' });
      }
    }
  };
};

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.post('/api/auth/login', vercelToExpress(loginHandler));
app.post('/api/auth/register', vercelToExpress(registerHandler));
app.get('/api/auth/me', authMiddleware, vercelToExpress(meHandler));

app.get('/api/events', authMiddleware, vercelToExpress(eventsHandler));
app.get('/api/events/upcoming', authMiddleware, vercelToExpress(upcomingHandler));

app.get('/api/family-members', authMiddleware, vercelToExpress(familyMembersHandler));
app.post('/api/family-members', authMiddleware, vercelToExpress(familyMembersHandler));

app.get('/api/gifts', authMiddleware, vercelToExpress(giftsHandler));
app.post('/api/gifts', authMiddleware, vercelToExpress(giftsHandler));
app.get('/api/gifts/suggestions', authMiddleware, vercelToExpress(suggestionsHandler));

// Serve React static files
const clientDist = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientDist));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${NODE_ENV}`);
  console.log(`🗄️  Database URL configured: ${process.env.DATABASE_URL || process.env.POSTGRES_URL ? 'Yes' : 'No'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});
