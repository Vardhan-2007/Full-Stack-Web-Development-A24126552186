const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    issuedOn: { type: Date, default: Date.now },
    dueOn: { type: Date, required: true },
    returnedOn: { type: Date, default: null },
    fine: { type: Number, default: 0 }
  },
  { timestamps: true }
);

loanSchema.virtual('status').get(function () {
  if (this.returnedOn) return 'Returned';
  return new Date() > this.dueOn ? 'Overdue' : 'Issued';
});

loanSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Loan', loanSchema);
