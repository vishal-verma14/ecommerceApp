# E-Commerce API Integration Guide

This guide provides detailed instructions for integrating the React frontend with the Node.js/Express backend API.

## API Base URL

The base URL for all API requests is defined in your environment configuration:

```
REACT_APP_API_URL=http://localhost:8000/api
```

In production, this should be updated to your deployed API URL.

## Authentication

### User Authentication Flow

1. **Sign Up**
   ```javascript
   // services/authService.js
   export const register = async (userData) => {
     return axios.post(`${API_URL}/auth/register`, userData);
   };
   
   // Usage in component
   const handleSignup = async (formData) => {
     try {
       const response = await authService.register(formData);
       localStorage.setItem('token', response.data.token);
       dispatch(setUser(response.data.user));
       navigate('/dashboard');
     } catch (error) {
       setError(error.response?.data?.message || 'Registration failed');
     }
   };
   ```

2. **Sign In**
   ```javascript
   // services/authService.js
   export const login = async (credentials) => {
     return axios.post(`${API_URL}/auth/login`, credentials);
   };
   
   // Usage in component
   const handleLogin = async (formData) => {
     try {
       const response = await authService.login(formData);
       localStorage.setItem('token', response.data.token);
       dispatch(setUser(response.data.user));
       navigate('/dashboard');
     } catch (error) {
       setError(error.response?.data?.message || 'Login failed');
     }
   };
   ```

3. **Authentication Header**
   ```javascript
   // services/axiosConfig.js
   import axios from 'axios';

   const API_URL = process.env.REACT_APP_API_URL;
   
   const axiosInstance = axios.create({
     baseURL: API_URL,
     headers: {
       'Content-Type': 'application/json',
     },
   });
   
   // Add a request interceptor to include the auth token
   axiosInstance.interceptors.request.use(
     (config) => {
       const token = localStorage.getItem('token');
       if (token) {
         config.headers['Authorization'] = `Bearer ${token}`;
       }
       return config;
     },
     (error) => {
       return Promise.reject(error);
     }
   );
   
   // Add a response interceptor to handle token expiration
   axiosInstance.interceptors.response.use(
     (response) => response,
     (error) => {
       if (error.response && error.response.status === 401) {
         // Token expired or invalid
         localStorage.removeItem('token');
         window.location.href = '/login';
       }
       return Promise.reject(error);
     }
   );
   
   export default axiosInstance;
   ```

4. **Logout**
   ```javascript
   // services/authService.js
   export const logout = () => {
     localStorage.removeItem('token');
     // No need to call backend as JWT is stateless
   };
   ```

### Admin Authentication

For admin-specific functionality, use the same authentication flow but ensure the user has admin privileges:

```javascript
// Redux slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.role === 'admin';
    },
    // Other reducers...
  },
});
```

## Product API

### Fetching Products

1. **Get All Products**
   ```javascript
   // services/productService.js
   export const getProducts = async (filters = {}) => {
     return axiosInstance.get('/products', { params: filters });
   };
   
   // Usage with React Query
   import { useQuery } from 'react-query';
   import { getProducts } from '../services/productService';
   
   const ProductList = () => {
     const [filters, setFilters] = useState({
       category: '',
       minPrice: '',
       maxPrice: '',
       sort: 'newest',
       page: 1,
       limit: 10,
     });
     
     const { data, isLoading, error } = useQuery(
       ['products', filters],
       () => getProducts(filters),
       {
         keepPreviousData: true,
         staleTime: 5 * 60 * 1000, // 5 minutes
       }
     );
     
     // Component logic...
   };
   ```

2. **Get Product by ID**
   ```javascript
   // services/productService.js
   export const getProductById = async (id) => {
     return axiosInstance.get(`/products/${id}`);
   };
   
   // Usage with React Query
   const ProductDetail = ({ id }) => {
     const { data, isLoading, error } = useQuery(
       ['product', id],
       () => getProductById(id),
       {
         enabled: !!id,
       }
     );
     
     // Component logic...
   };
   ```

3. **Search Products**
   ```javascript
   // services/productService.js
   export const searchProducts = async (query) => {
     return axiosInstance.get('/products/search', { params: { q: query } });
   };
   ```

### Managing Products (Admin)

1. **Create Product**
   ```javascript
   // services/productService.js
   export const createProduct = async (productData) => {
     return axiosInstance.post('/products', productData);
   };
   
   // Usage with React Query
   import { useMutation, useQueryClient } from 'react-query';
   
   const AddProductForm = () => {
     const queryClient = useQueryClient();
     
     const mutation = useMutation(createProduct, {
       onSuccess: () => {
         queryClient.invalidateQueries('products');
         // Reset form and show success message
       },
     });
     
     const handleSubmit = (formData) => {
       mutation.mutate(formData);
     };
     
     // Form rendering...
   };
   ```

2. **Update Product**
   ```javascript
   // services/productService.js
   export const updateProduct = async ({ id, data }) => {
     return axiosInstance.put(`/products/${id}`, data);
   };
   
   // Usage with React Query
   const EditProductForm = ({ id, initialData }) => {
     const queryClient = useQueryClient();
     
     const mutation = useMutation(updateProduct, {
       onSuccess: () => {
         queryClient.invalidateQueries(['products']);
         queryClient.invalidateQueries(['product', id]);
       },
     });
     
     const handleSubmit = (formData) => {
       mutation.mutate({ id, data: formData });
     };
     
     // Form rendering...
   };
   ```

3. **Delete Product**
   ```javascript
   // services/productService.js
   export const deleteProduct = async (id) => {
     return axiosInstance.delete(`/products/${id}`);
   };
   
   // Usage with React Query
   const ProductActions = ({ product }) => {
     const queryClient = useQueryClient();
     
     const mutation = useMutation(deleteProduct, {
       onSuccess: () => {
         queryClient.invalidateQueries('products');
       },
     });
     
     const handleDelete = () => {
       if (window.confirm('Are you sure you want to delete this product?')) {
         mutation.mutate(product.id);
       }
     };
     
     // Component rendering...
   };
   ```

## Category API

### Fetching Categories

```javascript
// services/categoryService.js
export const getCategories = async () => {
  return axiosInstance.get('/categories');
};

// Usage in component
const Categories = () => {
  const { data, isLoading, error } = useQuery(
    'categories',
    getCategories,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
  
  // Component logic...
};
```

### Managing Categories (Admin)

Similar to product management, with appropriate endpoints:

```javascript
// services/categoryService.js
export const createCategory = async (data) => {
  return axiosInstance.post('/categories', data);
};

export const updateCategory = async ({ id, data }) => {
  return axiosInstance.put(`/categories/${id}`, data);
};

export const deleteCategory = async (id) => {
  return axiosInstance.delete(`/categories/${id}`);
};
```

## Cart Management

### Local Storage Cart

For better performance and offline capabilities, implement the cart using localStorage with syncing to the backend:

```javascript
// services/cartService.js
import axiosInstance from './axiosConfig';

// Local cart operations
export const getLocalCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : { items: [], totalAmount: 0, totalItems: 0 };
};

export const setLocalCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Backend cart operations
export const syncCartWithBackend = async (cart) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return cart; // If not logged in, just use local cart
    
    // Send cart to backend
    const response = await axiosInstance.post('/cart/sync', cart);
    return response.data;
  } catch (error) {
    console.error('Failed to sync cart with backend', error);
    return cart;
  }
};

export const getCartFromBackend = async () => {
  try {
    const response = await axiosInstance.get('/cart');
    setLocalCart(response.data); // Update local storage
    return response.data;
  } catch (error) {
    console.error('Failed to get cart from backend', error);
    return getLocalCart();
  }
};
```

### Cart Redux Slice

```javascript
// store/slices/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cartService from '../../services/cartService';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        return await cartService.getCartFromBackend();
      } else {
        return cartService.getLocalCart();
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async (cart, { rejectWithValue }) => {
    try {
      cartService.setLocalCart(cart);
      return await cartService.syncCartWithBackend(cart);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    totalItems: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.product.price * item.quantity, 
        0
      );
    },
    // More reducers...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch cart';
      })
      // Sync cart cases...
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

## Order Management

### Creating Orders

```javascript
// services/orderService.js
export const createOrder = async (orderData) => {
  return axiosInstance.post('/orders', orderData);
};

// Usage in component
const CheckoutPage = () => {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  
  const mutation = useMutation(createOrder, {
    onSuccess: (data) => {
      dispatch(clearCart());
      navigate(`/orders/${data.id}`);
    },
  });
  
  const handlePlaceOrder = (paymentData) => {
    const orderData = {
      items: cart.items,
      shippingAddress: addressFormData,
      paymentMethod: paymentData.method,
      paymentDetails: paymentData.details,
    };
    
    mutation.mutate(orderData);
  };
  
  // Component rendering...
};
```

### Fetching Orders

```javascript
// services/orderService.js
export const getUserOrders = async () => {
  return axiosInstance.get('/orders');
};

export const getOrderById = async (id) => {
  return axiosInstance.get(`/orders/${id}`);
};

// Usage in component
const OrdersPage = () => {
  const { data, isLoading, error } = useQuery(
    'userOrders',
    getUserOrders
  );
  
  // Component rendering...
};

const OrderDetailPage = ({ id }) => {
  const { data, isLoading, error } = useQuery(
    ['order', id],
    () => getOrderById(id),
    {
      enabled: !!id,
    }
  );
  
  // Component rendering...
};
```

### Admin Order Management

```javascript
// services/orderService.js
export const getAllOrders = async (filters = {}) => {
  return axiosInstance.get('/admin/orders', { params: filters });
};

export const updateOrderStatus = async ({ id, status }) => {
  return axiosInstance.patch(`/admin/orders/${id}/status`, { status });
};

// Usage in component
const AdminOrdersPage = () => {
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 20,
  });
  
  const { data, isLoading, error } = useQuery(
    ['adminOrders', filters],
    () => getAllOrders(filters),
    {
      keepPreviousData: true,
    }
  );
  
  // Component rendering...
};

const OrderStatusUpdate = ({ order }) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation(updateOrderStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOrders']);
      queryClient.invalidateQueries(['order', order.id]);
    },
  });
  
  const handleStatusUpdate = (status) => {
    mutation.mutate({ id: order.id, status });
  };
  
  // Component rendering...
};
```

## Payment Integration

### Razorpay Integration

```javascript
// services/paymentService.js
export const createPaymentOrder = async (amount) => {
  return axiosInstance.post('/payments/razorpay/create', { amount });
};

export const verifyPayment = async (paymentData) => {
  return axiosInstance.post('/payments/razorpay/verify', paymentData);
};

// Usage in component
const RazorpayPayment = ({ amount, onSuccess, onFailure }) => {
  const handlePayment = async () => {
    try {
      // 1. Create order on backend
      const orderResponse = await createPaymentOrder(amount);
      const { id: orderId } = orderResponse.data;
      
      // 2. Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount * 100, // Razorpay expects amount in paisa
        currency: 'INR',
        name: 'E-Commerce Store',
        description: 'Purchase Payment',
        order_id: orderId,
        handler: async (response) => {
          // 3. Verify payment on backend
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          
          try {
            await verifyPayment(verificationData);
            onSuccess({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
            });
          } catch (error) {
            onFailure(error.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
        },
        theme: {
          color: '#3f51b5',
        },
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      onFailure(error.response?.data?.message || 'Failed to initialize payment');
    }
  };
  
  return (
    <button onClick={handlePayment}>
      Pay with Razorpay
    </button>
  );
};
```

## User Profile Management

```javascript
// services/userService.js
export const getUserProfile = async () => {
  return axiosInstance.get('/user/profile');
};

export const updateUserProfile = async (userData) => {
  return axiosInstance.put('/user/profile', userData);
};

export const updatePassword = async (passwordData) => {
  return axiosInstance.put('/user/password', passwordData);
};

// Usage in component
const ProfilePage = () => {
  const { data, isLoading, error } = useQuery(
    'userProfile',
    getUserProfile
  );
  
  const mutation = useMutation(updateUserProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries('userProfile');
      // Show success notification
    },
  });
  
  const handleProfileUpdate = (formData) => {
    mutation.mutate(formData);
  };
  
  // Component rendering...
};
```

## Address Management

```javascript
// services/addressService.js
export const getUserAddresses = async () => {
  return axiosInstance.get('/user/addresses');
};

export const addAddress = async (addressData) => {
  return axiosInstance.post('/user/addresses', addressData);
};

export const updateAddress = async ({ id, data }) => {
  return axiosInstance.put(`/user/addresses/${id}`, data);
};

export const deleteAddress = async (id) => {
  return axiosInstance.delete(`/user/addresses/${id}`);
};

// Usage in component
const AddressBook = () => {
  const { data, isLoading, error } = useQuery(
    'userAddresses',
    getUserAddresses
  );
  
  const addMutation = useMutation(addAddress, {
    onSuccess: () => {
      queryClient.invalidateQueries('userAddresses');
      // Show success notification
    },
  });
  
  const updateMutation = useMutation(updateAddress, {
    onSuccess: () => {
      queryClient.invalidateQueries('userAddresses');
      // Show success notification
    },
  });
  
  const deleteMutation = useMutation(deleteAddress, {
    onSuccess: () => {
      queryClient.invalidateQueries('userAddresses');
      // Show success notification
    },
  });
  
  // Component rendering...
};
```

## Error Handling

### Global Error Handling

```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        // Bad request - typically validation errors
        return {
          type: 'VALIDATION_ERROR',
          message: data.message || 'Invalid input',
          errors: data.errors || {},
        };
      case 401:
        // Unauthorized - handle auth errors
        return {
          type: 'AUTH_ERROR',
          message: 'Please login to continue',
        };
      case 403:
        // Forbidden - handle permission errors
        return {
          type: 'PERMISSION_ERROR',
          message: 'You don\'t have permission to perform this action',
        };
      case 404:
        // Not found
        return {
          type: 'NOT_FOUND',
          message: data.message || 'Resource not found',
        };
      case 500:
      default:
        // Server error or other errors
        return {
          type: 'SERVER_ERROR',
          message: 'Something went wrong. Please try again later.',
        };
    }
  } else if (error.request) {
    // Request made but no response received (network error)
    return {
      type: 'NETWORK_ERROR',
      message: 'Unable to connect to the server. Please check your internet connection.',
    };
  } else {
    // Something else happened
    return {
      type: 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
    };
  }
};

// Usage with React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        const formattedError = handleApiError(error);
        
        // Show toast notification
        toast.error(formattedError.message);
        
        // Log error for monitoring
        console.error(`${formattedError.type}: ${formattedError.message}`, error);
      },
    },
    mutations: {
      onError: (error) => {
        const formattedError = handleApiError(error);
        
        // Show toast notification
        toast.error(formattedError.message);
        
        // Log error for monitoring
        console.error(`${formattedError.type}: ${formattedError.message}`, error);
      },
    },
  },
});
```

## Advanced Features

### Real-time Order Updates

Using WebSockets for real-time order status updates:

```javascript
// services/socketService.js
import io from 'socket.io-client';

let socket;

export const initializeSocket = (token) => {
  if (socket) socket.disconnect();
  
  socket = io(process.env.REACT_APP_SOCKET_URL, {
    auth: {
      token,
    },
  });
  
  socket.on('connect', () => {
    console.log('Socket connected');
  });
  
  socket.on('connect_error', (error) => {
    console.error('Socket connection error', error);
  });
  
  return socket;
};

export const subscribeToOrderUpdates = (orderId, callback) => {
  if (!socket) return;
  
  socket.emit('join:order', orderId);
  
  socket.on(`order:${orderId}:updated`, (data) => {
    callback(data);
  });
  
  return () => {
    socket.off(`order:${orderId}:updated`);
    socket.emit('leave:order', orderId);
  };
};

// Usage in component
const OrderTracking = ({ orderId }) => {
  const [orderStatus, setOrderStatus] = useState('');
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    // Initialize socket connection
    const socket = initializeSocket(token);
    
    // Subscribe to order updates
    const unsubscribe = subscribeToOrderUpdates(orderId, (data) => {
      setOrderStatus(data.status);
      // Update UI with the new status
    });
    
    // Cleanup on component unmount
    return () => {
      unsubscribe();
      socket.disconnect();
    };
  }, [orderId, token]);
  
  // Component rendering...
};
```

### File Uploads

```javascript
// services/productService.js
export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  return axiosInstance.post('/products/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Usage in component
const ProductImageUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    
    try {
      const response = await uploadProductImage(file);
      onUploadSuccess(response.data.imageUrl);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
```

## Best Practices

1. **Use Service Abstraction**: Centralize all API calls in service files
2. **API Configuration**: Use axios interceptors for global configurations
3. **Error Handling**: Implement consistent error handling across the application
4. **Caching**: Use React Query's caching capabilities to minimize API calls
5. **Authentication**: Properly manage JWT tokens and handle expiration
6. **Loading States**: Show appropriate loading indicators during API calls
7. **React Query**: Leverage React Query for data fetching, caching, and mutations
8. **TypeScript**: Use TypeScript for better type safety and autocompletion
9. **Documentation**: Keep API integration documentation up-to-date
10. **Testing**: Write tests for API integration code

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend has proper CORS configuration
   - Check request headers for proper formatting

2. **Authentication Issues**
   - Verify token is correctly stored and included in requests
   - Check token expiration and refresh mechanism

3. **Data Inconsistencies**
   - Validate data schemas match between frontend and backend
   - Check for proper data transformation in both directions

4. **API Rate Limiting**
   - Implement request throttling
   - Add proper error handling for rate limit responses

5. **Network Errors**
   - Add retry logic for transient network issues
   - Implement offline support where appropriate

## API Testing

### Using Postman

1. Import the `e-commerce-api-postman-collection.json` file into Postman
2. Set up environment variables:
   - `baseUrl`: http://localhost:8000/api
   - `token`: (will be populated after login)
3. Run the Authentication requests first to get a valid token
4. Test other endpoints using the token

### Using the API Documentation

Refer to the comprehensive API documentation in `e-commerce-api-documentation.md` for detailed information about:
- Available endpoints
- Request/response formats
- Required parameters
- Authentication requirements
- Example requests and responses 