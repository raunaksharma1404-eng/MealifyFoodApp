const Models = require('../models');

// Discover meals and curated combos strictly within user budget
async function findBudgetMeals(req, res, next) {
  try {
    const {
      budget = 250,
      preference = 'any', // 'any', 'veg', 'non-veg', 'fast-food', 'healthy'
      sortBy = 'best-value' // 'price-asc', 'price-desc', 'best-value'
    } = req.query;

    const maxBudget = Math.max(50, Math.min(500, Number(budget)));

    // Base filter: available and price <= maxBudget
    const filter = {
      isAvailable: true,
      price: { $lte: maxBudget }
    };

    if (preference === 'veg') {
      filter.isVeg = true;
    } else if (preference === 'non-veg') {
      filter.isVeg = false;
    } else if (preference === 'fast-food') {
      filter.tags = { $in: ['fast food', 'snack'] };
    } else if (preference === 'healthy') {
      filter.tags = { $in: ['healthy', 'superfoods', 'fitness'] };
    }

    const eligibleFoods = await Models.Food.find(filter)
      .populate('restaurant')
      .exec();

    // Sort individual items
    let sortedItems = [...eligibleFoods];
    if (sortBy === 'price-asc') {
      sortedItems.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sortedItems.sort((a, b) => b.price - a.price);
    } else {
      // Best-value: higher rating, higher discount
      sortedItems.sort((a, b) => {
        const discountA = a.originalPrice ? (a.originalPrice - a.price) : 0;
        const discountB = b.originalPrice ? (b.originalPrice - b.price) : 0;
        return (b.rating * 50 + discountB) - (a.rating * 50 + discountA);
      });
    }

    // Attach remaining budget to each item
    const itemsWithRemaining = sortedItems.map(item => ({
      ...item,
      remainingBudget: maxBudget - item.price
    }));

    // Generate intelligent combos from eligible items (e.g., Main + Side/Drink <= Budget)
    const combos = [];
    for (let i = 0; i < eligibleFoods.length; i++) {
      for (let j = i + 1; j < eligibleFoods.length; j++) {
        const item1 = eligibleFoods[i];
        const item2 = eligibleFoods[j];

        // Combos are most logical if they are complementary or from the same restaurant
        const totalComboPrice = item1.price + item2.price;
        if (totalComboPrice <= maxBudget) {
          const isSameRestaurant = String(item1.restaurant?._id || item1.restaurant) === String(item2.restaurant?._id || item2.restaurant);
          const comboTitle = isSameRestaurant
            ? `${item1.name} + ${item2.name}`
            : `${item1.name} & ${item2.name} Feast`;

          combos.push({
            id: `combo_${item1._id}_${item2._id}`,
            title: comboTitle,
            items: [item1, item2],
            totalPrice: totalComboPrice,
            remainingBudget: maxBudget - totalComboPrice,
            restaurantName: item1.restaurant?.name || 'Multiple Kitchens',
            restaurantId: item1.restaurant?._id || item1.restaurant,
            isSameRestaurant,
            savings: (item1.originalPrice ? item1.originalPrice - item1.price : 0) +
                     (item2.originalPrice ? item2.originalPrice - item2.price : 0) + 30 // Combo special saving
          });
        }
      }
    }

    // Sort combos by closest to budget / best value
    combos.sort((a, b) => b.totalPrice - a.totalPrice);
    const topCombos = combos.slice(0, 6);

    res.json({
      success: true,
      budget: maxBudget,
      preference,
      itemCount: itemsWithRemaining.length,
      items: itemsWithRemaining,
      comboCount: topCombos.length,
      combos: topCombos
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  findBudgetMeals
};

