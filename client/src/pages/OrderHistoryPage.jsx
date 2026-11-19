import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, RefreshCw, ArrowRight, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem, clearCart } = useCart();
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      if (!isAuthenticated) {
        await demoLogin('customer');
      }
      try {
        const res = await api.getMyOrders();
        if (res.success) {
          setOrders(res.orders || []);
        }
      } catch (err) {
        console.warn('Error fetching orders:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [isAuthenticated]);

  async function handleReorder(order) {
    clearCart();
    if (order.items && order.items.length > 0) {
      for (const it of order.items) {
        addItem(
          {
            _id: it.food,
            name: it.name,
            price: it.price,
            image: it.image,
            isVeg: it.isVeg,
            restaurant: order.restaurant?._id || order.restaurant
          },
          it.quantity
        );
      }
      navigate('/cart');
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-[#A5A5A5]">
        Loading your order history...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="text-3xl font-black text-[#F8F5EF] tracking-tight">
          Your Previous Orders
        </h1>
        <p className="text-xs text-[#A5A5A5] mt-1">
          Track active deliveries or reorder your favorite meals with one click.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#171717] border border-white/8 text-center space-y-4">
          <div className="text-4xl">🍽️</div>
          <h3 className="text-lg font-bold text-[#F8F5EF]">No orders placed yet.</h3>
          <p className="text-xs text-[#888888]">
            Browse our partner kitchens or find budget meals to place your first order.
          </p>
          <Link
            to="/restaurants"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] text-xs font-black uppercase tracking-wider inline-block"
          >
            Explore Menus
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-5 rounded-2xl bg-[#171717] border border-white/8 hover:border-[#FF9F1C]/30 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-[#F8F5EF]">
                      {order.restaurantName || 'Kitchen'}
                    </h3>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      order.orderStatus === 'delivered'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                    }`}>
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-[#A5A5A5] mt-0.5">
                    Order #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-[#FFC857]">
                    ₹{order.totalAmount}
                  </div>
                  <div className="text-[10px] text-[#666666]">
                    {order.items?.length} items
                  </div>
                </div>
              </div>

              {/* Items summary */}
              <div className="text-xs text-[#A5A5A5] flex flex-wrap gap-2">
                {order.items?.map((it, idx) => (
                  <span key={idx} className="bg-white/5 px-2 py-1 rounded-md text-[#E0E0E0]">
                    {it.quantity}x {it.name}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <Link
                  to={`/order-tracking/${order._id}`}
                  className="text-xs font-bold text-[#FFC857] hover:underline flex items-center gap-1"
                >
                  <span>Track Status Timeline</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => handleReorder(order)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#FF9F1C] text-[#F8F5EF] hover:text-[#101010] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reorder Meal</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

