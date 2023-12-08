
const errorMiddleware = (err, req, res, next)=>{
    err.statusCode =  err.statusCode||500;
    err.message =  err.message || "somthing went wrong";

    return res.status().json({
        success: false,
        message: err.message,
        stack: err.stack
    })

}

module.exports = errorMiddleware