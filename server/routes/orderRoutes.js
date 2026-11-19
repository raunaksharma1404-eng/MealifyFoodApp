const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/checkout', protect, orderController.createOrder);
router.get('/my-orders', protect, orderController.getMyOrders);
router.get('/:id', protect, orderController.getOrderById);
router.post('/:id/reorder', protect, orderController.reorder);
router.post('/:id/simulate-step', protect, orderController.simulateNextStep);

module.exports = router;

