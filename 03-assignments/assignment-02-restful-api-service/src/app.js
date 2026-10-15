const express = require('express');
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const loanRoutes = require('./routes/loanRoutes');
const requestLogger = require('./middleware/requestLogger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get('/api', (req, res) => {
  res.json({
    name: 'Library Lending API',
    endpoints: {
      books: '/api/books',
      members: '/api/members',
      loans: '/api/loans',
      issue: 'POST /api/loans',
      return: 'PATCH /api/loans/:id/return'
    }
  });
});

app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/loans', loanRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
