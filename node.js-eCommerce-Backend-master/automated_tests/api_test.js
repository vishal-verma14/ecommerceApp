const axios = require('axios');
const chalk = require('chalk');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: '../.env' });

// Configuration
const API_BASE_URL = 'http://localhost:8000/api';
const LOG_FILE_PATH = path.join(__dirname, 'api_test_results.log');

// Store authentication token
let authToken = '';
let userId = '';
let categoryId = '';
let productId = '';
let cartProductId = '';
let orderId = '';
let razorpayOrderId = '';

// Create a logger that outputs to both console and file
const logger = {
  log: (message) => {
    console.log(message);
    fs.appendFileSync(LOG_FILE_PATH, message + '\n');
  },
  success: (message) => {
    const formattedMessage = chalk.green(`✓ SUCCESS: ${message}`);
    console.log(formattedMessage);
    fs.appendFileSync(LOG_FILE_PATH, `SUCCESS: ${message}\n`);
  },
  error: (message, error) => {
    const formattedMessage = chalk.red(`✗ ERROR: ${message}`);
    console.log(formattedMessage);
    if (error && error.response) {
      console.log(chalk.red('Response:', JSON.stringify(error.response.data, null, 2)));
      fs.appendFileSync(LOG_FILE_PATH, `ERROR: ${message}\nResponse: ${JSON.stringify(error.response.data, null, 2)}\n`);
    } else {
      console.log(chalk.red('Error:', error.message));
      fs.appendFileSync(LOG_FILE_PATH, `ERROR: ${message}\nError: ${error.message}\n`);
    }
  },
  info: (message) => {
    const formattedMessage = chalk.blue(`ℹ INFO: ${message}`);
    console.log(formattedMessage);
    fs.appendFileSync(LOG_FILE_PATH, `INFO: ${message}\n`);
  },
  separator: () => {
    const line = '='.repeat(80);
    console.log(chalk.yellow(line));
    fs.appendFileSync(LOG_FILE_PATH, line + '\n');
  }
};

// Initialize log file
fs.writeFileSync(LOG_FILE_PATH, `E-Commerce API Test Results - ${new Date().toISOString()}\n\n`);

// API client with authentication
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Update auth token when it changes
const setAuthToken = (token) => {
  authToken = token;
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Test Authentication APIs
const testAuthAPIs = async () => {
  logger.separator();
  logger.info('TESTING AUTHENTICATION APIs');
  
  try {
    // Test user signup
    logger.info('Testing signup API...');
    const signupResponse = await apiClient.post('/auth/signup', {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    
    setAuthToken(signupResponse.data.token);
    userId = signupResponse.data.data._id;
    logger.success('Signup successful');
    
    // Test user signin
    logger.info('Testing signin API...');
    const signinResponse = await apiClient.post('/auth/signin', {
      email: signupResponse.data.data.email,
      password: 'password123'
    });
    
    setAuthToken(signinResponse.data.token);
    logger.success('Signin successful');
    
    // Test get user
    logger.info('Testing get user API...');
    const getUserResponse = await apiClient.get(`/auth/user/${userId}`);
    logger.success('Get user successful');
    
    // Test update user
    logger.info('Testing update user API...');
    const updateUserResponse = await apiClient.post(`/auth/update-user/${userId}`, {
      name: 'Updated Test User',
      address: '123 Test Street',
      phone: '1234567890'
    });
    logger.success('Update user successful');
    
    // Test signout
    logger.info('Testing signout API...');
    const signoutResponse = await apiClient.get('/auth/signout');
    logger.success('Signout successful');
    
    // Sign back in for the rest of the tests
    const reSigninResponse = await apiClient.post('/auth/signin', {
      email: signupResponse.data.data.email,
      password: 'password123'
    });
    setAuthToken(reSigninResponse.data.token);
    
    return true;
  } catch (error) {
    logger.error('Authentication API tests failed', error);
    return false;
  }
};

// Test Category APIs
const testCategoryAPIs = async () => {
  logger.separator();
  logger.info('TESTING CATEGORY APIs');
  
  try {
    // Test create category
    logger.info('Testing create category API...');
    const createCategoryResponse = await apiClient.post('/categories', {
      name: 'Test Category',
      imageUrl: 'https://example.com/images/test-category.jpg'
    });
    
    categoryId = createCategoryResponse.data.data._id;
    logger.success('Create category successful');
    
    // Test get all categories
    logger.info('Testing get all categories API...');
    const getCategoriesResponse = await apiClient.get('/categories');
    logger.success('Get all categories successful');
    
    // Test update category
    logger.info('Testing update category API...');
    const updateCategoryResponse = await apiClient.post(`/categories/update-category/${categoryId}`, {
      name: 'Updated Test Category',
      imageUrl: 'https://example.com/images/updated-test-category.jpg'
    });
    logger.success('Update category successful');
    
    return true;
  } catch (error) {
    logger.error('Category API tests failed', error);
    return false;
  }
};

// Test Product APIs
const testProductAPIs = async () => {
  logger.separator();
  logger.info('TESTING PRODUCT APIs');
  
  try {
    // Test add product
    logger.info('Testing add product API...');
    const addProductResponse = await apiClient.post('/products/add-product', {
      title: 'Test Product',
      summary: 'This is a test product',
      desc: 'This is a detailed description of the test product',
      images: ['https://example.com/images/test-product.jpg'],
      category: categoryId,
      sizes: ['S', 'M', 'L'],
      price: 99.99
    });
    
    productId = addProductResponse.data.data._id;
    logger.success('Add product successful');
    
    // Test get all products
    logger.info('Testing get all products API...');
    const getProductsResponse = await apiClient.get('/products/get-products');
    logger.success('Get all products successful');
    
    // Test get single product
    logger.info('Testing get single product API...');
    const getProductResponse = await apiClient.get(`/products/get-product/${productId}`);
    logger.success('Get single product successful');
    
    // Test update product
    logger.info('Testing update product API...');
    const updateProductResponse = await apiClient.post(`/products/update-product/${productId}`, {
      title: 'Updated Test Product',
      price: 89.99
    });
    logger.success('Update product successful');
    
    return true;
  } catch (error) {
    logger.error('Product API tests failed', error);
    return false;
  }
};

// Test Order APIs
const testOrderAPIs = async () => {
  logger.separator();
  logger.info('TESTING ORDER APIs');
  
  try {
    // Test add to cart
    logger.info('Testing add to cart API...');
    const addToCartResponse = await apiClient.post('/orders/add-to-cart', {
      product: productId,
      size: 'M',
      quantity: 2
    });
    
    cartProductId = addToCartResponse.data.data._id;
    logger.success('Add to cart successful');
    
    // Test get cart products
    logger.info('Testing get cart products API...');
    const getCartResponse = await apiClient.get('/orders/get-cart');
    logger.success('Get cart products successful');
    
    // Test remove from cart
    logger.info('Testing remove from cart API...');
    await apiClient.delete(`/orders/remove-from-cart/${cartProductId}`);
    logger.success('Remove from cart successful');
    
    // Add item back to cart for order testing
    await apiClient.post('/orders/add-to-cart', {
      product: productId,
      size: 'M',
      quantity: 1
    });
    
    // Test cash on delivery order
    logger.info('Testing cash on delivery order API...');
    const codOrderResponse = await apiClient.post('/orders/cod-order');
    orderId = codOrderResponse.data.orderId;
    logger.success('Cash on delivery order successful');
    
    // Test get user orders
    logger.info('Testing get user orders API...');
    const getUserOrdersResponse = await apiClient.get('/orders/get-orders');
    logger.success('Get user orders successful');
    
    // Test get all orders (admin)
    logger.info('Testing get all orders API...');
    const getAllOrdersResponse = await apiClient.get('/orders/get-all-orders');
    logger.success('Get all orders successful');
    
    // Test update order status (admin)
    logger.info('Testing update order status API...');
    const updateOrderResponse = await apiClient.post(`/orders/update-order/${orderId}`, {
      status: 'Shipped'
    });
    logger.success('Update order status successful');
    
    return true;
  } catch (error) {
    logger.error('Order API tests failed', error);
    return false;
  }
};

// Test Payment APIs
const testPaymentAPIs = async () => {
  logger.separator();
  logger.info('TESTING PAYMENT APIs');
  
  try {
    // Test create order
    logger.info('Testing create order API...');
    const createOrderResponse = await apiClient.post('/payment/create-order', {
      amount: 19998
    });
    
    razorpayOrderId = createOrderResponse.data.data.id;
    logger.success('Create order successful');
    
    // Test validate payment (test mode)
    logger.info('Testing test validate payment API...');
    const testValidateResponse = await apiClient.post('/payment/test-validate-payment', {
      razorpay_order_id: 'test_order',
      razorpay_payment_id: 'test_payment',
      razorpay_signature: 'test_signature'
    });
    logger.success('Test validate payment successful');
    
    return true;
  } catch (error) {
    logger.error('Payment API tests failed', error);
    return false;
  }
};

// Test Delete APIs (cleanup)
const testDeleteAPIs = async () => {
  logger.separator();
  logger.info('TESTING DELETE APIs (CLEANUP)');
  
  try {
    // Test delete product
    logger.info('Testing delete product API...');
    await apiClient.delete(`/products/delete-product/${productId}`);
    logger.success('Delete product successful');
    
    // Test delete category
    logger.info('Testing delete category API...');
    await apiClient.delete(`/categories/${categoryId}`);
    logger.success('Delete category successful');
    
    return true;
  } catch (error) {
    logger.error('Delete API tests failed', error);
    return false;
  }
};

// Run all tests
const runAllTests = async () => {
  logger.info('Starting E-Commerce API tests...');
  
  const authSuccess = await testAuthAPIs();
  if (!authSuccess) {
    logger.error('Authentication tests failed, stopping further tests');
    return;
  }
  
  const categorySuccess = await testCategoryAPIs();
  if (!categorySuccess) {
    logger.error('Category tests failed, stopping further tests');
    return;
  }
  
  const productSuccess = await testProductAPIs();
  if (!productSuccess) {
    logger.error('Product tests failed, stopping further tests');
    return;
  }
  
  const orderSuccess = await testOrderAPIs();
  if (!orderSuccess) {
    logger.error('Order tests failed, stopping further tests');
    return;
  }
  
  const paymentSuccess = await testPaymentAPIs();
  if (!paymentSuccess) {
    logger.error('Payment tests failed, stopping further tests');
    return;
  }
  
  const deleteSuccess = await testDeleteAPIs();
  if (!deleteSuccess) {
    logger.error('Delete tests failed');
  }
  
  logger.separator();
  if (authSuccess && categorySuccess && productSuccess && orderSuccess && paymentSuccess && deleteSuccess) {
    logger.success('ALL API TESTS COMPLETED SUCCESSFULLY');
  } else {
    logger.error('SOME API TESTS FAILED. CHECK LOG FOR DETAILS');
  }
};

// Run the tests
runAllTests().catch(error => {
  logger.error('Unhandled error during test execution', error);
}); 