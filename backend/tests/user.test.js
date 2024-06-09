import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import dotenv from 'dotenv';

dotenv.config();

describe('User Endpoints', () => {
  let adminToken;
  let userId;

  beforeAll(async () => {
    
    const db = process.env.MONGO_URI;
    await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

   
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'admin', password: 'adminpass', isAdmin: true });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'adminpass' });

    adminToken = response.body.token;
    console.log('Admin Token:', adminToken);

   
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password123' });

    userId = userResponse.body._id;
    console.log('User ID:', userId);
  });

  afterAll(async () => {
    
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'newuser', password: 'password123' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('username', 'newuser');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should edit an existing user', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'updateduser' });

    console.log(res.body); 

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'updateduser');
  });

  it('should delete an existing user', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    console.log(res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');
  });

  it('should search for users', async () => {
    const res = await request(app)
      .get('/api/users?search=updateduser')
      .set('Authorization', `Bearer ${adminToken}`);

    console.log(res.body); 

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('users');
    expect(res.body.users.length).toBeGreaterThan(0);
  });
});
