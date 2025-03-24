process.env.JWT_SECRET = 'test_secret_key';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/user.model');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('../routes/auth.routes');
const loggerMiddleware = require('../middlewares/logger.middleware');

let mongoServer;
let app;
let server;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.disconnect();
  await mongoose.connect(mongoServer.getUri());

  app = express();
  app.use(loggerMiddleware);
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
  app.use('/api/auth', authRoutes);

  server = app.listen(0); // random available port
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe('Auth Routes', () => {
  const userData = {
    email: 'test@example.com',
    password: 'test1234',
  };

  beforeEach(async () => {
    await User.deleteMany();
  });

  it('should register a user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send(userData);
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should not register an existing user', async () => {
    await request(server).post('/api/auth/register').send(userData);
    const res = await request(server)
      .post('/api/auth/register')
      .send(userData);
    expect(res.statusCode).toBe(409);
  });

  it('should login a user', async () => {
    await request(server).post('/api/auth/register').send(userData);
    const res = await request(server)
      .post('/api/auth/login')
      .send(userData);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should fail login with wrong password', async () => {
    await request(server).post('/api/auth/register').send(userData);
    const res = await request(server)
      .post('/api/auth/login')
      .send({ email: userData.email, password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
  });

});
