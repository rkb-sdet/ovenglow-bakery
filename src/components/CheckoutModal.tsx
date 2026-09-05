import React, { useState } from 'react';
import { X, CheckCircle2, Clock, MapPin, Phone, User, Flame, ArrowRight, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { supabase } from '../lib/supabaseClient';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTracker?: (details: { orderId: string; name: string; address: string }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOpenTracker,
}) => {
  const { getTotalPrice, clearCart, items } = useCartStore();

  const [slot, setSlot] = useState<'instant' | 'scheduled'>('instant');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedOrderId = `OG-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: formData.name,
            customer_phone: formData.phone,
            delivery_address: formData.address,
            delivery_slot: slot,
            total_amount: total,
            order_status: 'baking',
            items: items.map((i) => ({
              id: i.id,
              name: i.name,
              quantity: i.quantity,
              price: i.price,
            })),
          },
        ])
        .select();

      if (error) {
        console.error('DATABASE ERROR:', error);
        alert('Database Insert Error: ' + error.message);
        setIsSubmitting(false);
        return;
      }

      console.log('Order Successfully Created in DB:', data);
      setOrderId(generatedOrderId);
      clearCart();
    } catch (err: any) {
      console.error('CATCH ERROR:', err);
      alert('Unexpected Error: ' + (err?.message || 'Something went wrong'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOrderId(null);
    onClose();
  };

  const handleTrackOrder = () => {
    if (onOpenTracker && orderId) {
      onOpenTracker({
        orderId,
        name: formData.name || 'Valued Guest',
        address: formData.address || 'Express Delivery Location',
      });
    }
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-bakery-espresso/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-bakery-dough overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-bakery-dough bg-bakery-cream/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-bakery-crust">
              Express Checkout
            </span>
            <h3 className="font-serif text-2xl font-bold text-bakery-espresso">
              {orderId ? 'Order Dispatched to Oven' : 'Confirm Midnight Order'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-bakery-dough text-bakery-espresso transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {orderId ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-bakery-sage/15 text-bakery-sage rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="font-serif text-2xl font-bold text-bakery-espresso">
                  Baking in Progress!
                </h4>
                <p className="text-sm text-bakery-cocoaMuted">
                  Order ID: <span className="font-mono font-bold text-bakery-crust">#{orderId}</span>
                </p>
              </div>

              <div className="p-4 bg-bakery-dough/60 rounded-2xl border border-bakery-dough text-left space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-bakery-crimson text-white flex items-center justify-center text-xs">
                    <Flame className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-bakery-espresso">Live Hearth Status</p>
                    <p className="text-[11px] text-bakery-cocoaMuted">
                      Order logged to database • Chef prepping ingredients
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-bakery-espresso border-t border-bakery-dough pt-2">
                  <span>Estimated Drop Time:</span>
                  <span className="text-bakery-crust">~28 Mins</span>
                </div>
              </div>

              <button
                onClick={handleTrackOrder}
                className="w-full bg-bakery-espresso hover:bg-bakery-crust text-white py-3.5 rounded-2xl font-semibold text-sm transition-all shadow-warm hover:shadow-warm-hover"
              >
                Track Live on Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-bakery-cocoaMuted mb-2">
                  Select Delivery Speed
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSlot('instant')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      slot === 'instant'
                        ? 'border-bakery-crust bg-bakery-honey/10 ring-2 ring-bakery-crust/20'
                        : 'border-bakery-dough bg-white hover:bg-bakery-cream'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-bakery-espresso">
                      <Clock className="w-3.5 h-3.5 text-bakery-crust" />
                      <span>Instant 30 Min</span>
                    </div>
                    <span className="text-[11px] text-bakery-cocoaMuted block mt-0.5">
                      Hot from hearth now
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSlot('scheduled')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      slot === 'scheduled'
                        ? 'border-bakery-crust bg-bakery-honey/10 ring-2 ring-bakery-crust/20'
                        : 'border-bakery-dough bg-white hover:bg-bakery-cream'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-bakery-espresso">
                      <Clock className="w-3.5 h-3.5 text-bakery-cocoaMuted" />
                      <span>Morning 8 AM</span>
                    </div>
                    <span className="text-[11px] text-bakery-cocoaMuted block mt-0.5">
                      Breakfast fresh drop
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <User className="w-4 h-4 text-bakery-cocoaMuted absolute left-3.5 top-3.5" />
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-bakery-dough/40 border border-bakery-dough focus:border-bakery-crust rounded-xl py-2.5 pl-10 pr-4 text-xs text-bakery-espresso outline-none transition-colors"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 text-bakery-cocoaMuted absolute left-3.5 top-3.5" />
                  <input
                    required
                    type="tel"
                    placeholder="10-digit Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-bakery-dough/40 border border-bakery-dough focus:border-bakery-crust rounded-xl py-2.5 pl-10 pr-4 text-xs text-bakery-espresso outline-none transition-colors"
                  />
                </div>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-bakery-cocoaMuted absolute left-3.5 top-3.5" />
                  <textarea
                    required
                    rows={2}
                    placeholder="Complete Delivery Address (Flat / House No, Street, Landmark)"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-bakery-dough/40 border border-bakery-dough focus:border-bakery-crust rounded-xl py-2.5 pl-10 pr-4 text-xs text-bakery-espresso outline-none resize-none transition-colors"
                  />
                </div>
              </div>

              <div className="border-t border-bakery-dough pt-4 space-y-2">
                <div className="flex justify-between text-xs text-bakery-cocoaMuted">
                  <span>Cart Items ({items.length})</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs text-bakery-cocoaMuted">
                  <span>Midnight Delivery</span>
                  <span className="font-semibold text-bakery-espresso">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-bakery-espresso pt-1">
                  <span>Total Amount</span>
                  <span className="font-serif text-base text-bakery-crust">₹{total}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-bakery-crust hover:bg-bakery-crustDark disabled:opacity-60 text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-warm hover:shadow-warm-hover"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending to Oven...</span>
                  </>
                ) : (
                  <>
                    <span>Place Order • Cash on Delivery / UPI</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};