
require('dotenv').config({
    path: '../.env'
});
const asyncHandler = require('../middlewares/asyncHandler.middleware')
const AppError = require("../utils/error.utils");

const authorizedSubscriber = asyncHandler(async()=>{
   const subscription = req.user.subscription;
   const currentUserRole = req.user.role;

   if(currentUserRole !== 'ADMIN' && subscription.status !== 'active'){
     return next(
        new AppError('please subscribce to access this route!', 403)
     )
   };

   next();
})

module.exports = authorizedSubscriber;