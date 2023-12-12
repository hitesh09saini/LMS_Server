const { Router } = require('express');
const {getRazorpayApiKey, buySubscription, verifySubscription, cancelSubscription, allPayments} = require('../controllers/razorpay.controller');
const isLoggedIn = require('../middlewares/isLogged.middleware');
const authorizedRoles = require('../middlewares/auth.middleWare');

const router = Router();

router.route('/razorpay-key')
.get(isLoggedIn, getRazorpayApiKey)

router.route('/subscribe')
.post(isLoggedIn, buySubscription)


router.route('/verify')
.post(isLoggedIn, verifySubscription)

router.route('/unsubscribe')
.post(isLoggedIn, cancelSubscription)

router.route('/')
.post(isLoggedIn,authorizedRoles('ADMIN'), allPayments)


module.exports = router;
