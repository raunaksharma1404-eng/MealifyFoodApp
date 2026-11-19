const express = require('express');
const router = express.Router();
const groupOrderController = require('../controllers/groupOrderController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, groupOrderController.createGroup);
router.get('/:code', groupOrderController.getGroupByCode);
router.post('/:code/join', groupOrderController.joinGroup);
router.put('/:code/items', groupOrderController.updateMemberItems);
router.put('/:code/close', protect, groupOrderController.closeGroup);
router.put('/:code/payment/:memberUserId', protect, groupOrderController.updateMemberPayment);

module.exports = router;

