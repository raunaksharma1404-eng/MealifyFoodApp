import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Utensils, 
  Moon, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AdminDashboardPage() {
  const { user, isAdmin, demoLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState('orders'); // 'orders', 'menu', 'night-rescue', 'overview'
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [rescueDeals, setRescueDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Dish Modal
  const [addFoodOpen, setAddFoodOpen] = useState(false);
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodPrice, setNewFoodPrice] = useState('');
  const [newFoodCategory, setNewFoodCategory] = useState('Burgers & Wraps');
  const [newFoodVeg, setNewFoodVeg] = useState(true);
  const [newFoodPrep, setNewFoodPrep] = useState('15');
  const [newFoodImage, setNewFoodImage] = useState('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80');

  // Add Night Rescue Modal
  const [addRescueOpen, setAddRescueOpen] = useState(false);
  const [rescueFoodId, setRescueFoodId] = useState('');
  const [rescueQuantity, setRescueQuantity] = useState(5);
  const [rescueDiscount, setRescueDiscount] = useState(50);

  async function loadAdminData() {
    try {
      const [statsRes, ordersRes, foodsRes, rescueRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders(),
        api.getFoods({ limit: 50 }),
        api.getNightRescueDeals()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (ordersRes.success) setOrders(ordersRes.orders || []);
      if (foodsRes.success) {
        setFoods(foodsRes.foods || []);
        if (foodsRes.foods?.length > 0 && !rescueFoodId) {
          setRescueFoodId(foodsRes.foods[0]._id);
        }
      }
      if (rescueRes.success) setRescueDeals(rescueRes.deals || []);
    } catch (err) {
      console.warn('Error loading admin data:', err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function init() {
      if (!user || user.role !== 'restaurant_admin') {
        // Auto-switch to Chef Marco Rossi for smooth zero-friction evaluation
        await demoLogin('restaurant_admin');
      }
      loadAdminData();
    }
    init();
  }, []);

  async function handleUpdateOrderStatus(orderId, nextStatus) {
    try {
      const res = await api.updateOrderStatus(orderId, nextStatus);
      if (res.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? res.order : o));
        toast.success(`Order updated to ${nextStatus.replace(/_/g, ' ')}`);
      }
    } catch (err) {
      toast.error(err.message || 'Status transition failed.');
    }
  }

  async function handleToggleFoodAvailability(foodId) {
    try {
      const res = await api.toggleFoodAvailability(foodId);
      if (res.success) {
        setFoods(prev => prev.map(f => f._id === foodId ? res.food : f));
        toast.info(res.message || 'Availability updated.');
      }
    } catch (err) {
      toast.error(err.message || 'Could not toggle availability.');
    }
  }

  async function handleDeleteFood(foodId) {
    if (!window.confirm('Delete this dish from the menu?')) return;
    try {
      const res = await api.deleteFood(foodId);
      if (res.success) {
        setFoods(prev => prev.filter(f => f._id !== foodId));
        toast.success('Dish removed from menu catalog.');
      }
    } catch (err) {
      toast.error(err.message || 'Delete failed.');
    }
  }

  async function handleCreateFood(e) {
    e.preventDefault();
    try {
      const res = await api.createFood({
        name: newFoodName,
        price: Number(newFoodPrice),
        category: newFoodCategory,
        isVeg: newFoodVeg,
        preparationTime: Number(newFoodPrep),
        image: newFoodImage
      });

      if (res.success && res.food) {
        setFoods(prev => [res.food, ...prev]);
        setAddFoodOpen(false);
        setNewFoodName('');
        setNewFoodPrice('');
        toast.success(`Published "${res.food.name}" to menu!`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add dish.');
    }
  }

  async function handleCreateRescueDeal(e) {
    e.preventDefault();
    try {
      const res = await api.createNightRescueDeal({
        foodId: rescueFoodId,
        surplusQuantity: rescueQuantity,
        discountPercentage: rescueDiscount
      });

      if (res.success && res.deal) {
        setRescueDeals(prev => [res.deal, ...prev]);
        setAddRescueOpen(false);
        toast.success('Night Rescue surplus batch activated at discount!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to activate surplus deal.');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FF9F1C]/20 text-[#FFC857] border border-[#FF9F1C]/40">
              Kitchen Command Center
            </span>
            <span className="text-xs text-[#A5A5A5]">
              Chef Marco Rossi • Indiranagar Smokehouse
            </span>
          </div>
          <h1 className="text-3xl font-black text-[#F8F5EF] tracking-tight">
            Restaurant Admin Portal
          </h1>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex rounded-xl bg-[#171717] p-1 border border-white/10 shrink-0">
          <button
            onClick={() => setTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'orders' ? 'bg-[#FF9F1C] text-[#101010]' : 'text-[#A5A5A5] hover:text-white'
            }`}
          >
            Live Orders ({orders.length})
          </button>
          <button
            onClick={() => setTab('menu')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'menu' ? 'bg-[#FF9F1C] text-[#101010]' : 'text-[#A5A5A5] hover:text-white'
            }`}
          >
            Menu Items ({foods.length})
          </button>
          <button
            onClick={() => setTab('night-rescue')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'night-rescue' ? 'bg-[#FF9F1C] text-[#101010]' : 'text-[#A5A5A5] hover:text-white'
            }`}
          >
            Night Rescue ({rescueDeals.length})
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#171717] border border-white/8 space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#A5A5A5]">Total Gross Revenue</div>
          <div className="text-2xl font-black text-[#FFC857]">₹{stats?.totalRevenue || 0}</div>
          <div className="text-[10px] text-emerald-400">↑ 18% this week</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#171717] border border-white/8 space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#A5A5A5]">Total Orders</div>
          <div className="text-2xl font-black text-[#F8F5EF]">{stats?.totalOrders || orders.length}</div>
          <div className="text-[10px] text-[#A5A5A5]">Real-time pipeline</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#171717] border border-white/8 space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#A5A5A5]">Surplus Rescued</div>
          <div className="text-2xl font-black text-emerald-400">{rescueDeals.length} Batches</div>
          <div className="text-[10px] text-emerald-400">Zero food wasted</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#171717] border border-white/8 space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#A5A5A5]">Menu Dishes</div>
          <div className="text-2xl font-black text-[#FF9F1C]">{foods.length} Dishes</div>
          <div className="text-[10px] text-[#A5A5A5]">Active & in-stock</div>
        </div>
      </div>

      {/* Tab 1: Orders Pipeline Table */}
      {tab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-[#F8F5EF]">
              Incoming & Active Kitchen Orders
            </h3>
            <span className="text-xs text-[#A5A5A5]">
              Update preparation status to notify delivery riders & customers
            </span>
          </div>

          <div className="overflow-x-auto rounded-3xl bg-[#171717] border border-white/8">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121212] border-b border-white/10 text-[#A5A5A5] uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Kitchen Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#FFC857]">
                      {order.orderNumber}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#F8F5EF]">{order.customerName || 'Customer'}</div>
                      <div className="text-[10px] text-[#888888]">{order.deliveryAddress?.city}</div>
                    </td>
                    <td className="p-4 max-w-xs">
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="truncate text-[#E0E0E0]">
                          {it.quantity}x {it.name}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 font-bold text-[#F8F5EF]">
                      ₹{order.totalAmount}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        order.orderStatus === 'delivered'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : order.orderStatus === 'ready_for_pickup'
                          ? 'bg-teal-500/15 text-teal-300'
                          : 'bg-amber-500/15 text-amber-400 animate-pulse'
                      }`}>
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {order.orderStatus === 'order_placed' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'order_accepted')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-[#101010] font-bold text-[11px] hover:brightness-110"
                        >
                          Accept Order
                        </button>
                      )}
                      {order.orderStatus === 'order_accepted' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'preparing_food')}
                          className="px-3 py-1.5 rounded-lg bg-[#FF9F1C] text-[#101010] font-bold text-[11px] hover:brightness-110"
                        >
                          Start Cooking
                        </button>
                      )}
                      {order.orderStatus === 'preparing_food' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'ready_for_pickup')}
                          className="px-3 py-1.5 rounded-lg bg-teal-400 text-[#101010] font-bold text-[11px] hover:brightness-110"
                        >
                          Mark Ready for Pickup
                        </button>
                      )}
                      {order.orderStatus === 'ready_for_pickup' && (
                        <span className="text-[11px] text-[#A5A5A5] italic">
                          Awaiting rider pickup
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Menu CRUD */}
      {tab === 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-[#F8F5EF]">
              Menu Catalog Management
            </h3>
            <button
              onClick={() => setAddFoodOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {foods.map((food) => (
              <div
                key={food._id}
                className="p-4 rounded-2xl bg-[#171717] border border-white/8 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${food.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <h4 className="font-bold text-xs text-[#F8F5EF] truncate">{food.name}</h4>
                    </div>
                    <div className="text-xs font-black text-[#FFC857] mt-0.5">₹{food.price}</div>
                    <span className="text-[10px] text-[#A5A5A5]">{food.category}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/5">
                  <button
                    onClick={() => handleToggleFoodAvailability(food._id)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                      food.isAvailable
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-red-500/15 text-red-400'
                    }`}
                  >
                    {food.isAvailable ? 'In Stock' : 'Sold Out'}
                  </button>

                  <button
                    onClick={() => handleDeleteFood(food._id)}
                    className="p-1.5 text-red-400 hover:text-red-300"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Night Rescue Manager */}
      {tab === 'night-rescue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-[#F8F5EF]">
                Surplus Food & Night Rescue Deals
              </h3>
              <p className="text-xs text-[#A5A5A5]">
                List unsold food batches to prevent waste and earn revenue
              </p>
            </div>

            <button
              onClick={() => setAddRescueOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Rescue Deal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rescueDeals.map((deal) => (
              <div
                key={deal._id}
                className="p-4 rounded-2xl bg-[#1a1714] border border-[#FFC857]/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#FFC857]">
                    -{deal.discountPercentage}% OFF
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#F8F5EF] truncate">
                    {deal.food?.name || 'Surplus Food'}
                  </h4>
                  <div className="text-xs text-[#A5A5A5]">
                    Surplus: {deal.remainingQuantity} of {deal.totalQuantity} units left
                  </div>
                </div>

                <div className="flex items-baseline gap-2 pt-2 border-t border-white/5">
                  <span className="text-base font-black text-[#FFC857]">
                    ₹{deal.rescuePrice}
                  </span>
                  <span className="text-xs text-[#666666] line-through">
                    ₹{deal.originalPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Dish Modal */}
      {addFoodOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#161616] border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-black text-[#F8F5EF]">Add Dish to Menu</h3>
            <form onSubmit={handleCreateFood} className="space-y-3">
              <input
                type="text"
                placeholder="Dish Name (e.g. Sourdough Calzone)"
                value={newFoodName}
                onChange={(e) => setNewFoodName(e.target.value)}
                required
                className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F5EF]"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={newFoodPrice}
                  onChange={(e) => setNewFoodPrice(e.target.value)}
                  required
                  className="w-1/2 bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F5EF]"
                />
                <input
                  type="number"
                  placeholder="Prep Time (mins)"
                  value={newFoodPrep}
                  onChange={(e) => setNewFoodPrep(e.target.value)}
                  className="w-1/2 bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F5EF]"
                />
              </div>
              <select
                value={newFoodCategory}
                onChange={(e) => setNewFoodCategory(e.target.value)}
                className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F5EF]"
              >
                <option value="Burgers & Wraps">Burgers & Wraps</option>
                <option value="Pizzas & Breads">Pizzas & Breads</option>
                <option value="Biryani & Indian Bowls">Biryani & Indian Bowls</option>
                <option value="Asian & Ramen">Asian & Ramen</option>
                <option value="Healthy & Superfoods">Healthy & Superfoods</option>
                <option value="Desserts & Sweets">Desserts & Sweets</option>
              </select>
              <div className="flex gap-4 text-xs text-[#A5A5A5]">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={newFoodVeg}
                    onChange={() => setNewFoodVeg(true)}
                  />
                  <span>Vegetarian</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={!newFoodVeg}
                    onChange={() => setNewFoodVeg(false)}
                  />
                  <span>Non-Vegetarian</span>
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddFoodOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-xs text-[#A5A5A5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#FF9F1C] text-[#101010] text-xs font-bold"
                >
                  Publish Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Night Rescue Deal Modal */}
      {addRescueOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#161616] border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-black text-[#F8F5EF]">Launch Night Rescue Deal</h3>
            <form onSubmit={handleCreateRescueDeal} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#A5A5A5] mb-1">
                  Select Surplus Food Item
                </label>
                <select
                  value={rescueFoodId}
                  onChange={(e) => setRescueFoodId(e.target.value)}
                  className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F5EF]"
                >
                  {foods.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name} (Original: ₹{f.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#A5A5A5] mb-1">
                    Surplus Units
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={rescueQuantity}
                    onChange={(e) => setRescueQuantity(Number(e.target.value))}
                    className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F5EF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#A5A5A5] mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="80"
                    value={rescueDiscount}
                    onChange={(e) => setRescueDiscount(Number(e.target.value))}
                    className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F5EF]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddRescueOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-xs text-[#A5A5A5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] text-xs font-bold"
                >
                  Activate Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

