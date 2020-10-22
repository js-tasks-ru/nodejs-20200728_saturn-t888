const Order = require('../models/Order');
const User = require ('../models/User');
const Product = require ('../models/Product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  
    const product = await Product.findById (ctx.request.body.product) || null;
    
    const order = await Order.create ({
        user: !!ctx.user._id ? ctx.user._id : null,
        product: !!product ? product._id : null,
        phone: !!ctx.request.body.phone ? ctx.request.body.phone : null,
        address: !!ctx.request.body.address ? ctx.request.body.address : null
    });

    if (!!order) {
        ctx.status = 200;
        ctx.body = {order: order._id};

        // sending Email //
        await sendMail ({
            template: 'order-confirmation',
            locals: {id: order._id, product: product.title},
            to: ctx.user.email,
            subject: 'Ваш заказ сформирован'
        });
    }

};

module.exports.getOrdersList = async function ordersList(ctx, next) {

    const orders = await Order.find ({user: ctx.user._id});
    ctx.body = {orders: orders};
};