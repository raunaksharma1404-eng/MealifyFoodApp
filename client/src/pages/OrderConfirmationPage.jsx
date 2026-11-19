import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Clock, MapPin, Receipt, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await api.getOrderById(id);
        if (res.success && res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.warn('Error fetching order:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-[#A5A5A5]">
        Verifying order transaction...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-center">
      
      {/* 3D Success Celebration Icon */}
      <div className="relative w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-400 p-[2px] shadow-2xl shadow-emerald-500/30">
        <div className="w-full h-full bg-[#121212] rounded-[22px] flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Order Successfully Placed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#F8F5EF] tracking-tight">
          Your Feast Is Being Prepared!
        </h1>
        <p className="text-sm text-[#A5A5A5] max-w-md mx-auto">
          Order <span className="font-mono text-[#FFC857] font-bold">#{order?.orderNumber || id}</span> has been dispatched to {order?.restaurantName || 'the kitchen'}.
        </p>
      </div>

      {/* Summary Card */}
      <div className="p-6 rounded-3xl bg-[#171717] border border-white/10 text-left space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-white/5 text-xs text-[#A5A5A5]">
          <span>Delivery Destination:</span>
          <span className="font-bold text-[#F8F5EF]">{order?.deliveryAddress?.street}, {order?.deliveryAddress?.city}</span>
        </div>

        <div className="space-y-2">
          {order?.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between text-xs">
              <span className="text-[#A5A5A5]">{item.quantity}x {item.name}</span>
              <span className="font-bold text-[#F8F5EF]">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-white/5 flex justify-between items-center">
          <span className="text-xs text-[#A5A5A5]">Total Paid ({order?.paymentMethod?.toUpperCase()})</span>
          <span className="text-xl font-black text-[#FFC857]">₹{order?.totalAmount}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          to={`/order-tracking/${order?._id || id}`}
          className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#FF9F1C]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Track Order In Real-Time</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/restaurants"
          className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-[#F8F5EF] text-xs font-bold transition-colors"
        >
          Back To Home
        </Link>
      </div>

    </div>
  );
}

