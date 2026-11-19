import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Check, 
  ShieldCheck, 
  Plus, 
  Lock, 
  ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export default function CheckoutPage() {
  const { user, isAuthenticated, demoLogin, addAddress } = useAuth();
  const { items, restaurant, subtotal, deliveryFee, tax, discount, finalTotal, coupon, clearCart } = useCart();
  const navigate = useNavigate();

  // Address State
  const defaultAddress = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0] || {
    id: 'addr_default',
    label: 'Home',
    street: 'Apt 402, Cyber Tower 3, High-Tech City',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipCode: '560001',
    phone: user?.phone || '+91 98765 43210'
  };

  const [selectedAddress, setSelectedAddress] = useState(defaultAddress);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru');
  const [newZip, setNewZip] = useState('560001');

  // Payment method: 'card', 'upi', 'cod'
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Alex Mercer');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [notes, setNotes] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  async function handleAddAddressSubmit(e) {
    e.preventDefault();
    if (!newStreet.trim()) return;

    if (!isAuthenticated) {
      await demoLogin('customer');
    }

    const res = await addAddress({
      label: 'Saved Address',
      street: newStreet.trim(),
      city: newCity.trim(),
      state: 'Karnataka',
      zipCode: newZip.trim(),
      isDefault: true
    });

    if (res.success && res.addresses) {
      const added = res.addresses.slice(-1)[0];
      setSelectedAddress(added);
      setShowAddAddress(false);
      setNewStreet('');
    }
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    if (!isAuthenticated) {
      await demoLogin('customer');
    }

    setPlacingOrder(true);
    try {
      const orderPayload = {
        restaurantId: restaurant.id,
        items: items.map(i => ({
          foodId: i.foodId,
          quantity: i.quantity,
          rescueDealId: i.rescueDealId || null
        })),
        deliveryAddress: selectedAddress,
        paymentMethod,
        couponCode: coupon?.code || null,
        notes
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.order) {
        clearCart();
        navigate(`/order-confirmed/${res.order._id}`);
      } else {
        setError(res.message || 'Failed to process order.');
      }
    } catch (err) {
      setError(err.message || 'Could not place order. Please review your cart.');
    } finally {
      setPlacingOrder(false);
    }
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A5A5A5] hover:text-[#FFC857] mb-2">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <h1 className="text-3xl font-black text-[#F8F5EF] tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs text-[#A5A5A5]">
          Select delivery location & simulated instant payment
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Address & Payment */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. Delivery Address Card */}
          <div className="p-6 rounded-3xl bg-[#171717] border border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF9F1C]/20 border border-[#FF9F1C]/40 flex items-center justify-center text-[#FFC857]">
                  <MapPin className="w-4 h-4 text-[#FF9F1C]" />
                </div>
                <h3 className="font-extrabold text-base text-[#F8F5EF]">
                  1. Delivery Address
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="text-xs font-bold text-[#FFC857] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddAddress ? 'Cancel' : 'Add New'}</span>
              </button>
            </div>

            {/* Address Selector */}
            <div className="space-y-3">
              {(user?.addresses && user.addresses.length > 0 ? user.addresses : [defaultAddress]).map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                    selectedAddress.id === addr.id
                      ? 'bg-[#1f1b14] border-[#FFC857] shadow-md shadow-[#FF9F1C]/10'
                      : 'bg-[#121212] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#F8F5EF]">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded text-[#A5A5A5]">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#A5A5A5]">
                      {addr.street}, {addr.city}, {addr.zipCode}
                    </p>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedAddress.id === addr.id
                      ? 'border-[#FF9F1C] bg-[#FF9F1C] text-[#101010]'
                      : 'border-white/20'
                  }`}>
                    {selectedAddress.id === addr.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Inline Add Address Form */}
            {showAddAddress && (
              <form onSubmit={handleAddAddressSubmit} className="pt-4 border-t border-white/10 space-y-3">
                <input
                  type="text"
                  placeholder="Street / Flat / Landmark..."
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8F5EF] focus:outline-none focus:border-[#FF9F1C]"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8F5EF]"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={newZip}
                    onChange={(e) => setNewZip(e.target.value)}
                    className="w-32 bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8F5EF]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FF9F1C] text-[#101010] text-xs font-bold"
                >
                  Save Address
                </button>
              </form>
            )}
          </div>

          {/* 2. Simulated Payment Method Selection */}
          <div className="p-6 rounded-3xl bg-[#171717] border border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF9F1C]/20 border border-[#FF9F1C]/40 flex items-center justify-center text-[#FFC857]">
                  <CreditCard className="w-4 h-4 text-[#FF9F1C]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#F8F5EF]">
                    2. Payment Architecture
                  </h3>
                  <span className="text-[10px] text-amber-400">
                    * Clearly labeled sandbox / simulated payment gateway
                  </span>
                </div>
              </div>
              <Lock className="w-4 h-4 text-[#10B981]" />
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-[#1f1b14] border-[#FFC857] text-[#FFC857]'
                    : 'bg-[#121212] border-white/5 text-[#A5A5A5] hover:border-white/20'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-current" />
                <span className="text-xs font-bold block">Credit / Debit</span>
                <span className="text-[9px] text-[#666666]">Simulated Instant</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-[#1f1b14] border-[#FFC857] text-[#FFC857]'
                    : 'bg-[#121212] border-white/5 text-[#A5A5A5] hover:border-white/20'
                }`}
              >
                <QrCode className="w-5 h-5 mx-auto mb-1 text-current" />
                <span className="text-xs font-bold block">UPI / QR</span>
                <span className="text-[9px] text-[#666666]">GPay, PhonePe</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-[#1f1b14] border-[#FFC857] text-[#FFC857]'
                    : 'bg-[#121212] border-white/5 text-[#A5A5A5] hover:border-white/20'
                }`}
              >
                <Banknote className="w-5 h-5 mx-auto mb-1 text-current" />
                <span className="text-xs font-bold block">Cash on Delivery</span>
                <span className="text-[9px] text-[#666666]">Pay at doorstep</span>
              </button>
            </div>

            {/* Simulated Card Preview UI */}
            {paymentMethod === 'card' && (
              <div className="p-5 rounded-2xl bg-gradient-to-tr from-[#221c15] via-[#1c1813] to-[#141414] border border-[#FFC857]/30 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#FFC857] font-bold">MEALIFY GOLD CARD</span>
                  <span className="text-emerald-400 font-semibold text-[10px]">Test Sandbox</span>
                </div>
                <div className="font-mono text-base tracking-widest text-[#F8F5EF]">
                  {cardNumber}
                </div>
                <div className="flex justify-between items-end text-xs text-[#A5A5A5]">
                  <div>
                    <div className="text-[9px] uppercase font-bold text-[#666666]">Cardholder</div>
                    <div className="text-[#F8F5EF] font-semibold">{cardHolder}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-[#666666]">Expires</div>
                    <div className="text-[#F8F5EF] font-semibold">12/29</div>
                  </div>
                </div>
              </div>
            )}

            {/* Simulated UPI Preview */}
            {paymentMethod === 'upi' && (
              <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 text-center space-y-2">
                <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                  <QrCode className="w-full h-full text-black" />
                </div>
                <p className="text-xs font-mono text-[#FFC857]">UPI ID: mealify@okaxis (Simulated)</p>
                <p className="text-[10px] text-[#888888]">
                  Clicking "Place Order" will simulate auto-approval of your UPI request.
                </p>
              </div>
            )}

            {/* Kitchen Notes */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#A5A5A5] mb-1">
                Special Delivery / Cooking Instructions (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Ring bell once, extra napkins, contact-free delivery..."
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8F5EF] focus:outline-none focus:border-[#FF9F1C]"
              />
            </div>

          </div>

        </div>

        {/* Right Summary Card */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#171717] border border-white/10 space-y-6">
          <h3 className="text-base font-extrabold text-[#F8F5EF]">
            Order Summary
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <span className="text-[#A5A5A5] truncate max-w-[180px]">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-bold text-[#F8F5EF]">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-[#A5A5A5]">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="text-[#F8F5EF]">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-[#F8F5EF]">₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (5%)</span>
              <span className="text-[#F8F5EF]">₹{tax}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
            <span className="text-sm font-bold text-[#A5A5A5]">Total</span>
            <span className="text-2xl font-black text-[#FFC857]">₹{finalTotal}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-xl shadow-[#FF9F1C]/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{placingOrder ? 'Validating & Placing...' : `Pay ₹${finalTotal} & Order`}</span>
          </button>
        </div>

      </div>

    </div>
  );
}

