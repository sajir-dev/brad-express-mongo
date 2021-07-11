
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.hostname}://${req.OriginalUrl}`);
    next();
}

module.exports = logger