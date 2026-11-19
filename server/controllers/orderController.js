const Models = require('../models');

// Calculate and place order with strict backend validation
async function createOrder(req, res, next) {
  try {
    const {
      restaurantId,
      items, // array of { foodId, quantity, rescueDealId }
      deliveryAddress,
      paymentMethod = 'card', // 'cod', 'card', 'upi'
      couponCode,
      notes
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart cannot be empty.' });
    }

    if (!deliveryAddress || !deliveryAddress.street) {
      return res.status(400).json({ success: false, message: 'Valid delivery address required.' });
    }

    const restaurant = await Models.Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(400).json({ success: false, message: 'Restaurant not found.' });
    }

    // STRICT BACKEND PRICE & STOCK VALIDATION
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const cartItem of items) {
      const food = await Models.Food.findById(cartItem.foodId);
      if (!food) {
        return res.status(400).json({ success: false, message: `Dish with ID ${cartItem.foodId} no longer exists.` });
      }

      if (!food.isAvailable) {
        return res.status(400).json({ success: false, message: `${food.name} is currently sold out.` });
      }

      const qty = Math.max(1, parseInt(cartItem.quantity, 10) || 1);
      let unitPrice = food.price;

      // Check if it's ordered under an active Night Rescue Deal
      if (cartItem.rescueDealId) {
        const rescueDeal = await Models.NightRescueDeal.findById(cartItem.rescueDealId);
        if (rescueDeal && rescueDeal.isActive && rescueDeal.remainingQuantity >= qty) {
          unitPrice = rescueDeal.rescuePrice;
          // Decrement surplus stock
          const newRemaining = rescueDeal.remainingQuantity - qty;
          await Models.NightRescueDeal.findByIdAndUpdate(rescueDeal._id, {
            remainingQuantity: newRemaining,
            isActive: newRemaining > 0
          });
        }
      }

      const itemTotal = unitPrice * qty;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        food: food._id,
        name: food.name,
        price: unitPrice,
        quantity: qty,
        image: food.image,
        isVeg: food.isVeg,
        itemTotal
      });
    }

    // Validate Coupon if provided
    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode && couponCode.trim() !== '') {
      const coupon = await Models.Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true
      });

      if (coupon) {
        if (calculatedSubtotal >= (coupon.minOrder || 0)) {
          const rawDiscount = (calculatedSubtotal * coupon.discountPercent) / 100;
          discountAmount = Math.min(rawDiscount, coupon.maxDiscount || rawDiscount);
          appliedCoupon = coupon.code;
        }
      }
    }

    const deliveryFee = restaurant.deliveryFee || 39;
    const tax = Math.round(calculatedSubtotal * 0.05); // 5% GST
    const totalAmount = Math.max(0, calculatedSubtotal + deliveryFee + tax - discountAmount);

    // Generate unique order ID
    const orderNumber = 'MLF-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();

    const newOrder = await Models.Order.create({
      orderNumber,
      customer: req.user._id,
      customerName: req.user.name,
      restaurant: restaurant._id,
      restaurantName: restaurant.name,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      deliveryFee,
      tax,
      couponCode: appliedCoupon,
      discount: discountAmount,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'simulated_paid',
      orderStatus: 'order_placed',
      estimatedDeliveryMinutes: (restaurant.deliveryTimeMin || 25) + 5,
      notes: notes || '',
      statusHistory: [
        {
          status: 'order_placed',
          timestamp: now.toISOString(),
          note: 'Order successfully placed by customer. Kitchen notified.'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order: newOrder
    });
  } catch (error) {
    next(error);
  }
}

// Get customer's orders
async function getMyOrders(req, res, next) {
  try {
    const orders = await Models.Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('restaurant')
      .exec();

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
}

// Get single order details with real-time tracking timeline
async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    let order = await Models.Order.findById(id).populate('restaurant');

    if (!order) {
      // Try finding by orderNumber
      order = await Models.Order.findOne({ orderNumber: id }).populate('restaurant');
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Role-based authorization check: customer, admin, or delivery partner
    if (
      req.user.role === 'customer' &&
      String(order.customer) !== String(req.user._id)
    ) {
      return res.status(403).json({ success: false, message: 'Access denied to this order.' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

// Reorder a past order
async function reorder(req, res, next) {
  try {
    const { id } = req.params;
    const oldOrder = await Models.Order.findById(id);

    if (!oldOrder) {
      return res.status(404).json({ success: false, message: 'Previous order not found.' });
    }

    // Return items to populate user's cart
    res.json({
      success: true,
      message: 'Items retrieved for reordering.',
      restaurantId: oldOrder.restaurant,
      items: oldOrder.items
    });
  } catch (error) {
    next(error);
  }
}

// Simulator for demo: advance order through its real-time 7 stages
async function simulateNextStep(req, res, next) {
  try {
    const { id } = req.params;
    let order = await Models.Order.findById(id);
    if (!order) {
      order = await Models.Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const stages = [
      { key: 'order_placed', note: 'Order received and logged in kitchen system.' },
      { key: 'order_accepted', note: 'Executive Chef accepted order and assigned prep station.' },
      { key: 'preparing_food', note: 'Fresh ingredients sizzling on the grill.' },
      { key: 'ready_for_pickup', note: 'Sealed in thermal moisture-lock packaging.' },
      { key: 'picked_up', note: 'Delivery rider Vikram Singh picked up thermal package.' },
      { key: 'out_for_delivery', note: 'Rider is on electric scooter heading to your address.' },
      { key: 'delivered', note: 'Order handed over. Enjoy your warm gourmet meal!' }
    ];

    const currentIdx = stages.findIndex(s => s.key === order.orderStatus);
    let nextIdx = 0;
    if (currentIdx !== -1 && currentIdx < stages.length - 1) {
      nextIdx = currentIdx + 1;
    } else if (currentIdx === stages.length - 1) {
      nextIdx = currentIdx;
    }

    const nextStage = stages[nextIdx];
    const history = [...(order.statusHistory || [])];
    history.push({
      status: nextStage.key,
      timestamp: new Date().toISOString(),
      note: nextStage.note
    });

    const updated = await Models.Order.findByIdAndUpdate(
      order._id,
      {
        orderStatus: nextStage.key,
        statusHistory: history,
        deliveryPartnerName: 'Vikram Singh',
        deliveryPartnerPhone: '+91 98444 55566'
      },
      { new: true }
    );

    res.json({
      success: true,
      message: `Order simulated to stage: ${nextStage.key}`,
      order: updated,
      isFinal: nextIdx === stages.length - 1
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  reorder,
  simulateNextStep
};

