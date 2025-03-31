# E-Commerce Backend

A complete e-commerce backend built with Node.js and Express, featuring user authentication, product/category management, order processing, and payment integration with Razorpay.

## Features

- User authentication and management (signup, signin, update profile)
- Product and category CRUD operations
- Cart management
- Order processing
- Payment integration with Razorpay
- Admin functionalities for order management

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

- All available endpoints
- Request/response formats
- Authentication requirements
- Testing guidelines

Additionally, a Postman collection is available in `e-commerce-api-postman-collection.json` that you can import to quickly test all endpoints.

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
├── helpers/                # Helper utilities
├── middlewares/            # Custom middleware
├── models/                 # Mongoose models
├── routes/                 # API routes
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
