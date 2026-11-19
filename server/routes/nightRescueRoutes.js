const express = require('express');
const router = express.Router();
const nightRescueController = require('../controllers/nightRescueController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', nightRescueController.getActiveDeals);
router.get('/:id', nightRescueController.getDealById);

// Protected routes for restaurant admins
router.post('/', protect, authorize('restaurant_admin', 'admin'), nightRescueController.createDeal);
router.put('/:id', protect, authorize('restaurant_admin', 'admin'), nightRescueController.updateDeal);
router.delete('/:id', protect, authorize('restaurant_admin', 'admin'), nightRescueController.deleteDeal);

module.exports = router;

