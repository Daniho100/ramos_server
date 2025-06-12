import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import errorHandler from './middlewares/errMid.js';

const app = express();




app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://ramos-client.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Handle preflight immediately
  }

  next();
});





const corsOptions = {
  origin: 'https://ramos-client.vercel.app', // Exact origin match
  credentials: true, // Required for Authorization header and cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow Authorization header
  exposedHeaders: ['Content-Length', 'X-Custom-Header'], // Optional, for client access
  optionsSuccessStatus: 200, // Ensure OPTIONS returns 200
};
app.use(cors(corsOptions));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://*"],
      connectSrc: ["'self'", "https://ramos-client.vercel.app"],
    },
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  frameguard: { action: 'deny' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  xssFilter: true,
  noSniff: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

morgan.token('remote-addr', (req) => req.ip);
morgan.token('timestamp', () => new Date().toISOString());
morgan.token('user-agent', (req) => req.headers['user-agent'] || 'unknown');

app.use(morgan(':method :url :status - :res[content-length] bytes - :response-time ms - IP: :remote-addr - Time: :timestamp - Agent: :user-agent', {
  skip: (req) => req.url.includes('favicon.ico'),
}));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

try {
  app.use('/api/listings', listingRoutes);
} catch (error) {
  console.error('Error registering listing routes:', error.stack);
}

try {
  app.use('/api/auth', authRoutes);
} catch (error) {
  console.error('Error registering auth routes:', error.stack);
}

app.use(errorHandler);

app.use('*', (req, res) => {
  console.log(`Fallback route hit: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

export default app;