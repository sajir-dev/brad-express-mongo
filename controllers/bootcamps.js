
// @desc        List all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: "listing bootcamps",
    });
}

// @desc        Get one bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Private
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: `showing bootcamp${req.params.id}`
    });
}

// @desc        Create a bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: `creating bootcamp`
    });
}

// @desc        Update a bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: `updating bootcamp ${req.params.id}`
    });
}

// @desc        Delete a bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: `deleting bootcamp ${req.params.id}`
    });
}