const Models = require('../models');

// Get all restaurants with search and filters
async function getAllRestaurants(req, res, next) {
  try {
    const { search, cuisine, minRating, isPromoted } = req.query;
    let filter = {};

    if (search && search.trim() !== '') {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { tagline: { $regex: search.trim(), $options: 'i' } },
        { cuisines: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (cuisine && cuisine !== 'all') {
      filter.cuisines = { $regex: cuisine, $options: 'i' };
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    if (isPromoted === 'true') {
      filter.isPromoted = true;
    }

    const restaurants = await Models.Restaurant.find(filter).exec();
    res.json({ success: true, count: restaurants.length, restaurants });
  } catch (error) {
    next(error);
  }
}

// Get single restaurant with full menu categorized
async function getRestaurantById(req, res, next) {
  try {
    const { id } = req.params;
    const restaurant = await Models.Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    const foods = await Models.Food.find({ restaurant: id, isAvailable: true }).exec();

    // Group foods by category
    const menuByCategory = {};
    foods.forEach(food => {
      const cat = food.category || 'Specialties';
      if (!menuByCategory[cat]) {
        menuByCategory[cat] = [];
      }
      menuByCategory[cat].push(food);
    });

    res.json({
      success: true,
      restaurant,
      menuByCategory,
      totalItems: foods.length
    });
  } catch (error) {
    next(error);
  }
}

// Get all food categories
async function getCategories(req, res, next) {
  try {
    const categories = await Models.Category.find({}).exec();
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getCategories
};

