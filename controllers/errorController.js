const AppError = require('./../utils/appError');

const handleCastErrorDB = err => { // making internal db error into an operational error
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = err => new AppError('Invalid token. Please log in again!', 401)

const handleJWTExpiredError = err => new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } 

    // B) RENDERED WEBSITE
    console.error('Error 💥', err);
    return res.status(err.statusCode).render('error', {
        title: 'Somthing went wrong!',
        msg: err.message
    });
};

const sendErrorProd = (err, req, res) => {
    // console.log(err);
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        // A) Operational, trusted error: send message to client
        if(err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });

        // B) Programming or other unknown error: don't leak error details
        } 
        // 1) Log error
        console.error('Error 💥', err);

        // 2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        })
    } 
    // B) RENDERED WEBSITE
    if(err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        });
    } 
    // 1) Log error
    console.error('Error 💥', err);

    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.'
    });
};

module.exports = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if(process.env.NODE_ENV === 'production') {
        let error;

        if (err.name === 'CastError') error = handleCastErrorDB(err);
        else if (err.code === 11000) error = handleDuplicateFieldsDB(err);
        else if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
        else if(err.name === 'JsonWebTokenError') error = handleJWTError(err);
        else if(err.name === 'TokenExpiredError') error = handleJWTExpiredError(err);
        else
            error = { ...err };
        error.message = err.message || 'Please try again later!';
        sendErrorProd(error, req, res);
    }   
};
