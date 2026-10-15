const router = require('express').Router();
const c = require('../controllers/memberController');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/').get(c.getMembers).post(c.createMember);
router.route('/:id').all(validateObjectId).get(c.getMember).put(c.updateMember).delete(c.deleteMember);
router.get('/:id/loans', validateObjectId, c.getMemberLoans);

module.exports = router;
