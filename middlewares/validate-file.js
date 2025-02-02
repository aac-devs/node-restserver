const validateFileUpload = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res
      .status(400)
      .json({ msg: "There are no files to upload - validateFileUpload" });
  }
  next();
};

module.exports = {
  validateFileUpload,
};
