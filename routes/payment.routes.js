const { Router } = require('express');
const {getRazorpayApiKey, buySubscription, verifySubscription, cancelSubscription, allPayments} = require('../controllers/razorpay.controller');
const isLoggedIn = require('../middlewares/isLogged.middleware');

const router = Router();

router.route('/razorpay-key')
.get(getRazorpayApiKey)

router.route('/subscribe')
.post(isLoggedIn, buySubscription)


router.route('/verify')
.post(verifySubscription)

router.route('/unsubscribe')
.post(cancelSubscription)

router.route('/')
.post(allPayments)


module.exports = router;
