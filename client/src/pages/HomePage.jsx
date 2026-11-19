import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Utensils, 
  Star, 
  ShieldCheck, 
  Users, 
  Tag, 
  HeartHandshake, 
  Zap,
  Percent
} from 'lucide-react';
import { api } from '../services/api';
import Hero3D from '../components/Hero3D';
import FoodCard3D from '../components/FoodCard3D';
import RestaurantCard from '../components/RestaurantCard';
import NightRescueSection from '../components/NightRescueSection';
import BudgetMealFinderSection from '../components/BudgetMealFinderSection';

export default function HomePage({ onOpenAI, onOpenGroup }) {
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [trendingFoods, setTrendingFoods] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [catRes, restRes, foodRes, coupRes] = await Promise.all([
          api.getCategories(),
          api.getRestaurants({ isPromoted: 'true' }),
          api.getTrendingFoods(),
          api.getCoupons()
        ]);

        if (catRes.success) setCategories(catRes.categories || []);
        if (restRes.success) setRestaurants(restRes.restaurants || []);
        if (foodRes.success) setTrendingFoods(foodRes.foods || []);
        if (coupRes.success) setCoupons(coupRes.coupons || []);
      } catch (err) {
        console.warn('Error loading home data:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-16">
      
      {/* 1. Hero 3D Section */}
      <Hero3D onOpenAI={onOpenAI} />

      {/* 2. Food Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
              Curated Menus
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F8F5EF] tracking-tight">
              Explore Cravings
            </h2>
          </div>
          <Link
            to="/restaurants"
            className="text-xs font-bold text-[#FFC857] hover:text-[#FF9F1C] flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/restaurants?cuisine=${encodeURIComponent(cat.slug)}`}
              className="group p-4 rounded-2xl bg-[#171717] border border-white/5 hover:border-[#FF9F1C]/40 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FF9F1C]/10 backdrop-blur-md"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {cat.icon || '🍽️'}
              </div>
              <h4 className="font-bold text-xs text-[#F8F5EF] group-hover:text-[#FFC857] transition-colors truncate">
                {cat.name}
              </h4>
              <p className="text-[10px] text-[#777777] line-clamp-1 mt-0.5">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Unique Feature 1: Night Rescue Section */}
      <NightRescueSection />

      {/* 4. Trending 3D Dishes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF9F1C] mb-1">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Chef Specials & Hot Picks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F8F5EF] tracking-tight">
              Trending Gourmet Creations
            </h2>
          </div>
          <Link
            to="/restaurants"
            className="text-xs font-bold text-[#FFC857] hover:text-[#FF9F1C] flex items-center gap-1 group"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingFoods.slice(0, 8).map((food) => (
            <FoodCard3D key={food._id} food={food} />
          ))}
        </div>
      </section>

      {/* 5. Unique Feature 2: Smart Budget Meal Finder */}
      <BudgetMealFinderSection />

      {/* 6. Popular / Promoted Partner Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
              Elite Kitchens
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F8F5EF] tracking-tight">
              Top Rated Partner Restaurants
            </h2>
          </div>
          <Link
            to="/restaurants"
            className="text-xs font-bold text-[#FFC857] hover:text-[#FF9F1C] flex items-center gap-1 group"
          >
            <span>See All Restaurants</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.slice(0, 6).map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* 7. Unique Feature 4 & 3 Interactive Dual Banners (AI Craving & Group Order) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Banner 1: AI Food Craving Assistant */}
          <div className="relative rounded-3xl p-8 bg-gradient-to-br from-[#1d1912] to-[#121212] border border-[#FF9F1C]/30 shadow-2xl overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9F1C]/15 blur-3xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9F1C]/20 border border-[#FF9F1C]/40 text-xs font-bold text-[#FFC857]">
                <Sparkles className="w-3.5 h-3.5 text-[#FF9F1C]" />
                <span>AI Craving Matcher</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#F8F5EF] leading-tight">
                Not Sure What To Eat? <br />
                <span className="text-[#FFC857]">Ask The MEALIFY AI</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                Describe your mood, exact budget, or taste preferences in plain words. Our culinary AI scans live menus to surface precision recommendations with 1-click cart addition.
              </p>
            </div>
            <div className="pt-6 relative z-10">
              <button
                onClick={onOpenAI}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#FF9F1C]/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Tell Us What You're Craving</span>
              </button>
            </div>
          </div>

          {/* Banner 2: Group Ordering Feature */}
          <div className="relative rounded-3xl p-8 bg-gradient-to-br from-[#121a18] to-[#121212] border border-emerald-500/25 shadow-2xl overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-xs font-bold text-emerald-400">
                <Users className="w-3.5 h-3.5" />
                <span>Collaborative Dining</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#F8F5EF] leading-tight">
                Ordering With Friends? <br />
                <span className="text-emerald-400">Launch a Group Cart</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                Create a shared room, invite friends with a single click, let everyone pick their favorite dishes, and choose between individual bill splitting or a single host payment.
              </p>
            </div>
            <div className="pt-6 relative z-10">
              <button
                onClick={onOpenGroup}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-[#101010] font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Create Shared Group Room</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Special Offers & Verified Coupons Marquee */}
      {coupons.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-3xl bg-[#171717] border border-white/8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF9F1C]/20 border border-[#FF9F1C]/40 flex items-center justify-center text-[#FFC857]">
                <Percent className="w-6 h-6 text-[#FF9F1C]" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#F8F5EF]">
                  Active Promo Codes & Savings
                </h4>
                <p className="text-xs text-[#A5A5A5]">
                  Apply directly at checkout for instant savings
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="px-4 py-2 rounded-xl bg-black/60 border border-dashed border-[#FFC857]/40 flex items-center gap-2"
                >
                  <span className="font-mono text-xs font-black text-[#FFC857] tracking-wider">
                    {c.code}
                  </span>
                  <span className="text-[11px] text-[#A5A5A5]">
                    ({c.description})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
            Verified Foodies
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#F8F5EF] mt-1 tracking-tight">
            Loved By 50,000+ Gastronomes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#171717] border border-white/5 space-y-4">
            <div className="flex text-[#FFC857]">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-[#A5A5A5] leading-relaxed italic">
              "Night Rescue is pure genius. I claimed a 16-hour slow-cooked Dum Biryani surplus at 55% off. Hot, fresh, and saved good food from being tossed!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Alex M."
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="text-xs font-bold text-[#F8F5EF]">Alex Mercer</div>
                <div className="text-[10px] text-[#777777]">Bengaluru • 42 Orders</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#171717] border border-white/5 space-y-4">
            <div className="flex text-[#FFC857]">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-[#A5A5A5] leading-relaxed italic">
              "The 3D design and AI assistant are miles ahead of other apps. I typed 'healthy dinner under 300' and it gave me an amazing Quinoa Power Bowl within budget."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                alt="Sarah J."
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="text-xs font-bold text-[#F8F5EF]">Sarah Jenkins</div>
                <div className="text-[10px] text-[#777777]">Indiranagar • 19 Orders</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#171717] border border-white/5 space-y-4">
            <div className="flex text-[#FFC857]">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-[#A5A5A5] leading-relaxed italic">
              "Group ordering made office team lunches effortless. Shared the link in Slack, everyone selected their items in 5 minutes, and no more collecting money manually."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                alt="David Z."
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="text-xs font-bold text-[#F8F5EF]">David Zhao</div>
                <div className="text-[10px] text-[#777777]">Tech Park • 27 Orders</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

