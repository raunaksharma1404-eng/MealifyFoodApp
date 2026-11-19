const Models = require('../models');

// Search & filter food catalog
async function getFoods(req, res, next) {
  try {
    const {
      search,
      category,
      restaurantId,
      isVeg,
      mealType,
      minPrice,
      maxPrice,
      minRating,
      tag,
      sortBy = 'rating',
      sortOrder = 'desc',
      limit = 40,
      skip = 0
    } = req.query;

    let filter = { isAvailable: true };

    if (search && search.trim() !== '') {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { tags: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (restaurantId) {
      filter.restaurant = restaurantId;
    }

    if (isVeg !== undefined && isVeg !== 'all' && isVeg !== '') {
      filter.isVeg = isVeg === 'true' || isVeg === true || isVeg === 'veg';
    }

    if (mealType && mealType !== 'all' && mealType !== '') {
      filter.mealType = mealType;
    }

    if (minPrice || maxPrice) {
      if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
      if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    const sortObj = {};
    if (sortBy === 'price') {
      sortObj.price = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'prepTime') {
      sortObj.preparationTime = 1;
    } else {
      sortObj.rating = -1;
    }

    const foods = await Models.Food.find(filter)
      .sort(sortObj)
      .skip(Number(skip))
      .limit(Number(limit))
      .populate('restaurant')
      .exec();

    const total = await Models.Food.countDocuments(filter);

    res.json({
      success: true,
      count: foods.length,
      total,
      foods
    });
  } catch (error) {
    next(error);
  }
}

// Get single food details with restaurant and reviews
async function getFoodById(req, res, next) {
  try {
    const { id } = req.params;
    const food = await Models.Food.findById(id).populate('restaurant');

    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found.' });
    }

    const reviews = await Models.Review.find({ food: id }).exec();

    // Related dishes from same restaurant or category
    const relatedFoods = await Models.Food.find({
      category: food.category,
      _id: { $ne: food._id },
      isAvailable: true
    }).limit(4).exec();

    res.json({
      success: true,
      food,
      reviews,
      relatedFoods
    });
  } catch (error) {
    next(error);
  }
}

// Trending / Chef specials
async function getTrendingFoods(req, res, next) {
  try {
    const { isVeg, mealType } = req.query;
    let filter = { isAvailable: true };

    if (isVeg !== undefined && isVeg !== 'all' && isVeg !== '') {
      filter.isVeg = isVeg === 'true' || isVeg === true || isVeg === 'veg';
    }

    if (mealType && mealType !== 'all' && mealType !== '') {
      filter.mealType = mealType;
    }

    const trending = await Models.Food.find(filter)
      .sort({ rating: -1 })
      .limit(12)
      .populate('restaurant')
      .exec();

    res.json({ success: true, count: trending.length, foods: trending });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFoods,
  getFoodById,
  getTrendingFoods
};

