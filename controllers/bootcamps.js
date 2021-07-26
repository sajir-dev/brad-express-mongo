const path = require('path')
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../util/errorResponse')
const asyncHandler = require('../middlewares/async')
const geocoder = require('../util/node-geo-locator')

// @desc        List all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults);
});

// @desc        Get one bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Private
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const data = await Bootcamp.findById(req.params.id).populate('courses');

    if (!data) {
        next(err);
        return;
    }

    res.status(200).json({
        success: true,
        data: data,
    });
});

// @desc        Create a bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const created = await Bootcamp.create(req.body)
    res.status(201).json({
        success: true,
        data: created
    });
});

// @desc        Update a bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false
    })
    if (!bootcamp) {
        return next(
            new ErrorResponse(404, `no bootcamp found with id ${req.params.id}`)
        )
    }
    res.status(200).json({
        success: true,
        data: bootcamp
    });
});


// @desc        Delete a bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    // Removed the findByIdAndDelete in order to invoke cascade deleting courses too. Otherwise it will not invoke the pre-middleware wrote inside bootcamp models
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        next(err);
        return;
    }

    bootcamp.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});


// @desc        Bootcamps in a radius
// @route       GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Private
exports.bootcampInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    const radius = distance / 3963
    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});


// @desc        Upload a file of a bootcamp
// @route       PUT /api/v1/bootcamps/:id/photo
// @access      Private
exports.bootcampFileUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        next(err);
        return;
    }

    if (!req.files) {
        return next(new ErrorResponse(400, `no image attached`));
    }

    const file = req.files.file

    // checking file type
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(400, `only images can be uploaded`))
    }

    // checking file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(400, `please upload images upto ${process.env.MAX_FILE_UPLOAD / 100000} Mb`))
    }

    // create a custom filename to avoid overwriting files
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}` // we are using path because string ops based on dots can cause errors if it has more than two dots in a filename 

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(500, `problem with file upload`));
        }

        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, {
            photo: file.name
        },
            {
                new: true,
                useFindAndModify: false
            });

        res.status(200).json({
            success: true,
            data: bootcamp
        });
    })

});