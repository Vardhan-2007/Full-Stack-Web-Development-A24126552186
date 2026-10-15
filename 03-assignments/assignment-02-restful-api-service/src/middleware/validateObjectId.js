const mongoose = require('mongoose');

// Rejects badly formed :id values before they reach the database
function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, error: `Invalid id: ${req.params.id}` });
  }
  next();
}

module.exports = validateObjectId;
