const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/restaurant/:restaurantId', reviewController.getReviewsByRestaurant);
router.post('/', protect, reviewController.createReview);

module.exports = router;

