require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Book = require('./models/Book');
const Member = require('./models/Member');
const Loan = require('./models/Loan');

const books = [
  { isbn: '9780131103627', title: 'The C Programming Language', author: 'Kernighan and Ritchie', category: 'Programming', publishedYear: 1988, totalCopies: 4 },
  { isbn: '9781491952023', title: 'JavaScript: The Definitive Guide', author: 'David Flanagan', category: 'Programming', publishedYear: 2020, totalCopies: 3 },
  { isbn: '9780073523323', title: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', category: 'Databases', publishedYear: 2019, totalCopies: 5 },
  { isbn: '9780262035613', title: 'Deep Learning', author: 'Goodfellow, Bengio, Courville', category: 'AI/ML', publishedYear: 2016, totalCopies: 2 },
  { isbn: '9780133594140', title: 'Computer Networking: A Top-Down Approach', author: 'Kurose and Ross', category: 'Networks', publishedYear: 2016, totalCopies: 3 },
  { isbn: '9780980232776', title: 'Introduction to Linear Algebra', author: 'Gilbert Strang', category: 'Mathematics', publishedYear: 2016, totalCopies: 2 }
];

const members = [
  { rollNo: 'A24126552186', name: 'V. Govardhan', email: 'govardhan@example.com' },
  { rollNo: 'A24126552150', name: 'K. Divya', email: 'divya@example.com' },
  { rollNo: 'FAC1021', name: 'Dr. S. Lakshmi', email: 'lakshmi@example.com', type: 'Faculty', maxBooks: 8 }
];

(async () => {
  await connectDB();
  await Promise.all([Loan.deleteMany({}), Book.deleteMany({}), Member.deleteMany({})]);
  for (const b of books) await Book.create(b);
  await Member.insertMany(members);
  console.log(`Seeded ${books.length} books and ${members.length} members`);
  await mongoose.disconnect();
})();
