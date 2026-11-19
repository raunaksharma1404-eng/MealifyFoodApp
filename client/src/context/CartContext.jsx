import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('mealify_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [restaurant, setRestaurant] = useState(() => {
    try {
      const saved = localStorage.getItem('mealify_cart_restaurant');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [coupon, setCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('mealify_cart', JSON.stringify(items));
    localStorage.setItem('mealify_cart_restaurant', JSON.stringify(restaurant));
  }, [items, restaurant]);

  // Recalculate coupon when items change
  useEffect(() => {
    if (coupon) {
      const currentSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      if (currentSubtotal < (coupon.minOrder || 0)) {
        setCoupon(null);
        setCouponDiscount(0);
        setCouponError(`Coupon removed: minimum order of ₹${coupon.minOrder} required.`);
      } else {
        const raw = (currentSubtotal * coupon.discountPercent) / 100;
        setCouponDiscount(Math.min(raw, coupon.maxDiscount || raw));
      }
    }
  }, [items, coupon]);

  function addItem(food, quantity = 1, rescueDeal = null) {
    const foodRestId = typeof food.restaurant === 'object' ? food.restaurant._id : food.restaurant;
    const foodRestName = typeof food.restaurant === 'object' ? food.restaurant.name : 'MEALIFY Kitchen';

    // Check if adding from another restaurant
    if (restaurant && restaurant.id && restaurant.id !== foodRestId) {
      const confirmed = window.confirm(
        `Your cart contains items from "${restaurant.name}". Starting a new order from "${foodRestName}" will reset your cart. Proceed?`
      );
      if (!confirmed) return false;
      // Reset cart for new restaurant
      setItems([]);
      setCoupon(null);
      setCouponDiscount(0);
    }

    setRestaurant({ id: foodRestId, name: foodRestName });

    const effectivePrice = rescueDeal ? rescueDeal.rescuePrice : food.price;
    const cartItemId = rescueDeal ? `${food._id}_rescue_${rescueDeal._id}` : String(food._id);

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: cartItemId,
            foodId: food._id,
            name: food.name + (rescueDeal ? ' (Night Rescue)' : ''),
            price: effectivePrice,
            originalPrice: food.price,
            quantity,
            image: food.image,
            isVeg: food.isVeg,
            restaurantId: foodRestId,
            restaurantName: foodRestName,
            rescueDealId: rescueDeal ? rescueDeal._id : null
          }
        ];
      }
    });

    return true;
  }

  function updateQuantity(itemId, delta) {
    setItems(prevItems => {
      return prevItems
        .map(item => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  }

  function removeItem(itemId) {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }

  function clearCart() {
    setItems([]);
    setRestaurant(null);
    setCoupon(null);
    setCouponDiscount(0);
    setCouponError('');
    localStorage.removeItem('mealify_cart');
    localStorage.removeItem('mealify_cart_restaurant');
  }

  async function applyCoupon(code) {
    setCouponError('');
    try {
      const currentSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const res = await api.validateCoupon(code, currentSubtotal);
      if (res.success && res.valid) {
        setCoupon(res.coupon);
        setCouponDiscount(res.discount);
        return { success: true, message: `Applied coupon ${res.coupon.code} (-₹${res.discount})` };
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon');
      return { success: false, message: err.message };
    }
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponDiscount(0);
    setCouponError('');
  }

  // Price calculations
  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 39 : 0;
  const tax = items.length > 0 ? Math.round(subtotal * 0.05) : 0;
  const finalTotal = Math.max(0, subtotal + deliveryFee + tax - couponDiscount);

  return (
    <CartContext.Provider
      value={{
        items,
        restaurant,
        totalItemsCount,
        subtotal,
        deliveryFee,
        tax,
        discount: couponDiscount,
        finalTotal,
        coupon,
        couponError,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

