module.exports.errorHandler = (err, req, res, next) => {
  res.status(500).json({ status: false, message: 'Server Error', error: err.message });
};
