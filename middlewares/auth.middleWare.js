require('dotenv').config({
    path: '../.env'
});

const AppError = require("../utils/error.utils");
const jwt = require('jsonwebtoken')

const isLoggedIn = async (req,res, next)=>{

    const { token } = req.cookies;

     if(!token){
        return next(new AppError('unauthenticated, please login again', 400))
     }

     const userDetails = await jwt.verify(token, process.env.JWT_SECRET);
     req.user = userDetails;

    next();
}


module.exports = isLoggedIn;