const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../util/errorResponse')
const asyncHandler = require('../middlewares/async')
const geocoder = require('../util/node-geo-locator')

// @desc        List all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    // copy req query
    const reqQuery = { ...req.query }
    console.log(reqQuery)

    // remove fields
    const removeFields = ['select', 'sort']

    // remove select from params
    removeFields.forEach(param => delete reqQuery[param])
    console.log(reqQuery)

    // converting query into string
    let queryStr = JSON.stringify(reqQuery);

    // converting string into mongoose query by putting in $between operands
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // querying db
    let query = Bootcamp.find(JSON.parse(queryStr));

    // selecting fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields)
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    const data = await query;
    res.status(200).json({
        success: true,
        count: data.length,
        data: data
    });
});

// @desc        Get one bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Private
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const data = await Bootcamp.findById(req.params.id)
    if (!data) {
        next(err)
        return
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
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if (!bootcamp) {
        next(err)
        return
    }
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