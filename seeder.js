const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// load config vars
dotenv.config({ path: './config/config.env' });

// Load models
const Bootcamp = require('./models/Bootcamp');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// Import into db
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);

        console.log(`Data imported`);
        process.exit(1);
    } catch (err) {
        console.log(err)
    }
}

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()

        console.log('Data destroyed');
        process.exit(1);
    } catch (err) {
        console.log(err);
    }
}

if (process.argv[2] === "-i") {
    importData()
} else if (process.argv[2] === "-d") {
    deleteData()
}

