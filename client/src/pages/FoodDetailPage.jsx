import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Flame, 
  Plus, 
  Minus, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  Utensils 
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import FoodCard3D from '../components/FoodCard3D';

export default function FoodDetailPage() {
  const { id } = useParams();
  const { addItem, items, updateQuantity } = useCart();

  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedFoods, setRelatedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    async function loadFood() {
      setLoading(true);
      try {
        const res = await api.getFoodById(id);
        if (res.success) {
          setFood(res.food);
          setReviews(res.reviews || []);
          setRelatedFoods(res.relatedFoods || []);
        }
      } catch (err) {
        console.warn('Error loading food:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadFood();
  }, [id]);

  function handleAddToCart() {
    if (!food) return;
    const success = addItem(food, quantity);
    if (success !== false) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#A5A5A5]">
        Loading gourmet creation details...
      </div>
    );
  }

  if (!food) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#F8F5EF]">Dish Not Found</h2>
        <Link to="/restaurants" className="px-4 py-2 rounded-xl bg-[#FF9F1C] text-[#101010] text-xs font-bold inline-block">
          Return to Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back button */}
      <Link
        to={food.restaurant?._id ? `/restaurant/${food.restaurant._id}` : '/restaurants'}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#A5A5A5] hover:text-[#FFC857] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {food.restaurant?.name || 'Restaurant'}</span>
      </Link>

      {/* Main 3D Dish Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: 3D Product Presentation */}
        <div className="lg:col-span-7 rounded-3xl overflow-hidden bg-[#161616] border border-white/10 p-4 shadow-2xl">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

            {/* Veg / Non-Veg Tag */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10">
              <span className={`w-3 h-3 rounded-full ${food.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="text-xs font-bold text-[#F8F5EF]">
                {food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            </div>

            {/* Rating */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-[#FFC857]/30 text-[#FFC857] text-xs font-black">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{food.rating}</span>
            </div>
          </div>
        </div>

        {/* Right: Dish Specs, Nutritional Info & Add to Cart */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
              {food.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#F8F5EF] tracking-tight mt-1">
              {food.name}
            </h1>
            <p className="text-sm text-[#A5A5A5] mt-2 leading-relaxed">
              {food.description}
            </p>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-[#191919] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#A5A5A5] uppercase font-bold">Standard Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#FFC857]">
                  ₹{food.price}
                </span>
                {food.originalPrice && food.originalPrice > food.price && (
                  <span className="text-sm text-[#666666] line-through">
                    ₹{food.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Controller */}
            <div className="flex items-center gap-3 bg-[#121212] border border-white/10 rounded-xl px-3 py-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 rounded flex items-center justify-center text-[#A5A5A5] hover:text-white"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-black text-sm text-[#FFC857] min-w-[16px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-6 h-6 rounded flex items-center justify-center text-[#FF9F1C] hover:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#181818] border border-white/5 text-center">
              <Clock className="w-4 h-4 text-[#FF9F1C] mx-auto mb-1" />
              <div className="text-xs font-bold text-[#F8F5EF]">{food.preparationTime} Mins</div>
              <div className="text-[10px] text-[#888888]">Cook Time</div>
            </div>
            <div className="p-3 rounded-xl bg-[#181818] border border-white/5 text-center">
              <Flame className="w-4 h-4 text-red-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-[#F8F5EF]">{food.calories || 450} kcal</div>
              <div className="text-[10px] text-[#888888]">Energy</div>
            </div>
            <div className="p-3 rounded-xl bg-[#181818] border border-white/5 text-center">
              <Utensils className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-[#F8F5EF]">
                Level {food.spicyLevel || 1}/5
              </div>
              <div className="text-[10px] text-[#888888]">Spice Heat</div>
            </div>
          </div>

          {/* Ingredients */}
          {food.ingredients && food.ingredients.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#A5A5A5] mb-2">
                Curated Ingredients
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {food.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[#E0E0E0]"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              justAdded
                ? 'bg-emerald-500 text-[#101010]'
                : 'bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] hover:brightness-110 shadow-xl shadow-[#FF9F1C]/25'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-5 h-5" />
                <span>Added To Cart (₹{food.price * quantity})</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Add {quantity} to Cart (₹{food.price * quantity})</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Related Dishes */}
      {relatedFoods.length > 0 && (
        <div className="pt-10 border-t border-white/10 space-y-6">
          <h3 className="text-xl font-black text-[#F8F5EF]">
            More in {food.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedFoods.map((rel) => (
              <FoodCard3D key={rel._id} food={rel} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

