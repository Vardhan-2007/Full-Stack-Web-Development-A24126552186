const Loan = require('../models/Loan');
const Book = require('../models/Book');
const Member = require('../models/Member');
const asyncHandler = require('../middleware/asyncHandler');

const DAY_MS = 24 * 60 * 60 * 1000;
const loanDays = () => Number(process.env.LOAN_DAYS) || 14;
const finePerDay = () => Number(process.env.FINE_PER_DAY) || 2;

// GET /api/loans?status=Issued|Returned|Overdue
exports.getLoans = asyncHandler(async (req, res) => {
  const filter = {};
  const { status } = req.query;
  if (status === 'Returned') filter.returnedOn = { $ne: null };
  if (status === 'Issued') { filter.returnedOn = null; filter.dueOn = { $gte: new Date() }; }
  if (status === 'Overdue') { filter.returnedOn = null; filter.dueOn = { $lt: new Date() }; }

  const loans = await Loan.find(filter)
    .populate('book', 'title isbn')
    .populate('member', 'name rollNo')
    .sort('-issuedOn');
  res.json({ success: true, count: loans.length, data: loans });
});

exports.getLoan = asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id).populate('book', 'title isbn').populate('member', 'name rollNo');
  if (!loan) return res.status(404).json({ success: false, error: 'Loan not found' });
  res.json({ success: true, data: loan });
});

// POST /api/loans  { bookId, memberId }  - issue a book
exports.issueBook = asyncHandler(async (req, res) => {
  const { bookId, memberId } = req.body;
  if (!bookId || !memberId) {
    return res.status(400).json({ success: false, error: 'bookId and memberId are required' });
  }

  const member = await Member.findById(memberId);
  if (!member) return res.status(404).json({ success: false, error: 'Member not found' });
  if (!member.active) return res.status(403).json({ success: false, error: 'Member is not active' });

  const current = await Loan.countDocuments({ member: memberId, returnedOn: null });
  if (current >= member.maxBooks) {
    return res.status(409).json({ success: false, error: `Member already has ${current} books (limit ${member.maxBooks})` });
  }

  const alreadyHas = await Loan.exists({ member: memberId, book: bookId, returnedOn: null });
  if (alreadyHas) {
    return res.status(409).json({ success: false, error: 'Member already has a copy of this book' });
  }

  // Take one copy only if one is available (a single atomic update, so two requests can't both get the last copy)
  const book = await Book.findOneAndUpdate(
    { _id: bookId, availableCopies: { $gt: 0 } },
    { $inc: { availableCopies: -1 } },
    { new: true }
  );
  if (!book) {
    const exists = await Book.exists({ _id: bookId });
    return exists
      ? res.status(409).json({ success: false, error: 'No copies available right now' })
      : res.status(404).json({ success: false, error: 'Book not found' });
  }

  const loan = await Loan.create({
    book: book._id,
    member: member._id,
    dueOn: new Date(Date.now() + loanDays() * DAY_MS)
  });

  res.status(201).json({ success: true, data: loan });
});

// PATCH /api/loans/:id/return  - return a book and calculate the fine
exports.returnBook = asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id);
  if (!loan) return res.status(404).json({ success: false, error: 'Loan not found' });
  if (loan.returnedOn) return res.status(409).json({ success: false, error: 'Book already returned' });

  loan.returnedOn = new Date();
  const lateDays = Math.max(0, Math.ceil((loan.returnedOn - loan.dueOn) / DAY_MS));
  loan.fine = lateDays * finePerDay();
  await loan.save();

  await Book.findByIdAndUpdate(loan.book, { $inc: { availableCopies: 1 } });

  res.json({ success: true, message: lateDays ? `Returned ${lateDays} day(s) late` : 'Returned on time', data: loan });
});
