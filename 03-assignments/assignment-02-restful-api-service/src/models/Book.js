const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      match: [/^\d{10}(\d{3})?$/, 'ISBN must be 10 or 13 digits']
    },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    author: { type: String, required: [true, 'Author is required'], trim: true },
    category: {
      type: String,
      enum: ['Programming', 'Databases', 'AI/ML', 'Networks', 'Mathematics', 'General'],
      default: 'General'
    },
    publishedYear: { type: Number, min: 1900, max: new Date().getFullYear() },
    totalCopies: { type: Number, required: true, min: [1, 'At least one copy is needed'] },
    availableCopies: { type: Number, min: 0 }
  },
  { timestamps: true }
);

// When a new book is created, all copies are available
bookSchema.pre('save', function (next) {
  if (this.isNew && this.availableCopies === undefined) {
    this.availableCopies = this.totalCopies;
  }
  if (this.availableCopies > this.totalCopies) {
    return next(new Error('availableCopies cannot be more than totalCopies'));
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);
