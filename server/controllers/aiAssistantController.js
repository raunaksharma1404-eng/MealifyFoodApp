const Models = require('../models');

// Extract user culinary intent from query
function parseIntent(query) {
  const text = query.toLowerCase();

  // Extract budget (e.g. ₹150, 150 rs, under 200, within 600)
  let budget = null;
  const budgetMatch = text.match(/(?:₹|rs\.?|inr|under|within|below|around)\s*(\d+)/i) || text.match(/(\d+)\s*(?:₹|rs|rupees)/i);
  if (budgetMatch && budgetMatch[1]) {
    budget = parseInt(budgetMatch[1], 10);
  }

  // Dietary preference
  let isVeg = null;
  if (text.includes('pure veg') || text.includes('vegetarian') || text.includes(' veg ') || text.startsWith('veg ')) {
    isVeg = true;
  } else if (text.includes('non-veg') || text.includes('nonveg') || text.includes('chicken') || text.includes('meat') || text.includes('pork') || text.includes('pepperoni')) {
    isVeg = false;
  }

  // Category & craving flags
  const cravingCategories = [];
  if (text.includes('burger') || text.includes('wrap') || text.includes('sandwich')) cravingCategories.push('Burgers & Wraps');
  if (text.includes('pizza') || text.includes('bread') || text.includes('crust')) cravingCategories.push('Pizzas & Breads');
  if (text.includes('biryani') || text.includes('rice') || text.includes('curry') || text.includes('dal') || text.includes('indian')) cravingCategories.push('Biryani & Indian Bowls');
  if (text.includes('ramen') || text.includes('noodle') || text.includes('dimsum') || text.includes('asian') || text.includes('tofu')) cravingCategories.push('Asian & Ramen');
  if (text.includes('healthy') || text.includes('salad') || text.includes('superfood') || text.includes('quinoa') || text.includes('diet') || text.includes('protein')) cravingCategories.push('Healthy & Superfoods');
  if (text.includes('sweet') || text.includes('dessert') || text.includes('cake') || text.includes('shake') || text.includes('chocolate') || text.includes('lava')) cravingCategories.push('Desserts & Sweets');

  // Taste & mood attributes
  const isSpicy = text.includes('spicy') || text.includes('fiery') || text.includes('hot') || text.includes('chilli');
  const isHealthy = text.includes('healthy') || text.includes('clean') || text.includes('fitness') || text.includes('protein');
  const isAffordable = text.includes('cheap') || text.includes('affordable') || text.includes('budget') || text.includes('pocket-friendly') || (budget && budget <= 200);

  // Group size
  let groupSize = 1;
  const peopleMatch = text.match(/(\d+)\s*(?:people|persons|friends|guests)/i) ||
                     (text.includes('two people') ? [0, 2] : null) ||
                     (text.includes('four people') ? [0, 4] : null);
  if (peopleMatch && peopleMatch[1]) {
    groupSize = parseInt(peopleMatch[1], 10);
  }

  return {
    rawQuery: query,
    budget,
    isVeg,
    cravingCategories,
    isSpicy,
    isHealthy,
    isAffordable,
    groupSize
  };
}

// Grounded AI recommendation handler
async function getAIRecommendations(req, res, next) {
  try {
    const { message, previousMessages = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message prompt required.' });
    }

    const intent = parseIntent(message);

    // Fetch all available dishes from database with restaurant populated
    const allFoods = await Models.Food.find({ isAvailable: true })
      .populate('restaurant')
      .exec();

    // Score & match dishes strictly against database
    const scoredFoods = allFoods.map(food => {
      let score = 50; // base score
      let matchReasons = [];

      // Dietary filter check
      if (intent.isVeg !== null) {
        if (intent.isVeg && !food.isVeg) {
          return { food, score: -1000, matchReasons: [] }; // Disqualify non-veg if veg requested
        }
        if (!intent.isVeg && food.isVeg) {
          score -= 10;
        } else if (intent.isVeg && food.isVeg) {
          score += 25;
          matchReasons.push('100% Vegetarian verified');
        }
      }

      // Budget check
      if (intent.budget) {
        if (food.price > intent.budget) {
          return { food, score: -1000, matchReasons: [] }; // Exceeds budget
        }
        score += 30;
        matchReasons.push(`Fits within your ₹${intent.budget} budget (₹${food.price})`);
      }

      // Category matching
      if (intent.cravingCategories.length > 0) {
        if (intent.cravingCategories.includes(food.category)) {
          score += 40;
          matchReasons.push(`Matches your craving for ${food.category}`);
        }
      }

      // Spicy preference
      if (intent.isSpicy) {
        if ((food.spicyLevel || 0) >= 2 || (food.tags || []).includes('spicy')) {
          score += 30;
          matchReasons.push(`Delivers that fiery, spicy kick (Level ${food.spicyLevel || 3}/5)`);
        }
      }

      // Healthy preference
      if (intent.isHealthy) {
        if ((food.tags || []).includes('healthy') || food.category === 'Healthy & Superfoods') {
          score += 35;
          matchReasons.push(`Clean macros with nutrient-dense ingredients`);
        }
      }

      // Affordable
      if (intent.isAffordable) {
        if (food.price <= 200) {
          score += 25;
          matchReasons.push(`Super affordable value at just ₹${food.price}`);
        }
      }

      // Quality rating bonus
      if (food.rating >= 4.8) {
        score += 15;
        matchReasons.push(`Top-rated customer favorite (${food.rating} ★)`);
      }

      return {
        food,
        score,
        matchReasons
      };
    });

    // Filter out disqualified items and sort by score
    const qualified = scoredFoods
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    let recommended = qualified.slice(0, 3).map(q => ({
      ...q.food,
      matchReason: q.matchReasons.length > 0
        ? q.matchReasons.slice(0, 2).join(' • ')
        : `Handpicked by MEALIFY AI from ${q.food.restaurant?.name || 'our top kitchen'}`
    }));

    // If no exact match (e.g. impossible budget like ₹20), fallback to closest affordable database items
    let fallbackNotice = null;
    if (recommended.length === 0) {
      fallbackNotice = intent.budget
        ? `We couldn't find items strictly under ₹${intent.budget}, but here are our closest best-value verified options:`
        : `Here are our highest-rated culinary alternatives matching your preference:`;

      const closest = allFoods
        .filter(f => (intent.isVeg === null || (intent.isVeg ? f.isVeg : true)))
        .sort((a, b) => a.price - b.price)
        .slice(0, 3);

      recommended = closest.map(f => ({
        ...f,
        matchReason: `Closest budget alternative at ₹${f.price} (${f.rating} ★)`
      }));
    }

    // Generate dynamic intelligent AI assistant narrative
    let aiResponseText = '';
    if (intent.budget && intent.isVeg) {
      aiResponseText = `I analyzed our live kitchen menus for vegetarian dishes within your ₹${intent.budget} budget. Here are top-rated recommendations that hit your craving spot without exceeding your price limit!`;
    } else if (intent.budget) {
      aiResponseText = `Found dishes strictly within your ₹${intent.budget} budget from our partner kitchens. Each price is verified directly against current restaurant menus:`;
    } else if (intent.isSpicy) {
      aiResponseText = `Bringing on the heat! Here are our most flavorful, spicy dishes crafted with authentic seasonings and chili oils:`;
    } else if (intent.isHealthy) {
      aiResponseText = `Looking for clean energy? These chef-crafted superfood bowls and salads pack high protein and nutrient-dense ingredients:`;
    } else if (intent.cravingCategories.length > 0) {
      aiResponseText = `Craving ${intent.cravingCategories.join(' & ')}? Here are the top-rated culinary highlights ready for instant ordering:`;
    } else {
      aiResponseText = `Here are our chef's top recommended dishes curated for you. Every price and availability is synced in real-time with our database:`;
    }

    if (fallbackNotice) {
      aiResponseText = fallbackNotice;
    }

    // Check if Gemini API key is configured for enhanced LLM touch
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        // Can call Google Gen AI SDK or fetch endpoint
        // For maximum reliability, our grounded intent engine above already filtered database items!
      } catch (geminiError) {
        console.warn('Gemini LLM call skipped, using local grounded response:', geminiError.message);
      }
    }

    res.json({
      success: true,
      query: message,
      intent,
      assistantResponse: aiResponseText,
      recommendations: recommended,
      count: recommended.length
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAIRecommendations
};

