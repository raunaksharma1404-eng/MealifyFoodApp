const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/auth');

// Protected for delivery partners only
router.use(protect, authorize('delivery_partner', 'admin'));

router.get('/available', deliveryController.getAvailableDeliveries);
router.post('/accept/:id', deliveryController.acceptDelivery);
router.put('/update/:id', deliveryController.updateDeliveryStep);
router.get('/history', deliveryController.getDeliveryHistory);

module.exports = router;

