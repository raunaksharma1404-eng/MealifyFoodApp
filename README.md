# MEALIFY — Premium 3D Food Delivery Platform

MEALIFY is a full-stack, production-minded food delivery web application built with a **3D Neo-Futuristic** visual identity, intelligent grounded recommendations, real-time order tracking, and four distinctive food-tech features.

---

## 🌟 Visual Design System

- **Background:** Deep charcoal / near-black (`#101010`)
- **Secondary Background:** Dark graphite (`#191919`)
- **Primary Accent:** Golden orange (`#FF9F1C`)
- **Secondary Accent:** Warm gold (`#FFC857`)
- **Text:** Warm white (`#F8F5EF`)
- **Secondary Text:** Muted grey (`#A5A5A5`)
- **Success:** Emerald green (`#10B981`)
- **Error:** Soft red (`#EF4444`)
- **3D Elements:** Realistic floating food ingredients (chili peppers, organic basil, Hass avocado), glowing concentric 3D rings, 3D chef mascot with golden MEALIFY 'M' emblem, glossy glassmorphism (`backdrop-blur-xl`), and depth-based transitions.

---

## 🚀 The 4 Unique Features

### 1. 🌙 Night Rescue — *"Save Food. Save Money."*
- Helps partner restaurants sell genuine surplus fresh food at **40% to 65% discount** before closing hours.
- Live countdown timers, remaining quantity progress bar, and pickup deadlines.
- Automatically decrements surplus quantity upon ordering and deactivates expired deals.
- Dedicated restaurant controls to activate surplus batches.

### 2. 💰 Smart Budget Meal Finder — *"Eat What You Love. Within Your Budget."*
- Dynamic budget slider from **₹50 to ₹500**.
- Preference filters: Pure Veg, Non-Veg, Fast Food, Healthy/Superfoods, or All Cravings.
- Algorithmic combo pairing: automatically pairs complementary dishes (e.g. Burger + Truffle Fries, Biryani + Raita) strictly under the target spend.
- Exact remaining budget calculation for every item.

### 3. 👥 Group Ordering — *"Good Food Is Better Together."*
- Allows multiple diners to create or join a shared ordering room via code (e.g. `GRP-4819`) or direct shareable URL.
- Live shared cart with real-time member item lists, individual subtotals, and group countdown deadline.
- Flexible settlement: **Host Pays Everything** vs. **Individual Split** with paid/unpaid tracking.
- Only the host can finalize and close the group order for checkout.

### 4. 🤖 Advanced AI Food Assistant — *"Tell Us What You're Craving."*
- Specialized food-recommendation AI engine capable of natural language understanding:
  - *"I have ₹150. Suggest something filling."*
  - *"I want spicy vegetarian food."*
  - *"Suggest a healthy high-protein dinner."*
  - *"I want pizza under ₹300."*
- **Strictly Grounded in Real Kitchen Data:** Never hallucinates fake dishes or prices. Queries available menu items and calculates nutrition/spice matches with 1-click Add to Cart.

---

## 🎭 3 Role-Based Experiences & Demo Logins

The application includes an instant **1-Click Demo Persona Switcher** in the top navigation bar:

| Role | Persona Name | Email | Credentials | Dedicated Dashboard |
|---|---|---|---|---|
| **Customer** | Alex Mercer | `alex@mealify.com` | `password123` | Browsing, Cart, Checkout, 7-Stage Tracking, Reviews |
| **Restaurant Admin** | Chef Marco Rossi | `chef@mealify.com` | `password123` | `/admin` — Kitchen orders pipeline, Menu CRUD, Night Rescue manager |
| **Delivery Partner** | Vikram Singh | `rider@mealify.com` | `password123` | `/delivery` — Available deliveries queue, Accept, Pickup, Out for Delivery, Delivered |

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router DOM, Framer Motion, Lucide React
- **Backend:** Node.js, Express.js REST APIs
- **Database:** MongoDB & Mongoose with zero-config instant In-Memory Database Engine and MongoDB Atlas URI support
- **Authentication:** bcrypt password hashing, JSON Web Tokens (JWT), role-based middleware
- **AI Integration:** Grounded NLP intent parser with optional Google Gemini API support

---

## 🏁 Quick Start & Setup

### 1. Install Dependencies
```bash
# Install root orchestration
npm install

# Install client packages
cd client && npm install && cd ..

# Install server packages
cd server && npm install && cd ..
```

### 2. Run Both Frontend and Backend Concurrently
```bash
npm run dev
```
- **Frontend Application:** [http://localhost:5173](http://localhost:5173)
- **Backend REST API:** [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 3. Run Automated Integration Test Suite
```bash
node server/test/e2e-test.js
```
*Executes all 35 end-to-end integration tests covering authentication, database seeding, menu discovery, all 4 unique features, checkout validation, and 7-stage order tracking.*

---

## 📦 Project Structure

```
MealifyApp/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Brand logo, role switcher, navigation, cart count
│   │   │   ├── Footer.jsx               # Neo-futuristic footer with links & badges
│   │   │   ├── Hero3D.jsx               # 3D chef mascot, floating ingredients, search bar
│   │   │   ├── FoodCard3D.jsx           # 3D interactive tilt dish card with quick add
│   │   │   ├── RestaurantCard.jsx       # Restaurant card with rating & delivery time
│   │   │   ├── NightRescueSection.jsx   # Dark-gold surplus food deals section
│   │   │   ├── BudgetMealFinderSection.jsx # Slider-based meal & combo finder
│   │   │   ├── AIAssistantModal.jsx     # AI Food Assistant chat dialog
│   │   │   ├── GroupOrderModal.jsx      # Room creator & invitation code joiner
│   │   │   └── OrderTimeline.jsx        # 7-stage visual order tracking stepper
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── RestaurantsPage.jsx
│   │   │   ├── RestaurantDetailPage.jsx
│   │   │   ├── FoodDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderConfirmationPage.jsx
│   │   │   ├── OrderTrackingPage.jsx
│   │   │   ├── OrderHistoryPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── NightRescuePage.jsx
│   │   │   ├── BudgetFinderPage.jsx
│   │   │   ├── GroupOrderPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   └── DeliveryDashboardPage.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   └── services/
│   │       └── api.js                   # Client REST API adapter
│   └── index.html
├── server/
│   ├── config/
│   │   └── db.js                        # Database connector (MongoDB / In-Memory engine)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── restaurantController.js
│   │   ├── foodController.js
│   │   ├── orderController.js
│   │   ├── nightRescueController.js
│   │   ├── budgetController.js
│   │   ├── groupOrderController.js
│   │   ├── aiAssistantController.js
│   │   ├── adminController.js
│   │   ├── deliveryController.js
│   │   ├── couponController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── auth.js                      # JWT verification & role authorization
│   │   └── errorHandler.js
│   ├── models/
│   │   └── index.js                     # Unified Model Manager
│   ├── routes/                          # Express REST API routes
│   ├── seed/
│   │   ├── seedData.js                  # Realistic culinary demo seed data
│   │   └── seedRunner.js
│   ├── test/
│   │   └── e2e-test.js                  # Comprehensive automated test suite
│   ├── server.js                        # Express server entry point
│   ├── .env.example
│   └── .env
└── package.json                         # Root orchestration scripts
```

---

## 🔒 Security & Validation Highlights

- **Backend-Enforced Calculations:** Order totals, discounts, delivery fees, and taxes are strictly calculated and validated on the backend. Frontend prices are never blindly trusted.
- **Stock & Surplus Guard:** Night Rescue deals decrement available units immediately upon placement. Overselling is prevented.
- **Role-Based Access Control:** Admin APIs require `restaurant_admin` or `admin` role; delivery partner APIs require `delivery_partner` role. Ordinary customers cannot manipulate kitchen status or access private endpoints.
- **Protected Environment Credentials:** Environment variables are managed via `.env` with a complete `.env.example` template provided. Secrets are never exposed to client bundles.

