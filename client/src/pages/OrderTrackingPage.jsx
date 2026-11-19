import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertCircle, ShoppingBag, Play, Pause, FastForward, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import OrderTimeline from '../components/OrderTimeline';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAutoSimulating, setIsAutoSimulating] = useState(false);
  const autoSimRef = useRef(null);
  const toast = useToast();

  async function fetchOrderStatus(showSpinner = false) {
    if (showSpinner) setIsRefreshing(true);
    try {
      const res = await api.getOrderById(id);
      if (res.success && res.order) {
        setOrder(res.order);
      }
    } catch (err) {
      console.warn('Error polling order:', err.message);
    } finally {
      setLoading(false);
      if (showSpinner) setIsRefreshing(false);
    }
  }

  useEffect(() => {
    fetchOrderStatus();

    // Auto-poll status every 4 seconds for real-time progress
    const interval = setInterval(() => {
      fetchOrderStatus(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [id]);

  // Clean up auto simulation interval
  useEffect(() => {
    return () => {
      if (autoSimRef.current) clearInterval(autoSimRef.current);
    };
  }, []);

  async function handleSimulateStep() {
    if (!order || isSimulating) return;
    setIsSimulating(true);
    try {
      const res = await api.simulateOrderStep(order._id);
      if (res.success && res.order) {
        setOrder(res.order);
        const stageLabel = res.order.orderStatus.replace(/_/g, ' ');
        toast.info(`Stage Advanced: ${stageLabel.toUpperCase()}`);
        if (res.isFinal) {
          toast.success('Delivered! Your gourmet feast has arrived.');
          if (autoSimRef.current) {
            clearInterval(autoSimRef.current);
            setIsAutoSimulating(false);
          }
        }
      } else {
        toast.error(res.message || 'Simulation step failed');
      }
    } catch (err) {
      toast.error('Simulation error: ' + err.message);
    } finally {
      setIsSimulating(false);
    }
  }

  function toggleAutoSimulate() {
    if (isAutoSimulating) {
      if (autoSimRef.current) clearInterval(autoSimRef.current);
      setIsAutoSimulating(false);
      toast.info('Auto simulation paused.');
    } else {
      if (order?.orderStatus === 'delivered') {
        toast.info('Order is already delivered!');
        return;
      }
      setIsAutoSimulating(true);
      toast.success('Live delivery simulation started (advancing every 3s)...');
      // Run first step immediately
      handleSimulateStep();
      autoSimRef.current = setInterval(() => {
        handleSimulateStep();
      }, 3000);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-[#A5A5A5]">
        Connecting to live delivery GPS & kitchen status...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#F8F5EF]">Order Not Found</h2>
        <p className="text-xs text-[#A5A5A5]">Could not locate order #{id}.</p>
        <Link to="/orders" className="px-4 py-2 rounded-xl bg-[#FF9F1C] text-[#101010] text-xs font-bold inline-block">
          View All Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Navigation & Live Sync Pill */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A5A5A5] hover:text-[#FFC857] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>My Orders</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-semibold text-[#A5A5A5]">
            Live Sync (Every 4s)
          </span>
          <button
            onClick={() => fetchOrderStatus(true)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#FFC857]"
            title="Refresh now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
            {order.restaurantName || 'Restaurant Kitchen'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F8F5EF] tracking-tight mt-0.5">
            Order #{order.orderNumber}
          </h1>
        </div>

        {/* Demo Simulation Control Suite */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#191919] border border-[#FFC857]/30 shadow-lg">
          <span className="text-[10px] font-black uppercase text-[#FFC857] px-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9F1C]" />
            Demo Sim:
          </span>
          <button
            onClick={handleSimulateStep}
            disabled={isSimulating || order.orderStatus === 'delivered'}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#FF9F1C] text-[#F8F5EF] hover:text-[#101010] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            title="Step to next order status"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Next Stage</span>
          </button>

          <button
            onClick={toggleAutoSimulate}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isAutoSimulating
                ? 'bg-amber-500 text-[#101010] shadow-md shadow-amber-500/20'
                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-[#101010]'
            }`}
          >
            {isAutoSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoSimulating ? 'Pause Flow' : 'Auto Flow (3s)'}</span>
          </button>
        </div>
      </div>

      {/* 7-Stage Visual Order Tracking Timeline */}
      <div className="p-6 rounded-3xl bg-[#171717] border border-white/8 shadow-2xl">
        <OrderTimeline order={order} />
      </div>

      {/* Order Details & Summary Card */}
      <div className="p-6 rounded-3xl bg-[#171717] border border-white/8 space-y-4">
        <h3 className="text-base font-extrabold text-[#F8F5EF]">
          Dishes in This Order
        </h3>

        <div className="space-y-3">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className="font-semibold text-[#F8F5EF]">
                  {item.quantity}x {item.name}
                </span>
              </div>
              <span className="font-bold text-[#FFC857]">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-between text-xs text-[#A5A5A5]">
          <span>Delivery Address:</span>
          <span className="font-bold text-[#F8F5EF] text-right">
            {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
          </span>
        </div>

        <div className="pt-2 border-t border-white/5 flex justify-between items-baseline">
          <span className="text-xs text-[#A5A5A5]">Total Paid</span>
          <span className="text-xl font-black text-[#FFC857]">₹{order.totalAmount}</span>
        </div>
      </div>

    </div>
  );
}

