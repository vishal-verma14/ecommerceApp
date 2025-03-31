# E-Commerce Frontend Developer Guide

This document provides technical details and guidelines for developers working on the E-Commerce Frontend application.

## Development Environment Setup

### Required Tools

- **Node.js**: v14 or higher
- **npm/yarn**: For package management
- **Git**: For version control
- **Code Editor**: VS Code recommended with the following extensions:
  - ESLint
  - Prettier
  - React Developer Tools
  - Redux DevTools

### Environment Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Create a `.env.development` file for development settings
   - Create a `.env.production` file for production settings
   - Create a `.env.test` file for test settings

3. Run development server with hot reloading:
   ```bash
   npm start
   ```

## Code Structure

### Component Organization

We follow a feature-based organization pattern:

```
src/
├── components/
│   ├── auth/               # Authentication components
│   │   ├── LoginForm.js
│   │   ├── SignupForm.js
│   │   └── ...
│   ├── products/           # Product-related components
│   │   ├── ProductList.js
│   │   ├── ProductDetail.js
│   │   └── ...
│   ├── cart/               # Cart components
│   │   ├── CartItem.js
│   │   ├── CartSummary.js
│   │   └── ...
│   ├── checkout/           # Checkout components
│   │   ├── CheckoutForm.js
│   │   ├── PaymentOptions.js
│   │   └── ...
│   ├── common/             # Reusable UI components
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Modal.js
│   │   └── ...
│   └── layout/             # Layout components
│       ├── Header.js
│       ├── Footer.js
│       └── ...
```

### Component Types

1. **Presentational Components**: Focus on UI, receive data via props
2. **Container Components**: Connect to Redux store, pass data to presentational components
3. **Page Components**: Represent complete pages, compose multiple components
4. **Layout Components**: Define the structure of the application
5. **Common Components**: Reusable UI elements

### Component Naming Conventions

- Use PascalCase for component names
- Use `.jsx` extension for components with JSX
- Name files the same as the component they export
- Use specific suffixes for special types of components:
  - `*Page.jsx` for page components
  - `*Form.jsx` for form components
  - `*List.jsx` for components that render lists

## State Management

### Redux Store Structure

```javascript
{
  auth: {
    user: { id, name, email, ... },
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  },
  products: {
    items: [],
    currentProduct: {},
    filters: {},
    loading: boolean,
    error: string | null
  },
  cart: {
    items: [],
    totalAmount: number,
    totalItems: number,
    loading: boolean,
    error: string | null
  },
  checkout: {
    orderDetails: {},
    paymentInfo: {},
    step: number,
    loading: boolean,
    error: string | null
  },
  ui: {
    notifications: [],
    modals: {},
    theme: 'light' | 'dark'
  }
}
```

### Redux Best Practices

1. Use Redux Toolkit for simplified Redux logic
2. Use slices to organize reducers and actions
3. Use selectors to extract data from the store
4. Normalize complex state shapes
5. Use middleware for side effects (Redux Thunk or Redux Saga)
6. Keep Redux state serializable
7. Use Redux DevTools for debugging

## API Communication

### Service Layer

All API calls are abstracted in service files:

```
src/
├── services/
│   ├── authService.js
│   ├── productService.js
│   ├── cartService.js
│   ├── orderService.js
│   └── ...
```

### Error Handling

Use a consistent approach to handle API errors:

```javascript
try {
  const response = await apiService.someMethod();
  return response.data;
} catch (error) {
  // Handle different types of errors
  if (error.response) {
    // Server responded with an error status
    const { status, data } = error.response;
    
    if (status === 401) {
      // Handle unauthorized access
      dispatch(logoutUser());
    }
    
    return thunkAPI.rejectWithValue(data);
  } else if (error.request) {
    // Request was made but no response received
    return thunkAPI.rejectWithValue({ message: 'Network error. Please try again.' });
  } else {
    // Something else happened
    return thunkAPI.rejectWithValue({ message: error.message });
  }
}
```

### Authentication

1. JWT tokens are stored in localStorage
2. Include auth token in API request headers:

```javascript
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
```

3. Handle token expiration by refreshing or redirecting to login

## Form Management

### Formik + Yup Implementation

Example of form validation:

```javascript
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// Component
const LoginForm = ({ onSubmit }) => (
  <Formik
    initialValues={{ email: '', password: '' }}
    validationSchema={LoginSchema}
    onSubmit={onSubmit}
  >
    {({ errors, touched }) => (
      <Form>
        <Field name="email" type="email" placeholder="Email" />
        {errors.email && touched.email ? <div>{errors.email}</div> : null}
        
        <Field name="password" type="password" placeholder="Password" />
        {errors.password && touched.password ? <div>{errors.password}</div> : null}
        
        <button type="submit">Login</button>
      </Form>
    )}
  </Formik>
);
```

### Form Submission

Use Redux thunks for form submissions:

```javascript
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    } catch (error) {
      // Error handling logic
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
```

## Styling

### Styled Components

Example of a styled component:

```javascript
import styled from 'styled-components';

export const Button = styled.button`
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'white'};
  color: ${props => props.primary ? 'white' : 'var(--primary-color)'};
  padding: 0.5rem 1rem;
  border: 2px solid var(--primary-color);
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-dark)' : 'var(--primary-light)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
```

### Theme Variables

Define all theme variables in a central theme file:

```javascript
export const lightTheme = {
  primary: '#3f51b5',
  secondary: '#f50057',
  text: '#333',
  background: '#fff',
  error: '#f44336',
  success: '#4caf50',
  // More colors...
};

export const darkTheme = {
  primary: '#7986cb',
  secondary: '#ff4081',
  text: '#f5f5f5',
  background: '#121212',
  error: '#e57373',
  success: '#81c784',
  // More colors...
};
```

## Routing

### Protected Routes

Implementation of protected routes:

```javascript
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Usage in route definitions
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { 
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "orders", element: <OrdersPage /> },
        ] 
      },
      // More routes...
    ]
  }
]);
```

### Route Constants

Define route paths as constants:

```javascript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PRODUCT_LIST: '/products',
  PRODUCT_DETAIL: (id) => `/products/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  // More routes...
};
```

## Testing

### Unit Testing with Jest and React Testing Library

Example test for a component:

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import LoginForm from './LoginForm';

const mockStore = configureStore([]);

describe('LoginForm', () => {
  let store;
  
  beforeEach(() => {
    store = mockStore({
      auth: {
        loading: false,
        error: null
      }
    });
  });
  
  it('renders the form correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
  
  it('validates user input', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </Provider>
    );
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    // Submit empty form
    fireEvent.click(submitButton);
    
    // Check for validation errors
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });
  
  // More tests...
});
```

### E2E Testing with Cypress

Example Cypress test:

```javascript
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });
  
  it('should login successfully with valid credentials', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-token',
        user: { id: 1, name: 'Test User', email: 'test@example.com' }
      }
    }).as('loginRequest');
    
    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('button').contains('Login').click();
    
    cy.wait('@loginRequest');
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome, Test User').should('be.visible');
  });
  
  // More tests...
});
```

## Performance Optimization

### Code Splitting

Use React.lazy and Suspense for component-level code splitting:

```javascript
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy-loaded components
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
```

### Memoization

Use React.memo for components and useMemo/useCallback hooks for optimizing renders:

```javascript
import React, { memo, useMemo, useCallback } from 'react';

const ProductCard = memo(({ product, onAddToCart }) => {
  // Component logic
  
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(product.price);
  }, [product.price]);
  
  const handleAddToCart = useCallback(() => {
    onAddToCart(product.id);
  }, [product.id, onAddToCart]);
  
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{formattedPrice}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
});
```

## Accessibility

### Implementation Guidelines

1. Use semantic HTML elements
2. Implement keyboard navigation
3. Add proper ARIA attributes
4. Ensure sufficient color contrast
5. Provide text alternatives for non-text content
6. Create responsive designs that work with screen readers

### Example Implementation

```javascript
const Dropdown = ({ label, options, onChange, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' && isOpen) {
      // Focus next option
    } else if (e.key === 'ArrowUp' && isOpen) {
      // Focus previous option
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleDropdown();
    }
  };
  
  return (
    <div 
      className="dropdown" 
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <label id={`${label}-label`}>{label}</label>
      <button
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${label}-label`}
        onClick={toggleDropdown}
      >
        {value || 'Select an option'}
      </button>
      
      {isOpen && (
        <ul 
          role="listbox"
          aria-labelledby={`${label}-label`}
          tabIndex={-1}
        >
          {options.map((option, index) => (
            <li
              key={index}
              role="option"
              aria-selected={option === value}
              onClick={() => handleOptionClick(option)}
              tabIndex={0}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

## Debugging and Troubleshooting

### Common Issues and Solutions

1. **State updates not reflecting in UI**
   - Check if the component is memoized and dependencies are correct
   - Verify that the state is being updated correctly
   - Use React DevTools to inspect component state

2. **Infinite re-renders**
   - Look for missing dependency arrays in useEffect hooks
   - Check for state updates in render logic
   - Use React.memo and useMemo/useCallback hooks

3. **Redux state not updating**
   - Use Redux DevTools to verify actions are being dispatched
   - Check reducer logic for handling the action
   - Ensure the component is connected to the Redux store

4. **API calls failing**
   - Check browser console for network errors
   - Verify API URL and request payload
   - Ensure authorization headers are set correctly

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring without functionality changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Updates to build process, dependencies, etc.

Example:
```
feat(auth): add user registration functionality

- Add registration form component
- Create Redux actions and reducers for registration
- Add validation for registration inputs

Closes #123
```

## CI/CD Pipeline

Our CI/CD pipeline uses GitHub Actions:

1. **Continuous Integration**:
   - Lint code
   - Run unit tests
   - Run integration tests
   - Build application

2. **Continuous Deployment**:
   - Deploy to staging environment for PR review
   - Deploy to production on merge to main branch

### Pipeline Configuration

See the `.github/workflows` directory for workflow definitions.

## Recommended VS Code Extensions

- ESLint: JavaScript linting
- Prettier: Code formatting
- ES7+ React/Redux/React-Native snippets: Helpful code snippets
- Jest: Testing support
- vscode-styled-components: Syntax highlighting for styled-components
- Import Cost: Display import package sizes
- Path Intellisense: Autocomplete filenames in imports
- Error Lens: Inline error display 