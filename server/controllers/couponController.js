const Models = require('../models');

// Validate a coupon code against subtotal
async function validateCoupon(req, res, next) {
  try {
    const { code, subtotal = 0 } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code required.' });
    }

    const coupon = await Models.Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
    }

    const numSubtotal = Number(subtotal);
    if (numSubtotal < (coupon.minOrder || 0)) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrder} required for ${coupon.code}.`
      });
    }

    const rawDiscount = (numSubtotal * coupon.discountPercent) / 100;
    const discount = Math.min(rawDiscount, coupon.maxDiscount || rawDiscount);

    res.json({
      success: true,
      valid: true,
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        maxDiscount: coupon.maxDiscount,
        minOrder: coupon.minOrder,
        description: coupon.description
      },
      discount,
      newSubtotal: Math.max(0, numSubtotal - discount)
    });
  } catch (error) {
    next(error);
  }
}

// Get all available public coupons
async function getAvailableCoupons(req, res, next) {
  try {
    const coupons = await Models.Coupon.find({ isActive: true }).exec();
    res.json({ success: true, count: coupons.length, coupons });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateCoupon,
  getAvailableCoupons
};

