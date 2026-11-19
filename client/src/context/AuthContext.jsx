import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('mealify_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize or fetch current user on mount
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Failed to restore session:', err.message);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  async function login(email, password) {
    const res = await api.login(email, password);
    if (res.success && res.token) {
      localStorage.setItem('mealify_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  }

  async function register(userData) {
    const res = await api.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('mealify_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  }

  async function demoLogin(role = 'customer') {
    const res = await api.demoLogin(role);
    if (res.success && res.token) {
      localStorage.setItem('mealify_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  }

  function logout() {
    localStorage.removeItem('mealify_token');
    setToken(null);
    setUser(null);
  }

  async function addAddress(addressData) {
    const res = await api.addAddress(addressData);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  }

  async function deleteAddress(addressId) {
    const res = await api.deleteAddress(addressId);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  }

  async function updateProfile(data) {
    const res = await api.updateProfile(data);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isCustomer: user?.role === 'customer',
        isAdmin: user?.role === 'restaurant_admin' || user?.role === 'admin',
        isRider: user?.role === 'delivery_partner',
        login,
        register,
        demoLogin,
        logout,
        addAddress,
        deleteAddress,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

