const bcrypt = require('bcryptjs');

async function getSeedData() {
  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('password123', salt);

  const users = [
    {
      _id: '670000000000000000000001',
      name: 'Alex Mercer',
      email: 'alex@mealify.com',
      password: defaultPassword,
      role: 'customer',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      addresses: [
        {
          id: 'addr_1',
          label: 'Home',
          street: 'Apt 402, Cyber Tower 3, High-Tech City',
          city: 'Bengaluru',
          state: 'Karnataka',
          zipCode: '560001',
          isDefault: true
        },
        {
          id: 'addr_2',
          label: 'Office',
          street: '7th Floor, Innovation Hub, Outer Ring Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          zipCode: '560103',
          isDefault: false
        }
      ]
    },
    {
      _id: '670000000000000000000002',
      name: 'Chef Marco Rossi',
      email: 'chef@mealify.com',
      password: defaultPassword,
      role: 'restaurant_admin',
      phone: '+91 98111 22233',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=250&q=80',
      restaurantId: '670000000000000000000011',
      addresses: []
    },
    {
      _id: '670000000000000000000003',
      name: 'Vikram Singh',
      email: 'rider@mealify.com',
      password: defaultPassword,
      role: 'delivery_partner',
      phone: '+91 98444 55566',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      vehicleType: 'Electric Scooter (EV-9000)',
      rating: 4.95,
      totalDeliveries: 428,
      addresses: []
    },
    {
      _id: '670000000000000000000004',
      name: 'Sarah Jenkins',
      email: 'sarah@mealify.com',
      password: defaultPassword,
      role: 'customer',
      phone: '+91 98222 33344',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
      addresses: []
    },
    {
      _id: '670000000000000000000005',
      name: 'David Zhao',
      email: 'david@mealify.com',
      password: defaultPassword,
      role: 'customer',
      phone: '+91 98333 44455',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      addresses: []
    }
  ];

  const categories = [
    {
      _id: '670000000000000000000021',
      name: 'Burgers & Wraps',
      slug: 'burgers-wraps',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      icon: '🍔',
      description: 'Hand-crafted artisan brioche burgers & toasted wraps.'
    },
    {
      _id: '670000000000000000000022',
      name: 'Pizzas & Breads',
      slug: 'pizzas-breads',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      icon: '🍕',
      description: 'Slow-fermented Neapolitan woodfired crusts & calzones.'
    },
    {
      _id: '670000000000000000000023',
      name: 'Biryani & Indian Bowls',
      slug: 'biryani-indian',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      icon: '🍛',
      description: 'Dum-cooked saffron basmati rice with fragrant spices.'
    },
    {
      _id: '670000000000000000000024',
      name: 'Asian & Ramen',
      slug: 'asian-ramen',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
      icon: '🍜',
      description: 'Rich broths, handmade noodles & fiery stir fries.'
    },
    {
      _id: '670000000000000000000025',
      name: 'Healthy & Superfoods',
      slug: 'healthy-superfoods',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      icon: '🥗',
      description: 'High-protein grain bowls, fresh greens & detox smoothies.'
    },
    {
      _id: '670000000000000000000026',
      name: 'Desserts & Sweets',
      slug: 'desserts',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
      icon: '🍰',
      description: 'Velvety cheesecakes, warm lava tortes & artisan gelato.'
    }
  ];

  const restaurants = [
    {
      _id: '670000000000000000000011',
      name: 'The Golden Truffle & Smokehouse',
      tagline: 'Artisan Burgers & Smoked Delights',
      description: 'Award-winning smokehouse blending 18-hour slow smoked brisket with brioche gourmet burgers and truffle mayo.',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80',
      rating: 4.9,
      totalReviews: 840,
      cuisines: ['Burgers', 'American', 'Gourmet Grills'],
      deliveryTimeMin: 28,
      deliveryFee: 39,
      minOrder: 199,
      isPromoted: true,
      isOpen: true,
      heroTag: 'Chef Special',
      address: {
        street: '14 Indiranagar 100ft Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560038'
      }
    },
    {
      _id: '670000000000000000000012',
      name: 'Neo Tokyo Bento & Ramen',
      tagline: 'Futuristic Japanese Culinary Art',
      description: 'Modern Japanese kitchen crafting Umami-rich 16-hour Tonkotsu broths, Teriyaki crunch bowls and fresh sushi rolls.',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80',
      rating: 4.8,
      totalReviews: 620,
      cuisines: ['Japanese', 'Asian', 'Ramen & Bowls'],
      deliveryTimeMin: 32,
      deliveryFee: 49,
      minOrder: 249,
      isPromoted: true,
      isOpen: true,
      heroTag: 'Popular Choice',
      address: {
        street: '88 Koramangala 4th Block',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560034'
      }
    },
    {
      _id: '670000000000000000000013',
      name: 'Spice Syndicate — Royal Dum Biryani',
      tagline: 'Authentic Hyderabadi & Awadhi Flavours',
      description: 'Slow clay-pot dum biryani layered with long-grain aged Basmati rice, hand-pounded ghee and royal saffron.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
      rating: 4.85,
      totalReviews: 1240,
      cuisines: ['North Indian', 'Biryani', 'Mughlai'],
      deliveryTimeMin: 24,
      deliveryFee: 29,
      minOrder: 179,
      isPromoted: false,
      isOpen: true,
      heroTag: 'Trending',
      address: {
        street: '42 MG Road, Central Plaza',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560001'
      }
    },
    {
      _id: '670000000000000000000014',
      name: 'CyberSlice Woodfired Pizza',
      tagline: '48hr Sourdough Italian Neapolitan',
      description: 'San Marzano tomatoes, fresh Fior Di Latte mozzarella and 450-degree wood-fired charred perfection.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
      rating: 4.75,
      totalReviews: 512,
      cuisines: ['Italian', 'Pizzas', 'Pastas'],
      deliveryTimeMin: 30,
      deliveryFee: 39,
      minOrder: 220,
      isPromoted: false,
      isOpen: true,
      heroTag: 'Crispy Crust',
      address: {
        street: '22 Richmond Town, Lavelle Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560025'
      }
    },
    {
      _id: '670000000000000000000015',
      name: 'Vitality Bowl & Green Alchemy',
      tagline: 'Clean Nutrition & High Protein Living',
      description: 'Chef-formulated organic salads, warm quinoa macro bowls, avocado super-plates and cold-pressed botanical juices.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80',
      rating: 4.92,
      totalReviews: 390,
      cuisines: ['Healthy', 'Salads', 'Superfoods'],
      deliveryTimeMin: 18,
      deliveryFee: 25,
      minOrder: 149,
      isPromoted: true,
      isOpen: true,
      heroTag: 'Fitness Favourite',
      address: {
        street: '15 HSR Layout Sector 3',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560102'
      }
    },
    {
      _id: '670000000000000000000016',
      name: 'Midnight Nirvana Patisserie',
      tagline: 'Decadent Desserts & Midnight Shakes',
      description: 'Golden chocolate lava cakes, Basque burnt cheesecakes, French macarons, and thick Belgian fudge shakes.',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80',
      rating: 4.9,
      totalReviews: 730,
      cuisines: ['Desserts', 'Bakery', 'Shakes'],
      deliveryTimeMin: 15,
      deliveryFee: 20,
      minOrder: 99,
      isPromoted: false,
      isOpen: true,
      heroTag: 'Sweet Tooth',
      address: {
        street: '7 Church Street',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560001'
      }
    }
  ];

  const foods = [
    // The Golden Truffle
    {
      _id: '670000000000000000000101',
      name: 'Truffle Glaze Double Smash Burger',
      description: 'Two smashed prime patties, double melted vintage cheddar, caramelized onions, black truffle aioli on toasted brioche.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      price: 349,
      originalPrice: 429,
      category: 'Burgers & Wraps',
      restaurant: '670000000000000000000011',
      isVeg: false,
      isAvailable: true,
      preparationTime: 18,
      rating: 4.9,
      totalRatings: 320,
      calories: 680,
      spicyLevel: 1,
      tags: ['bestseller', 'chef-special', 'fast food'],
      ingredients: ['Prime Patty', 'Vintage Cheddar', 'Truffle Mayo', 'Brioche Bun']
    },
    {
      _id: '670000000000000000000102',
      name: 'Golden Crispy Paneer Tower Burger',
      description: 'Herb-crusted crispy cottage cheese patty, smoked paprika cheese sauce, crisp iceberg lettuce and tangy gherkins.',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
      price: 269,
      originalPrice: 329,
      category: 'Burgers & Wraps',
      restaurant: '670000000000000000000011',
      isVeg: true,
      isAvailable: true,
      preparationTime: 15,
      rating: 4.8,
      totalRatings: 210,
      calories: 550,
      spicyLevel: 2,
      tags: ['vegetarian', 'bestseller', 'fast food'],
      ingredients: ['Cottage Cheese', 'Paprika Sauce', 'Crisp Greens', 'Brioche']
    },
    {
      _id: '670000000000000000000103',
      name: 'Parmesan Truffle Loaded Fries',
      description: 'Double fried golden potato wedges tossed in aromatic truffle oil, aged parmesan snow and fresh chives.',
      image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
      price: 189,
      originalPrice: 229,
      category: 'Burgers & Wraps',
      restaurant: '670000000000000000000011',
      isVeg: true,
      isAvailable: true,
      preparationTime: 12,
      rating: 4.75,
      totalRatings: 180,
      calories: 420,
      spicyLevel: 0,
      tags: ['budget-friendly', 'fast food', 'snack'],
      ingredients: ['Potatoes', 'Truffle Oil', 'Parmesan', 'Chives']
    },

    // Neo Tokyo
    {
      _id: '670000000000000000000104',
      name: 'Cyber Umami Shoyu Ramen',
      description: 'Handmade curly ramen noodles in a velvety 16-hour broth topped with ajitsuke egg, nori, bamboo shoots, and scallions.',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
      price: 389,
      originalPrice: 459,
      category: 'Asian & Ramen',
      restaurant: '670000000000000000000012',
      isVeg: false,
      isAvailable: true,
      preparationTime: 20,
      rating: 4.95,
      totalRatings: 410,
      calories: 590,
      spicyLevel: 2,
      tags: ['bestseller', 'chef-special', 'signature'],
      ingredients: ['Ramen Noodles', 'Savory Broth', 'Ramen Egg', 'Nori', 'Enoki']
    },
    {
      _id: '670000000000000000000105',
      name: 'Tokyo Teriyaki Tofu Rice Bowl',
      description: 'Crispy wok-tossed silken tofu glazed in sweet mirin teriyaki on a bed of steamed sticky rice with sesame edamame.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      price: 289,
      originalPrice: 349,
      category: 'Asian & Ramen',
      restaurant: '670000000000000000000012',
      isVeg: true,
      isAvailable: true,
      preparationTime: 16,
      rating: 4.78,
      totalRatings: 195,
      calories: 470,
      spicyLevel: 1,
      tags: ['vegetarian', 'healthy', 'protein-rich'],
      ingredients: ['Silken Tofu', 'Teriyaki Sauce', 'Sticky Rice', 'Edamame']
    },
    {
      _id: '670000000000000000000106',
      name: 'Fiery Dragon Chilli Dimsums (6 pcs)',
      description: 'Steamed crystal dumplings filled with exotic mushrooms and water chestnuts, drizzled with Sichuan garlic crisp oil.',
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
      price: 229,
      originalPrice: 289,
      category: 'Asian & Ramen',
      restaurant: '670000000000000000000012',
      isVeg: true,
      isAvailable: true,
      preparationTime: 14,
      rating: 4.88,
      totalRatings: 260,
      calories: 320,
      spicyLevel: 4,
      tags: ['spicy', 'budget-friendly', 'vegetarian'],
      ingredients: ['Exotic Mushrooms', 'Crystal Wrap', 'Sichuan Crisp', 'Spring Onion']
    },

    // Spice Syndicate
    {
      _id: '670000000000000000000107',
      name: 'Shahi Royal Chicken Dum Biryani',
      description: 'Slow clay-pot dum biryani with succulent chicken, caramelized onions, mint, and pure saffron. Served with spiced burani raita and mirchi ka salan.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      price: 369,
      originalPrice: 449,
      category: 'Biryani & Indian Bowls',
      restaurant: '670000000000000000000013',
      isVeg: false,
      isAvailable: true,
      preparationTime: 22,
      rating: 4.9,
      totalRatings: 680,
      calories: 720,
      spicyLevel: 3,
      tags: ['bestseller', 'chef-special', 'signature'],
      ingredients: ['Basmati Rice', 'Chicken', 'Saffron', 'Ghee', 'Biryani Spices']
    },
    {
      _id: '670000000000000000000108',
      name: 'Nizami Paneer Dum Biryani',
      description: 'Marinated cottage cheese cubes layered with fragrant Basmati rice and whole aromatic spices. Served with creamy cucumber mint raita.',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
      price: 319,
      originalPrice: 389,
      category: 'Biryani & Indian Bowls',
      restaurant: '670000000000000000000013',
      isVeg: true,
      isAvailable: true,
      preparationTime: 20,
      rating: 4.82,
      totalRatings: 440,
      calories: 610,
      spicyLevel: 2,
      tags: ['vegetarian', 'bestseller'],
      ingredients: ['Cottage Cheese', 'Basmati Rice', 'Raita', 'Fried Onions']
    },
    {
      _id: '670000000000000000000109',
      name: 'Dal Makhani Slow-Simmered (48 Hours)',
      description: 'Whole black lentils cooked overnight on tandoor embers with butter, cream and sun-dried fenugreek leaves. Comes with 2 butter naans.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      price: 249,
      originalPrice: 299,
      category: 'Biryani & Indian Bowls',
      restaurant: '670000000000000000000013',
      isVeg: true,
      isAvailable: true,
      preparationTime: 15,
      rating: 4.86,
      totalRatings: 520,
      calories: 540,
      spicyLevel: 1,
      tags: ['vegetarian', 'budget-friendly', 'comfort food'],
      ingredients: ['Black Lentils', 'Butter', 'Cream', 'Butter Naan']
    },

    // CyberSlice Pizza
    {
      _id: '670000000000000000000110',
      name: 'Margherita Gold Fior Di Latte Pizza (11")',
      description: 'San Marzano DOP tomato sauce, fresh buffalo mozzarella, fresh basil leaves, extra virgin olive oil and oregano dust.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      price: 379,
      originalPrice: 449,
      category: 'Pizzas & Breads',
      restaurant: '670000000000000000000014',
      isVeg: true,
      isAvailable: true,
      preparationTime: 18,
      rating: 4.9,
      totalRatings: 340,
      calories: 690,
      spicyLevel: 0,
      tags: ['vegetarian', 'bestseller', 'fast food'],
      ingredients: ['Sourdough', 'San Marzano Sauce', 'Mozzarella', 'Basil']
    },
    {
      _id: '670000000000000000000111',
      name: 'Smoky Pepperoni & Hot Honey Crust (11")',
      description: 'Aged pork pepperoni, hot calabrian chili honey drizzle, crushed red pepper flakes and melted scamorza cheese.',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
      price: 469,
      originalPrice: 549,
      category: 'Pizzas & Breads',
      restaurant: '670000000000000000000014',
      isVeg: false,
      isAvailable: true,
      preparationTime: 20,
      rating: 4.88,
      totalRatings: 390,
      calories: 780,
      spicyLevel: 3,
      tags: ['chef-special', 'spicy'],
      ingredients: ['Pepperoni', 'Hot Honey', 'Scamorza', 'Chili Flakes']
    },
    {
      _id: '670000000000000000000112',
      name: 'Garlic Butter Stuffed Crust Breadsticks',
      description: 'Pull-apart oven-baked breadsticks filled with molten mozzarella and brushed with roasted garlic herb butter.',
      image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80',
      price: 179,
      originalPrice: 219,
      category: 'Pizzas & Breads',
      restaurant: '670000000000000000000014',
      isVeg: true,
      isAvailable: true,
      preparationTime: 14,
      rating: 4.75,
      totalRatings: 180,
      calories: 390,
      spicyLevel: 0,
      tags: ['budget-friendly', 'snack', 'vegetarian'],
      ingredients: ['Garlic Butter', 'Mozzarella', 'Herbs', 'Marinara Dip']
    },

    // Vitality Bowl & Green Alchemy
    {
      _id: '670000000000000000000113',
      name: 'Golden Quinoa Avocado Power Bowl',
      description: 'Organic rainbow quinoa, ripe avocado, roasted sweet potatoes, edamame, pumpkin seeds and creamy tahini lemon dressing.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
      price: 299,
      originalPrice: 369,
      category: 'Healthy & Superfoods',
      restaurant: '670000000000000000000015',
      isVeg: true,
      isAvailable: true,
      preparationTime: 12,
      rating: 4.92,
      totalRatings: 280,
      calories: 410,
      spicyLevel: 0,
      tags: ['healthy', 'vegetarian', 'superfoods', 'bestseller'],
      ingredients: ['Avocado', 'Quinoa', 'Sweet Potato', 'Tahini Lemon']
    },
    {
      _id: '670000000000000000000114',
      name: 'Herb-Grilled Citrus Chicken Salad',
      description: 'Sous-vide grilled chicken breast strips, organic baby spinach, cherry tomatoes, walnuts, goat cheese and pomegranate vinaigrette.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      price: 339,
      originalPrice: 399,
      category: 'Healthy & Superfoods',
      restaurant: '670000000000000000000015',
      isVeg: false,
      isAvailable: true,
      preparationTime: 15,
      rating: 4.88,
      totalRatings: 210,
      calories: 380,
      spicyLevel: 0,
      tags: ['healthy', 'protein-rich', 'fitness'],
      ingredients: ['Grilled Chicken', 'Baby Spinach', 'Walnuts', 'Goat Cheese']
    },
    {
      _id: '670000000000000000000115',
      name: 'Spirulina Matcha Antioxidant Smoothie',
      description: 'Cold-pressed almond milk, ceremonial grade Uji matcha, organic spirulina, chia seeds and raw Himalayan honey.',
      image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
      price: 189,
      originalPrice: 229,
      category: 'Healthy & Superfoods',
      restaurant: '670000000000000000000015',
      isVeg: true,
      isAvailable: true,
      preparationTime: 8,
      rating: 4.8,
      totalRatings: 140,
      calories: 220,
      spicyLevel: 0,
      tags: ['healthy', 'budget-friendly', 'beverages'],
      ingredients: ['Uji Matcha', 'Almond Milk', 'Chia Seeds', 'Honey']
    },

    // Midnight Nirvana Desserts
    {
      _id: '670000000000000000000116',
      name: 'Warm Belgian Chocolate Molten Lava Cake',
      description: 'Warm cocoa sponge with an oozing liquid dark chocolate center. Dusted with gold luster and served with vanilla cream.',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
      price: 219,
      originalPrice: 269,
      category: 'Desserts & Sweets',
      restaurant: '670000000000000000000016',
      isVeg: true,
      isAvailable: true,
      preparationTime: 12,
      rating: 4.96,
      totalRatings: 490,
      calories: 460,
      spicyLevel: 0,
      tags: ['bestseller', 'desserts', 'sweet tooth'],
      ingredients: ['Belgian Cocoa', 'Molten Core', 'Vanilla Cream', 'Gold Dust']
    },
    {
      _id: '670000000000000000000117',
      name: 'Basque Burnt Caramel Cheesecake',
      description: 'Caramelized burnt top with an ultra-creamy, custardy center infused with Madagascar bourbon vanilla bean.',
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
      price: 259,
      originalPrice: 319,
      category: 'Desserts & Sweets',
      restaurant: '670000000000000000000016',
      isVeg: true,
      isAvailable: true,
      preparationTime: 10,
      rating: 4.91,
      totalRatings: 320,
      calories: 430,
      spicyLevel: 0,
      tags: ['desserts', 'chef-special'],
      ingredients: ['Cream Cheese', 'Bourbon Vanilla', 'Caramelized Crust']
    },
    {
      _id: '670000000000000000000118',
      name: 'Salted Caramel Hazelnut Thickshake',
      description: 'Creamy gelato blended with roasted Piedmont hazelnuts, sea salt butter caramel and crunchy praline crunchies.',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
      price: 199,
      originalPrice: 249,
      category: 'Desserts & Sweets',
      restaurant: '670000000000000000000016',
      isVeg: true,
      isAvailable: true,
      preparationTime: 8,
      rating: 4.85,
      totalRatings: 230,
      calories: 490,
      spicyLevel: 0,
      tags: ['desserts', 'budget-friendly', 'shake'],
      ingredients: ['Gelato', 'Hazelnut Praline', 'Sea Salt Caramel']
    },

    // Extra Value & Budget Meals under ₹150 for Budget Finder
    {
      _id: '670000000000000000000119',
      name: 'Crispy Veggie Masala Roll',
      description: 'Flaky toasted paratha wrapped around spiced potato croquettes, sliced onions and mint chutney.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
      price: 99,
      originalPrice: 139,
      category: 'Burgers & Wraps',
      restaurant: '670000000000000000000013',
      isVeg: true,
      isAvailable: true,
      preparationTime: 10,
      rating: 4.65,
      totalRatings: 180,
      calories: 310,
      spicyLevel: 2,
      tags: ['budget-friendly', 'vegetarian', 'snack'],
      ingredients: ['Toasted Paratha', 'Spiced Veggies', 'Mint Dip']
    },
    {
      _id: '670000000000000000000120',
      name: 'Egg & Cheese Sunrise Roll',
      description: 'Double fluffy omelette with melted cheddar and caramelized onions in a crisp whole-wheat wrap.',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
      price: 119,
      originalPrice: 159,
      category: 'Burgers & Wraps',
      restaurant: '670000000000000000000013',
      isVeg: false,
      isAvailable: true,
      preparationTime: 10,
      rating: 4.7,
      totalRatings: 140,
      calories: 340,
      spicyLevel: 1,
      tags: ['budget-friendly', 'protein-rich'],
      ingredients: ['Double Eggs', 'Cheddar', 'Whole Wheat Wrap']
    },
    {
      _id: '670000000000000000000121',
      name: 'Mini Saffron Rice & Chana Bowl',
      description: 'Aromatic cumin-saffron rice topped with slow-braised Amritsari chickpea curry and pickled salad.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      price: 139,
      originalPrice: 180,
      category: 'Biryani & Indian Bowls',
      restaurant: '670000000000000000000013',
      isVeg: true,
      isAvailable: true,
      preparationTime: 12,
      rating: 4.75,
      totalRatings: 165,
      calories: 420,
      spicyLevel: 2,
      tags: ['budget-friendly', 'vegetarian', 'healthy'],
      mealType: 'dinner_food',
      ingredients: ['Saffron Rice', 'Amritsari Chana', 'Pickled Salad']
    },
    {
      _id: '670000000000000000000122',
      name: 'Home-Style Dal Tadka & Jeera Rice Thali (Dal Chawal)',
      description: 'Comforting golden yellow toor dal with aromatic garlic-ghee tadka, steamed fragrant jeera rice, spiced aloo jeera, roasted papad and sweet mango pickle.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      price: 179,
      originalPrice: 229,
      category: 'Biryani & Indian Bowls',
      mealType: 'dinner_food',
      restaurant: '670000000000000000000013',
      isVeg: true,
      isAvailable: true,
      preparationTime: 14,
      rating: 4.88,
      totalRatings: 340,
      calories: 520,
      spicyLevel: 1,
      tags: ['dal chawal', 'thali', 'dinner', 'comfort food', 'bestseller', 'vegetarian'],
      ingredients: ['Yellow Dal Tadka', 'Jeera Rice', 'Aloo Jeera', 'Papad', 'Pickle']
    },
    {
      _id: '670000000000000000000123',
      name: 'Royal Maharaja Grand Full Thali',
      description: 'Luxurious 7-dish royal Indian feast: Paneer Lababdar, 24hr Dal Makhani, Dum Biryani Pulao, 2 Tandoori Butter Rotis, Cucumber Boondi Raita, Gulab Jamun, Salad & Mint Chutney.',
      image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=800&q=80',
      price: 329,
      originalPrice: 399,
      category: 'Biryani & Indian Bowls',
      mealType: 'dinner_food',
      restaurant: '670000000000000000000013',
      isVeg: true,
      isAvailable: true,
      preparationTime: 20,
      rating: 4.95,
      totalRatings: 580,
      calories: 820,
      spicyLevel: 2,
      tags: ['full thali', 'thali', 'dinner', 'chef-special', 'royal', 'vegetarian'],
      ingredients: ['Paneer Lababdar', 'Dal Makhani', 'Biryani Rice', 'Butter Rotis', 'Gulab Jamun']
    },
    {
      _id: '670000000000000000000124',
      name: 'Dilli 6 Rajma Chawal & Kachumber Bowl',
      description: 'Melt-in-mouth Kashmiri red kidney beans slow-simmered in rich spiced tomato-onion gravy over hot basmati rice with crunchy kachumber salad and roasted papad.',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
      price: 169,
      originalPrice: 219,
      category: 'Biryani & Indian Bowls',
      mealType: 'dinner_food',
      restaurant: '670000000000000000000013',
      isVeg: true,
      isAvailable: true,
      preparationTime: 12,
      rating: 4.82,
      totalRatings: 290,
      calories: 490,
      spicyLevel: 2,
      tags: ['rajma chawal', 'dal chawal', 'dinner', 'comfort food', 'vegetarian'],
      ingredients: ['Kashmiri Rajma', 'Basmati Rice', 'Kachumber', 'Papad']
    },
    {
      _id: '670000000000000000000125',
      name: 'Desi Butter Chicken & Garlic Naan Feast (Non-Veg Thali)',
      description: 'Tandoor-charred chicken tikka simmered in silky tomato cashew makhani gravy, served with 2 hot garlic butter naans, jeera pulao, spiced onions and mint dip.',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
      price: 379,
      originalPrice: 459,
      category: 'Biryani & Indian Bowls',
      mealType: 'dinner_food',
      restaurant: '670000000000000000000013',
      isVeg: false,
      isAvailable: true,
      preparationTime: 22,
      rating: 4.93,
      totalRatings: 610,
      calories: 790,
      spicyLevel: 2,
      tags: ['thali', 'dinner', 'chicken', 'chef-special', 'non-veg feast'],
      ingredients: ['Chicken Tikka', 'Makhani Gravy', 'Garlic Naan', 'Jeera Pulao']
    },
    {
      _id: '670000000000000000000126',
      name: 'Wok-Tossed Hakka Street Noodles & Manchurian Combo',
      description: 'Classic Indo-Chinese street noodles tossed with shredded bell peppers, spring onions, and crispy vegetable Manchurian balls in spicy dark garlic sauce.',
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
      price: 249,
      originalPrice: 299,
      category: 'Asian & Ramen',
      mealType: 'fast_food',
      restaurant: '670000000000000000000012',
      isVeg: true,
      isAvailable: true,
      preparationTime: 15,
      rating: 4.86,
      totalRatings: 370,
      calories: 560,
      spicyLevel: 3,
      tags: ['fast food', 'noodles', 'asian', 'street food', 'vegetarian'],
      ingredients: ['Hakka Noodles', 'Veg Manchurian', 'Garlic Sauce', 'Spring Onion']
    }
  ];

  // Night Rescue Deals (Fresh surplus food with active expiry deadlines)
  // Let's set expiration timestamps to 4 hours and 6 hours into the future so they are live and active!
  const now = Date.now();
  const nightRescueDeals = [
    {
      _id: '670000000000000000000201',
      food: '670000000000000000000101',
      restaurant: '670000000000000000000011',
      originalPrice: 429,
      rescuePrice: 189,
      discountPercentage: 56,
      totalQuantity: 6,
      remainingQuantity: 4,
      expiresAt: new Date(now + 4 * 60 * 60 * 1000).toISOString(),
      pickupStartTime: '21:30',
      pickupEndTime: '23:45',
      isActive: true,
      dealTitle: 'Late-Night Truffle Smash Surplus Batch'
    },
    {
      _id: '670000000000000000000202',
      food: '670000000000000000000107',
      restaurant: '670000000000000000000013',
      originalPrice: 449,
      rescuePrice: 199,
      discountPercentage: 55,
      totalQuantity: 8,
      remainingQuantity: 5,
      expiresAt: new Date(now + 5 * 60 * 60 * 1000).toISOString(),
      pickupStartTime: '22:00',
      pickupEndTime: '23:59',
      isActive: true,
      dealTitle: 'Royal Dum Handi Evening Surplus'
    },
    {
      _id: '670000000000000000000203',
      food: '670000000000000000000110',
      restaurant: '670000000000000000000014',
      originalPrice: 449,
      rescuePrice: 179,
      discountPercentage: 60,
      totalQuantity: 5,
      remainingQuantity: 3,
      expiresAt: new Date(now + 3 * 60 * 60 * 1000).toISOString(),
      pickupStartTime: '21:00',
      pickupEndTime: '23:30',
      isActive: true,
      dealTitle: 'Artisan Woodfire Margherita Sourdough Tray'
    },
    {
      _id: '670000000000000000000204',
      food: '670000000000000000000116',
      restaurant: '670000000000000000000016',
      originalPrice: 269,
      rescuePrice: 109,
      discountPercentage: 59,
      totalQuantity: 7,
      remainingQuantity: 4,
      expiresAt: new Date(now + 6 * 60 * 60 * 1000).toISOString(),
      pickupStartTime: '22:30',
      pickupEndTime: '01:00',
      isActive: true,
      dealTitle: 'Belgian Molten Cake Evening Patisserie Surplus'
    }
  ];

  const coupons = [
    {
      _id: '670000000000000000000301',
      code: 'MEALIFY50',
      discountPercent: 50,
      maxDiscount: 150,
      minOrder: 199,
      description: '50% OFF up to ₹150 on orders above ₹199',
      isActive: true,
      expiresAt: new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: '670000000000000000000302',
      code: 'NIGHTRESCUE',
      discountPercent: 20,
      maxDiscount: 100,
      minOrder: 150,
      description: 'Extra 20% OFF on all surplus rescue orders',
      isActive: true,
      expiresAt: new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: '670000000000000000000303',
      code: 'GOLD100',
      discountPercent: 30,
      maxDiscount: 200,
      minOrder: 499,
      description: 'Flat ₹100-200 savings for feast orders above ₹499',
      isActive: true,
      expiresAt: new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const reviews = [
    {
      _id: '670000000000000000000401',
      user: '670000000000000000000001',
      restaurant: '670000000000000000000011',
      food: '670000000000000000000101',
      rating: 5,
      comment: 'The Truffle Glaze Smash Burger is otherworldly! Crispy edges, juicy patty and decadent truffle aroma.',
      userName: 'Alex Mercer',
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: '670000000000000000000402',
      user: '670000000000000000000004',
      restaurant: '670000000000000000000013',
      food: '670000000000000000000107',
      rating: 5,
      comment: 'Best Dum Biryani in town. Saffron aroma filled the entire room as soon as I opened the clay handi packaging.',
      userName: 'Sarah Jenkins',
      createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Seed sample initial completed order for Alex so he has order history to view or reorder!
  const orders = [
    {
      _id: '670000000000000000000501',
      orderNumber: 'MLF-80921',
      customer: '670000000000000000000001',
      restaurant: '670000000000000000000011',
      restaurantName: 'The Golden Truffle & Smokehouse',
      items: [
        {
          food: '670000000000000000000101',
          name: 'Truffle Glaze Double Smash Burger',
          price: 349,
          quantity: 1,
          isVeg: false,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80'
        },
        {
          food: '670000000000000000000103',
          name: 'Parmesan Truffle Loaded Fries',
          price: 189,
          quantity: 1,
          isVeg: true,
          image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=300&q=80'
        }
      ],
      subtotal: 538,
      deliveryFee: 39,
      tax: 27,
      couponCode: 'MEALIFY50',
      discount: 150,
      totalAmount: 454,
      deliveryAddress: {
        label: 'Home',
        street: 'Apt 402, Cyber Tower 3, High-Tech City',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560001',
        phone: '+91 98765 43210'
      },
      paymentMethod: 'card',
      paymentStatus: 'completed',
      orderStatus: 'delivered',
      deliveryPartner: '670000000000000000000003',
      deliveryPartnerName: 'Vikram Singh',
      deliveryPartnerPhone: '+91 98444 55566',
      estimatedDeliveryMinutes: 25,
      statusHistory: [
        { status: 'order_placed', timestamp: new Date(now - 120 * 60 * 1000).toISOString(), note: 'Order placed by customer' },
        { status: 'order_accepted', timestamp: new Date(now - 115 * 60 * 1000).toISOString(), note: 'Restaurant confirmed order' },
        { status: 'preparing_food', timestamp: new Date(now - 105 * 60 * 1000).toISOString(), note: 'Chef Marco is preparing food' },
        { status: 'ready_for_pickup', timestamp: new Date(now - 90 * 60 * 1000).toISOString(), note: 'Food packed and ready' },
        { status: 'picked_up', timestamp: new Date(now - 80 * 60 * 1000).toISOString(), note: 'Rider Vikram picked up package' },
        { status: 'out_for_delivery', timestamp: new Date(now - 60 * 60 * 1000).toISOString(), note: 'Rider heading to address' },
        { status: 'delivered', timestamp: new Date(now - 40 * 60 * 1000).toISOString(), note: 'Delivered to customer doorstep' }
      ],
      createdAt: new Date(now - 120 * 60 * 1000).toISOString()
    }
  ];

  return {
    users,
    categories,
    restaurants,
    foods,
    nightRescueDeals,
    coupons,
    reviews,
    orders
  };
}

module.exports = { getSeedData };

