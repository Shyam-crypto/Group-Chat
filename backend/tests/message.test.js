// tests/groupMessage.test.js

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Group Message Endpoints', () => {
  let userToken;
  let groupId;
  let messageId;

  beforeAll(async () => {
    const db = process.env.MONGO_URI;
    await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

    await request(app)
      .post('/api/auth/register')
      .send({ username: 'messageuser', password: 'password123' });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'messageuser', password: 'password123' });

    userToken = response.body.token;

    const groupRes = await request(app)
      .post('/api/groups')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'messagegroup' });

    groupId = groupRes.body._id;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should send a message in a group', async () => {
    const res = await request(app)
      .post(`/api/groups/${groupId}/messages`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ content: 'Hello, group!' });

    console.log('Send Message Response:', res.body); // Log the response for debugging

    messageId = res.body._id;
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('content', 'Hello, group!');
  });

  it('should like a message in a group', async () => {
    const res = await request(app)
      .post(`/api/groups/${groupId}/messages/${messageId}/like`)
      .set('Authorization', `Bearer ${userToken}`);

    console.log('Like Message Response:', res.body); // Log the response for debugging

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('likes');
    expect(res.body.likes).toContain(expect.any(String));
  });
});
