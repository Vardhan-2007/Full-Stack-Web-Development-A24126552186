const Member = require('../models/Member');
const Loan = require('../models/Loan');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/members?type=Student&active=true
exports.getMembers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.active) filter.active = req.query.active === 'true';
  const members = await Member.find(filter).sort('name');
  res.json({ success: true, count: members.length, data: members });
});

exports.getMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) return res.status(404).json({ success: false, error: 'Member not found' });
  res.json({ success: true, data: member });
});

exports.createMember = asyncHandler(async (req, res) => {
  const { rollNo, name, email, type, maxBooks } = req.body;
  const member = await Member.create({ rollNo, name, email, type, maxBooks });
  res.status(201).json({ success: true, data: member });
});

exports.updateMember = asyncHandler(async (req, res) => {
  const allowed = ['name', 'email', 'type', 'maxBooks', 'active'];
  const updates = {};
  allowed.forEach(key => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });
  const member = await Member.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!member) return res.status(404).json({ success: false, error: 'Member not found' });
  res.json({ success: true, data: member });
});

exports.deleteMember = asyncHandler(async (req, res) => {
  const active = await Loan.countDocuments({ member: req.params.id, returnedOn: null });
  if (active > 0) {
    return res.status(409).json({ success: false, error: 'Member still has books to return' });
  }
  const member = await Member.findByIdAndDelete(req.params.id);
  if (!member) return res.status(404).json({ success: false, error: 'Member not found' });
  res.json({ success: true, message: 'Member deleted' });
});

// GET /api/members/:id/loans  - borrowing history of one member
exports.getMemberLoans = asyncHandler(async (req, res) => {
  const loans = await Loan.find({ member: req.params.id }).populate('book', 'title author isbn').sort('-issuedOn');
  res.json({ success: true, count: loans.length, data: loans });
});
