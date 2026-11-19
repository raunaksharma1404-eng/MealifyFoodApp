import React, { useState, useEffect } from 'react';
import { Sliders, Sparkles, Plus, Check, Layers, ArrowRight, DollarSign } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export default function BudgetFinderPage() {
  const [budget, setBudget] = useState(200);
  const [preference, setPreference] = useState('any');
  const [sortBy, setSortBy] = useState('best-value');
  const [results, setResults] = useState({ items: [], combos: [] });
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState({});

  useEffect(() => {
    let cancel = false;
    async function loadBudgetMeals() {
      setLoading(true);
      try {
        const res = await api.findBudgetMeals({ budget, preference, sortBy });
        if (!cancel && res.success) {
          setResults({ items: res.items || [], combos: res.combos || [] });
        }
      } catch (err) {
        console.warn('Error fetching budget meals:', err.message);
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    const timer = setTimeout(loadBudgetMeals, 150);
    return () => {
      cancel = true;
      clearTimeout(timer);
    };
  }, [budget, preference, sortBy]);

  function handleAddDish(dish) {
    const success = addItem(dish, 1);
    if (success !== false) {
      setAddedIds(prev => ({ ...prev, [dish._id]: true }));
      setTimeout(() => setAddedIds(prev => ({ ...prev, [dish._id]: false })), 1200);
    }
  }

  function handleAddCombo(combo) {
    let allAdded = true;
    for (const item of combo.items) {
      const ok = addItem(item, 1);
      if (ok === false) {
        allAdded = false;
        break;
      }
    }
    if (allAdded) {
      setAddedIds(prev => ({ ...prev, [combo.id]: true }));
      setTimeout(() => setAddedIds(prev => ({ ...prev, [combo.id]: false })), 1200);
    }
  }

  const preferenceTabs = [
    { id: 'any', label: 'All Cravings' },
    { id: 'veg', label: 'Pure Veg 🌱' },
    { id: 'non-veg', label: 'Non-Veg 🍗' },
    { id: 'fast-food', label: 'Fast Food 🍟' },
    { id: 'healthy', label: 'Healthy & Superfoods 🥗' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#FFC857] uppercase tracking-wider mb-2">
          <Sliders className="w-3.5 h-3.5 text-[#FF9F1C]" />
          <span>Smart Budget Discovery</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#F8F5EF] tracking-tight">
          Eat What You Love. <span className="bg-gradient-to-r from-[#FFC857] to-[#FF9F1C] bg-clip-text text-transparent">Within Your Budget.</span>
        </h1>
        <p className="text-sm text-[#A5A5A5] mt-1 max-w-xl">
          Set your exact meal budget between ₹50 and ₹500. We curate individual items and pairing combos with zero hidden charges.
        </p>
      </div>

      {/* Control Studio Box */}
      <div className="p-6 rounded-3xl bg-[#171717] border border-white/10 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Slider */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A5A5A5]">
                Target Budget Limit
              </span>
              <span className="text-3xl font-black text-[#FFC857] bg-black/60 px-4 py-1.5 rounded-2xl border border-white/10">
                ₹{budget}
              </span>
            </div>

            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-[#FF9F1C] cursor-pointer h-2.5 bg-black/60 rounded-lg"
            />

            <div className="flex justify-between text-xs text-[#666666] font-semibold">
              <span>₹50</span>
              <span>₹150</span>
              <span>₹250</span>
              <span>₹350</span>
              <span>₹500</span>
            </div>
          </div>

          {/* Sort By Filter */}
          <div className="md:col-span-6 flex flex-col md:items-end space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A5A5A5]">
              Recommendation Algorithm
            </span>
            <div className="flex rounded-xl bg-[#121212] p-1 border border-white/10">
              <button
                onClick={() => setSortBy('best-value')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'best-value'
                    ? 'bg-[#FF9F1C] text-[#101010]'
                    : 'text-[#A5A5A5] hover:text-white'
                }`}
              >
                Best Value ★
              </button>
              <button
                onClick={() => setSortBy('price-asc')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'price-asc'
                    ? 'bg-[#FF9F1C] text-[#101010]'
                    : 'text-[#A5A5A5] hover:text-white'
                }`}
              >
                Lowest Price
              </button>
              <button
                onClick={() => setSortBy('price-desc')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'price-desc'
                    ? 'bg-[#FF9F1C] text-[#101010]'
                    : 'text-[#A5A5A5] hover:text-white'
                }`}
              >
                Max Flavor
              </button>
            </div>
          </div>

        </div>

        {/* Preference Selector */}
        <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2">
          {preferenceTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPreference(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                preference === tab.id
                  ? 'bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] shadow'
                  : 'bg-white/5 text-[#A5A5A5] hover:text-[#F8F5EF] hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Combos Deck */}
      {results.combos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#FF9F1C]" />
            <h3 className="text-lg font-black text-[#F8F5EF]">
              Curated Meal Combos Under ₹{budget}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.combos.map((combo) => {
              const isAdded = !!addedIds[combo.id];
              return (
                <div
                  key={combo.id}
                  className="p-5 rounded-3xl bg-[#171717] border border-white/8 hover:border-[#FF9F1C]/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Combo Saves ₹{combo.savings}
                      </span>
                      <span className="text-xs font-semibold text-[#A5A5A5]">
                        Leaves ₹{combo.remainingBudget}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-[#F8F5EF]">
                      {combo.title}
                    </h4>

                    <div className="grid grid-cols-2 gap-2">
                      {combo.items.map((it) => (
                        <div key={it._id} className="relative aspect-video rounded-xl overflow-hidden bg-black">
                          <img
                            src={it.image}
                            alt={it.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-1.5">
                            <span className="text-[10px] font-bold text-white truncate">
                              {it.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-4">
                    <span className="text-xl font-black text-[#FFC857]">
                      ₹{combo.totalPrice}
                    </span>
                    <button
                      onClick={() => handleAddCombo(combo)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-500 text-[#101010]'
                          : 'bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] hover:brightness-110'
                      }`}
                    >
                      {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{isAdded ? 'Combo Added' : 'Add Both to Cart'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Individual Dishes */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-[#F8F5EF]">
          Verified Dishes Under ₹{budget} ({results.items.length})
        </h3>

        {results.items.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#A5A5A5] bg-[#171717] rounded-3xl p-8">
            No dishes found under ₹{budget} for this craving. Try adjusting your budget slider to ₹150+.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.items.map((dish) => {
              const isAdded = !!addedIds[dish._id];
              return (
                <div
                  key={dish._id}
                  className="p-4 rounded-3xl bg-[#171717] border border-white/8 hover:border-[#FF9F1C]/40 transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black mb-3">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/75 text-[10px] font-bold text-emerald-400">
                      Leaves ₹{dish.remainingBudget}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#A5A5A5] truncate block">
                      {dish.restaurant?.name || 'Kitchen'}
                    </span>
                    <h5 className="font-bold text-sm text-[#F8F5EF] line-clamp-1 mt-0.5">
                      {dish.name}
                    </h5>
                    <p className="text-[11px] text-[#888888] line-clamp-2 mt-1">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-white/5 mt-3">
                    <span className="text-base font-black text-[#FFC857]">
                      ₹{dish.price}
                    </span>
                    <button
                      onClick={() => handleAddDish(dish)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-500 text-[#101010]'
                          : 'bg-white/10 hover:bg-[#FF9F1C] text-[#F8F5EF] hover:text-[#101010]'
                      }`}
                    >
                      {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{isAdded ? 'Added' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

