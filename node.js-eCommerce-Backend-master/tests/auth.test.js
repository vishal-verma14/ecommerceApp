const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user');

describe('Authentication API Tests', () => {
  beforeAll(async () => {
    // Clear the users collection before tests
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('name', 'Test User');
      expect(res.body.data).toHaveProperty('email', 'test@example.com');
    });

    it('should not create user with existing email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Another User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'User already exists');
    });
  });

  describe('POST /api/auth/signin', () => {
    it('should login existing user', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('name', 'Test User');
      expect(res.body.data).toHaveProperty('email', 'test@example.com');
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Email and password do not match');
    });
  });
}); 