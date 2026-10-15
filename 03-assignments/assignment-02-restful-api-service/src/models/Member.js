const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    rollNo: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    name: { type: String, required: [true, 'Name is required'], trim: true, minlength: 3 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email is not valid']
    },
    type: { type: String, enum: ['Student', 'Faculty'], default: 'Student' },
    maxBooks: { type: Number, default: 3, min: 1, max: 10 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', memberSchema);
