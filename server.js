const dotenv = require('dotenv');
const express = require('express');
// const logger = require('./middlewares/logger')
const morgan = require('morgan')

// Loading config vars
dotenv.config({ path: './config/config.env' });

// import db-config
const dbConn = require('./config/db')
dbConn()

// importing routes
const bootcamps = require('./routes/bootcamps')

const app = express();

// import body parser 
app.use(express.json())

// custom route
// app.use(logger)

if (process.env.NODE_ENV === 'DEVELOPMENT') {
    app.use(morgan('dev'))
}


app.use("/api/v1/bootcamps", bootcamps)

PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`App started in env ${process.env.NODE_ENV} on Port ${PORT}`)
);

// Handling unhandled server rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error ${err.message}`)
    // Close server and exit process
    server.close(() => process.exit(1))
})