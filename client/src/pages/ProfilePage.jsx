import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Phone, Mail, Shield, Bike, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, addAddress, deleteAddress, demoLogin } = useAuth();

  const [newLabel, setNewLabel] = useState('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru');
  const [newZip, setNewZip] = useState('560001');
  const [showAdd, setShowAdd] = useState(false);

  async function handleAddAddr(e) {
    e.preventDefault();
    if (!newStreet.trim()) return;

    await addAddress({
      label: newLabel,
      street: newStreet.trim(),
      city: newCity.trim(),
      state: 'Karnataka',
      zipCode: newZip.trim(),
      isDefault: (user?.addresses?.length || 0) === 0
    });

    setNewStreet('');
    setShowAdd(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[#F8F5EF] tracking-tight">
          Customer Profile & Settings
        </h1>
        <p className="text-xs text-[#A5A5A5] mt-1">
          Manage your delivery addresses, account personas, and dining preferences.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 rounded-3xl bg-[#171717] border border-white/8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
            alt={user?.name || 'User'}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FFC857]/40 shadow-xl"
          />

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-[#F8F5EF]">{user?.name || 'Alex Mercer'}</h2>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FF9F1C]/20 text-[#FFC857] border border-[#FF9F1C]/40">
                {user?.role?.replace(/_/g, ' ') || 'Customer'}
              </span>
            </div>
            <div className="text-xs text-[#A5A5A5] flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#FF9F1C]" /> {user?.email || 'alex@mealify.com'}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> {user?.phone || '+91 98765 43210'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Portal Access */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5">
          <Link
            to="/orders"
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-center text-xs font-semibold text-[#F8F5EF] transition-colors"
          >
            📦 View Order History
          </Link>
          <Link
            to="/admin"
            className="p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-center text-xs font-semibold text-[#FFC857] transition-colors"
          >
            🛡️ Restaurant Admin Panel
          </Link>
          <Link
            to="/delivery"
            className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-center text-xs font-semibold text-emerald-400 transition-colors"
          >
            🛵 Delivery Partner Panel
          </Link>
        </div>
      </div>

      {/* Saved Addresses Section */}
      <div className="p-6 rounded-3xl bg-[#171717] border border-white/8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FF9F1C]" />
            <h3 className="font-extrabold text-base text-[#F8F5EF]">
              Saved Delivery Addresses
            </h3>
          </div>

          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-xs font-bold text-[#FFC857] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAdd ? 'Cancel' : 'Add New Address'}</span>
          </button>
        </div>

        {/* Add Address Form */}
        {showAdd && (
          <form onSubmit={handleAddAddr} className="p-4 rounded-2xl bg-[#121212] border border-white/10 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Label (e.g. Home, Office, Gym)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8F5EF]"
              />
              <input
                type="text"
                placeholder="City"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8F5EF]"
              />
            </div>
            <input
              type="text"
              placeholder="Street Address / Flat No / Building"
              value={newStreet}
              onChange={(e) => setNewStreet(e.target.value)}
              className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F8F5EF]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#FF9F1C] text-[#101010] text-xs font-bold"
            >
              Save Address
            </button>
          </form>
        )}

        {/* Address Cards */}
        <div className="space-y-3">
          {(user?.addresses || []).map((addr) => (
            <div
              key={addr.id}
              className="p-4 rounded-2xl bg-[#121212] border border-white/5 flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#F8F5EF]">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded text-emerald-400">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#A5A5A5]">
                  {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                </p>
              </div>

              <button
                onClick={() => deleteAddress(addr.id)}
                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg"
                title="Remove address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

