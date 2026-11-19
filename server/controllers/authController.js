const bcrypt = require('bcryptjs');
const Models = require('../models');
const { generateToken } = require('../middleware/auth');

// Register new user
async function register(req, res, next) {
  try {
    const { name, email, password, role = 'customer', phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    const existing = await Models.User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Models.User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: ['customer', 'restaurant_admin', 'delivery_partner'].includes(role) ? role : 'customer',
      phone: phone || '',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      addresses: []
    });

    const token = generateToken(newUser._id, newUser.role);
    const { password: _, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
}

// Login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = await Models.User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user._id, user.role);
    const { password: _, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
}

// Quick demo login (Alex, Marco, Vikram)
async function demoLogin(req, res, next) {
  try {
    const { role = 'customer' } = req.body;
    let targetEmail = 'alex@mealify.com';

    if (role === 'restaurant_admin' || role === 'admin') {
      targetEmail = 'chef@mealify.com';
    } else if (role === 'delivery_partner' || role === 'rider') {
      targetEmail = 'rider@mealify.com';
    }

    const user = await Models.User.findOne({ email: targetEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Demo user for role ${role} not found. Please run seed.`
      });
    }

    const token = generateToken(user._id, user.role);
    const { password: _, ...safeUser } = user;

    res.json({
      success: true,
      message: `Signed in as demo ${user.role} (${user.name})`,
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
}

// Get current user profile
async function getMe(req, res, next) {
  try {
    const user = await Models.User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const { password, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (error) {
    next(error);
  }
}

// Update profile
async function updateProfile(req, res, next) {
  try {
    const { name, phone, avatar } = req.body;
    const updated = await Models.User.findByIdAndUpdate(
      req.user._id,
      { ...(name && { name }), ...(phone && { phone }), ...(avatar && { avatar }) },
      { new: true }
    );
    const { password, ...safeUser } = updated;
    res.json({ success: true, message: 'Profile updated.', user: safeUser });
  } catch (error) {
    next(error);
  }
}

// Add delivery address
async function addAddress(req, res, next) {
  try {
    const { label, street, city, state, zipCode, isDefault } = req.body;
    if (!street || !city) {
      return res.status(400).json({ success: false, message: 'Street and city are required.' });
    }

    const user = await Models.User.findById(req.user._id);
    const newAddr = {
      id: 'addr_' + Date.now(),
      label: label || 'Delivery Address',
      street,
      city,
      state: state || 'Karnataka',
      zipCode: zipCode || '560001',
      isDefault: isDefault || (user.addresses.length === 0)
    };

    let updatedAddresses = [...(user.addresses || [])];
    if (newAddr.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newAddr);

    const updatedUser = await Models.User.findByIdAndUpdate(
      req.user._id,
      { addresses: updatedAddresses },
      { new: true }
    );

    const { password, ...safeUser } = updatedUser;
    res.status(201).json({ success: true, message: 'Address added.', addresses: safeUser.addresses, user: safeUser });
  } catch (error) {
    next(error);
  }
}

// Delete delivery address
async function deleteAddress(req, res, next) {
  try {
    const { id } = req.params;
    const user = await Models.User.findById(req.user._id);
    const filtered = (user.addresses || []).filter(a => a.id !== id);

    const updatedUser = await Models.User.findByIdAndUpdate(
      req.user._id,
      { addresses: filtered },
      { new: true }
    );

    const { password, ...safeUser } = updatedUser;
    res.json({ success: true, message: 'Address removed.', addresses: safeUser.addresses, user: safeUser });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  demoLogin,
  getMe,
  updateProfile,
  addAddress,
  deleteAddress
};

