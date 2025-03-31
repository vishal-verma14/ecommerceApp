# E-Commerce Frontend

A modern, responsive e-commerce frontend application built with React, designed to work seamlessly with the Node.js E-Commerce Backend.

## Features

- User authentication (signup, login, profile management)
- Product browsing with advanced filtering and search
- Category navigation with hierarchical structure
- Shopping cart functionality
- Checkout process with multiple payment options
- Order tracking and history
- Responsive design for mobile, tablet, and desktop
- Admin dashboard for store management

## Tech Stack

- React.js
- Redux for state management
- React Router for navigation
- Styled Components for styling
- Axios for API communication
- Formik and Yup for form validation
- React Query for data fetching
- Payment gateway integration (Razorpay)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn
- Backend API running (see backend repository)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

The application will be available at http://localhost:3000

## Application Structure

```
├── public/                 # Static files
├── src/
│   ├── assets/             # Images, fonts, etc.
│   │   ├── common/         # Buttons, inputs, etc.
│   │   ├── layout/         # Header, footer, etc.
│   │   └── ...             # Feature-specific components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API service functions
│   ├── store/              # Redux store and slices
│   ├── utils/              # Utility functions
│   ├── App.js              # Main App component
│   └── index.js            # Application entry point
└── .env                    # Environment variables
```

## Key Components

### Authentication

The application uses JWT tokens for authentication:
- Tokens are stored in localStorage
- Auth state is managed in Redux
- Protected routes redirect unauthenticated users to login

### Product Browsing

- Grid and list views for products
- Filtering by category, price, rating, etc.
- Sorting options (price, popularity, newest)
- Search functionality with autocomplete
- Infinite scrolling for product lists

### Shopping Cart

- Add/remove products
- Update quantities
- Save for later functionality
- Persistent cart (saved in localStorage)

### Checkout

- Multi-step checkout process
- Address management
- Payment method selection
- Order summary
- Integration with Razorpay for payments

### User Dashboard

- Order history and tracking
- Profile management
- Address book
- Wishlist management

### Admin Dashboard

- Product management (CRUD operations)
- Order management
- User management
- Sales analytics
- Inventory management

## API Integration

The frontend communicates with the backend through RESTful API endpoints:

```javascript
// Example API service for products
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const productService = {
  getAllProducts: async (filters = {}) => {
    const response = await axios.get(`${API_URL}/products`, { params: filters });
    return response.data;
  },
  
  getProductById: async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  },
  
  // More methods...
};
```

## State Management

Redux is used for global state management:

```javascript
// Example Redux slice for cart
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    totalItems: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      // Add item logic
    },
    removeFromCart: (state, action) => {
      // Remove item logic
    },
    // More actions...
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
```

## Responsive Design

The application is fully responsive with breakpoints for:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

CSS variables are used for consistent theming:

```css
:root {
  --primary-color: #3f51b5;
  --secondary-color: #f50057;
  --text-color: #333;
  --background-color: #fff;
  --error-color: #f44336;
  --success-color: #4caf50;
  /* More variables... */
}
```

## Testing

### Unit Testing

```bash
npm test
# or
yarn test
```

### End-to-End Testing

```bash
npm run cypress:open
# or
yarn cypress:open
```

## Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory.

## Deployment

Instructions for deploying to various platforms:

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command to `npm run build`
3. Set publish directory to `build`
4. Configure environment variables

### Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect React configuration
3. Configure environment variables

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
