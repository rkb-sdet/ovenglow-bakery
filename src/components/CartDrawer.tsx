import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckout }) => {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalCount } = useCartStore();

  if (!isOpen) return null;

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bakery-espresso/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-bakery-dough flex items-center justify-between bg-bakery-cream">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-bakery-espresso">Your Bag</h2>
                <span className="bg-bakery-crust/10 text-bakery-crust text-xs font-bold px-2 py-0.5 rounded-full">
                  {getTotalCount()} items
                </span>
              </div>
              <p className="text-xs text-bakery-cocoaMuted mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-bakery-crust" />
                24x7 Express Delivery: Est. 25-30 mins
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-bakery-dough text-bakery-espresso transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🥐</div>
                <h3 className="font-serif text-xl font-bold text-bakery-espresso">Your bag is empty</h3>
                <p className="text-sm text-bakery-cocoaMuted mt-1">
                  Warm, fresh midnight bakes are just a click away.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 inline-flex items-center gap-2 bg-bakery-crust text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-bakery-crustDark transition-colors"
                >
                  Start Ordering
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3.5 rounded-2xl border border-bakery-dough bg-bakery-cream/40"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-bakery-espresso truncate">
                      {item.name}
                    </h4>
                    <span className="text-xs text-bakery-crust font-semibold">
                      ₹{item.price}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-bakery-dough bg-white rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-bakery-espresso hover:text-bakery-crust"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-bakery-espresso">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-bakery-espresso hover:text-bakery-crust"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-bakery-cocoaMuted hover:text-bakery-crimson text-xs p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Smart Upsell Banner */}
            {items.length > 0 && subtotal < 500 && (
              <div className="p-3 bg-bakery-honey/15 rounded-xl border border-bakery-honey/30 flex items-center gap-2.5 text-xs text-bakery-crustDark">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span>
                  Add items worth <b>₹{500 - subtotal}</b> more for <b>FREE Midnight Delivery</b>!
                </span>
              </div>
            )}
          </div>

          {/* Footer / Bill Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-bakery-dough bg-bakery-cream/60 space-y-3">
              <div className="space-y-1.5 text-xs text-bakery-cocoaMuted">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-bakery-espresso">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Midnight Delivery Fee</span>
                  <span className="font-semibold text-bakery-espresso">
                    {deliveryFee === 0 ? <span className="text-bakery-sage">FREE</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-bakery-espresso pt-2 border-t border-bakery-dough">
                  <span>Total Payable</span>
                  <span className="font-serif text-lg text-bakery-crust">₹{total}</span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full flex items-center justify-center gap-2 bg-bakery-crust hover:bg-bakery-crustDark text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-warm hover:shadow-warm-hover"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};