const asyncHandler = require("../middlewares/asyncHandler.middleware")


// get key
const getRazorpayApiKey = asyncHandler(async (req, res, next) => {
    
})

// buy subs
const buySubscription = asyncHandler(async (req, res, next) => {

})

// verify
const verifySubscription = asyncHandler(async (req, res, next) => {

})

// cancel
const cancelSubscription = asyncHandler(async (req, res, next) => {

})

// payments
const allPayments = asyncHandler(async (req, res, next) => {

})


module.exports = {
    getRazorpayApiKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    allPayments
} 