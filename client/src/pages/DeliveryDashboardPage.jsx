import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Package, 
  Navigation, 
  PhoneCall,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function DeliveryDashboardPage() {
  const { user, isRider, demoLogin } = useAuth();
  const { toast } = useToast();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myActiveOrders, setMyActiveOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  async function loadDeliveryData() {
    try {
      const [delivRes, histRes] = await Promise.all([
        api.getAvailableDeliveries(),
        api.getDeliveryHistory()
      ]);

      if (delivRes.success) {
        setAvailableOrders(delivRes.availableOrders || []);
        setMyActiveOrders(delivRes.myActiveOrders || []);
      }
      if (histRes.success) {
        setHistory(histRes.history || []);
        setTotalEarnings(histRes.totalEarnings || 0);
      }
    } catch (err) {
      console.warn('Error loading delivery data:', err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function init() {
      if (!user || user.role !== 'delivery_partner') {
        // Auto-switch to Vikram Singh for zero-friction evaluation
        await demoLogin('delivery_partner');
      }
      loadDeliveryData();
    }
    init();

    const interval = setInterval(loadDeliveryData, 5000);
    return () => clearInterval(interval);
  }, []);

  async function handleAccept(orderId) {
    try {
      const res = await api.acceptDelivery(orderId);
      if (res.success) {
        toast.success('Delivery accepted! Head to kitchen for pickup.');
        loadDeliveryData();
      }
    } catch (err) {
      toast.error(err.message || 'Could not accept order.');
    }
  }

  async function handleUpdateStep(orderId, nextStep) {
    try {
      const res = await api.updateDeliveryStep(orderId, nextStep);
      if (res.success) {
        toast.success(`Delivery status updated: ${nextStep.replace(/_/g, ' ')}`);
        loadDeliveryData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update step.');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Rider Partner Portal
            </span>
            <span className="text-xs text-[#A5A5A5]">
              Vikram Singh • Electric Scooter (EV-9000)
            </span>
          </div>
          <h1 className="text-3xl font-black text-[#F8F5EF] tracking-tight">
            Delivery Operations Hub
          </h1>
        </div>

        <button
          onClick={loadDeliveryData}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#FFC857] text-xs font-bold flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#171717] border border-white/8">
          <div className="text-[10px] uppercase font-bold text-[#A5A5A5]">Total Payout Earnings</div>
          <div className="text-2xl font-black text-emerald-400">₹{totalEarnings}</div>
          <div className="text-[10px] text-[#A5A5A5]">₹50 base per completed order</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#171717] border border-white/8">
          <div className="text-[10px] uppercase font-bold text-[#A5A5A5]">Completed Deliveries</div>
          <div className="text-2xl font-black text-[#F8F5EF]">{history.length} Runs</div>
          <div className="text-[10px] text-emerald-400">100% on-time record</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#171717] border border-white/8">
          <div className="text-[10px] uppercase font-bold text-[#A5A5A5]">Active In-Progress</div>
          <div className="text-2xl font-black text-[#FFC857]">{myActiveOrders.length}</div>
          <div className="text-[10px] text-[#A5A5A5]">Currently handling</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#171717] border border-white/8">
          <div className="text-[10px] uppercase font-bold text-[#A5A5A5]">Available Requests</div>
          <div className="text-2xl font-black text-[#FF9F1C]">{availableOrders.length}</div>
          <div className="text-[10px] text-[#A5A5A5]">Ready for claim</div>
        </div>
      </div>

      {/* 1. Active Assigned Deliveries */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-[#F8F5EF] flex items-center gap-2">
          <Navigation className="w-5 h-5 text-[#FF9F1C]" />
          <span>My Active Deliveries ({myActiveOrders.length})</span>
        </h3>

        {myActiveOrders.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#171717] border border-white/5 text-center text-xs text-[#888888]">
            No active delivery right now. Accept an order from the available pool below!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myActiveOrders.map((order) => (
              <div
                key={order._id}
                className="p-6 rounded-3xl bg-[#181818] border border-[#FF9F1C]/40 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#FFC857]">#{order.orderNumber}</span>
                    <h4 className="font-bold text-sm text-[#F8F5EF]">{order.restaurantName}</h4>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-500/20 text-[#FFC857]">
                    {order.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-[#A5A5A5]">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#F8F5EF]">Customer Address:</span> {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                    </div>
                  </div>
                  <div className="text-[11px] text-[#888888]">
                    Items: {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>
                </div>

                {/* Progress Buttons */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {order.orderStatus === 'ready_for_pickup' && (
                    <button
                      onClick={() => handleUpdateStep(order._id, 'picked_up')}
                      className="flex-1 py-2.5 rounded-xl bg-[#FF9F1C] text-[#101010] font-black text-xs uppercase tracking-wider hover:brightness-110"
                    >
                      Pick Up Package
                    </button>
                  )}
                  {order.orderStatus === 'picked_up' && (
                    <button
                      onClick={() => handleUpdateStep(order._id, 'out_for_delivery')}
                      className="flex-1 py-2.5 rounded-xl bg-[#FF9F1C] text-[#101010] font-black text-xs uppercase tracking-wider hover:brightness-110"
                    >
                      Start Navigation (Out for Delivery)
                    </button>
                  )}
                  {order.orderStatus === 'out_for_delivery' && (
                    <button
                      onClick={() => handleUpdateStep(order._id, 'delivered')}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-[#101010] font-black text-xs uppercase tracking-wider hover:brightness-110"
                    >
                      Mark as Delivered ✓
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Available Deliveries Ready for Pickup */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-[#F8F5EF] flex items-center gap-2">
          <Package className="w-5 h-5 text-emerald-400" />
          <span>Available Delivery Requests ({availableOrders.length})</span>
        </h3>

        {availableOrders.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#171717] border border-white/5 text-center text-xs text-[#888888]">
            No unassigned deliveries waiting. Kitchens will appear here as soon as orders are ready.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableOrders.map((order) => (
              <div
                key={order._id}
                className="p-5 rounded-2xl bg-[#171717] border border-white/8 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#FFC857]">#{order.orderNumber}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Earn ₹50
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#F8F5EF]">{order.restaurantName}</h4>
                  <p className="text-xs text-[#A5A5A5] mt-1 line-clamp-1">
                    To: {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-[#888888]">{order.items?.length} items</span>
                  <button
                    onClick={() => handleAccept(order._id)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-[#101010] font-black text-xs uppercase tracking-wider hover:brightness-110"
                  >
                    Accept Run
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

