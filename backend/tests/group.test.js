// tests/group.test.js

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Group Endpoints', () => {
  let userToken;
  let groupId;

  beforeAll(async () => {
    const db = process.env.MONGO_URI;
    await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

    await request(app)
      .post('/api/auth/register')
      .send({ username: 'groupuser', password: 'password123' });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'groupuser', password: 'password123' });

    userToken = response.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a new group', async () => {
    const res = await request(app)
      .post('/api/groups')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'testgroup' });

    console.log('Create Group Response:', res.body); // Log the response for debugging

    groupId = res.body._id;
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'testgroup');
  });

  it('should search for groups', async () => {
    const res = await request(app)
      .get('/api/groups?search=testgroup')
      .set('Authorization', `Bearer ${userToken}`);

    console.log('Search Groups Response:', res.body); // Log the response for debugging

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('groups');
    expect(res.body.groups.length).toBeGreaterThan(0);
  });

  it('should add a member to the group', async () => {
    const res = await request(app)
      .put(`/api/groups/${groupId}/add-member`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ userId });

    console.log('Add Member Response:', res.body); // Log the response for debugging

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('members');
    expect(res.body.members).toContain(userId);
  });

  it('should delete a group', async () => {
    const res = await request(app)
      .delete(`/api/groups/${groupId}`)
      .set('Authorization', `Bearer ${userToken}`);

    console.log('Delete Group Response:', res.body); // Log the response for debugging

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Group deleted successfully');
  });
});
