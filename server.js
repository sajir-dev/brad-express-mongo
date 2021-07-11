const dotenv = require('dotenv');
const express = require('express');
// const logger = require('./middlewares/logger')
const morgan = require('morgan')

// importing routes
const bootcamps = require('./routes/bootcamps')

// Loading config vars
dotenv.config({ path: './config/config.env' });

const app = express();

// custom route
// app.use(logger)

if (process.env.NODE_ENV === 'DEVELOPMENT') {
    app.use(morgan('dev'))
}

// thirdparty route


app.use("/api/v1/bootcamps", bootcamps)

PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`App started in env ${process.env.NODE_ENV} on Port ${PORT}`)
);