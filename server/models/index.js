const mongoose = require('mongoose');
const { isMemoryMode } = require('../config/db');

// In-Memory Storage Tables
const memoryStore = {
  users: [],
  restaurants: [],
  categories: [],
  foods: [],
  nightRescueDeals: [],
  orders: [],
  groupOrders: [],
  coupons: [],
  reviews: [],
};

// Helper: generate consistent MongoDB-like ObjectIds
function generateId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return timestamp + random;
}

// Deep clone helper
function clone(obj) {
  if (!obj) return obj;
  return JSON.parse(JSON.stringify(obj));
}

// Filter matching helper
function matchesFilter(item, filter) {
  if (!filter || Object.keys(filter).length === 0) return true;

  for (const [key, value] of Object.entries(filter)) {
    if (key === '_id' || key === 'id') {
      const targetId = String(item._id || item.id);
      if (typeof value === 'object' && value !== null) {
        if (value.$in && Array.isArray(value.$in)) {
          if (!value.$in.map(String).includes(targetId)) return false;
        } else if (value.$ne && String(value.$ne) === targetId) {
          return false;
        }
      } else if (String(value) !== targetId) {
        return false;
      }
      continue;
    }

    if (key === '$or' && Array.isArray(value)) {
      const anyMatch = value.some(subFilter => matchesFilter(item, subFilter));
      if (!anyMatch) return false;
      continue;
    }

    const itemVal = item[key];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (value.$regex) {
        const regex = new RegExp(value.$regex, value.$options || 'i');
        if (!regex.test(String(itemVal || ''))) return false;
      }
      if (value.$in && Array.isArray(value.$in)) {
        if (Array.isArray(itemVal)) {
          if (!itemVal.some(v => value.$in.includes(v))) return false;
        } else {
          if (!value.$in.includes(itemVal)) return false;
        }
      }
      if (value.$gte !== undefined && Number(itemVal) < Number(value.$gte)) return false;
      if (value.$lte !== undefined && Number(itemVal) > Number(value.$lte)) return false;
      if (value.$gt !== undefined && Number(itemVal) <= Number(value.$gt)) return false;
      if (value.$lt !== undefined && Number(itemVal) >= Number(value.$lt)) return false;
      if (value.$ne !== undefined && itemVal === value.$ne) return false;
    } else {
      if (itemVal !== value) return false;
    }
  }
  return true;
}

// Memory Query Builder with chainable sort, skip, limit, and infinite populate chaining
class MemoryQuery {
  constructor(collectionName, filter = {}) {
    this.collectionName = collectionName;
    this.filter = filter;
    this._sort = null;
    this._limit = null;
    this._skip = 0;
    this._populates = [];
    this._isSingle = false;
  }

  sort(sortObj) {
    this._sort = sortObj;
    return this;
  }

  limit(n) {
    this._limit = Number(n);
    return this;
  }

  skip(n) {
    this._skip = Number(n);
    return this;
  }

  populate(field) {
    if (field) {
      if (typeof field === 'string') {
        this._populates.push(field);
      } else if (typeof field === 'object' && field.path) {
        this._populates.push(field.path);
      }
    }
    return this;
  }

  async exec() {
    let results = (memoryStore[this.collectionName] || []).filter(item => matchesFilter(item, this.filter));

    if (this._sort) {
      const [sortKey, sortDir] = Object.entries(this._sort)[0] || [];
      if (sortKey) {
        const dir = (sortDir === -1 || sortDir === 'desc') ? -1 : 1;
        results.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return -1 * dir;
          if (a[sortKey] > b[sortKey]) return 1 * dir;
          return 0;
        });
      }
    }

    if (this._skip > 0) {
      results = results.slice(this._skip);
    }

    if (this._limit && this._limit > 0) {
      results = results.slice(0, this._limit);
    }

    let cloned = clone(results);

    // Apply populates
    for (const popField of this._populates) {
      for (const item of cloned) {
        if (popField === 'restaurant' && item.restaurant) {
          const restId = typeof item.restaurant === 'object' ? item.restaurant._id : item.restaurant;
          const rest = memoryStore.restaurants.find(r => String(r._id) === String(restId));
          if (rest) item.restaurant = clone(rest);
        } else if (popField === 'food' && item.food) {
          const foodId = typeof item.food === 'object' ? item.food._id : item.food;
          const f = memoryStore.foods.find(food => String(food._id) === String(foodId));
          if (f) item.food = clone(f);
        } else if (popField === 'customer' && item.customer) {
          const custId = typeof item.customer === 'object' ? item.customer._id : item.customer;
          const c = memoryStore.users.find(u => String(u._id) === String(custId));
          if (c) {
            const { password, ...safeUser } = c;
            item.customer = clone(safeUser);
          }
        }
      }
    }

    if (this._isSingle) {
      return cloned.length > 0 ? cloned[0] : null;
    }

    return cloned;
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }
}

// Memory Model Factory
function createMemoryModel(collectionName) {
  return {
    find(filter = {}) {
      return new MemoryQuery(collectionName, filter);
    },

    findOne(filter = {}) {
      const q = new MemoryQuery(collectionName, filter);
      q._isSingle = true;
      return q;
    },

    findById(id) {
      const q = new MemoryQuery(collectionName, { _id: String(id) });
      q._isSingle = true;
      return q;
    },

    async create(data) {
      if (Array.isArray(data)) {
        return this.insertMany(data);
      }
      const newItem = {
        _id: data._id ? String(data._id) : generateId(),
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryStore[collectionName].push(newItem);
      return clone(newItem);
    },

    async insertMany(items) {
      const createdItems = items.map(item => ({
        _id: item._id ? String(item._id) : generateId(),
        ...item,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      memoryStore[collectionName].push(...createdItems);
      return clone(createdItems);
    },

    findByIdAndUpdate(id, update, options = {}) {
      const index = (memoryStore[collectionName] || []).findIndex(item => String(item._id) === String(id));
      if (index === -1) {
        const emptyQuery = new MemoryQuery(collectionName, { _id: '__non_existent__' });
        emptyQuery._isSingle = true;
        return emptyQuery;
      }

      const current = memoryStore[collectionName][index];
      const updatedFields = update.$set ? { ...update.$set } : { ...update };
      delete updatedFields.$set;

      const updated = {
        ...current,
        ...updatedFields,
        updatedAt: new Date().toISOString()
      };

      memoryStore[collectionName][index] = updated;

      const q = new MemoryQuery(collectionName, { _id: String(id) });
      q._isSingle = true;
      return q;
    },

    async findByIdAndDelete(id) {
      const index = (memoryStore[collectionName] || []).findIndex(item => String(item._id) === String(id));
      if (index === -1) return null;
      const [deleted] = memoryStore[collectionName].splice(index, 1);
      return clone(deleted);
    },

    async countDocuments(filter = {}) {
      return (memoryStore[collectionName] || []).filter(item => matchesFilter(item, filter)).length;
    },

    async deleteMany(filter = {}) {
      const initialCount = memoryStore[collectionName].length;
      memoryStore[collectionName] = memoryStore[collectionName].filter(item => !matchesFilter(item, filter));
      return { deletedCount: initialCount - memoryStore[collectionName].length };
    }
  };
}

// Initialize models
const Models = {
  User: createMemoryModel('users'),
  Restaurant: createMemoryModel('restaurants'),
  Category: createMemoryModel('categories'),
  Food: createMemoryModel('foods'),
  NightRescueDeal: createMemoryModel('nightRescueDeals'),
  Order: createMemoryModel('orders'),
  GroupOrder: createMemoryModel('groupOrders'),
  Coupon: createMemoryModel('coupons'),
  Review: createMemoryModel('reviews'),
  memoryStore // Expose for testing/debugging
};

module.exports = Models;
