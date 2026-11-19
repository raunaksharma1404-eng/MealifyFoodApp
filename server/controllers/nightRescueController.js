const Models = require('../models');

// Get active Night Rescue deals (filtering out expired or 0-quantity deals)
async function getActiveDeals(req, res, next) {
  try {
    const allDeals = await Models.NightRescueDeal.find({ isActive: true })
      .populate('restaurant')
      .populate('food')
      .exec();

    const now = new Date();

    // Enforce business rules: remove expired or out-of-stock deals automatically
    const validDeals = [];
    for (const deal of allDeals) {
      const isExpired = deal.expiresAt && new Date(deal.expiresAt) <= now;
      const isOutOfStock = Number(deal.remainingQuantity) <= 0;

      if (isExpired || isOutOfStock) {
        // Automatically deactivate in DB
        await Models.NightRescueDeal.findByIdAndUpdate(deal._id, { isActive: false });
      } else {
        validDeals.push(deal);
      }
    }

    res.json({
      success: true,
      count: validDeals.length,
      deals: validDeals
    });
  } catch (error) {
    next(error);
  }
}

// Get single deal
async function getDealById(req, res, next) {
  try {
    const { id } = req.params;
    const deal = await Models.NightRescueDeal.findById(id)
      .populate('restaurant')
      .populate('food');

    if (!deal || !deal.isActive) {
      return res.status(404).json({ success: false, message: 'Night Rescue deal not found or has expired.' });
    }

    res.json({ success: true, deal });
  } catch (error) {
    next(error);
  }
}

// Restaurant Admin: Create a new Night Rescue deal
async function createDeal(req, res, next) {
  try {
    const { foodId, surplusQuantity, rescuePrice, discountPercentage, expiresAt, pickupStartTime, pickupEndTime, dealTitle } = req.body;

    const food = await Models.Food.findById(foodId);
    if (!food) {
      return res.status(400).json({ success: false, message: 'Valid food item required.' });
    }

    const originalPrice = food.price;
    const quantity = parseInt(surplusQuantity, 10);
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Surplus quantity must be at least 1.' });
    }

    let calculatedRescuePrice = Number(rescuePrice);
    let calculatedDiscount = Number(discountPercentage);

    if (calculatedRescuePrice && !calculatedDiscount) {
      calculatedDiscount = Math.round(((originalPrice - calculatedRescuePrice) / originalPrice) * 100);
    } else if (calculatedDiscount && !calculatedRescuePrice) {
      calculatedRescuePrice = Math.round(originalPrice * (1 - calculatedDiscount / 100));
    } else if (!calculatedRescuePrice && !calculatedDiscount) {
      calculatedDiscount = 40; // Default 40% discount for rescue food
      calculatedRescuePrice = Math.round(originalPrice * 0.6);
    }

    // Default expiry 3 hours from now if not specified
    const defaultExpiry = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();

    const newDeal = await Models.NightRescueDeal.create({
      food: food._id,
      restaurant: food.restaurant,
      originalPrice,
      rescuePrice: calculatedRescuePrice,
      discountPercentage: calculatedDiscount,
      totalQuantity: quantity,
      remainingQuantity: quantity,
      expiresAt: expiresAt || defaultExpiry,
      pickupStartTime: pickupStartTime || '21:00',
      pickupEndTime: pickupEndTime || '23:30',
      isActive: true,
      dealTitle: dealTitle || `${food.name} (Surplus Rescue)`
    });

    const populated = await Models.NightRescueDeal.findById(newDeal._id)
      .populate('food')
      .populate('restaurant');

    res.status(201).json({
      success: true,
      message: 'Night Rescue deal activated! Saving food & reducing waste.',
      deal: populated
    });
  } catch (error) {
    next(error);
  }
}

// Restaurant Admin: Update surplus quantity or deactive
async function updateDeal(req, res, next) {
  try {
    const { id } = req.params;
    const { remainingQuantity, isActive, expiresAt } = req.body;

    const updateData = {};
    if (remainingQuantity !== undefined) {
      const q = parseInt(remainingQuantity, 10);
      updateData.remainingQuantity = q;
      if (q <= 0) updateData.isActive = false;
    }
    if (isActive !== undefined) updateData.isActive = isActive;
    if (expiresAt) updateData.expiresAt = expiresAt;

    const updated = await Models.NightRescueDeal.findByIdAndUpdate(id, updateData, { new: true })
      .populate('food')
      .populate('restaurant');

    res.json({ success: true, message: 'Deal updated.', deal: updated });
  } catch (error) {
    next(error);
  }
}

// Restaurant Admin: Delete deal
async function deleteDeal(req, res, next) {
  try {
    const { id } = req.params;
    await Models.NightRescueDeal.findByIdAndDelete(id);
    res.json({ success: true, message: 'Night Rescue deal removed.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getActiveDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal
};

