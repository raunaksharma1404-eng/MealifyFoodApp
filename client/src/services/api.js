const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('mealify_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  async demoLogin(role) {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(profileData)
    });
    return handleResponse(res);
  },

  async addAddress(addressData) {
    const res = await fetch(`${API_BASE}/auth/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(addressData)
    });
    return handleResponse(res);
  },

  async deleteAddress(addressId) {
    const res = await fetch(`${API_BASE}/auth/addresses/${addressId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Restaurants
  async getRestaurants(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/restaurants${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },

  async getRestaurantById(id) {
    const res = await fetch(`${API_BASE}/restaurants/${id}`);
    return handleResponse(res);
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/restaurants/categories`);
    return handleResponse(res);
  },

  // Foods
  async getFoods(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/foods${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },

  async getFoodById(id) {
    const res = await fetch(`${API_BASE}/foods/${id}`);
    return handleResponse(res);
  },

  async getTrendingFoods(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/foods/trending${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },

  // Night Rescue
  async getNightRescueDeals() {
    const res = await fetch(`${API_BASE}/night-rescue`);
    return handleResponse(res);
  },

  async createNightRescueDeal(dealData) {
    const res = await fetch(`${API_BASE}/night-rescue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(dealData)
    });
    return handleResponse(res);
  },

  async updateNightRescueDeal(id, updateData) {
    const res = await fetch(`${API_BASE}/night-rescue/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updateData)
    });
    return handleResponse(res);
  },

  async deleteNightRescueDeal(id) {
    const res = await fetch(`${API_BASE}/night-rescue/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Smart Budget Meal Finder
  async findBudgetMeals(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/budget/find?${query}`);
    return handleResponse(res);
  },

  // Group Ordering
  async createGroupOrder(groupData) {
    const res = await fetch(`${API_BASE}/group-orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(groupData)
    });
    return handleResponse(res);
  },

  async getGroupByCode(code) {
    const res = await fetch(`${API_BASE}/group-orders/${code}`);
    return handleResponse(res);
  },

  async joinGroupOrder(code, data) {
    const res = await fetch(`${API_BASE}/group-orders/${code}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateGroupItems(code, data) {
    const res = await fetch(`${API_BASE}/group-orders/${code}/items`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async closeGroupOrder(code) {
    const res = await fetch(`${API_BASE}/group-orders/${code}/close`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async updateMemberPayment(code, memberUserId, paid) {
    const res = await fetch(`${API_BASE}/group-orders/${code}/payment/${memberUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ paid })
    });
    return handleResponse(res);
  },

  // AI Food Assistant
  async getAIRecommendations(message, previousMessages = []) {
    const res = await fetch(`${API_BASE}/ai/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, previousMessages })
    });
    return handleResponse(res);
  },

  // Orders
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(orderData)
    });
    return handleResponse(res);
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async getOrderById(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async reorder(orderId) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/reorder`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async simulateOrderStep(orderId) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/simulate-step`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Coupons
  async getCoupons() {
    const res = await fetch(`${API_BASE}/coupons`);
    return handleResponse(res);
  },

  async validateCoupon(code, subtotal) {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal })
    });
    return handleResponse(res);
  },

  // Reviews
  async getRestaurantReviews(restaurantId) {
    const res = await fetch(`${API_BASE}/reviews/restaurant/${restaurantId}`);
    return handleResponse(res);
  },

  async createReview(reviewData) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(reviewData)
    });
    return handleResponse(res);
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async getAdminOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/orders${query ? `?${query}` : ''}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async updateOrderStatus(orderId, status, note) {
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, note })
    });
    return handleResponse(res);
  },

  async createFood(foodData) {
    const res = await fetch(`${API_BASE}/admin/foods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(foodData)
    });
    return handleResponse(res);
  },

  async updateFood(id, foodData) {
    const res = await fetch(`${API_BASE}/admin/foods/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(foodData)
    });
    return handleResponse(res);
  },

  async deleteFood(id) {
    const res = await fetch(`${API_BASE}/admin/foods/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async toggleFoodAvailability(id) {
    const res = await fetch(`${API_BASE}/admin/foods/${id}/toggle-availability`, {
      method: 'PUT',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Delivery
  async getAvailableDeliveries() {
    const res = await fetch(`${API_BASE}/delivery/available`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async acceptDelivery(orderId) {
    const res = await fetch(`${API_BASE}/delivery/accept/${orderId}`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async updateDeliveryStep(orderId, status, note) {
    const res = await fetch(`${API_BASE}/delivery/update/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, note })
    });
    return handleResponse(res);
  },

  async getDeliveryHistory() {
    const res = await fetch(`${API_BASE}/delivery/history`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  }
};

