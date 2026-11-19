import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Bike, Sparkles, ChevronRight } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="group block rounded-3xl bg-[#171717]/85 border border-white/8 hover:border-[#FF9F1C]/40 p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FF9F1C]/10 hover:-translate-y-1.5 backdrop-blur-md"
    >
      {/* Restaurant Image with Badges */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#101010] mb-3.5">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Promoted / Special Pill */}
        {restaurant.isPromoted && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] text-[10px] font-black uppercase tracking-wider shadow-lg">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>{restaurant.heroTag || 'Promoted'}</span>
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-[#FFC857]/30 text-[#FFC857] text-xs font-bold shadow-lg">
          <Star className="w-3.5 h-3.5 fill-current text-[#FFC857]" />
          <span>{restaurant.rating}</span>
          <span className="text-[10px] text-[#A5A5A5]">({restaurant.totalReviews})</span>
        </div>

        {/* Delivery Time & Fee */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-xs text-[#E0E0E0]">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            <Clock className="w-3.5 h-3.5 text-[#FFC857]" />
            <span>{restaurant.deliveryTimeMin} mins</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            <Bike className="w-3.5 h-3.5 text-emerald-400" />
            <span>₹{restaurant.deliveryFee} fee</span>
          </div>
        </div>
      </div>

      {/* Info & Details */}
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-extrabold text-base text-[#F8F5EF] group-hover:text-[#FFC857] transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <ChevronRight className="w-4 h-4 text-[#A5A5A5] group-hover:text-[#FFC857] group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
        </div>

        <p className="text-xs text-[#888888] line-clamp-1">
          {restaurant.tagline || restaurant.description}
        </p>

        {/* Cuisine Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {(restaurant.cuisines || []).map((c) => (
            <span
              key={c}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[#A5A5A5]"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

