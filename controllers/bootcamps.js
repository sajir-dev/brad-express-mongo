const Bootcamp = require('../models/Bootcamp')

// @desc        List all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const data = await Bootcamp.find()
        res.status(200).json({
            success: true,
            data: data
        });
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
}

// @desc        Get one bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Private
exports.getBootcamp = async (req, res, next) => {
    try {
        const data = await Bootcamp.findById(req.params.id)
        if (!data) {
            res.status(400).json({
                success: false
            })
            return
        }
        res.status(200).json({
            success: true,
            data: data,
        });
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
}

// @desc        Create a bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
exports.createBootcamp = async (req, res, next) => {
    try {
        const created = await Bootcamp.create(req.body)
        res.status(201).json({
            success: true,
            data: created
        })
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
}

// @desc        Update a bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false
    })
    if (!bootcamp) {
        res.status(400).json({
            success: false
        })
        return
    }
    res.status(200).json({
        success: true,
        data: bootcamp
    })
}

// @desc        Delete a bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if (bootcamp) {
        res.status(200).json({
            success: true,
            data: {}
        })
        return
    }
    res.status(400).json({
        success: false
    })
}