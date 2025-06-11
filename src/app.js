import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import errorHandler from './middlewares/errMid.js';

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
      connectSrc: ["'self'", "http://localhost:5173"],
    },
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  frameguard: { action: 'deny' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  xssFilter: true,
  noSniff: true,
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


morgan.token('remote-addr', (req) => req.ip);
morgan.token('timestamp', () => new Date().toISOString());
morgan.token('user-agent', (req) => req.headers['user-agent'] || 'unknown');

app.use(morgan(':method :url :status - :res[content-length] bytes - :response-time ms - IP: :remote-addr - Time: :timestamp - Agent: :user-agent', {
  skip: (req) => req.url.includes('favicon.ico'),
}));

// Request Logger
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Routes
try {
  console.log('Registering listing routes...');
  app.use('/api/listings', listingRoutes);
  console.log('Listing routes registered successfully');
} catch (error) {
  console.error('Error registering listing routes:', error.stack);
}

try {
  console.log('Registering auth routes...');
  app.use('/api/auth', authRoutes);
  console.log('Auth routes registered successfully');
} catch (error) {
  console.error('Error registering auth routes:', error.stack);
}

// Error Handler
app.use(errorHandler);

// Fallback Route
app.use('*', (req, res) => {
  console.log(`Fallback route hit: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Log all routes
console.log('Registered middleware and routes:');
app._router.stack.forEach((layer, index) => {
  if (layer.route) {
    console.log(`Layer ${index}: Route ${layer.route.path}`);
  } else if (layer.name === 'router' && layer.handle.stack) {
    console.log(`Layer ${index}: Router ${layer.regexp}`);
    layer.handle.stack.forEach((handler, handlerIndex) => {
      if (handler.route) {
        console.log(`  Handler ${handlerIndex}: ${handler.route.path} (${Object.keys(handler.route.methods).join(', ')})`);
      }
    });
  } else {
    console.log(`Layer ${index}: ${layer.name || 'anonymous'}`);
  }
});

export default app;
