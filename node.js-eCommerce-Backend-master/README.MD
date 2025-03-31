# E-Commerce Backend

A complete e-commerce backend built with Node.js and Express, featuring user authentication, product/category management, order processing, and payment integration with Razorpay.

## Features

- User authentication and management (signup, signin, update profile)
- Product and category CRUD operations
- Cart management
- Order processing
- Payment integration with Razorpay
- Admin functionalities for order management

## Admin API

The backend includes a comprehensive set of admin APIs for managing the e-commerce platform:

### Admin Authentication
- Login with admin credentials
- Secure admin routes with role-based access control

### Product Management
- Create, update, delete, and list all products
- Bulk product operations
- Product inventory management
- Product image upload and management

### Category Management
- Create hierarchical category structure
- Update and delete categories
- Associate products with categories

### Order Management
- View all customer orders
- Update order status (Processing, Shipped, Delivered, Cancelled)
- Filter orders by status, date, or customer
- Generate order reports

### User Management
- View all registered users
- Update user roles and permissions
- Disable/enable user accounts
- View user purchase history

### Dashboard Analytics
- Sales reports and statistics
- Inventory status
- Top-selling products
- Revenue trends and forecasts

### Payment Management
- View payment transactions
- Process refunds
- Manage failed payments
- Payment reconciliation

To access admin APIs, include the admin authentication token in your request headers. All admin endpoints are secured with middleware that verifies admin privileges.

## Tech Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication
- Razorpay Payment Gateway Integration
- AWS S3 for file storage

## Installation and Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd node.js-eCommerce-Backend-master
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory based on `.env.example`
   - Fill in your MongoDB connection string, JWT secret, and other required variables

4. Start the development server:
   ```
   npm run dev
   ```

5. For production:
   ```
   npm start
   ```

## API Documentation

Comprehensive API documentation is available in the `e-commerce-api-documentation.md` file in the root directory. This includes:

- All available endpoints (both customer and admin)
- Request/response formats
- Authentication requirements
- Role-based access control details
- Testing guidelines

The documentation is organized into sections:
- Public APIs (no authentication required)
- Customer APIs (customer authentication required)
- Admin APIs (admin authentication required)

Additionally, a Postman collection is available in `e-commerce-api-postman-collection.json` that you can import to quickly test all endpoints, including the admin functionality.

## Testing

### Automated Testing

The project includes both unit tests and automated API tests:

1. Unit tests (using Jest):
   ```
   npm test
   ```

2. Automated API tests:
   ```
   cd automated_tests
   npm install
   npm test
   ```

Refer to the `automated_tests/README.md` for detailed information on the API testing.

### Manual Testing

1. Import the Postman collection provided in the root directory
2. Set up environment variables in Postman:
   - `baseUrl`: http://localhost:8000/api
   - `token`: (will be populated after login)
3. Follow the testing flow outlined in the API documentation

## Project Structure

```
├── app.js                  # Application entry point
├── constants/              # Application constants
├── controllers/            # Route controllers
│   ├── AuthController.js   # User & admin authentication
│   ├── ProductController.js # Product management (includes admin endpoints)
│   ├── CategoryController.js # Category management (includes admin endpoints)
│   ├── OrderController.js  # Order processing (includes admin endpoints)
│   └── PaymentController.js # Payment processing
├── helpers/                # Helper utilities
├── middlewares/            # Custom middleware
│   ├── auth.js             # Authentication middleware
│   └── admin.js            # Admin role verification middleware
├── models/                 # Mongoose models
│   ├── user.js             # User model (includes admin role)
│   ├── product.js          # Product model
│   ├── category.js         # Category model
│   ├── order.js            # Order model
│   └── payment.js          # Payment model
├── routes/                 # API routes
│   ├── api.js              # Main router
│   ├── auth.js             # Authentication routes
│   ├── admin.js            # Admin-specific routes
│   ├── product.js          # Product routes (public & protected)
│   ├── category.js         # Category routes
│   ├── order.js            # Order routes
│   └── payment.js          # Payment routes
├── validators/             # Input validation
├── workers/                # Background processing
├── tests/                  # Unit tests
└── automated_tests/        # Automated API tests
```

## Frontend Integration

For integrating with a frontend application:

1. Store the JWT token from login/signup in localStorage or secure cookies
2. Include the token in the Authorization header for authenticated API requests
3. Handle token expiration by redirecting to login screen
4. Implement proper error handling for user-friendly messages

Sample code for frontend integration is available in the API documentation.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- [Your Name](https://github.com/yourusername)

## Acknowledgments

- Express.js team
- MongoDB team
- Razorpay for payment integration
