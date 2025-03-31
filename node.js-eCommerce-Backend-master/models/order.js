const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const {constants} = require("../constants/index")

const ProductCartSchema = new mongoose.Schema({
    product: {
      type: ObjectId,
      ref: "Product",
    },
    quantity: {
        type: Number,
        required: true,
    },
    user: {
        type: ObjectId,
        ref: "User",
        index: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        required: false,
    },
    summary: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },

  },{timestamps: true});

const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

const order = new mongoose.Schema({
    orderId:{
        type: String
    },
    products: [ ProductCartSchema ],
    paymentMode: {
        type: String,
        required: true,
        default: constants.PAYMENT_TYPES.COD
    },
    paymentId: {
        type: String
    },
    status: {
        type: String,
        default: "Received",
        enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Received", "Pending", "Failed"],
    },
    user: {
        type: ObjectId,
        ref: "User",
    },
}, {timestamps: true} )

const Order = mongoose.model("Order", order);

module.exports = { Order, ProductCart };