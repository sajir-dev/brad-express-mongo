const errorResponse = require('../util/errorResponse')

const errorHandler = (err, req, res, next) => {
    let error = { ...err }

    error.message = err.message

    if (err.name === 'CastError') {
        const message = `Bootcamp not found with id of ${err.value}`
        error = new errorResponse(404, message)
    }

    if (err.code === 11000) {
        const message = "Duplicate field value entered"
        error = new errorResponse(400, message)
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message)
        error = new errorResponse(400, message)
    }

    res.status(error.statusCode || 500).json({
        sucess: false,
        error: error.message || "Server error"
    });
}

module.exports = errorHandler;