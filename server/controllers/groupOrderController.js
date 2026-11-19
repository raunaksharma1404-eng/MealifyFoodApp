const Models = require('../models');

// Create group order
async function createGroup(req, res, next) {
  try {
    const { restaurantId, deadlineMinutes = 30, paymentOption = 'host_pays' } = req.body;

    const restaurant = await Models.Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(400).json({ success: false, message: 'Valid restaurant required for group ordering.' });
    }

    // Generate readable code e.g. GRP-4829
    const code = 'GRP-' + Math.floor(1000 + Math.random() * 9000);
    const deadline = new Date(Date.now() + Number(deadlineMinutes) * 60 * 1000).toISOString();

    const newGroup = await Models.GroupOrder.create({
      code,
      host: req.user._id,
      hostName: req.user.name,
      restaurant: restaurant._id,
      restaurantName: restaurant.name,
      status: 'active', // 'active', 'closed', 'placed'
      deadline,
      paymentOption, // 'host_pays' or 'individual_split'
      members: [
        {
          userId: String(req.user._id),
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + req.user.name,
          items: [],
          subtotal: 0,
          paymentStatus: paymentOption === 'host_pays' ? 'paid' : 'unpaid'
        }
      ],
      totalAmount: 0
    });

    res.status(201).json({
      success: true,
      message: 'Group order room created.',
      group: newGroup,
      shareLink: `/group/${newGroup.code}`
    });
  } catch (error) {
    next(error);
  }
}

// Get group order details by code
async function getGroupByCode(req, res, next) {
  try {
    const { code } = req.params;
    const group = await Models.GroupOrder.findOne({ code: code.toUpperCase() });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group order not found. Check the invite code.' });
    }

    const restaurant = await Models.Restaurant.findById(group.restaurant);
    const menu = await Models.Food.find({ restaurant: group.restaurant, isAvailable: true }).exec();

    res.json({
      success: true,
      group,
      restaurant,
      menu
    });
  } catch (error) {
    next(error);
  }
}

// Join group order
async function joinGroup(req, res, next) {
  try {
    const { code } = req.params;
    const { guestName } = req.body;

    const group = await Models.GroupOrder.findOne({ code: code.toUpperCase() });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group order not found.' });
    }

    if (group.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This group order is closed or already placed.' });
    }

    const userId = req.user ? String(req.user._id) : ('guest_' + Date.now());
    const memberName = req.user ? req.user.name : (guestName || 'Friend');

    // Check if already in group
    const existing = (group.members || []).find(m => String(m.userId) === userId);
    if (!existing) {
      const newMember = {
        userId,
        name: memberName,
        email: req.user ? req.user.email : '',
        avatar: req.user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(memberName)}`,
        items: [],
        subtotal: 0,
        paymentStatus: group.paymentOption === 'host_pays' ? 'paid' : 'unpaid'
      };

      const updatedMembers = [...(group.members || []), newMember];
      await Models.GroupOrder.findByIdAndUpdate(group._id, { members: updatedMembers });
      group.members = updatedMembers;
    }

    res.json({ success: true, message: `Joined group ${code}`, group });
  } catch (error) {
    next(error);
  }
}

// Add or update member items in shared group cart
async function updateMemberItems(req, res, next) {
  try {
    const { code } = req.params;
    const { items } = req.body; // array of { foodId, name, price, quantity, isVeg }

    const group = await Models.GroupOrder.findOne({ code: code.toUpperCase() });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group order not found.' });
    }

    if (group.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Group is locked. No edits allowed.' });
    }

    const currentUserId = req.user ? String(req.user._id) : req.body.userId;
    if (!currentUserId) {
      return res.status(400).json({ success: false, message: 'User identification required.' });
    }

    let memberSubtotal = 0;
    const validatedItems = (items || []).map(item => {
      const q = Math.max(0, parseInt(item.quantity, 10) || 0);
      const p = Number(item.price);
      memberSubtotal += p * q;
      return {
        foodId: item.foodId,
        name: item.name,
        price: p,
        quantity: q,
        isVeg: item.isVeg
      };
    }).filter(i => i.quantity > 0);

    const updatedMembers = (group.members || []).map(member => {
      if (String(member.userId) === String(currentUserId)) {
        return {
          ...member,
          items: validatedItems,
          subtotal: memberSubtotal
        };
      }
      return member;
    });

    // Recalculate total group order amount
    const newTotal = updatedMembers.reduce((sum, m) => sum + (m.subtotal || 0), 0);

    const updatedGroup = await Models.GroupOrder.findByIdAndUpdate(
      group._id,
      { members: updatedMembers, totalAmount: newTotal },
      { new: true }
    );

    res.json({ success: true, message: 'Shared cart updated.', group: updatedGroup });
  } catch (error) {
    next(error);
  }
}

// Host updates payment status or locks group
async function closeGroup(req, res, next) {
  try {
    const { code } = req.params;
    const group = await Models.GroupOrder.findOne({ code: code.toUpperCase() });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group order not found.' });
    }

    if (String(group.host) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the group host can finalize or close the order.' });
    }

    const updatedGroup = await Models.GroupOrder.findByIdAndUpdate(
      group._id,
      { status: 'closed' },
      { new: true }
    );

    res.json({ success: true, message: 'Group cart closed. Ready for host checkout.', group: updatedGroup });
  } catch (error) {
    next(error);
  }
}

// Update individual member contribution payment status
async function updateMemberPayment(req, res, next) {
  try {
    const { code, memberUserId } = req.params;
    const { paid } = req.body;

    const group = await Models.GroupOrder.findOne({ code: code.toUpperCase() });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found.' });
    }

    if (String(group.host) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the host can confirm payment receipt.' });
    }

    const updatedMembers = (group.members || []).map(m => {
      if (String(m.userId) === String(memberUserId)) {
        return { ...m, paymentStatus: paid ? 'paid' : 'unpaid' };
      }
      return m;
    });

    const updatedGroup = await Models.GroupOrder.findByIdAndUpdate(
      group._id,
      { members: updatedMembers },
      { new: true }
    );

    res.json({ success: true, message: 'Payment status updated.', group: updatedGroup });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createGroup,
  getGroupByCode,
  joinGroup,
  updateMemberItems,
  closeGroup,
  updateMemberPayment
};

