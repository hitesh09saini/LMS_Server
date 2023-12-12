require('dotenv').config({
    path: '../.env'
});

const asyncHandler = require("../middlewares/asyncHandler.middleware")
const User = require('../models/user.models');
const AppError = require('../utils/error.utils');
const razorpay = require('../index')
const crypto = require('crypto');
const Payment = require('../models/payment.models')

// get key
const getRazorpayApiKey = asyncHandler(async (req, res, next) => {
    res.status(201).json({
        success: true,
        message: 'Razarpay Api Key',
        Key: process.env.RAZORPAY_KEY_ID
    });
})

// buy subs
const buySubscription = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
        return next(
            new AppError('unauthorized account, please login', 400)
        )
    }

    if (user.role === 'ADMIN') {
        return next(
            new AppError('Admin cannot purchase a Subscription', 400)
        )
    }

    const subscription = await razorpay.subscriptions.create(
        {
            plan_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify: 1
        }
    )

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(201).json({
        success: true,
        message: 'Subscribed Successfully',
    });

})

// verify
const verifySubscription = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    const {razorpay_payment_id, razorpay_signature, razorpay_subscription_id} = req.body;

    const user = await User.findById(id);

    if (!user) {
        return next(
            new AppError('unauthorized account, please login', 400)
        )
    }

    const subscriptionId  = user.subscription.id;

    const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(`${razorpay_payment_id}|${subscriptionId}`)
    .digest('hex');

    if(generatedSignature !== razorpay_signature){
        return next(
            new AppError('payment not verified, please try again', 500)
        )
    }

    await Payment.create({
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature
    })


    user.subscription.status = 'active';

    await user.save();

    res.status(201).json({
        success: true,
        message: 'payment verfied successfully',
       
    });
})

// cancel
const cancelSubscription = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
        return next(
            new AppError('unauthorized account, please login', 400)
        )
    }

    const subscriptionId = user.subscription.id;
    const subscription = await razorpay.subscriptions.cancel(
        subscriptionId
    )

    user.subscription.status = subscription.status;

    await user.save();

    res.status(201).json({
        success: true,
        message: 'payment cancel successfully',
    });
})

// payments
const allPayments = asyncHandler(async (req, res, next) => {
    const {count}= req.query;

    const subscriptions = await razorpay.subscriptions.all({
        count: count || 10,
    });

    // const payments = 

    res.status(201).json({
        success: true,
        message: 'all payment',
        subscriptions
    });


})


module.exports = {
    getRazorpayApiKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    allPayments,
} 