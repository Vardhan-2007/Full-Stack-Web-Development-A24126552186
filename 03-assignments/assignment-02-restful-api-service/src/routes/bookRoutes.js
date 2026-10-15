const router = require('express').Router();
const c = require('../controllers/bookController');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/stats/categories', c.categoryStats);
router.route('/').get(c.getBooks).post(c.createBook);
router.route('/:id').all(validateObjectId).get(c.getBook).put(c.updateBook).delete(c.deleteBook);

module.exports = router;
