import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Shield, Bike, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const { login, register, demoLogin } = useAuth();
  const { toast } = useToast();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer'); // 'customer', 'restaurant_admin', 'delivery_partner'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        toast.success(`Welcome back, ${res.user.name}!`);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        role
      });
      if (res.success) {
        toast.success(`Account created! Welcome to MEALIFY, ${res.user.name}.`);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDemo(personaRole) {
    setError('');
    setLoading(true);
    try {
      const res = await demoLogin(personaRole);
      if (res.success) {
        toast.success(`Logged in as demo ${res.user.role.replace('_', ' ')} (${res.user.name})`);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-[#151515] border border-[#FFC857]/30 shadow-2xl shadow-black p-6 sm:p-8 overflow-hidden">
        
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF9F1C]/15 blur-3xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A5A5A5] hover:text-[#F8F5EF] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF9F1C] to-[#FFC857] p-[1.5px] shadow-lg shadow-[#FF9F1C]/20">
            <div className="w-full h-full bg-[#121212] rounded-[14px] flex items-center justify-center">
              <span className="font-black text-xl bg-gradient-to-br from-[#FFC857] to-[#FF9F1C] bg-clip-text text-transparent">
                M
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-[#F8F5EF]">
              {mode === 'login' ? 'Welcome Back' : 'Join MEALIFY'}
            </h3>
            <p className="text-xs text-[#A5A5A5]">
              {mode === 'login' ? 'Sign in to access your orders & cravings' : 'Discover 3D food delivery & surplus rescue'}
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-[#1c1c1c] p-1 border border-white/5 mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] shadow'
                : 'text-[#A5A5A5] hover:text-[#F8F5EF]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] shadow'
                : 'text-[#A5A5A5] hover:text-[#F8F5EF]'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#A5A5A5] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@mealify.com"
                  required
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F8F5EF] placeholder-[#666666] focus:outline-none focus:border-[#FF9F1C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A5A5A5] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F8F5EF] placeholder-[#666666] focus:outline-none focus:border-[#FF9F1C]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#FF9F1C]/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In To MEALIFY'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#A5A5A5] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Sharma"
                  required
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-[#F8F5EF] focus:outline-none focus:border-[#FF9F1C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A5A5A5] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya@example.com"
                  required
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-[#F8F5EF] focus:outline-none focus:border-[#FF9F1C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#A5A5A5] uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    required
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl pl-10 pr-3 py-2 text-sm text-[#F8F5EF] focus:outline-none focus:border-[#FF9F1C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A5A5A5] uppercase tracking-wider mb-1">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl pl-10 pr-3 py-2 text-sm text-[#F8F5EF] focus:outline-none focus:border-[#FF9F1C]"
                  />
                </div>
              </div>
            </div>

            {/* Account Role Choice */}
            <div>
              <label className="block text-xs font-bold text-[#A5A5A5] uppercase tracking-wider mb-1">
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'customer', label: 'Customer', icon: User },
                  { id: 'restaurant_admin', label: 'Restaurant', icon: Shield },
                  { id: 'delivery_partner', label: 'Rider', icon: Bike },
                ].map(r => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 border transition-all ${
                        role === r.id
                          ? 'bg-[#FF9F1C]/20 border-[#FF9F1C] text-[#FFC857]'
                          : 'bg-[#1c1c1c] border-white/5 text-[#A5A5A5]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#FF9F1C]/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}

        {/* Quick Demo Access Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
            Or Quick 1-Click Demo Login
          </span>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => handleDemo('customer')}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-semibold text-[#FFC857] border border-white/5 cursor-pointer"
            >
              👤 Alex (Customer)
            </button>
            <button
              type="button"
              onClick={() => handleDemo('restaurant_admin')}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-semibold text-[#FF9F1C] border border-white/5 cursor-pointer"
            >
              👨‍🍳 Marco (Admin)
            </button>
            <button
              type="button"
              onClick={() => handleDemo('delivery_partner')}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-semibold text-emerald-400 border border-white/5 cursor-pointer"
            >
              🛵 Vikram (Rider)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

