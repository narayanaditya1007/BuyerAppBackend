const express = require('express');
const authenticate_login = require('../middlewares/authenticate_login');
const orderController=require('../controllers/OrderController');

const Router = express.Router();

// place order
Router.post('/order',authenticate_login,orderController.placeOrder);

// get orders --buyer
Router.get('/order',authenticate_login,orderController.getOrder);






module.exports= Router;