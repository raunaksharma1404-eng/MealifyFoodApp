const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes strictly protected
router.use(protect, authorize('restaurant_admin', 'admin'));

router.get('/stats', adminController.getDashboardStats);
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

router.post('/foods', adminController.createFoodItem);
router.put('/foods/:id', adminController.updateFoodItem);
router.delete('/foods/:id', adminController.deleteFoodItem);
router.put('/foods/:id/toggle-availability', adminController.toggleAvailability);

module.exports = router;

