import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Bike, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  Plus, 
  Check, 
  Send,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import FoodCard3D from '../components/FoodCard3D';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated, demoLogin } = useAuth();
  const { toast } = useToast();

  const [restaurant, setRestaurant] = useState(null);
  const [menuByCategory, setMenuByCategory] = useState({});
  const [reviews, setReviews] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadRestaurant() {
      setLoading(true);
      try {
        const [restRes, revRes] = await Promise.all([
          api.getRestaurantById(id),
          api.getRestaurantReviews(id)
        ]);

        if (restRes.success) {
          setRestaurant(restRes.restaurant);
          setMenuByCategory(restRes.menuByCategory || {});
          const firstCat = Object.keys(restRes.menuByCategory || {})[0];
          if (firstCat) setActiveCategory(firstCat);
        }

        if (revRes.success) {
          setReviews(revRes.reviews || []);
        }
      } catch (err) {
        console.warn('Error loading restaurant:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadRestaurant();
  }, [id]);

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    if (!isAuthenticated) {
      await demoLogin('customer');
    }

    setSubmittingReview(true);
    try {
      const res = await api.createReview({
        restaurantId: id,
        rating: reviewRating,
        comment: reviewComment.trim()
      });

      if (res.success && res.review) {
        setReviews(prev => [res.review, ...prev]);
        setReviewModalOpen(false);
        setReviewComment('');
        toast.success('Review published! Thank you for your feedback.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#A5A5A5]">
        Loading restaurant menu & culinary creations...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#F8F5EF]">Restaurant Not Found</h2>
        <Link to="/restaurants" className="px-4 py-2 rounded-xl bg-[#FF9F1C] text-[#101010] text-xs font-bold inline-block">
          Return to Restaurants
        </Link>
      </div>
    );
  }

  const categoryNames = Object.keys(menuByCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Restaurant Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#171717] border border-white/8 shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/60 to-transparent" />
        </div>

        {/* Floating Details Overlay */}
        <div className="p-6 sm:p-8 relative -mt-24 sm:-mt-28 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FF9F1C] text-[#101010]">
                  {restaurant.heroTag || 'Gourmet Kitchen'}
                </span>
                <span className="text-xs text-[#A5A5A5] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FFC857]" /> {restaurant.address?.city || 'Bengaluru'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#F8F5EF] tracking-tight">
                {restaurant.name}
              </h1>
              <p className="text-sm text-[#A5A5A5] max-w-2xl mt-1">
                {restaurant.description}
              </p>
            </div>

            {/* Quick Metrics Badge */}
            <div className="flex items-center gap-3 bg-[#191919]/90 backdrop-blur-xl p-3.5 rounded-2xl border border-white/10 shrink-0">
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-sm font-black text-[#FFC857]">
                  <Star className="w-4 h-4 fill-current text-[#FFC857]" /> {restaurant.rating}
                </div>
                <div className="text-[10px] text-[#A5A5A5]">{restaurant.totalReviews} reviews</div>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-sm font-black text-[#F8F5EF]">
                  <Clock className="w-4 h-4 text-[#FF9F1C]" /> {restaurant.deliveryTimeMin}m
                </div>
                <div className="text-[10px] text-[#A5A5A5]">Delivery</div>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-sm font-black text-emerald-400">
                  <Bike className="w-4 h-4" /> ₹{restaurant.deliveryFee}
                </div>
                <div className="text-[10px] text-[#A5A5A5]">Fee</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Category Navigation */}
      {categoryNames.length > 0 && (
        <div className="sticky top-20 z-40 py-3 bg-[#101010]/90 backdrop-blur-xl border-y border-white/5 flex gap-2 overflow-x-auto scrollbar-none">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] shadow-md shadow-[#FF9F1C]/20'
                  : 'bg-white/5 text-[#A5A5A5] hover:text-[#F8F5EF] hover:bg-white/10'
              }`}
            >
              {cat} ({menuByCategory[cat]?.length || 0})
            </button>
          ))}
        </div>
      )}

      {/* Categorized Food Menu Grid */}
      <div className="space-y-12">
        {categoryNames.map((cat) => (
          <section key={cat} id={cat} className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xl font-black text-[#F8F5EF]">
                {cat}
              </h3>
              <span className="text-xs text-[#A5A5A5]">
                {menuByCategory[cat]?.length} items
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuByCategory[cat]?.map((food) => (
                <FoodCard3D key={food._id} food={{ ...food, restaurant }} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Customer Reviews & Feedback Section */}
      <div className="pt-8 border-t border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-[#F8F5EF]">
              Customer Reviews ({reviews.length})
            </h3>
            <p className="text-xs text-[#A5A5A5]">
              Real feedback from verified diners
            </p>
          </div>

          <button
            onClick={() => setReviewModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#FF9F1C] text-[#F8F5EF] hover:text-[#101010] text-xs font-bold transition-colors cursor-pointer"
          >
            Write a Review
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#171717] text-center text-xs text-[#888888]">
            No reviews yet. Be the first to share your culinary experience!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-4 rounded-2xl bg-[#171717] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#F8F5EF]">{rev.userName}</span>
                    <span className="text-[10px] text-[#777777]">• Verified Diner</span>
                  </div>
                  <div className="text-xs text-[#FFC857]">
                    {'★'.repeat(rev.rating)}
                  </div>
                </div>
                <p className="text-xs text-[#A5A5A5] leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leave Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#161616] border border-white/10 rounded-3xl p-6 space-y-4">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#A5A5A5] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-[#F8F5EF]">
              Review {restaurant.name}
            </h3>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#A5A5A5] mb-1">
                  Star Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`p-2 rounded-xl text-lg font-bold transition-all ${
                        reviewRating >= star ? 'text-[#FFC857] scale-110' : 'text-[#444444]'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A5A5A5] mb-1">
                  Your Feedback
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details of your food flavor, packing, and experience..."
                  rows={4}
                  className="w-full bg-[#101010] border border-white/10 rounded-xl p-3 text-xs text-[#F8F5EF] placeholder-[#666666] focus:outline-none focus:border-[#FF9F1C]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview || !reviewComment.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF9F1C] to-[#FFC857] text-[#101010] font-bold text-xs uppercase tracking-wider hover:brightness-110 disabled:opacity-40"
              >
                {submittingReview ? 'Submitting...' : 'Post Verified Review'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

