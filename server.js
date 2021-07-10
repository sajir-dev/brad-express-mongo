const dotenv = require('dotenv');
const express = require('express');

// Loading config vars
dotenv.config({ path: './config/config.env' });

const app = express();

PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`App started in env ${process.env.NODE_ENV} on Port ${PORT}`)
);