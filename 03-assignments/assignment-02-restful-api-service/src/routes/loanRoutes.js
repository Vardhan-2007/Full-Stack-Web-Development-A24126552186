const router = require('express').Router();
const c = require('../controllers/loanController');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/').get(c.getLoans).post(c.issueBook);
router.get('/:id', validateObjectId, c.getLoan);
router.patch('/:id/return', validateObjectId, c.returnBook);

module.exports = router;
