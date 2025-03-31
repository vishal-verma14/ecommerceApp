const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Product = require('../models/product');
const User = require('../models/user');
let adminToken;

describe('Product API Tests', () => {
  beforeAll(async () => {
    // Clear the products collection before tests
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create an admin user
    const adminRes = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 1
      });

    adminToken = adminRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/product/create', () => {
    it('should create a new product when admin is authenticated', async () => {
      const res = await request(app)
        .post('/api/product/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product',
          description: 'Test Description',
          price: 99.99,
          category: 'Test Category',
          stock: 100
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Test Product');
      expect(res.body).toHaveProperty('price', 99.99);
    });

    it('should not create product without admin authentication', async () => {
      const res = await request(app)
        .post('/api/product/create')
        .send({
          name: 'Test Product',
          description: 'Test Description',
          price: 99.99,
          category: 'Test Category',
          stock: 100
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/products', () => {
    it('should get all products', async () => {
      const res = await request(app)
        .get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/product/:productId', () => {
    let productId;

    beforeAll(async () => {
      const product = await Product.findOne({ name: 'Test Product' });
      productId = product._id;
    });

    it('should get product by id', async () => {
      const res = await request(app)
        .get(`/api/product/${productId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Test Product');
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app)
        .get('/api/product/123456789012345678901234');

      expect(res.statusCode).toBe(404);
    });
  });
}); 