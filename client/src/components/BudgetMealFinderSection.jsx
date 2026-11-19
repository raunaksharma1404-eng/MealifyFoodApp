import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Sliders, Sparkles, Plus, Check, ArrowRight, Layers } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export default function BudgetMealFinderSection() {
  const [budget, setBudget] = useState(250);
  const [preference, setPreference] = useState('any');
  const [results, setResults] = useState({ items: [], combos: [] });
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState({});

  useEffect(() => {
    let cancel = false;
    async function fetchBudget() {
      setLoading(true);
      try {
        const res = await api.findBudgetMeals({ budget, preference });
        if (!cancel && res.success) {
          setResults({ items: res.items || [], combos: res.combos || [] });
        }
      } catch (err) {
        console.warn('Budget query error:', err.message);
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    const timer = setTimeout(fetchBudget, 180);
    return () => {
      cancel = true;
      clearTimeout(timer);
    };
  }, [budget, preference]);

  function handleAddDish(dish) {
    const success = addItem(dish, 1);
    if (success !== false) {
      setAddedIds(prev => ({ ...prev, [dish._id]: true }));
      setTimeout(() => {
        setAddedIds(prev => ({ ...prev, [dish._id]: false }));
      }, 1200);
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
      setTimeout(() => {
        setAddedIds(prev => ({ ...prev, [combo.id]: false }));
      }, 1200);
    }
  }

  const preferenceTabs = [
    { id: 'any', label: 'All Cravings' },
    { id: 'veg', label: 'Pure Veg 🌱' },
    { id: 'non-veg', label: 'Non-Veg 🍗' },
    { id: 'fast-food', label: 'Fast Food 🍟' },
    { id: 'healthy', label: 'Healthy 🥗' },
  ];

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Container */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-[#161616] border border-white/8 shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-[#FF9F1C]/10 blur-3xl pointer-events-none rounded-full" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-[#FFC857] mb-2">
              <Sliders className="w-3.5 h-3.5 text-[#FF9F1C]" />
              <span>Smart Budget Meal Finder</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#F8F5EF] tracking-tight">
              Eat What You Love. <span className="bg-gradient-to-r from-[#FFC857] to-[#FF9F1C] bg-clip-text text-transparent">Within Your Budget.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#A5A5A5] mt-1 max-w-xl">
              Set your target spend. We calculate prices, curate complementary combos, and track every rupee remaining.
            </p>
          </div>

          <Link
            to="/budget-finder"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#FFC857] hover:text-[#FF9F1C] transition-colors"
          >
            <span>Open Advanced Budget Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Interactive Budget Controls Box */}
        <div className="relative z-10 p-5 rounded-2xl bg-[#1c1c1c] border border-white/10 mb-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Slider */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A5A5A5]">
                  Max Meal Budget
                </span>
                <span className="text-2xl font-black text-[#FFC857] bg-white/5 px-3 py-1 rounded-xl border border-white/10">
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
                className="w-full accent-[#FF9F1C] cursor-pointer h-2 bg-black/60 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-[#666666] font-semibold">
                <span>₹50 (Pocket snack)</span>
                <span>₹250 (Full gourmet lunch)</span>
                <span>₹500 (Feast combo)</span>
              </div>
            </div>

            {/* Preference Pills */}
            <div className="flex flex-wrap gap-2 md:max-w-md">
              {preferenceTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPreference(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    preference === tab.id
                      ? 'bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] shadow-md shadow-[#FF9F1C]/20'
                      : 'bg-white/5 text-[#A5A5A5] hover:text-[#F8F5EF] hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Results: Combos & Dishes */}
        <div className="relative z-10 space-y-8">
          
          {/* Smart Combos within budget */}
          {results.combos.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-[#FF9F1C]" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#F8F5EF]">
                  Recommended Combos Under ₹{budget}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.combos.slice(0, 3).map((combo) => {
                  const isAdded = !!addedIds[combo.id];
                  return (
                    <div
                      key={combo.id}
                      className="p-4 rounded-2xl bg-[#1c1c1c]/90 border border-white/8 hover:border-[#FF9F1C]/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Save ₹{combo.savings}
                          </span>
                          <span className="text-xs font-semibold text-[#A5A5A5]">
                            Leaves ₹{combo.remainingBudget}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-[#F8F5EF] mb-2">
                          {combo.title}
                        </h4>
                        <div className="flex gap-2">
                          {combo.items.map((item) => (
                            <img
                              key={item._id}
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover border border-white/10"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 flex items-center justify-between border-t border-white/5 mt-3">
                        <span className="text-base font-black text-[#FFC857]">
                          ₹{combo.totalPrice}
                        </span>
                        <button
                          onClick={() => handleAddCombo(combo)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-500 text-[#101010]'
                              : 'bg-white/10 hover:bg-[#FF9F1C] text-[#F8F5EF] hover:text-[#101010]'
                          }`}
                        >
                          {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          <span>{isAdded ? 'Added' : 'Add Combo'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Individual Dishes within budget */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#F8F5EF]">
                Individual Dishes Under ₹{budget} ({results.items.length})
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {results.items.slice(0, 4).map((dish) => {
                const isAdded = !!addedIds[dish._id];
                return (
                  <div
                    key={dish._id}
                    className="p-3 rounded-2xl bg-[#1c1c1c] border border-white/8 hover:border-[#FF9F1C]/40 transition-all flex flex-col justify-between group"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-black mb-2">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform"
                      />
                      <div className="absolute bottom-1.5 right-1.5 text-[10px] bg-black/75 px-1.5 py-0.5 rounded text-[#10B981] font-bold">
                        Leaves ₹{dish.remainingBudget}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-bold text-xs text-[#F8F5EF] truncate">
                        {dish.name}
                      </h5>
                      <span className="text-[10px] text-[#A5A5A5] truncate block">
                        {dish.restaurant?.name || 'Kitchen'}
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-white/5 mt-2">
                      <span className="text-xs font-black text-[#FFC857]">
                        ₹{dish.price}
                      </span>
                      <button
                        onClick={() => handleAddDish(dish)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-500 text-[#101010]'
                            : 'bg-white/10 hover:bg-[#FF9F1C] text-[#F8F5EF] hover:text-[#101010]'
                        }`}
                      >
                        {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

