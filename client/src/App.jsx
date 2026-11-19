import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistantModal from './components/AIAssistantModal';
import GroupOrderModal from './components/GroupOrderModal';
import AuthModal from './components/AuthModal';

// Pages
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import FoodDetailPage from './pages/FoodDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import NightRescuePage from './pages/NightRescuePage';
import BudgetFinderPage from './pages/BudgetFinderPage';
import GroupOrderPage from './pages/GroupOrderPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DeliveryDashboardPage from './pages/DeliveryDashboardPage';

export default function App() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-[#101010] text-[#F8F5EF] flex flex-col justify-between selection:bg-[#FF9F1C] selection:text-[#101010]">
              
              {/* Main Navigation Bar */}
              <Navbar
                onOpenAI={() => setAiModalOpen(true)}
                onOpenGroup={() => setGroupModalOpen(true)}
                onOpenAuth={() => setAuthModalOpen(true)}
              />

              {/* Application Viewport */}
              <main className="flex-1">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <HomePage
                        onOpenAI={() => setAiModalOpen(true)}
                        onOpenGroup={() => setGroupModalOpen(true)}
                      />
                    }
                  />
                  <Route path="/restaurants" element={<RestaurantsPage />} />
                  <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
                  <Route path="/food/:id" element={<FoodDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmed/:id" element={<OrderConfirmationPage />} />
                  <Route path="/order-tracking/:id" element={<OrderTrackingPage />} />
                  <Route path="/orders" element={<OrderHistoryPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  
                  {/* 4 Unique Feature Routes */}
                  <Route path="/night-rescue" element={<NightRescuePage />} />
                  <Route path="/budget-finder" element={<BudgetFinderPage />} />
                  <Route
                    path="/group-order"
                    element={
                      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
                        <div className="text-4xl">👥</div>
                        <h2 className="text-3xl font-black text-[#F8F5EF]">Group Food Ordering</h2>
                        <p className="text-sm text-[#A5A5A5] max-w-md mx-auto">
                          Order together with colleagues or friends. Create a room or join with a shared code.
                        </p>
                        <button
                          onClick={() => setGroupModalOpen(true)}
                          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#FF9F1C]/25"
                        >
                          Launch Group Room Setup
                        </button>
                      </div>
                    }
                  />
                  <Route path="/group/:code" element={<GroupOrderPage />} />

                  {/* Role Dashboards */}
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/delivery" element={<DeliveryDashboardPage />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Global AI Craving Modal */}
              <AIAssistantModal
                isOpen={aiModalOpen}
                onClose={() => setAiModalOpen(false)}
              />

              {/* Global Group Order Modal */}
              <GroupOrderModal
                isOpen={groupModalOpen}
                onClose={() => setGroupModalOpen(false)}
              />

              {/* Global Authentication Modal */}
              <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
              />

              {/* Footer */}
              <Footer />

            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
