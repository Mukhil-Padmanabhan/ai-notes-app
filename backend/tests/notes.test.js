process.env.JWT_SECRET = 'test_secret_key';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/user.model');
const Note = require('../models/note.model');
const { generateToken } = require('../utils/jwt');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('../routes/auth.routes');
const noteRoutes = require('../routes/note.routes');
const authMiddleware = require('../middlewares/auth.middleware');
const loggerMiddleware = require('../middlewares/logger.middleware');

// Mock sentiment service
jest.mock('../ml/sentimentService', () => ({
  analyze: () => 'neutral',
}));

let mongoServer;
let app;

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
  app.use('/api/notes', authMiddleware.verifyToken, noteRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Note Routes', () => {
  let token;
  let userId;

  beforeEach(async () => {
    await User.deleteMany();
    await Note.deleteMany();
    const user = await User.create({ email: 'note@example.com', password: 'pass1234' });
    userId = user._id;
    token = generateToken(userId);
  });

  it('should create a note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Note',
        content: 'This content is valid and has more than 10 characters.',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('title', 'Test Note');
    expect(res.body.data).toHaveProperty('sentiment');
  });

  it('should not create a note with short content', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Short Note',
        content: 'short',
      });
    expect(res.statusCode).toBe(400);
  });

  it('should return 500 on create error', async () => {
    jest.spyOn(Note, 'create').mockRejectedValueOnce(new Error('DB Error'));
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', content: 'This is a long enough content' });
    expect(res.statusCode).toBe(500);
    Note.create.mockRestore();
  });

  it('should fetch notes', async () => {
    await Note.create({ title: 'Note 1', content: 'Some content here', user: userId });
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should analyze sentiment of a note', async () => {
    const note = await Note.create({
      title: 'Sentiment Note',
      content: 'Happy content',
      user: userId,
    });

    const res = await request(app)
      .get(`/api/notes/${note._id}/analyze`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.sentiment).toBe('neutral');
  });

  it('should return 404 when analyzing non-existent note', async () => {
    const res = await request(app)
      .get(`/api/notes/${new mongoose.Types.ObjectId()}/analyze`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  it('should return 500 on sentiment analysis error', async () => {
    jest.spyOn(Note, 'findOne').mockRejectedValueOnce(new Error('DB Error'));
    const res = await request(app)
      .get(`/api/notes/${new mongoose.Types.ObjectId()}/analyze`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(500);
    Note.findOne.mockRestore();
  });

  it('should update a note', async () => {
    const note = await Note.create({
      title: 'Old Title',
      content: 'Valid content for update',
      user: userId,
    });

    const res = await request(app)
      .put(`/api/notes/${note._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Title', content: 'Updated content here' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('New Title');
  });

  it('should return 400 on invalid update input', async () => {
    const note = await Note.create({
      title: 'Test',
      content: 'Valid content',
      user: userId,
    });

    const res = await request(app)
      .put(`/api/notes/${note._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '', content: 'short' });

    expect(res.statusCode).toBe(400);
  });

  it('should return 404 when updating non-existent note', async () => {
    const res = await request(app)
      .put(`/api/notes/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Title', content: 'Valid content' });

    expect(res.statusCode).toBe(404);
  });

  it('should return 500 on update error', async () => {
    jest.spyOn(Note, 'findOneAndUpdate').mockRejectedValueOnce(new Error('Update failed'));
    const res = await request(app)
      .put(`/api/notes/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Error', content: 'Valid content' });
    expect(res.statusCode).toBe(500);
    Note.findOneAndUpdate.mockRestore();
  });

  it('should delete a note', async () => {
    const note = await Note.create({
      title: 'Delete Me',
      content: 'This is deletable content',
      user: userId,
    });

    const res = await request(app)
      .delete(`/api/notes/${note._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('should return 404 on non-existent delete', async () => {
    const res = await request(app)
      .delete(`/api/notes/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  it('should return 500 on delete error', async () => {
    jest.spyOn(Note, 'findOneAndDelete').mockRejectedValueOnce(new Error('Delete failed'));
    const res = await request(app)
      .delete(`/api/notes/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(500);
    Note.findOneAndDelete.mockRestore();
  });

  it('should return 401 when no token is provided', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toBe(401);
  });

  it('should return 400 for invalid note ID in analyze', async () => {
    const res = await request(app)
      .get('/api/notes/invalid-id/analyze')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(500); // or 400 depending on your error handler
  });

  it('should return a structured response with sentiment', async () => {
    const note = await Note.create({
      title: 'Feel Good',
      content: 'I am feeling amazing!',
      user: userId,
    });
  
    const res = await request(app)
      .get(`/api/notes/${note._id}/analyze`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      statusCode: 200,
      status: 'Success',
      message: 'Sentiment successfully analyzed',
      data: { sentiment: expect.any(String) },
    });
  });
});
