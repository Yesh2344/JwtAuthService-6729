import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import {
  registerUser,
  loginUser,
  refreshTokens,
  getUserById,
} from './authService.js';
import { verifyAccessToken } from './tokenUtils.js';
import logger from './logger.js';
import { config } from './config.js';

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Routes
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  try {
    const user = await registerUser(email, password);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    logger.warn('Registration error', err);
    res.status(409).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const tokens = await loginUser(email, password);
    res.json(tokens);
  } catch (err) {
    logger.warn('Login failure', err);
    res.status(401).json({ error: err.message });
  }
});

app.post('/api/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }
  try {
    const tokens = refreshTokens(refreshToken);
    res.json(tokens);
  } catch (err) {
    logger.warn('Refresh token error', err);
    res.status(401).json({ error: err.message });
  }
});

app.get('/api/protected', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    const user = getUserById(payload.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'You have accessed a protected route!', user });
  } catch (err) {
    logger.warn('Protected route auth error', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// Global error handler
app.use((err, _req, res, _next) => {
  logger.error('Unhandled error', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(config.port, () => {
  logger.info(`JwtAuthService listening on port ${config.port}`);
});