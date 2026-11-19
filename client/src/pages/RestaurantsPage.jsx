import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, Clock, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';

export default function RestaurantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCuisine = searchParams.get('cuisine') || 'all';

  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [minRating, setMinRating] = useState('');
  const [loading, setLoading] = useState(true);

  const cuisines = [
    { id: 'all', label: 'All Cuisines' },
    { id: 'Burgers', label: 'Burgers' },
    { id: 'Biryani', label: 'Biryani & Bowls' },
    { id: 'Italian', label: 'Woodfired Pizza' },
    { id: 'Japanese', label: 'Japanese & Ramen' },
    { id: 'Healthy', label: 'Healthy & Salads' },
    { id: 'Desserts', label: 'Desserts & Sweets' },
  ];

  useEffect(() => {
    async function fetchRestaurants() {
      setLoading(true);
      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (selectedCuisine !== 'all') params.cuisine = selectedCuisine;
        if (minRating) params.minRating = minRating;

        const res = await api.getRestaurants(params);
        if (res.success) {
          setRestaurants(res.restaurants || []);
        }
      } catch (err) {
        console.warn('Error fetching restaurants:', err.message);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchRestaurants, 200);
    return () => clearTimeout(timer);
  }, [search, selectedCuisine, minRating]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#FFC857] uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#FF9F1C]" />
          <span>Curated Dining Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#F8F5EF] tracking-tight">
          Explore Partner Restaurants
        </h1>
        <p className="text-sm text-[#A5A5A5] mt-1">
          Discover handpicked gourmet kitchens, artisanal woodfired ovens, and healthy superfood bars.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#171717] border border-white/8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#A5A5A5] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by restaurant name or cuisine..."
              className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F8F5EF] placeholder-[#666666] focus:outline-none focus:border-[#FF9F1C]"
            />
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="bg-[#121212] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#F8F5EF] focus:outline-none focus:border-[#FF9F1C]"
            >
              <option value="">All Ratings</option>
              <option value="4.5">★ 4.5 & Above</option>
              <option value="4.8">★ 4.8 & Above (Elite)</option>
            </select>
          </div>
        </div>

        {/* Cuisine Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5">
          {cuisines.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCuisine(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCuisine === c.id
                  ? 'bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] shadow'
                  : 'bg-white/5 text-[#A5A5A5] hover:text-[#F8F5EF] hover:bg-white/10'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurant List Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-[#A5A5A5]">
          Loading gourmet kitchens...
        </div>
      ) : restaurants.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="text-3xl">🔍</div>
          <h3 className="text-base font-bold text-[#F8F5EF]">No restaurants match your search.</h3>
          <p className="text-xs text-[#888888]">Try resetting your filters or searching for another dish.</p>
          <button
            onClick={() => { setSearch(''); setSelectedCuisine('all'); setMinRating(''); }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 text-[#FFC857] hover:bg-white/20"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      )}

    </div>
  );
}

