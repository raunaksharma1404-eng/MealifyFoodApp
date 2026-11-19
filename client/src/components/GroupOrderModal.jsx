import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Users, Copy, Check, ArrowRight, Clock, DollarSign, Utensils } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function GroupOrderModal({ isOpen, onClose }) {
  const { user, isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('create'); // 'create' or 'join'
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestId, setSelectedRestId] = useState('');
  const [deadlineMinutes, setDeadlineMinutes] = useState(30);
  const [paymentOption, setPaymentOption] = useState('host_pays');
  const [joinCode, setJoinCode] = useState('');
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const res = await api.getRestaurants();
        if (res.success && res.restaurants) {
          setRestaurants(res.restaurants);
          if (res.restaurants.length > 0) {
            setSelectedRestId(res.restaurants[0]._id);
          }
        }
      } catch (err) {
        console.warn('Error fetching restaurants:', err.message);
      }
    }
    if (isOpen) {
      loadRestaurants();
    }
  }, [isOpen]);

  async function handleCreateGroup(e) {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      await demoLogin('customer');
    }

    setLoading(true);
    try {
      const res = await api.createGroupOrder({
        restaurantId: selectedRestId,
        deadlineMinutes,
        paymentOption
      });

      if (res.success && res.group) {
        onClose();
        navigate(`/group/${res.group.code}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinGroup(e) {
    e.preventDefault();
    setError('');
    if (!joinCode.trim()) {
      setError('Please enter an invitation code');
      return;
    }

    setLoading(true);
    try {
      const cleanCode = joinCode.trim().toUpperCase();
      const res = await api.joinGroupOrder(cleanCode, {
        guestName: guestName.trim() || 'Foodie Friend'
      });

      if (res.success && res.group) {
        onClose();
        navigate(`/group/${res.group.code}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to join group. Verify the invite code.');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#151515] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A5A5A5] hover:text-[#F8F5EF]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FF9F1C]/15 border border-[#FF9F1C]/40 flex items-center justify-center text-[#FFC857]">
            <Users className="w-6 h-6 text-[#FF9F1C]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#F8F5EF]">
              Group Food Ordering
            </h3>
            <p className="text-xs text-[#A5A5A5]">
              Good Food Is Better Together • Shared Live Cart
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex rounded-xl bg-[#1f1f1f] p-1 border border-white/5 mb-6">
          <button
            type="button"
            onClick={() => setMode('create')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'create'
                ? 'bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] shadow'
                : 'text-[#A5A5A5] hover:text-[#F8F5EF]'
            }`}
          >
            Create New Group
          </button>
          <button
            type="button"
            onClick={() => setMode('join')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'join'
                ? 'bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] shadow'
                : 'text-[#A5A5A5] hover:text-[#F8F5EF]'
            }`}
          >
            Join with Code
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
            {error}
          </div>
        )}

        {mode === 'create' ? (
          <form onSubmit={handleCreateGroup} className="space-y-4">
            
            {/* Restaurant Selector */}
            <div>
              <label className="block text-xs font-bold text-[#A5A5A5] uppercase tracking-wider mb-1.5">
                Select Restaurant
              </label>
              <select
                value={selectedRestId}
                onChange={(e) => setSelectedRestId(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F8F5EF] focus:outline-none focus:border-[#FF9F1C]"
              >
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name} ({r.cuisines?.slice(0, 2).join(', ')})
                  </option>
                ))}
              </select>
            </div>

            {/* Deadline selection */}
            <div>
              <label className="block text-xs font-bold text-[#A5A5A5] uppercase tracking-wider mb-1.5">
                Ordering Window Deadline
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDeadlineMinutes(mins)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      deadlineMinutes === mins
                        ? 'bg-[#FF9F1C]/20 border-[#FF9F1C] text-[#FFC857]'
                        : 'bg-white/5 border-white/5 text-[#A5A5A5]'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Mode Selection */}
            <div>
              <label className="block text-xs font-bold text-[#A5A5A5] uppercase tracking-wider mb-1.5">
                Settlement Preference
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentOption('host_pays')}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    paymentOption === 'host_pays'
                      ? 'bg-[#FF9F1C]/20 border-[#FF9F1C] text-[#FFC857]'
                      : 'bg-white/5 border-white/5 text-[#A5A5A5]'
                  }`}
                >
                  <div className="font-bold text-xs">Host Pays Everything</div>
                  <div className="text-[10px] text-[#888888]">Single invoice covered by host</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentOption('individual_split')}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    paymentOption === 'individual_split'
                      ? 'bg-[#FF9F1C]/20 border-[#FF9F1C] text-[#FFC857]'
                      : 'bg-white/5 border-white/5 text-[#A5A5A5]'
                  }`}
                >
                  <div className="font-bold text-xs">Individual Split</div>
                  <div className="text-[10px] text-[#888888]">Each member pays their share</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] font-black text-sm hover:brightness-110 shadow-lg shadow-[#FF9F1C]/25 transition-all cursor-pointer"
            >
              {loading ? 'Creating Shared Room...' : 'Generate Group Room & Link'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoinGroup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#A5A5A5] uppercase tracking-wider mb-1.5">
                Invitation Code
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="e.g. GRP-4829"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-3 text-base font-mono tracking-wider uppercase text-[#FFC857] placeholder-[#666666] focus:outline-none focus:border-[#FF9F1C]"
              />
            </div>

            {!isAuthenticated && (
              <div>
                <label className="block text-xs font-bold text-[#A5A5A5] uppercase tracking-wider mb-1.5">
                  Your Name / Nickname
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Rohan"
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F8F5EF] placeholder-[#666666] focus:outline-none focus:border-[#FF9F1C]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] font-black text-sm hover:brightness-110 shadow-lg shadow-[#FF9F1C]/25 transition-all cursor-pointer"
            >
              {loading ? 'Joining Room...' : 'Join Shared Cart'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

