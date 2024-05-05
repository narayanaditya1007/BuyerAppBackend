const Order = require('../models/Order');


async function placeOrder(req,res){
    try{
        const order = new Order({
            user_id: req.body.userId,
            order_date:req.body.date,
            amount: req.body.amount,
            platform_id: req.body.platformId,
            order_id: req.body.orderId
        })
        await order.save();
        res.send(order)
    }
    catch(err){
        console.log(err);
    }
}



async function getOrder(req,res){
    const allOrder =await Order.find({user_id:req.params.userId});
    res.send(allOrder)
}



module.exports = {
    placeOrder,
    getOrder
}