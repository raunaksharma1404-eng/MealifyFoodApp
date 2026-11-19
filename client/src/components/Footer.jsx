import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Heart, Utensils, Award, Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-white/5 pt-16 pb-12 text-[#A5A5A5] mt-24 relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-gradient-to-b from-[#FF9F1C]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9F1C] to-[#FFC857] p-[1px] shadow-lg shadow-[#FF9F1C]/20">
                <div className="w-full h-full bg-[#121212] rounded-[11px] flex items-center justify-center">
                  <span className="font-black text-xl bg-gradient-to-br from-[#FFC857] to-[#FF9F1C] bg-clip-text text-transparent">
                    M
                  </span>
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-wider text-[#F8F5EF]">
                MEALIFY
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-[#888888]">
              The next-generation 3D food delivery ecosystem powered by artificial intelligence, real-time surplus rescue, and collective group dining.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Leaf className="w-3.5 h-3.5" /> Zero Food Waste Initiative
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-3.5 h-3.5" /> Gourmet Verified
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8F5EF]">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/restaurants" className="hover:text-[#FFC857] transition-colors">
                  Top Restaurants
                </Link>
              </li>
              <li>
                <Link to="/night-rescue" className="hover:text-[#FFC857] transition-colors flex items-center gap-1.5">
                  Night Rescue <span className="text-[10px] px-1.5 py-0.2 bg-[#FF9F1C]/20 text-[#FFC857] rounded">Save 50%</span>
                </Link>
              </li>
              <li>
                <Link to="/budget-finder" className="hover:text-[#FFC857] transition-colors">
                  Smart Budget Meal Finder
                </Link>
              </li>
              <li>
                <Link to="/group-order" className="hover:text-[#FFC857] transition-colors">
                  Group Ordering Room
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals & Roles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8F5EF]">
              Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/admin" className="hover:text-[#FFC857] transition-colors flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#FF9F1C]" /> Restaurant & Admin
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:text-[#FFC857] transition-colors flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5 text-[#10B981]" /> Delivery Partner Hub
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-[#FFC857] transition-colors">
                  Customer Profile
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#FFC857] transition-colors">
                  Cart & Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8F5EF]">
              Architecture
            </h4>
            <p className="text-xs text-[#888888] leading-relaxed">
              Engineered with React 19, Vite, Tailwind CSS, Node.js REST API, Framer Motion, and Grounded AI Intent matching.
            </p>
            <div className="pt-2 text-xs text-[#FFC857] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 3D Neo-Futuristic System
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#666666] gap-4">
          <p>© 2026 MEALIFY Inc. All rights reserved. Crafted for food lovers.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Security Audit</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

