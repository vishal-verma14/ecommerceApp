require('dotenv').config();

// Use test database
process.env.DATABASE = process.env.TEST_DATABASE || 'mongodb://localhost:27017/ecommerce_test';

// Set test environment
process.env.NODE_ENV = 'test';

// Increase test timeout
jest.setTimeout(30000); 