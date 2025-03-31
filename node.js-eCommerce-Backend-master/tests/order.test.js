const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
let userToken;
let productId;

describe('Order API Tests', () => {
  beforeAll(async () => {
    // Clear collections
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create a user
    const userRes = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123'
      });

    userToken = userRes.body.token;

    // Create a test product
    const product = await Product.create({
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      category: 'Test Category',
      stock: 100
    });

    productId = product._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/order/create', () => {
    it('should create a new order for authenticated user', async () => {
      const res = await request(app)
        .post('/api/order/create')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          products: [{
            product: productId,
            name: 'Test Product',
            count: 2,
            price: 99.99
          }],
          amount: 199.98,
          address: 'Test Address'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('amount', 199.98);
      expect(res.body.products).toHaveLength(1);
      expect(res.body.products[0]).toHaveProperty('count', 2);
    });

    it('should not create order without authentication', async () => {
      const res = await request(app)
        .post('/api/order/create')
        .send({
          products: [{
            product: productId,
            name: 'Test Product',
            count: 2,
            price: 99.99
          }],
          amount: 199.98,
          address: 'Test Address'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/orders/user', () => {
    it('should get all orders for authenticated user', async () => {
      const res = await request(app)
        .get('/api/orders/user')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should not get orders without authentication', async () => {
      const res = await request(app)
        .get('/api/orders/user');

      expect(res.statusCode).toBe(401);
    });
  });
}); 