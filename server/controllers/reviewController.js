const Models = require('../models');

// Post a review for a restaurant or food item
async function createReview(req, res, next) {
  try {
    const { restaurantId, foodId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars.' });
    }

    if (!comment || comment.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please write a brief review comment.' });
    }

    const review = await Models.Review.create({
      user: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      restaurant: restaurantId,
      food: foodId || null,
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ success: true, message: 'Review published. Thank you for your feedback!', review });
  } catch (error) {
    next(error);
  }
}

// Get reviews for a restaurant
async function getReviewsByRestaurant(req, res, next) {
  try {
    const { restaurantId } = req.params;
    const reviews = await Models.Review.find({ restaurant: restaurantId })
      .sort({ createdAt: -1 })
      .exec();

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createReview,
  getReviewsByRestaurant
};

