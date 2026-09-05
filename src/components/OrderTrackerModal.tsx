import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Flame, Bike, PackageCheck, Clock, MapPin, Sparkles } from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
  customerName?: string;
  deliveryAddress?: string;
}

type DeliveryStage = 'received' | 'baking' | 'rider' | 'delivered';

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orderId,
  customerName = 'Valued Guest',
  deliveryAddress = 'Express Delivery Location',
}) => {
  const [currentStage, setCurrentStage] = useState<DeliveryStage>('received');
  const [etaMins, setEtaMins] = useState(28);

  // Automated simulation of 24x7 express midnight delivery flow
  useEffect(() => {
    if (!isOpen) return;

    setCurrentStage('received');
    setEtaMins(28);

    const t1 = setTimeout(() => {
      setCurrentStage('baking');
      setEtaMins(22);
    }, 3500);

    const t2 = setTimeout(() => {
      setCurrentStage('rider');
      setEtaMins(12);
    }, 8500);

    const t3 = setTimeout(() => {
      setCurrentStage('delivered');
      setEtaMins(0);
    }, 15000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const stages = [
    {
      id: 'received',
      title: 'Order Confirmed',
      desc: 'Sent to hearth kitchen',
      icon: CheckCircle,
      activeColor: 'text-bakery-sage border-bakery-sage bg-bakery-sage/10',
    },
    {
      id: 'baking',
      title: 'Baking in Hearth',
      desc: 'Ovens running at 220°C',
      icon: Flame,
      activeColor: 'text-bakery-crimson border-bakery-crimson bg-bakery-crimson/10',
    },
    {
      id: 'rider',
      title: 'Midnight Express',
      desc: 'Insulated pouch dispatched',
      icon: Bike,
      activeColor: 'text-bakery-crust border-bakery-crust bg-bakery-crust/10',
    },
    {
      id: 'delivered',
      title: 'Delivered Hot',
      desc: 'Bon appétit!',
      icon: PackageCheck,
      activeColor: 'text-bakery-sage border-bakery-sage bg-bakery-sage/10',
    },
  ];

  const getStageIndex = (stage: DeliveryStage) => {
    switch (stage) {
      case 'received': return 0;
      case 'baking': return 1;
      case 'rider': return 2;
      case 'delivered': return 3;
    }
  };

  const activeIdx = getStageIndex(currentStage);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-bakery-espresso/70 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-bakery-dough overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-bakery-espresso via-[#3d271a] to-bakery-espresso text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bakery-honey opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-bakery-honey"></span>
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-bakery-honey">
                24x7 Live Oven Tracker
              </span>
            </div>
            <h3 className="font-serif text-2xl font-bold mt-0.5">
              Order #{orderId || 'OG-782190'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ETA & Status Banner */}
        <div className="p-6 bg-bakery-cream border-b border-bakery-dough flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-bakery-honey/20 border border-bakery-honey/40 flex items-center justify-center text-bakery-crust">
              <Clock className="w-6 h-6 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
              <p className="text-xs text-bakery-cocoaMuted uppercase font-bold tracking-wider">Estimated Arrival</p>
              <p className="font-serif text-2xl font-bold text-bakery-espresso">
                {currentStage === 'delivered' ? 'Arrived!' : `~${etaMins} Minutes`}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bakery-crust/10 text-bakery-crust text-xs font-bold border border-bakery-crust/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OvenGlow Fleet</span>
            </span>
          </div>
        </div>

        {/* Vertical Stepper */}
        <div className="p-6 space-y-6">
          <div className="relative pl-6 space-y-7 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-bakery-dough">
            {stages.map((stg, index) => {
              const isPassed = index <= activeIdx;
              const isCurrent = index === activeIdx;
              const IconComp = stg.icon;

              return (
                <div key={stg.id} className="relative flex items-start gap-4">
                  {/* Step Circle */}
                  <div
                    className={`absolute -left-6 top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? `${stg.activeColor} ring-4 ring-bakery-crust/10 scale-110`
                        : isPassed
                        ? 'bg-bakery-espresso border-bakery-espresso text-white'
                        : 'bg-white border-bakery-dough text-bakery-cocoaMuted'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </div>

                  {/* Step Description */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-bold ${
                          isCurrent
                            ? 'text-bakery-espresso font-serif text-base'
                            : isPassed
                            ? 'text-bakery-espresso'
                            : 'text-bakery-cocoaMuted/70'
                        }`}
                      >
                        {stg.title}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-bakery-crust/10 text-bakery-crust animate-pulse">
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-bakery-cocoaMuted mt-0.5">{stg.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Details Card */}
          <div className="p-4 rounded-2xl bg-bakery-dough/40 border border-bakery-dough space-y-2 text-xs">
            <div className="flex items-center gap-2 text-bakery-espresso font-semibold">
              <MapPin className="w-4 h-4 text-bakery-crust" />
              <span>Delivering to {customerName}</span>
            </div>
            <p className="text-bakery-cocoaMuted pl-6 line-clamp-1">{deliveryAddress}</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-bakery-dough bg-bakery-cream flex justify-end">
          <button
            onClick={onClose}
            className="w-full bg-bakery-espresso hover:bg-bakery-crust text-white py-3 rounded-2xl font-bold text-xs transition-all shadow-warm"
          >
            Close & Continue Browsing
          </button>
        </div>

      </div>
    </div>
  );
};