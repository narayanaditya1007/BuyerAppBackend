const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    order_date: String,
    amount: Number,
    platform_id: mongoose.Schema.Types.ObjectId,
    order_id: mongoose.Schema.Types.ObjectId,
})

const Order = mongoose.model("Order",OrderSchema);
module.exports = Order;