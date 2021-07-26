const Course = require('../models/Course')
const asyncHandler = require('../middlewares/async')
const errorResponse = require('../util/errorResponse')

// @desc        List all courses
// @route       GET /api/v1/courses
// @access      Public
exports.getCourses = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        queryObj = { bootcamp: req.params.bootcampId }
        // we can limit the fields inside populated bootcamp by passing fields as an obj with propoerty path and select as below.
        const data = await Course.find(queryObj).populate({
            path: 'bootcamp',
            select: 'name description'
        })

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });
    }

    res.status(200).json(res.advancedResults);
})


// @desc        Get single course
// @route       GET /api/v1/courses/:id
// @access      Public
exports.getCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!course) {
        next(
            new errorResponse(404, `no course with id ${req.params.id} found`)
        );
        return;
    }

    res.status(200).json({
        success: true,
        course
    })
})


// @desc        Add course
// @route       POST /api/v1/bootcamps/:bootcampId/courses
// @access      Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId

    const course = await Course.create(req.body);

    if (!course) {
        next(err);
        return;
    }

    res.status(201).json({
        success: true,
        data: course
    })
})


// @desc        Update a course
// @route       PUT /api/v1/courses/:id
// @access      Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false
    });

    if (!course) {
        next(
            new errorResponse(404, `no course with id ${req.params.id} found`)
        );
        return;
    }

    res.status(200).json({
        success: true,
        data: course
    })
});


// @desc        Delete a course
// @route       DELETE /api/v1/courses/:id
// @access      Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id);

    if (!course) {
        next(
            new errorResponse(404, `no course with id ${req.params.id} found`)
        );
        return;
    }

    await course.remove()

    res.status(200).json({
        success: true,
        data: {}
    })
})