import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Package, 
  Bike, 
  Navigation, 
  Home, 
  PhoneCall, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function OrderTimeline({ order }) {
  const steps = [
    { key: 'order_placed', label: 'Order Placed', icon: Clock, desc: 'Sent to restaurant kitchen' },
    { key: 'order_accepted', label: 'Accepted', icon: CheckCircle2, desc: 'Confirmed by chef' },
    { key: 'preparing_food', label: 'Preparing', icon: ChefHat, desc: 'Fresh ingredients on the grill' },
    { key: 'ready_for_pickup', label: 'Ready', icon: Package, desc: 'Packed in thermal container' },
    { key: 'picked_up', label: 'Picked Up', icon: Bike, desc: 'Rider received order' },
    { key: 'out_for_delivery', label: 'On The Way', icon: Navigation, desc: 'Heading towards your doorstep' },
    { key: 'delivered', label: 'Delivered', icon: Home, desc: 'Enjoy your warm gourmet meal!' },
  ];

  const currentStatus = order?.orderStatus || 'order_placed';
  const currentIndex = steps.findIndex(s => s.key === currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  return (
    <div className="space-y-8">
      
      {/* Real-time Order Header Status Banner */}
      <div className={`p-5 rounded-2xl border ${
        isCancelled
          ? 'bg-red-500/10 border-red-500/30 text-red-300'
          : currentStatus === 'delivered'
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          : 'bg-[#1e1a14] border-[#FFC857]/30 text-[#FFC857]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#A5A5A5]">
              Live Order Status
            </div>
            <div className="text-xl sm:text-2xl font-black capitalize flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-current animate-ping" />
              {currentStatus.replace(/_/g, ' ')}
            </div>
            <div className="text-xs text-[#A5A5A5]">
              {order?.statusHistory?.slice(-1)[0]?.note || 'Processing your order with care.'}
            </div>
          </div>

          {currentStatus !== 'delivered' && !isCancelled && (
            <div className="text-left sm:text-right bg-black/40 p-3 rounded-xl border border-white/5">
              <div className="text-[10px] text-[#A5A5A5] uppercase font-bold">Estimated Arrival</div>
              <div className="text-lg font-black text-[#FFC857]">
                ~{order?.estimatedDeliveryMinutes || 25} Minutes
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 7-Stage Visual Progress Timeline */}
      {!isCancelled && (
        <div className="relative py-4">
          
          {/* Desktop Horizontal Line */}
          <div className="hidden lg:block absolute top-7 left-8 right-8 h-1 bg-white/10 -z-0">
            <div
              className="h-full bg-gradient-to-r from-[#FF9F1C] to-[#10B981] transition-all duration-700"
              style={{
                width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100)}%`
              }}
            />
          </div>

          {/* Stepper Nodes */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const isUpcoming = idx > currentIndex;

              return (
                <div
                  key={step.key}
                  className="flex lg:flex-col items-center gap-4 lg:gap-2 text-left lg:text-center relative z-10"
                >
                  {/* Step Icon Node */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500 text-[#101010] shadow-lg shadow-emerald-500/20'
                        : isCurrent
                        ? 'bg-gradient-to-br from-[#FF9F1C] to-[#FFC857] text-[#101010] ring-4 ring-[#FF9F1C]/25 shadow-xl shadow-[#FF9F1C]/30 scale-110'
                        : 'bg-[#1c1c1c] border border-white/10 text-[#666666]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Step Text */}
                  <div className="flex-1 lg:flex-none">
                    <div
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-[#FFC857]'
                          : isCompleted
                          ? 'text-emerald-400'
                          : 'text-[#666666]'
                      }`}
                    >
                      {step.label}
                    </div>
                    <div className="text-[10px] text-[#888888] hidden sm:block lg:max-w-[110px] mx-auto mt-0.5">
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Delivery Rider Information Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181818] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 overflow-hidden flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
              alt="Delivery Rider"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#F8F5EF]">
                {order?.deliveryPartnerName || 'Vikram Singh'}
              </h4>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified Rider
              </span>
            </div>
            <p className="text-xs text-[#A5A5A5]">
              Electric Scooter (EV-9000) • 4.95 ★ Rating
            </p>
          </div>
        </div>

        <a
          href="tel:+919844455566"
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#F8F5EF] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#FF9F1C]" />
          <span>Call Rider</span>
        </a>
      </div>

    </div>
  );
}

