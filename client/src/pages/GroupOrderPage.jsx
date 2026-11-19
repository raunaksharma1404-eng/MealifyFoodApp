import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  Copy, 
  Check, 
  Clock, 
  Plus, 
  Minus, 
  Trash2, 
  Lock, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function GroupOrderPage() {
  const { code } = useParams();
  const { user, isAuthenticated, demoLogin } = useAuth();
  const { addItem, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [closing, setClosing] = useState(false);

  // Current member's selected items locally before sync
  const [myItems, setMyItems] = useState([]);

  async function fetchGroupData() {
    if (!code) return;
    try {
      const res = await api.getGroupByCode(code);
      if (res.success && res.group) {
        setGroup(res.group);
        setRestaurant(res.restaurant);
        setMenu(res.menu || []);

        // Load current member's items if already in group
        const currentUserId = user ? String(user._id) : null;
        if (currentUserId) {
          const myMember = (res.group.members || []).find(m => String(m.userId) === currentUserId);
          if (myMember) {
            setMyItems(myMember.items || []);
          }
        }
      }
    } catch (err) {
      console.warn('Error loading group:', err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGroupData();
    const interval = setInterval(fetchGroupData, 4000); // Live poll shared group every 4 seconds
    return () => clearInterval(interval);
  }, [code, user]);

  function copyInviteLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Group room invite link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleAddDishToMyShare(dish) {
    if (!group || group.status !== 'active') return;

    if (!isAuthenticated) {
      await demoLogin('customer');
    }

    const currentUserId = user ? String(user._id) : 'guest';
    const existingIndex = myItems.findIndex(i => String(i.foodId) === String(dish._id));

    let updated = [...myItems];
    if (existingIndex > -1) {
      updated[existingIndex].quantity += 1;
    } else {
      updated.push({
        foodId: dish._id,
        name: dish.name,
        price: dish.price,
        quantity: 1,
        isVeg: dish.isVeg
      });
    }

    setMyItems(updated);
    await api.updateGroupItems(group.code, {
      userId: currentUserId,
      items: updated
    });
    fetchGroupData();
  }

  async function handleUpdateMyItemQty(foodId, delta) {
    if (!group || group.status !== 'active') return;
    const currentUserId = user ? String(user._id) : 'guest';

    let updated = myItems
      .map(it => {
        if (String(it.foodId) === String(foodId)) {
          const newQty = it.quantity + delta;
          return newQty > 0 ? { ...it, quantity: newQty } : null;
        }
        return it;
      })
      .filter(Boolean);

    setMyItems(updated);
    await api.updateGroupItems(group.code, {
      userId: currentUserId,
      items: updated
    });
    fetchGroupData();
  }

  async function handleCloseGroup() {
    if (!group) return;
    setClosing(true);
    try {
      const res = await api.closeGroupOrder(group.code);
      if (res.success && res.group) {
        setGroup(res.group);
        toast.success('Group cart finalized and closed! Ready for checkout.');
      }
    } catch (err) {
      toast.error(err.message || 'Only the host can close the group order.');
    } finally {
      setClosing(false);
    }
  }

  async function handleTogglePayment(memberUserId, currentPaid) {
    try {
      await api.updateMemberPayment(group.code, memberUserId, !currentPaid);
      fetchGroupData();
    } catch (err) {
      console.warn('Payment update failed:', err.message);
    }
  }

  function handleHostProceedToCheckout() {
    // Populate cart with all group items
    clearCart();
    for (const member of group.members || []) {
      for (const item of member.items || []) {
        addItem(
          {
            _id: item.foodId,
            name: `${item.name} (${member.name})`,
            price: item.price,
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
            isVeg: item.isVeg,
            restaurant: group.restaurant
          },
          item.quantity
        );
      }
    }
    navigate('/checkout');
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-[#A5A5A5]">
        Joining group room and synchronizing shared cart...
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#F8F5EF]">Group Room Not Found</h2>
        <p className="text-xs text-[#A5A5A5]">The invitation code "{code}" does not exist or has expired.</p>
        <Link to="/" className="px-4 py-2 rounded-xl bg-[#FF9F1C] text-[#101010] text-xs font-bold inline-block">
          Return Home
        </Link>
      </div>
    );
  }

  const isHost = user && String(group.host) === String(user._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Room Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171a17] via-[#141414] to-[#121212] border border-emerald-500/25 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Shared Group Cart
            </span>
            <span className="text-xs font-mono font-bold text-[#FFC857] bg-white/5 px-2 py-0.5 rounded border border-white/10">
              Code: {group.code}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#F8F5EF] tracking-tight">
            Dining from {group.restaurantName}
          </h1>

          <p className="text-xs sm:text-sm text-[#A5A5A5] mt-1">
            Host: <span className="font-bold text-[#F8F5EF]">{group.hostName}</span> • Settlement: <span className="capitalize text-[#FFC857]">{group.paymentOption.replace('_', ' ')}</span>
          </p>
        </div>

        {/* Copy Share Link & Status */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={copyInviteLink}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#F8F5EF] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#FFC857]" />}
            <span>{copied ? 'Link Copied!' : 'Copy Invite Link'}</span>
          </button>

          {isHost && group.status === 'active' && (
            <button
              onClick={handleCloseGroup}
              disabled={closing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] text-xs font-black uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#FF9F1C]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{closing ? 'Closing...' : 'Close & Finalize'}</span>
            </button>
          )}

          {isHost && group.status === 'closed' && (
            <button
              onClick={handleHostProceedToCheckout}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-[#101010] text-xs font-black uppercase tracking-wider hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Host Checkout (₹{group.totalAmount})</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Shared Participants and Items Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-[#F8F5EF] flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>Group Members ({group.members?.length || 0})</span>
            </h3>
            <span className="text-xs text-[#A5A5A5]">
              Total Shared: <span className="font-bold text-[#FFC857]">₹{group.totalAmount || 0}</span>
            </span>
          </div>

          <div className="space-y-4">
            {(group.members || []).map((member, idx) => (
              <div
                key={member.userId || idx}
                className="p-5 rounded-3xl bg-[#171717] border border-white/8 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + member.name}
                      alt={member.name}
                      className="w-10 h-10 rounded-xl bg-black border border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#F8F5EF]">{member.name}</h4>
                        {String(group.host) === String(member.userId) && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded bg-amber-500/20 text-[#FFC857] border border-amber-500/30">
                            Host
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-[#FFC857]">
                        Portion: ₹{member.subtotal || 0}
                      </span>
                    </div>
                  </div>

                  {/* Payment settlement badge */}
                  {group.paymentOption === 'individual_split' && (
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                        member.paymentStatus === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {member.paymentStatus === 'paid' ? 'Paid ✓' : 'Unpaid ⏳'}
                      </span>
                      {isHost && (
                        <button
                          onClick={() => handleTogglePayment(member.userId, member.paymentStatus === 'paid')}
                          className="text-[10px] text-[#A5A5A5] hover:text-[#FFC857] underline cursor-pointer"
                        >
                          Toggle
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Items chosen by this member */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  {(!member.items || member.items.length === 0) ? (
                    <p className="text-xs text-[#666666] italic">No items chosen yet.</p>
                  ) : (
                    member.items.map((it, iIdx) => (
                      <div key={iIdx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${it.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <span className="text-[#E0E0E0]">
                            {it.quantity}x {it.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#F8F5EF]">
                            ₹{it.price * it.quantity}
                          </span>
                          {/* If current user, allow quick adjustments */}
                          {user && String(user._id) === String(member.userId) && group.status === 'active' && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleUpdateMyItemQty(it.foodId, -1)}
                                className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-[10px]"
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleUpdateMyItemQty(it.foodId, 1)}
                                className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-[10px]"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Restaurant Menu to Pick Food */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#171717] border border-white/8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-[#F8F5EF]">
              Select From Kitchen Menu
            </h3>
            <span className="text-xs text-[#A5A5A5]">
              {menu.length} dishes
            </span>
          </div>

          {group.status !== 'active' ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
              This group order is finalized and closed for new items.
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {menu.map((dish) => (
                <div
                  key={dish._id}
                  className="p-3 rounded-2xl bg-[#121212] border border-white/5 flex items-center justify-between gap-3 hover:border-[#FF9F1C]/40 transition-all"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-[#F8F5EF] truncate">
                      {dish.name}
                    </h5>
                    <div className="text-xs font-black text-[#FFC857] mt-0.5">
                      ₹{dish.price}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddDishToMyShare(dish)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#FF9F1C] text-xs font-bold text-[#F8F5EF] hover:text-[#101010] flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

