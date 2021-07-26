const express = require('express')
const router = express.Router({ mergeParams: true })

const Course = require('../models/Course')
const advancedResults = require('../middlewares/advancedResults')

const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses')

// List all courses
router.route('/')
    .get(advancedResults(Course, 'bootcamp'), getCourses)
    .post(addCourse)

// get single course
router.route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse)

module.exports = router