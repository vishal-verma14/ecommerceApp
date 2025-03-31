const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { isSignedIn, isAuthenticated, isAdmin } = require('../middlewares/auth');
const { addToCart, removeFromCart, getCartProducts, getOrdersOfUser, getAllOrders, updateOrder, cancelOrder, codOrder } = require('../controllers/OrderController');
const { isProductExist } = require('../middlewares/product');
const { isProductExistOnCart, getOrderId } = require('../middlewares/order');
const { isBasicUserDetailExists } = require('../middlewares/user');

router.param("cartProductId", isProductExistOnCart)
router.param("orderId", getOrderId)

router.post('/add-to-cart',
    isSignedIn,
    isProductExist,
    addToCart
)

router.delete('/remove-from-cart/:cartProductId',
    isSignedIn,
    isProductExistOnCart,
    removeFromCart
)

router.post('/cod-order',
    isSignedIn,
    isBasicUserDetailExists,
    codOrder
)

router.get('/get-orders',
    isSignedIn,
    getOrdersOfUser
)

router.get('/get-cart',
    isSignedIn,
    getCartProducts
)

router.get('/get-all-orders',
    isSignedIn,
    isAdmin,
    getAllOrders
)

router.post('/update-order/:orderId',
    isSignedIn,
    isAdmin,
    getOrderId,
    updateOrder
)

router.post('/cancel-order/:orderId',
    isSignedIn,
    cancelOrder

)

module.exports = router;