const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const noteRoutes = require('./routes/note.routes');
const authRoutes = require('./routes/auth.routes');
const authMiddleware = require('./middlewares/auth.middleware');
const loggerMiddleware = require('./middlewares/logger.middleware');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

const envFile = process.env.NODE_ENV === 'docker' 
  ? '.env.docker' 
  : '.env.local';
dotenv.config({ path: envFile });

const app = express();
app.use(xss());
app.use(mongoSanitize());
app.use(loggerMiddleware);

// Middleware
app.use(cors());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});
app.use(limiter);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', authMiddleware.verifyToken, noteRoutes);

require('./swagger')(app);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
