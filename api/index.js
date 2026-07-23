import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Load config variables
dotenv.config();

// Establish Database Connection
connectDB();

const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP for API routes on same domain
}));
app.use(
  cors({
    origin: true, // Allow all origins, or let it match client domain
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
);

app.use(express.json());
app.use(cookieParser());

// Global API request rate limiter
app.use('/api/', apiLimiter);

// Bind authentication routing
app.use('/api/auth', authRoutes);

// Fallback Route handler for 404
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `API resource '${req.originalUrl}' not found` });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(`[Express Error Handler] ${err.stack}`);
  res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
});

export default app;
