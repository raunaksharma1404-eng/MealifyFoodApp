import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Sparkles, 
  Moon, 
  DollarSign, 
  Users, 
  User, 
  LogOut, 
  Shield, 
  Bike, 
  Search, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenAI, onOpenSearch, onOpenAuth }) {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const { totalItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Restaurants', path: '/restaurants' },
    { name: 'Night Rescue', path: '/night-rescue', badge: 'Save 50%+' },
    { name: 'Budget Finder', path: '/budget-finder' },
    { name: 'Group Order', path: '/group-order' },
  ];

  async function handleSwitchRole(role) {
    setRoleDropdownOpen(false);
    await demoLogin(role);
    if (role === 'restaurant_admin') {
      navigate('/admin');
    } else if (role === 'delivery_partner') {
      navigate('/delivery');
    } else {
      navigate('/');
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#101010]/85 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with 3D Golden Emblem */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF9F1C] to-[#FFC857] p-[1.5px] shadow-lg shadow-[#FF9F1C]/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <div className="w-full h-full bg-[#121212] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <span className="font-black text-2xl tracking-tighter bg-gradient-to-br from-[#FFC857] to-[#FF9F1C] bg-clip-text text-transparent">
                  M
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-wider text-[#F8F5EF] flex items-center gap-1">
                MEALIFY
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F1C] inline-block animate-pulse" />
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#A5A5A5] -mt-1 font-semibold">
                3D Neo Food
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#FFC857] bg-white/5 shadow-inner'
                      : 'text-[#A5A5A5] hover:text-[#F8F5EF] hover:bg-white/5'
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010]">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            
            {/* AI Craving Button */}
            <button
              onClick={onOpenAI}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-[#FF9F1C]/40 text-[#FFC857] hover:border-[#FF9F1C] hover:bg-[#FF9F1C]/25 transition-all shadow-lg shadow-[#FF9F1C]/10 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FF9F1C] animate-spin" style={{ animationDuration: '6s' }} />
              <span>AI Craving</span>
            </button>

            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1c1c1c] border border-white/10 text-[#F8F5EF] hover:border-[#FF9F1C]/40 transition-all cursor-pointer"
                title="Switch demo persona"
              >
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="capitalize">
                  {user ? (user.role === 'restaurant_admin' ? 'Chef (Admin)' : user.role === 'delivery_partner' ? 'Rider' : 'Customer') : 'Switch Role'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#A5A5A5]" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#191919] border border-white/10 shadow-2xl p-2 z-50 backdrop-blur-2xl">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#A5A5A5]">
                    Quick Demo Roles
                  </div>
                  <button
                    onClick={() => handleSwitchRole('customer')}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#F8F5EF] hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#FFC857]" />
                    <div>
                      <div className="font-semibold">Alex Mercer</div>
                      <div className="text-[10px] text-[#A5A5A5]">Customer Mode</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSwitchRole('restaurant_admin')}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#F8F5EF] hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-[#FF9F1C]" />
                    <div>
                      <div className="font-semibold">Chef Marco Rossi</div>
                      <div className="text-[10px] text-[#A5A5A5]">Restaurant / Admin Panel</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSwitchRole('delivery_partner')}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#F8F5EF] hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Bike className="w-4 h-4 text-[#10B981]" />
                    <div>
                      <div className="font-semibold">Vikram Singh</div>
                      <div className="text-[10px] text-[#A5A5A5]">Delivery Partner Panel</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-[#191919] border border-white/10 hover:border-[#FF9F1C]/40 text-[#F8F5EF] transition-all flex items-center justify-center cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-[#FFC857]" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] text-[11px] font-black flex items-center justify-center shadow-lg shadow-[#FF9F1C]/40 animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* User Account / Navigation */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-[#191919] border border-white/10 hover:border-white/20 transition-all"
                >
                  <img
                    src={user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Mealify'}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover bg-black/40"
                  />
                  <span className="text-xs font-semibold text-[#F8F5EF] hidden md:inline truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-[#A5A5A5] hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] hover:brightness-110 shadow-lg shadow-[#FF9F1C]/25 transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#191919] border border-white/10 text-[#F8F5EF]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-[#F8F5EF] hover:bg-white/5"
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010]">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/5 flex gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAI(); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-[#FF9F1C]/20 border border-[#FF9F1C] text-[#FFC857]"
              >
                <Sparkles className="w-4 h-4" /> AI Craving
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

