import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Plus, Check, Bot, Utensils, Star, DollarSign, Flame } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export default function AIAssistantModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your MEALIFY Culinary AI. Tell me what you're craving, your exact budget, dietary preferences, or party size, and I'll find the best matching dishes directly from our live kitchen menus.",
      recommendations: []
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState({});
  const messagesEndRef = useRef(null);

  const moodPills = [
    { label: "🌙 Late Night", prompt: "Late night comforting snacks under ₹200" },
    { label: "💪 High Protein", prompt: "Healthy high protein meal with clean ingredients" },
    { label: "🌶️ Spicy Fiery", prompt: "Spicy Sichuan or Biryani with intense flavor" },
    { label: "⚡ Under ₹150", prompt: "Delicious pocket friendly food under ₹150" },
    { label: "🍕 Cheesy Comfort", prompt: "Cheesy woodfired pizza or loaded burger" },
    { label: "🥗 Green Detox", prompt: "Fresh vegetarian superfood salad or quinoa bowl" }
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  async function handleSend(textToSend) {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const userMessage = { sender: 'user', text, recommendations: [] };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setLoading(true);

    try {
      // Pass previous conversational messages
      const history = updatedMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await api.getAIRecommendations(text, history);
      if (res.success) {
        const aiMessage = {
          sender: 'ai',
          text: res.assistantResponse,
          recommendations: res.recommendations || []
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: "I couldn't process that culinary request right now. Let's try searching for a dish or budget range!",
            recommendations: []
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "I experienced a connection hiccup with our kitchen database. Please try another craving query!",
          recommendations: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleAddDish(dish) {
    const success = addItem(dish, 1);
    if (success !== false) {
      setAddedIds(prev => ({ ...prev, [dish._id]: true }));
      setTimeout(() => {
        setAddedIds(prev => ({ ...prev, [dish._id]: false }));
      }, 1500);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#141414] border border-[#FFC857]/30 rounded-3xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#1c1813] to-[#121212] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF9F1C] to-[#FFC857] p-[1px] shadow-lg shadow-[#FF9F1C]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#121212] rounded-[15px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#FFC857]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#F8F5EF]">
                  MEALIFY AI Food Assistant
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF9F1C]/20 text-[#FFC857] border border-[#FF9F1C]/30">
                  Live Grounded
                </span>
              </div>
              <p className="text-xs text-[#A5A5A5]">
                Real-Time Menu Grounding • Zero Hallucinations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A5A5A5] hover:text-[#F8F5EF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] font-semibold'
                    : 'bg-[#1e1e1e] border border-white/10 text-[#F8F5EF]'
                }`}
              >
                {msg.text}
              </div>

              {/* Recommended Dishes Card Deck */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="w-full mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {msg.recommendations.map((dish) => {
                    const isAdded = !!addedIds[dish._id];
                    return (
                      <div
                        key={dish._id}
                        className="rounded-2xl bg-[#181818] border border-white/10 hover:border-[#FF9F1C]/50 p-3 flex flex-col justify-between transition-all"
                      >
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-2">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-bold text-[#FFC857] flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-current" /> {dish.rating}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-bold text-xs text-[#F8F5EF] line-clamp-1">
                            {dish.name}
                          </h5>
                          <div className="text-[10px] text-[#A5A5A5] truncate">
                            {dish.restaurant?.name || 'Partner Kitchen'}
                          </div>
                          {dish.matchReason && (
                            <div className="text-[10px] text-amber-400/90 mt-1 line-clamp-2 italic bg-amber-500/5 p-1 rounded">
                              {dish.matchReason}
                            </div>
                          )}
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-white/5 mt-2">
                          <span className="text-xs font-black text-[#FFC857]">
                            ₹{dish.price}
                          </span>
                          <button
                            onClick={() => handleAddDish(dish)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              isAdded
                                ? 'bg-emerald-500 text-[#101010]'
                                : 'bg-[#FF9F1C] text-[#101010] hover:brightness-110'
                            }`}
                          >
                            {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            <span>{isAdded ? 'Added' : 'Add'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#FFC857] bg-[#1e1e1e] p-3 rounded-2xl w-fit border border-white/5">
              <Sparkles className="w-4 h-4 animate-spin text-[#FF9F1C]" />
              <span>Analyzing live kitchen menus & extracting nutritional matches...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Mood & Craving Chips */}
        <div className="px-6 py-2.5 bg-[#121212] border-t border-white/5 flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] font-bold text-[#A5A5A5] uppercase tracking-wider mr-1">
            Mood:
          </span>
          {moodPills.map((pill) => (
            <button
              key={pill.label}
              type="button"
              onClick={() => handleSend(pill.prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#FF9F1C]/20 border border-white/5 hover:border-[#FF9F1C]/40 text-[#A5A5A5] hover:text-[#FFC857] transition-all cursor-pointer"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#181818] border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="E.g., I want something spicy under ₹200 for lunch..."
            className="flex-1 bg-[#101010] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F8F5EF] placeholder-[#666666] focus:outline-none focus:border-[#FF9F1C]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || loading}
            className="p-3 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] font-bold hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

