import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductSection } from './components/ProductSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AdminOrders } from './components/AdminOrders';
import { useCartStore } from './store/useCartStore';

export default function App() {
  const [view, setView] = useState<'store' | 'admin'>('store');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<{
    orderId: string;
    name: string;
    address: string;
  } | null>(null);

  const totalCount = useCartStore((state) => state.getTotalCount());

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOpenTracker = (details: { orderId: string; name: string; address: string }) => {
    setActiveOrder(details);
    setIsTrackerOpen(true);
  };

  return (
    <div className="min-h-screen bg-bakery-cream selection:bg-bakery-honey/30">
      {/* Floating Kitchen Switcher Button */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setView(view === 'store' ? 'admin' : 'store')}
          className="bg-bakery-espresso hover:bg-bakery-crust text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl border border-white/20 transition-all transform hover:scale-105"
        >
          {view === 'store' ? '🔒 Staff Kitchen Console' : '🥐 Back to Bakery Store'}
        </button>
      </div>

      {view === 'store' ? (
        <>
          <Navbar cartCount={totalCount} onOpenCart={() => setIsCartOpen(true)} />
          <main>
            <Hero />
            <ProductSection />
          </main>
          <Footer />

          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onCheckout={handleProceedToCheckout}
          />

          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onOpenTracker={handleOpenTracker}
          />

          <OrderTrackerModal
            isOpen={isTrackerOpen}
            onClose={() => setIsTrackerOpen(false)}
            orderId={activeOrder?.orderId || null}
            customerName={activeOrder?.name}
            deliveryAddress={activeOrder?.address}
          />
        </>
      ) : (
        <AdminOrders onBackToStore={() => setView('store')} />
      )}
    </div>
  );
}