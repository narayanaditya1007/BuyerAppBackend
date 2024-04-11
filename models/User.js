const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    phone: String,
    user_type: String,
    address:{
        locality: String,
        city: String,
        state: String,
        country: String,
        postal_code: String
    },
    wishlist:[{
        platform_id: mongoose.Schema.Types.ObjectId,
        product_id: mongoose.Schema.Types.ObjectId
    }],
    cart:[{
        platform_id: mongoose.Schema.Types.ObjectId,
        product_id: mongoose.Schema.Types.ObjectId
    }]
})

const User = mongoose.model("User",UserSchema);
module.exports = User;