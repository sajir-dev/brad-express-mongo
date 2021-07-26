const advancedResults = (model, populate) => async (req, res, next) => {
    // copy req query
    const reqQuery = { ...req.query }

    // remove fields
    const removeFields = ['select', 'sort', 'page', 'limit']

    // remove select from params
    removeFields.forEach(param => delete reqQuery[param])

    // converting query into string
    let queryStr = JSON.stringify(reqQuery);

    // converting string into mongoose query by putting in $between operands
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // querying db
    let query = model.find(JSON.parse(queryStr));

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

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await model.countDocuments()

    query = query.skip(startIndex).limit(limit)

    if (populate) {
        query = query.populate(populate)
    }

    const pagination = {}

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    const data = await query;

    res.advancedResults = {
        success: true,
        count: data.length,
        pagination,
        data
    }

    next();
}

module.exports = advancedResults;