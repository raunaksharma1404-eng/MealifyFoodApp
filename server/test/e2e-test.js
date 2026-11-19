const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

async function req(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`[${res.status}] ${data.message || 'Request failed'}`);
  }
  return data;
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 RUNNING MEALIFY FULL SYSTEM INTEGRATION TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    console.log('1. Testing System Health & Database Connection...');
    const health = await req('/health');
    assert(health.status === 'online', 'Health endpoint reports online status');
    assert(health.database.connected === true, 'Database is connected');

    // 2. Authentication & Demo Personas
    console.log('\n2. Testing Authentication & User Roles...');
    const customerLogin = await req('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role: 'customer' })
    });
    assert(customerLogin.success && customerLogin.user.role === 'customer', 'Customer demo login succeeds (Alex Mercer)');
    const customerToken = customerLogin.token;

    const adminLogin = await req('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role: 'restaurant_admin' })
    });
    assert(adminLogin.success && adminLogin.user.role === 'restaurant_admin', 'Admin demo login succeeds (Chef Marco)');
    const adminToken = adminLogin.token;

    const riderLogin = await req('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role: 'delivery_partner' })
    });
    assert(riderLogin.success && riderLogin.user.role === 'delivery_partner', 'Delivery partner demo login succeeds (Vikram Singh)');
    const riderToken = riderLogin.token;

    // Test profile & address
    const profile = await req('/auth/me', { headers: { Authorization: `Bearer ${customerToken}` } });
    assert(profile.success && profile.user.email === 'alex@mealify.com', 'Profile retrieval verified');

    const addAddr = await req('/auth/addresses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        label: 'Penthouse Office',
        street: '99 Tech Boulevard',
        city: 'Bengaluru',
        zipCode: '560001'
      })
    });
    assert(addAddr.success && addAddr.addresses.some(a => a.label === 'Penthouse Office'), 'Delivery address addition works');

    // 3. Restaurants and Menus
    console.log('\n3. Testing Restaurant & Menu Discovery...');
    const rests = await req('/restaurants');
    assert(rests.success && rests.restaurants.length >= 6, `Found ${rests.restaurants.length} active partner restaurants`);

    const sampleRestId = rests.restaurants[0]._id;
    const restDetails = await req(`/restaurants/${sampleRestId}`);
    assert(restDetails.success && Object.keys(restDetails.menuByCategory).length > 0, 'Categorized menu retrieved');

    // 4. Food Search & Filters
    console.log('\n4. Testing Food Search, Cuisines & Diet Filters...');
    const vegFoods = await req('/foods?isVeg=true');
    assert(vegFoods.success && vegFoods.foods.every(f => f.isVeg === true), 'Vegetarian filter is 100% accurate');

    const searchRes = await req('/foods?search=Truffle');
    assert(searchRes.success && searchRes.foods.some(f => f.name.includes('Truffle')), 'Text search for "Truffle" works');

    // 5. Unique Feature 1: Night Rescue
    console.log('\n5. Testing Unique Feature 1: Night Rescue Surplus System...');
    const activeRescue = await req('/night-rescue');
    assert(activeRescue.success && activeRescue.deals.length > 0, `Active Night Rescue deals available (${activeRescue.deals.length})`);
    assert(activeRescue.deals.every(d => d.remainingQuantity > 0), 'All listed rescue deals have remaining surplus stock');

    const rescueDeal = activeRescue.deals[0];
    assert(rescueDeal.rescuePrice < rescueDeal.originalPrice, `Rescue price (₹${rescueDeal.rescuePrice}) is strictly discounted below original (₹${rescueDeal.originalPrice})`);

    // 6. Unique Feature 2: Smart Budget Meal Finder
    console.log('\n6. Testing Unique Feature 2: Smart Budget Meal Finder...');
    const budget200 = await req('/budget/find?budget=200&preference=any');
    assert(budget200.success, 'Budget meal finder returned results');
    assert(budget200.items.every(item => item.price <= 200), 'All recommended items strictly <= ₹200');
    assert(budget200.combos.every(combo => combo.totalPrice <= 200), 'All recommended combos strictly <= ₹200');
    assert(budget200.items.every(item => item.remainingBudget === 200 - item.price), 'Remaining budget calculation is mathematically exact');

    // 7. Unique Feature 3: Group Ordering
    console.log('\n7. Testing Unique Feature 3: Group Food Ordering Room...');
    const groupRoom = await req('/group-orders/create', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        restaurantId: sampleRestId,
        deadlineMinutes: 30,
        paymentOption: 'individual_split'
      })
    });
    assert(groupRoom.success && groupRoom.group.code.startsWith('GRP-'), `Created group room with invite code ${groupRoom.group.code}`);

    const groupDetails = await req(`/group-orders/${groupRoom.group.code}`);
    assert(groupDetails.success && groupDetails.group.status === 'active', 'Group room retrieved by code');

    // Update items in group
    const updateGroup = await req(`/group-orders/${groupRoom.group.code}/items`, {
      method: 'PUT',
      body: JSON.stringify({
        userId: customerLogin.user._id,
        items: [
          { foodId: restDetails.restaurant._id, name: 'Truffle Smash', price: 349, quantity: 2, isVeg: false }
        ]
      })
    });
    assert(updateGroup.success && updateGroup.group.totalAmount === 698, `Shared group total updated to ₹${updateGroup.group.totalAmount}`);

    // Close group
    const closedGroup = await req(`/group-orders/${groupRoom.group.code}/close`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(closedGroup.success && closedGroup.group.status === 'closed', 'Host successfully closed group order');

    // 8. Unique Feature 4: AI Food Assistant
    console.log('\n8. Testing Unique Feature 4: Grounded AI Food Assistant...');
    const ai1 = await req('/ai/recommend', {
      method: 'POST',
      body: JSON.stringify({ message: 'I have ₹150. Suggest something.' })
    });
    assert(ai1.success && ai1.recommendations.length > 0, 'AI responded with recommendations for ₹150 budget');
    assert(ai1.recommendations.every(r => r.price <= 150), 'AI recommendations strictly respect ₹150 budget');

    const ai2 = await req('/ai/recommend', {
      method: 'POST',
      body: JSON.stringify({ message: 'I want spicy vegetarian food' })
    });
    assert(ai2.success && ai2.recommendations.every(r => r.isVeg === true), 'AI vegetarian intent matching is 100% strict');

    // 9. Order Lifecycle & Role Workflow
    console.log('\n9. Testing Order Checkout, Price Validation & 7-Stage Delivery...');
    const sampleFood = vegFoods.foods[0];
    const initialSurplusQuantity = rescueDeal.remainingQuantity;

    const newOrder = await req('/orders/checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        restaurantId: sampleFood.restaurant?._id || sampleFood.restaurant,
        items: [
          { foodId: sampleFood._id, quantity: 2, rescueDealId: rescueDeal._id }
        ],
        deliveryAddress: {
          label: 'Home',
          street: 'Apt 402, Cyber Tower 3',
          city: 'Bengaluru',
          zipCode: '560001'
        },
        paymentMethod: 'card',
        couponCode: 'MEALIFY50'
      })
    });
    assert(newOrder.success && newOrder.order.orderStatus === 'order_placed', `Order created successfully: #${newOrder.order.orderNumber}`);
    assert(newOrder.order.discount > 0, `Coupon discount applied: -₹${newOrder.order.discount}`);

    // Verify stock decrement
    const updatedRescue = await req(`/night-rescue/${rescueDeal._id}`);
    assert(updatedRescue.deal.remainingQuantity === initialSurplusQuantity - 2, 'Night rescue surplus stock decremented by 2 after order');

    const orderId = newOrder.order._id;

    // Kitchen admin workflow
    console.log('   -> Chef accepts and starts cooking...');
    const cookStatus = await req(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'preparing_food', note: 'Chef Marco grilling patties' })
    });
    assert(cookStatus.success && cookStatus.order.orderStatus === 'preparing_food', 'Order status updated to preparing_food');

    const readyStatus = await req(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'ready_for_pickup', note: 'Food boxed in thermal packaging' })
    });
    assert(readyStatus.success && readyStatus.order.orderStatus === 'ready_for_pickup', 'Order status updated to ready_for_pickup');

    // Delivery Partner workflow
    console.log('   -> Rider accepts and completes delivery...');
    const acceptDelivery = await req(`/delivery/accept/${orderId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${riderToken}` }
    });
    assert(acceptDelivery.success, 'Rider accepted the delivery run');

    const pickedUp = await req(`/delivery/update/${orderId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${riderToken}` },
      body: JSON.stringify({ status: 'picked_up' })
    });
    assert(pickedUp.success && pickedUp.order.orderStatus === 'picked_up', 'Rider marked package as picked_up');

    const outForDelivery = await req(`/delivery/update/${orderId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${riderToken}` },
      body: JSON.stringify({ status: 'out_for_delivery' })
    });
    assert(outForDelivery.success && outForDelivery.order.orderStatus === 'out_for_delivery', 'Order marked as out_for_delivery');

    const delivered = await req(`/delivery/update/${orderId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${riderToken}` },
      body: JSON.stringify({ status: 'delivered' })
    });
    assert(delivered.success && delivered.order.orderStatus === 'delivered', 'Order successfully marked as delivered');

    // Test Demo Order Stage Simulator
    console.log('   -> Testing Demo Order Stage Simulator endpoint...');
    const simOrder = await req('/orders/checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        restaurantId: sampleRestId,
        items: [{ foodId: sampleFood._id, quantity: 1 }],
        deliveryAddress: { label: 'Tech Park', street: 'MG Road 10', city: 'Bengaluru' },
        paymentMethod: 'upi'
      })
    });
    const simStep = await req(`/orders/${simOrder.order._id}/simulate-step`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(simStep.success && simStep.order.orderStatus === 'order_accepted', 'Simulator advanced stage from order_placed to order_accepted');


    // 10. Reviews & Feedback
    console.log('\n10. Testing Ratings & Reviews...');
    const review = await req('/reviews', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        restaurantId: sampleRestId,
        rating: 5,
        comment: 'Exquisite flavor balance and prompt delivery! 5 stars.'
      })
    });
    assert(review.success && review.review.rating === 5, 'Customer review posted successfully');

    console.log('\n====================================================');
    console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('\n❌ Fatal Test Error:', err);
    process.exit(1);
  }
}

runTestSuite();
