import React, { useState, useEffect } from 'react';
import { Moon, Clock, Sparkles, Check, ShoppingBag, ShieldCheck, Leaf, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export default function NightRescuePage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vegOnly, setVegOnly] = useState(false);
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState({});

  useEffect(() => {
    async function loadDeals() {
      setLoading(true);
      try {
        const res = await api.getNightRescueDeals();
        if (res.success) {
          setDeals(res.deals || []);
        }
      } catch (err) {
        console.warn('Error loading deals:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
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

  const filteredDeals = deals.filter(deal => {
    if (vegOnly && !deal.food?.isVeg) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Dark Gold Themed Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#231a0e] via-[#161410] to-[#101010] border border-[#FFC857]/30 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF9F1C]/15 blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF9F1C]/20 border border-[#FF9F1C]/40 text-xs font-black uppercase tracking-wider text-[#FFC857]">
            <Moon className="w-4 h-4 text-[#FF9F1C]" />
            <span>Zero-Waste Night Rescue</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#F8F5EF] tracking-tight leading-tight">
            Save Food. <span className="bg-gradient-to-r from-[#FFC857] to-[#FF9F1C] bg-clip-text text-transparent">Save Money.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#A5A5A5] leading-relaxed">
            Every evening, partner restaurants prepare small extra batches to guarantee availability. Night Rescue lets food lovers claim these gourmet creations at 40% to 65% off before closing hours.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Leaf className="w-3.5 h-3.5" /> 100% Edible & Fresh
            </span>
            <span className="flex items-center gap-1.5 text-[#FFC857] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Chef Verified Safety
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#171717] border border-white/8">
        <div className="text-xs font-bold text-[#A5A5A5]">
          Available Rescue Batches: <span className="text-[#FFC857] font-black">{filteredDeals.length}</span>
        </div>

        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            vegOnly
              ? 'bg-emerald-500 text-[#101010] shadow'
              : 'bg-white/5 text-[#A5A5A5] hover:bg-white/10'
          }`}
        >
          {vegOnly ? '✓ Vegetarian Only' : 'Filter Vegetarian'}
        </button>
      </div>

      {/* Grid of Surplus Deals */}
      {loading ? (
        <div className="py-20 text-center text-sm text-[#A5A5A5]">
          Loading active surplus batches...
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="text-3xl">🌙</div>
          <h3 className="text-base font-bold text-[#F8F5EF]">All Night Rescue deals claimed!</h3>
          <p className="text-xs text-[#888888]">
            Check back later this evening as kitchens activate their next surplus batches.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDeals.map((deal) => {
            const food = deal.food;
            if (!food) return null;
            const isAdded = !!addedIds[deal._id];

            return (
              <div
                key={deal._id}
                className="group relative rounded-2xl bg-[#1a1714] border border-[#FFC857]/20 hover:border-[#FF9F1C] p-3.5 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FF9F1C]/15 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black mb-3">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] text-[11px] font-black">
                    {deal.discountPercentage}% OFF
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-[#E0E0E0] bg-black/75 px-2 py-1 rounded-lg">
                    <span className="flex items-center gap-1 text-[#FFC857]">
                      <Clock className="w-3 h-3" /> Pickup by {deal.pickupEndTime || '23:45'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-[#FFC857] font-semibold truncate">
                      {deal.restaurant?.name || 'Kitchen'}
                    </div>
                    <h4 className="font-bold text-sm text-[#F8F5EF] line-clamp-1">
                      {food.name}
                    </h4>
                    <p className="text-[11px] text-[#888888] line-clamp-2 mt-0.5">
                      {food.description}
                    </p>
                  </div>

                  {/* Stock progress */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-[#A5A5A5]">Surplus Left</span>
                      <span className="font-bold text-[#FFC857]">
                        {deal.remainingQuantity} units remaining
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] rounded-full"
                        style={{
                          width: `${Math.max(15, (deal.remainingQuantity / deal.totalQuantity) * 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Price & Add */}
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
                          <span>Claimed</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Claim Surplus</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

