import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Check, 
  AlertCircle, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function CartPage() {
  const { toast } = useToast();
  const { 
    items, 
    restaurant, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    subtotal, 
    deliveryFee, 
    tax, 
    discount, 
    finalTotal, 
    coupon, 
    couponError, 
    applyCoupon, 
    removeCoupon 
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  const sampleCoupons = [
    { code: 'MEALIFY50', desc: '50% off up to ₹150' },
    { code: 'NIGHTRESCUE', desc: 'Extra 20% off' },
    { code: 'GOLD100', desc: '₹100-200 savings' },
  ];

  async function handleApplyCoupon(code) {
    setApplying(true);
    const res = await applyCoupon(code || couponInput);
    setApplying(false);
    if (res?.success) {
      toast.success(res.message);
    } else if (res?.message) {
      toast.error(res.message);
    }
    setCouponInput('');
  }

  function handleClearCart() {
    clearCart();
    toast.info('Your cart has been cleared.');
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-4xl shadow-2xl">
          🛍️
        </div>
        <h2 className="text-2xl font-black text-[#F8F5EF]">Your Cart Is Empty</h2>
        <p className="text-sm text-[#A5A5A5] max-w-md mx-auto">
          Explore our 3D culinary catalog, claim high-value Night Rescue surplus, or let our AI recommend your next meal.
        </p>
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#FF9F1C]/20"
        >
          <span>Explore Menus</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
            Ordering from {restaurant?.name || 'Kitchen'}
          </div>
          <h1 className="text-3xl font-black text-[#F8F5EF] tracking-tight mt-0.5">
            Your Order Basket ({items.reduce((s, i) => s + i.quantity, 0)} Items)
          </h1>
        </div>

        <button
          onClick={handleClearCart}
          className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Items Table */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#171717] border border-white/8 flex items-center gap-4 hover:border-[#FF9F1C]/30 transition-all"
            >
              {/* Dish Thumbnail */}
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-white/10"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <h4 className="font-bold text-sm text-[#F8F5EF] truncate">
                    {item.name}
                  </h4>
                </div>
                <div className="text-xs font-black text-[#FFC857] mt-1">
                  ₹{item.price} each
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 bg-[#121212] border border-white/10 rounded-xl px-2.5 py-1.5 shrink-0">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-6 h-6 rounded flex items-center justify-center text-[#A5A5A5] hover:text-white"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-black text-xs text-[#F8F5EF] min-w-[16px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-6 h-6 rounded flex items-center justify-center text-[#FF9F1C] hover:text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Item Total */}
              <div className="text-right shrink-0 min-w-[70px]">
                <div className="text-sm font-black text-[#F8F5EF]">
                  ₹{item.price * item.quantity}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-[10px] text-red-400 hover:underline mt-0.5"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#A5A5A5] hover:text-[#FFC857] pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Add More Delicious Items</span>
          </Link>
        </div>

        {/* Right: Bill Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Coupon Box */}
          <div className="p-5 rounded-2xl bg-[#171717] border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFC857]">
              <Tag className="w-4 h-4 text-[#FF9F1C]" />
              <span>Have a Promo Code?</span>
            </div>

            {coupon ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-emerald-400">{coupon.code}</span>
                  <div className="text-[10px] text-[#A5A5A5]">{coupon.description}</div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-400 hover:underline font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g. MEALIFY50)"
                    className="flex-1 bg-[#101010] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono uppercase text-[#F8F5EF] focus:outline-none focus:border-[#FF9F1C]"
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={applying || !couponInput.trim()}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#FF9F1C] text-xs font-bold text-[#F8F5EF] hover:text-[#101010] transition-colors disabled:opacity-40"
                  >
                    {applying ? '...' : 'Apply'}
                  </button>
                </div>

                {couponError && (
                  <p className="text-[11px] text-red-400">{couponError}</p>
                )}

                {/* Available Quick Tap Coupons */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {sampleCoupons.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleApplyCoupon(c.code)}
                      className="text-[10px] px-2 py-1 rounded-md bg-white/5 hover:bg-[#FF9F1C]/20 border border-white/5 text-[#FFC857] font-mono"
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="p-6 rounded-2xl bg-[#171717] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#A5A5A5]">
              Payment Summary
            </h3>

            <div className="space-y-2 text-xs text-[#A5A5A5]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#F8F5EF]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span className="font-bold text-[#F8F5EF]">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Government Taxes (5% GST)</span>
                <span className="font-bold text-[#F8F5EF]">₹{tax}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Coupon Discount ({coupon?.code})</span>
                  <span>-₹{discount}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
              <div>
                <div className="text-xs text-[#A5A5A5]">Total Payable</div>
                <div className="text-2xl font-black text-[#FFC857]">₹{finalTotal}</div>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Verified on Backend
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#FF9F1C]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

