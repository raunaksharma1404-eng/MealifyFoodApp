const { getSeedData } = require('./seedData');
const Models = require('../models');

async function seedDatabase() {
  try {
    const data = await getSeedData();

    // Check if already seeded
    const existingUsers = await Models.User.countDocuments();
    if (existingUsers > 0) {
      console.log(`ℹ️ Database already contains ${existingUsers} users. Skipping seed.`);
      return;
    }

    console.log('🌱 Seeding MEALIFY database with rich culinary data...');

    await Models.User.insertMany(data.users);
    await Models.Category.insertMany(data.categories);
    await Models.Restaurant.insertMany(data.restaurants);
    await Models.Food.insertMany(data.foods);
    await Models.NightRescueDeal.insertMany(data.nightRescueDeals);
    await Models.Coupon.insertMany(data.coupons);
    await Models.Review.insertMany(data.reviews);
    await Models.Order.insertMany(data.orders);

    console.log('✨ Seed complete:');
    console.log(`  - ${data.users.length} Users (Customer, Admin, Rider)`);
    console.log(`  - ${data.restaurants.length} Restaurants`);
    console.log(`  - ${data.foods.length} Gourmet Dishes & Budget Meals`);
    console.log(`  - ${data.nightRescueDeals.length} Night Rescue Deals`);
    console.log(`  - ${data.coupons.length} Discount Coupons`);
    console.log(`  - ${data.orders.length} Sample Order History`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
}

if (require.main === module) {
  const { connectDB } = require('../config/db');
  require('dotenv').config();
  connectDB().then(() => {
    seedDatabase().then(() => {
      console.log('🚀 Standalone seed script finished.');
      process.exit(0);
    });
  });
}

module.exports = { seedDatabase };

