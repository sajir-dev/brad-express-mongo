const express = require('express');
const router = express.Router();

const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    bootcampInRadius
} = require('../controllers/bootcamps')

router.route("/")
    .get(getBootcamps)
    .post(createBootcamp);

router.route("/radius/:zipcode/:distance").get(bootcampInRadius);

router.route("/:id")
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;