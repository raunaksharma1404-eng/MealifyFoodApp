import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Check, Clock, Flame, Star, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function FoodCard3D({ food, rescueDeal = null }) {
  const { addItem, items, updateQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false
  });

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY, isHovered: true });
  }

  function handleMouseLeave() {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false });
  }

  // Check if item is already in cart
  const cartItemId = rescueDeal ? `${food._id}_rescue_${rescueDeal._id}` : String(food._id);
  const cartItem = items.find(i => i.id === cartItemId);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const displayPrice = rescueDeal ? rescueDeal.rescuePrice : food.price;
  const originalPrice = rescueDeal ? rescueDeal.originalPrice : (food.originalPrice || food.price);
  const discountPercent = rescueDeal
    ? rescueDeal.discountPercentage
    : (food.originalPrice && food.originalPrice > food.price
        ? Math.round(((food.originalPrice - food.price) / food.originalPrice) * 100)
        : 0);

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    const success = addItem(food, 1, rescueDeal);
    if (success !== false) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  }

  function handleIncrement(e) {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(cartItemId, 1);
  }

  function handleDecrement(e) {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(cartItemId, -1);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.isHovered
          ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: tilt.isHovered ? 'transform 0.08s ease-out' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
      className="group relative rounded-3xl bg-[#171717]/90 border border-white/8 hover:border-[#FF9F1C]/40 p-3.5 hover:shadow-2xl hover:shadow-[#FF9F1C]/20 flex flex-col justify-between backdrop-blur-md overflow-hidden"
    >
      {/* Dynamic Specular Glare Reflection on Hover */}
      {tilt.isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl z-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 240px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 200, 87, 0.14), transparent 70%)`
          }}
        />
      )}
      
      {/* Top Media & Floating Badges */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#101010] mb-3">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
        />

        {/* Gradient dark scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              food.isVeg ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F8F5EF]">
            {food.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-[#FFC857]/30 text-[#FFC857] text-xs font-bold">
          <Star className="w-3 h-3 fill-current text-[#FFC857]" />
          <span>{food.rating || 4.8}</span>
        </div>

        {/* Night Rescue Surplus Tag OR Discount Tag */}
        {rescueDeal ? (
          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-600/90 to-orange-600/90 text-[#101010] text-[11px] font-black shadow-lg">
            <span>🌙 RESCUE -{rescueDeal.discountPercentage}%</span>
          </div>
        ) : discountPercent > 0 ? (
          <div className="absolute bottom-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-[#FF9F1C] text-[#101010] text-[10px] font-black">
            {discountPercent}% OFF
          </div>
        ) : null}

        {/* Prep Time */}
        <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1 text-[11px] text-[#E0E0E0] bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
          <Clock className="w-3 h-3 text-[#A5A5A5]" />
          <span>{food.preparationTime || 15}m</span>
        </div>
      </div>

      {/* Content & Description */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#A5A5A5] mb-1">
            <span className="truncate max-w-[150px]">
              {food.restaurant?.name || 'Partner Kitchen'}
            </span>
            {food.spicyLevel > 0 && (
              <span className="flex items-center text-red-400 font-semibold text-[10px]">
                <Flame className="w-3 h-3 text-red-500 fill-current" />
                Spicy
              </span>
            )}
          </div>

          <Link to={`/food/${food._id}`} className="block group-hover:text-[#FFC857] transition-colors">
            <h3 className="font-bold text-sm text-[#F8F5EF] line-clamp-1 leading-snug">
              {food.name}
            </h3>
          </Link>

          <p className="text-xs text-[#888888] line-clamp-2 mt-1 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Price & Quantity Add Controls */}
        <div className="pt-2 flex items-center justify-between border-t border-white/5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-[#FFC857]">
              ₹{displayPrice}
            </span>
            {originalPrice > displayPrice && (
              <span className="text-xs text-[#666666] line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>

          {/* Quick Add or Quantity Modifier */}
          {currentQuantity === 0 ? (
            <button
              onClick={handleAdd}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                justAdded
                  ? 'bg-emerald-500 text-[#101010]'
                  : 'bg-white/10 hover:bg-[#FF9F1C] text-[#F8F5EF] hover:text-[#101010] border border-white/10 hover:border-[#FF9F1C]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#1c1c1c] border border-[#FF9F1C]/40 rounded-xl px-2 py-1 shadow-md">
              <button
                onClick={handleDecrement}
                className="w-5 h-5 rounded flex items-center justify-center text-[#A5A5A5] hover:text-[#F8F5EF] hover:bg-white/10 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-black text-[#FFC857] min-w-[14px] text-center">
                {currentQuantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-5 h-5 rounded flex items-center justify-center text-[#FF9F1C] hover:text-white hover:bg-[#FF9F1C]/30 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

