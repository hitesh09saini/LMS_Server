class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        Error.caputreStackTrace(this, this.contructor);
    }
}

module.exports = AppError;