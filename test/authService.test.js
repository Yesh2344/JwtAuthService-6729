import request from 'supertest';
import express from 'express';
import bodyParser from 'express';
import {
  registerUser,
  loginUser,
  refreshTokens,
} from '../src/authService.js';
import { verifyAccessToken } from '../src/tokenUtils.js';
import logger from '../src/logger.js';

// Set up a minimal Express app for integration tests
const app = express();
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await registerUser(email, password);
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const tokens = await loginUser(email, password);
    res.json(tokens);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

app.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  try {
    const tokens = refreshTokens(refreshToken);
    res.json(tokens);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

describe('Auth Service Integration Tests', () => {
  const testUser = { email: 'test@example.com', password: 'Secret123!' };
  let refreshToken = '';

  test('Register a new user', async () => {
    const res = await request(app).post('/register').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(testUser.email);
  });

  test('Login returns JWT pair', async () => {
    const res = await request(app).post('/login').send(testUser);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    refreshToken = res.body.refreshToken;

    // Verify access token can be decoded
    const payload = verifyAccessToken(res.body.accessToken);
    expect(payload.email).toBe(testUser.email);
  });

  test('Refresh token yields new pair', async () => {
    const res = await request(app).post('/refresh').send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });
});