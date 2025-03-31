# E-Commerce API Automated Tests

This directory contains automated tests for the E-Commerce API backend.

## Setup

1. Make sure you have Node.js (version 14 or higher) installed on your system.

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Make sure the backend server is running. By default, the tests will connect to `http://localhost:8000/api`.

## Running the Tests

To run all API tests:

```bash
npm test
```

This will:
1. Create a test user
2. Test all authentication endpoints
3. Test category endpoints
4. Test product endpoints
5. Test order endpoints
6. Test payment endpoints
7. Clean up by deleting test data

The test results will be displayed in the console and also written to `api_test_results.log`.

## Custom Server URL

If your server is running on a different URL, you can modify the `API_BASE_URL` constant in the `api_test.js` file.

## Test Structure

The tests are structured to run in sequence, as each section depends on data created in previous sections:

1. **Authentication Tests**: Creates a test user and tests login, logout, and user management endpoints.
2. **Category Tests**: Creates and manages product categories.
3. **Product Tests**: Creates and manages products within categories.
4. **Order Tests**: Tests cart functionality and order creation.
5. **Payment Tests**: Tests payment processing.
6. **Cleanup Tests**: Deletes test data created during testing.

## Troubleshooting

If tests fail, check:

1. The backend server is running and accessible
2. The MongoDB database is connected properly
3. All required environment variables are set correctly in the parent directory's `.env` file
4. Network connectivity (if using a remote database)

For detailed error messages, check the `api_test_results.log` file. 