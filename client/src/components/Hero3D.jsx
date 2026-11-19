import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, ShieldCheck, Clock, Flame, Utensils } from 'lucide-react';

export default function Hero3D({ onOpenAI }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  function handleHeroMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  }

  function handleHeroMouseLeave() {
    setMouseOffset({ x: 0, y: 0 });
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/restaurants');
    }
  }

  const popularChips = ['Truffle Burgers', 'Dum Biryani', 'Woodfired Pizza', 'Quinoa Bowls', 'Ramen', 'Molten Cake'];

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-8 pb-16">
      
      {/* Background Radial Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#FF9F1C]/20 via-[#FFC857]/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#FF9F1C]/10 blur-[90px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #FFC857 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Interaction */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#FF9F1C] animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFC857]">
                3D Neo-Futuristic Culinary Experience
              </span>
            </div>

            {/* Bold Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#F8F5EF] leading-[1.08]">
              Taste The Future <br />
              <span className="bg-gradient-to-r from-[#FFC857] via-[#FF9F1C] to-[#FFA726] bg-clip-text text-transparent drop-shadow-sm">
                In Full 3D
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-lg sm:text-xl text-[#A5A5A5] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Bespoke gourmet meals from elite kitchens. Powered by real-time AI food craving discovery, collective group dining, and zero-waste Night Rescue.
            </p>

            {/* Prominent 3D Food Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto lg:mx-0">
              <div className="relative flex items-center p-2 rounded-2xl bg-[#191919]/90 border border-[#FFC857]/25 shadow-2xl shadow-black/80 backdrop-blur-xl focus-within:border-[#FF9F1C] focus-within:shadow-[0_0_25px_rgba(255,159,28,0.25)] transition-all">
                <Search className="w-6 h-6 text-[#FFC857] ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants, truffle burgers, sourdough pizzas..."
                  className="w-full bg-transparent border-none text-[#F8F5EF] placeholder-[#666666] text-sm sm:text-base px-3 py-2.5 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] font-extrabold text-sm hover:brightness-110 shadow-lg shadow-[#FF9F1C]/30 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Autocomplete Quick Chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-3">
                <span className="text-xs text-[#777777] font-medium flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#FF9F1C]" /> Trending:
                </span>
                {popularChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setSearchQuery(chip);
                      navigate(`/restaurants?search=${encodeURIComponent(chip)}`);
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#FF9F1C]/20 border border-white/5 hover:border-[#FF9F1C]/40 text-[#A5A5A5] hover:text-[#FFC857] transition-all cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </form>

            {/* Value Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/5 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFC857]">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#F8F5EF]">25 Mins</div>
                  <div className="text-[10px] text-[#A5A5A5]">Avg. Delivery</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#F8F5EF]">Verified</div>
                  <div className="text-[10px] text-[#A5A5A5]">Hygienic Kitchens</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  onClick={onOpenAI}
                  className="w-9 h-9 rounded-xl bg-[#FF9F1C]/20 border border-[#FF9F1C]/40 flex items-center justify-center text-[#FFC857] cursor-pointer hover:scale-105 transition-transform"
                >
                  <Sparkles className="w-4 h-4 text-[#FF9F1C]" />
                </div>
                <div className="text-left cursor-pointer" onClick={onOpenAI}>
                  <div className="text-xs font-bold text-[#FFC857]">AI Craving</div>
                  <div className="text-[10px] text-[#A5A5A5]">Grounded Match</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Visual Centerpiece & Chef Mascot */}
          <div 
            className="lg:col-span-5 relative flex items-center justify-center"
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleHeroMouseLeave}
          >
            
            {/* 3D Visual Showcase Container */}
            <div 
              className="relative w-full max-w-[460px] aspect-square flex items-center justify-center transition-transform duration-300 ease-out"
              style={{
                transform: `perspective(1000px) rotateY(${mouseOffset.x * 12}deg) rotateX(${-mouseOffset.y * 12}deg)`
              }}
            >
              
              {/* Concentric Glowing 3D Rings */}
              <div className="absolute inset-0 rounded-full border border-[#FFC857]/20 animate-spin" style={{ animationDuration: '35s' }} />
              <div className="absolute inset-8 rounded-full border border-[#FF9F1C]/25 border-dashed animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
              <div className="absolute inset-16 rounded-full bg-gradient-to-tr from-[#1f1912] to-[#121212] border border-[#FFC857]/30 shadow-2xl shadow-black" />

              {/* 3D Chef Mascot & Dish Card */}
              <div 
                className="relative z-20 flex flex-col items-center transition-transform duration-300 ease-out"
                style={{
                  transform: `translate3d(${mouseOffset.x * 15}px, ${mouseOffset.y * 15}px, 20px)`
                }}
              >
                
                {/* 3D Chef Mascot Avatar with Golden MEALIFY Logo */}
                <div className="relative group cursor-pointer">
                  {/* Outer glowing halo */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] rounded-full blur-xl opacity-40 group-hover:opacity-75 transition-opacity" />
                  
                  {/* Mascot Head / Avatar */}
                  <div className="relative w-36 h-36 rounded-full bg-[#181818] border-2 border-[#FFC857] p-2 shadow-2xl flex items-center justify-center overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80"
                      alt="MEALIFY 3D Chef Mascot"
                      className="w-full h-full object-cover rounded-full"
                    />
                    
                    {/* Golden MEALIFY M Emblem Badge pinned to chef */}
                    <div className="absolute bottom-1 right-2 w-10 h-10 rounded-full bg-gradient-to-br from-[#FF9F1C] to-[#FFC857] p-[1.5px] shadow-lg shadow-black/80 flex items-center justify-center">
                      <div className="w-full h-full bg-[#121212] rounded-full flex items-center justify-center">
                        <span className="font-black text-sm text-[#FFC857]">M</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating 3D Burger / Dish Card with Glass Reflection */}
                <div 
                  className="relative -mt-6 z-30 w-72 rounded-2xl p-4 bg-[#1e1e1e]/90 border border-[#FFC857]/30 shadow-2xl shadow-black/90 backdrop-blur-2xl animate-float-slow transition-transform duration-300 ease-out"
                  style={{
                    transform: `translate3d(${mouseOffset.x * 22}px, ${mouseOffset.y * 22}px, 40px)`
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80"
                      alt="Signature Smash Burger"
                      className="w-16 h-16 rounded-xl object-cover border border-white/10"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF9F1C]">
                          Chef's Special
                        </span>
                        <span className="text-[11px] font-bold text-[#10B981] bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          ★ 4.9
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#F8F5EF] truncate">
                        Truffle Glaze Smash
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-extrabold text-[#FFC857]">
                          ₹349
                        </span>
                        <span className="text-[10px] text-[#A5A5A5] line-through">
                          ₹429
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Floating 3D Food Elements & Ingredients */}
              
              {/* 1. Floating Chili Pepper */}
              <div 
                className="absolute -top-4 left-6 z-30 animate-float-slow transition-transform duration-300 ease-out" 
                style={{ 
                  animationDelay: '0.5s',
                  transform: `translate3d(${-mouseOffset.x * 20}px, ${-mouseOffset.y * 20}px, 0)`
                }}
              >
                <div className="px-3 py-1.5 rounded-xl bg-[#1f1915]/90 border border-red-500/30 text-xs text-[#F8F5EF] flex items-center gap-1.5 shadow-xl shadow-red-500/10 backdrop-blur-md">
                  <span className="text-base">🌶️</span>
                  <span className="text-[11px] font-semibold text-red-400">Fiery Sichuan</span>
                </div>
              </div>

              {/* 2. Floating Fresh Herb / Basil */}
              <div 
                className="absolute top-12 -right-4 z-30 animate-float-reverse transition-transform duration-300 ease-out" 
                style={{ 
                  animationDelay: '1s',
                  transform: `translate3d(${mouseOffset.x * 25}px, ${-mouseOffset.y * 18}px, 0)`
                }}
              >
                <div className="px-3 py-1.5 rounded-xl bg-[#151f18]/90 border border-emerald-500/30 text-xs text-[#F8F5EF] flex items-center gap-1.5 shadow-xl shadow-emerald-500/10 backdrop-blur-md">
                  <span className="text-base">🌿</span>
                  <span className="text-[11px] font-semibold text-emerald-400">Organic Basil</span>
                </div>
              </div>

              {/* 3. Floating Avocado / Superfood */}
              <div 
                className="absolute -bottom-2 -left-2 z-30 animate-float-slow transition-transform duration-300 ease-out" 
                style={{ 
                  animationDelay: '1.5s',
                  transform: `translate3d(${-mouseOffset.x * 18}px, ${mouseOffset.y * 22}px, 0)`
                }}
              >
                <div className="px-3 py-1.5 rounded-xl bg-[#1a1f15]/90 border border-lime-500/30 text-xs text-[#F8F5EF] flex items-center gap-1.5 shadow-xl shadow-lime-500/10 backdrop-blur-md">
                  <span className="text-base">🥑</span>
                  <span className="text-[11px] font-semibold text-lime-400">Hass Avocado</span>
                </div>
              </div>

              {/* 4. Floating Night Rescue Pill */}
              <div 
                className="absolute bottom-16 -right-6 z-30 animate-float-reverse transition-transform duration-300 ease-out" 
                style={{ 
                  animationDelay: '2s',
                  transform: `translate3d(${mouseOffset.x * 28}px, ${mouseOffset.y * 18}px, 0)`
                }}
              >
                <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#291e10] to-[#1c160e] border border-[#FFC857]/40 text-xs text-[#F8F5EF] flex items-center gap-2 shadow-2xl shadow-[#FF9F1C]/20 backdrop-blur-md">
                  <span className="text-base">🌙</span>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase text-[#FFC857]">Night Rescue</div>
                    <div className="text-[9px] text-[#A5A5A5]">Surplus -55% Off</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

