const Book = require('../models/Book');
const Loan = require('../models/Loan');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/books?search=&category=&available=true&page=1&limit=10&sort=title
exports.getBooks = asyncHandler(async (req, res) => {
  const { search, category, available, sort = 'title' } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

  const filter = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } }
    ];
  }
  if (category) filter.category = category;
  if (available === 'true') filter.availableCopies = { $gt: 0 };

  const [books, total] = await Promise.all([
    Book.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
    Book.countDocuments(filter)
  ]);

  res.json({ success: true, page, totalPages: Math.ceil(total / limit), total, data: books });
});

// GET /api/books/:id
exports.getBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
  res.json({ success: true, data: book });
});

// POST /api/books
exports.createBook = asyncHandler(async (req, res) => {
  const { isbn, title, author, category, publishedYear, totalCopies } = req.body;
  const book = await Book.create({ isbn, title, author, category, publishedYear, totalCopies });
  res.status(201).json({ success: true, data: book });
});

// PUT /api/books/:id
exports.updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ success: false, error: 'Book not found' });

  const { title, author, category, publishedYear, totalCopies } = req.body;
  if (totalCopies !== undefined) {
    const onLoan = book.totalCopies - book.availableCopies;
    if (totalCopies < onLoan) {
      return res.status(400).json({ success: false, error: `${onLoan} copies are on loan; totalCopies cannot be less than that` });
    }
    book.availableCopies = totalCopies - onLoan;
    book.totalCopies = totalCopies;
  }
  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (category !== undefined) book.category = category;
  if (publishedYear !== undefined) book.publishedYear = publishedYear;

  await book.save();
  res.json({ success: true, data: book });
});

// DELETE /api/books/:id  (blocked while copies are on loan)
exports.deleteBook = asyncHandler(async (req, res) => {
  const active = await Loan.countDocuments({ book: req.params.id, returnedOn: null });
  if (active > 0) {
    return res.status(409).json({ success: false, error: 'Book has copies on loan and cannot be deleted' });
  }
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
  res.json({ success: true, message: 'Book deleted' });
});

// GET /api/books/stats/categories
exports.categoryStats = asyncHandler(async (req, res) => {
  const stats = await Book.aggregate([
    { $group: { _id: '$category', titles: { $sum: 1 }, copies: { $sum: '$totalCopies' }, available: { $sum: '$availableCopies' } } },
    { $sort: { titles: -1 } }
  ]);
  res.json({ success: true, data: stats });
});
