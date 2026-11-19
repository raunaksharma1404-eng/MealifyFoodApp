import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Clock, ArrowRight, Sparkles, AlertCircle, ShoppingBag, Check } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export default function NightRescueSection() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem, items } = useCart();
  const [addedIds, setAddedIds] = useState({});

  useEffect(() => {
    async function fetchDeals() {
      try {
        const res = await api.getNightRescueDeals();
        if (res.success) {
          setDeals(res.deals || []);
        }
      } catch (err) {
        console.warn('Failed to fetch Night Rescue deals:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDeals();
  }, []);

  function handleClaim(deal) {
    if (!deal.food) return;
    const foodItem = {
      ...deal.food,
      restaurant: deal.restaurant
    };
    const success = addItem(foodItem, 1, deal);
    if (success !== false) {
      setAddedIds(prev => ({ ...prev, [deal._id]: true }));
      setTimeout(() => {
        setAddedIds(prev => ({ ...prev, [deal._id]: false }));
      }, 1500);
    }
  }

  if (!loading && deals.length === 0) {
    return null; // Don't show if no active surplus deals
  }

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Dark-Gold Themed Container with Glow */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#1d1810] via-[#141414] to-[#121212] border border-[#FFC857]/30 shadow-2xl shadow-black/80 overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF9F1C]/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFC857]/5 blur-3xl pointer-events-none rounded-full" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-white/5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF9F1C]/15 border border-[#FF9F1C]/35 text-[#FFC857] text-xs font-black uppercase tracking-wider">
              <Moon className="w-3.5 h-3.5 text-[#FF9F1C]" />
              <span>Zero-Waste Night Rescue</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#F8F5EF] tracking-tight">
              Save Food. <span className="bg-gradient-to-r from-[#FFC857] to-[#FF9F1C] bg-clip-text text-transparent">Save Money.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#A5A5A5] max-w-xl">
              Authentic surplus batches fresh from top partner kitchens at 40% to 65% off. Every rescue meal claimed directly prevents delicious food from going to waste.
            </p>
          </div>

          <Link
            to="/night-rescue"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#FFC857] hover:text-[#FF9F1C] transition-colors self-start md:self-end group"
          >
            <span>View All Surplus Deals ({deals.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Deals Cards Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.slice(0, 4).map((deal) => {
            const food = deal.food;
            if (!food) return null;
            const isAdded = !!addedIds[deal._id];

            return (
              <div
                key={deal._id}
                className="group relative rounded-2xl bg-[#1a1714]/90 border border-[#FFC857]/20 hover:border-[#FF9F1C] p-3.5 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF9F1C]/15 flex flex-col justify-between backdrop-blur-md"
              >
                {/* Image & Surplus Badge */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black mb-3">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Discount percentage badge */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] text-[11px] font-black shadow-lg">
                    {deal.discountPercentage}% OFF
                  </div>

                  {/* Pickup deadline */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-[#E0E0E0] bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                    <span className="flex items-center gap-1 text-[#FFC857]">
                      <Clock className="w-3 h-3" /> Pickup by {deal.pickupEndTime || '23:45'}
                    </span>
                    <span className="text-[#A5A5A5]">Tonight</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-[#FFC857] font-semibold truncate">
                      {deal.restaurant?.name || 'Gourmet Kitchen'}
                    </div>
                    <h4 className="font-bold text-sm text-[#F8F5EF] line-clamp-1 group-hover:text-[#FFC857] transition-colors">
                      {food.name}
                    </h4>
                    <p className="text-[11px] text-[#888888] line-clamp-1 mt-0.5">
                      {deal.dealTitle || food.description}
                    </p>
                  </div>

                  {/* Stock remaining progress bar */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-[#A5A5A5]">Surplus Left</span>
                      <span className="font-bold text-[#FFC857]">
                        {deal.remainingQuantity} of {deal.totalQuantity} units
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] rounded-full transition-all"
                        style={{
                          width: `${Math.max(15, (deal.remainingQuantity / deal.totalQuantity) * 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Price & Claim Button */}
                  <div className="pt-2 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold text-[#FFC857]">
                        ₹{deal.rescuePrice}
                      </span>
                      <span className="text-xs text-[#666666] line-through">
                        ₹{deal.originalPrice}
                      </span>
                    </div>

                    <button
                      onClick={() => handleClaim(deal)}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-500 text-[#101010]'
                          : 'bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] hover:brightness-110 shadow-lg shadow-[#FF9F1C]/20'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Rescued</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Claim</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

