// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import authRoutes from './routes/authRoutes.js';
// import listingRoutes from './routes/listingRoutes.js';
// import errorHandler from './middlewares/errMid.js';





import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js'; // Adjust path
import listingRoutes from './routes/listingRoutes.js'; // Adjust path
import errorHandler from './middlewares/errMid.js'; // Adjust path

// Rest of the code remains the same





const app = express();

// const corsOptions = {
//   origin: 'https://ramos-client.vercel.app', // Exact origin match
//   credentials: true, // Allows cookies/auth credentials to be sent
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Headers the client can send
//   exposedHeaders: ['Content-Length', 'X-Custom-Header'], // Headers the client can access
//   optionsSuccessStatus: 200, // Responds with 200 for OPTIONS preflight
// };
app.use(cors());



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
  app.use('/api/listings', listingRoutes);
  // console.log('Listing routes registered successfully');
} catch (error) {
  console.error('Error registering listing routes:', error.stack);
}

try {
  // console.log('Registering auth routes...');
  app.use('/api/auth', authRoutes);
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

export default app;
