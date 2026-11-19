const Models = require('../models');

// Get orders ready for delivery acceptance
async function getAvailableDeliveries(req, res, next) {
  try {
    // Orders that are ready for pickup or accepted, and not yet claimed by another delivery partner
    const availableOrders = await Models.Order.find({
      orderStatus: { $in: ['ready_for_pickup', 'order_accepted', 'preparing_food'] },
      deliveryPartner: { $exists: false }
    })
      .populate('restaurant')
      .populate('customer')
      .exec();

    // Also include orders assigned to this current partner
    const myActiveOrders = await Models.Order.find({
      deliveryPartner: req.user._id,
      orderStatus: { $in: ['picked_up', 'out_for_delivery', 'ready_for_pickup'] }
    })
      .populate('restaurant')
      .populate('customer')
      .exec();

    res.json({
      success: true,
      availableCount: availableOrders.length,
      availableOrders,
      myActiveCount: myActiveOrders.length,
      myActiveOrders
    });
  } catch (error) {
    next(error);
  }
}

// Accept a delivery request
async function acceptDelivery(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Models.Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.deliveryPartner && String(order.deliveryPartner) !== String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'This delivery has already been assigned to another partner.' });
    }

    const history = [...(order.statusHistory || [])];
    history.push({
      status: 'delivery_assigned',
      timestamp: new Date().toISOString(),
      note: `Delivery partner ${req.user.name} accepted the delivery request.`
    });

    const updated = await Models.Order.findByIdAndUpdate(
      id,
      {
        deliveryPartner: req.user._id,
        deliveryPartnerName: req.user.name,
        deliveryPartnerPhone: req.user.phone,
        statusHistory: history
      },
      { new: true }
    )
      .populate('restaurant')
      .populate('customer');

    res.json({
      success: true,
      message: 'Delivery accepted! Head to the restaurant for pickup.',
      order: updated
    });
  } catch (error) {
    next(error);
  }
}

// Update delivery progress: 'picked_up', 'out_for_delivery', 'delivered'
async function updateDeliveryStep(req, res, next) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const allowedSteps = ['picked_up', 'out_for_delivery', 'delivered'];
    if (!allowedSteps.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid delivery step transition.' });
    }

    const order = await Models.Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const history = [...(order.statusHistory || [])];
    history.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Package status updated to ${status.replace(/_/g, ' ')} by rider ${req.user.name}.`
    });

    const updateFields = {
      orderStatus: status,
      statusHistory: history
    };

    if (status === 'delivered') {
      updateFields.deliveredAt = new Date().toISOString();
      updateFields.paymentStatus = 'completed';
    }

    const updated = await Models.Order.findByIdAndUpdate(id, updateFields, { new: true })
      .populate('restaurant')
      .populate('customer');

    res.json({
      success: true,
      message: `Delivery updated: ${status.replace(/_/g, ' ')}.`,
      order: updated
    });
  } catch (error) {
    next(error);
  }
}

// Completed deliveries and rider metrics
async function getDeliveryHistory(req, res, next) {
  try {
    const history = await Models.Order.find({
      deliveryPartner: req.user._id,
      orderStatus: 'delivered'
    })
      .sort({ createdAt: -1 })
      .populate('restaurant')
      .populate('customer')
      .exec();

    // Calculate rider payout (e.g. ₹50 per delivery base)
    const totalEarnings = history.length * 50;

    res.json({
      success: true,
      completedCount: history.length,
      totalEarnings,
      history
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAvailableDeliveries,
  acceptDelivery,
  updateDeliveryStep,
  getDeliveryHistory
};

