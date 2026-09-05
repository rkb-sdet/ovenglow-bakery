import React from 'react';
import { ShoppingBag, Search, Moon, Clock, X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount = 0, onOpenCart }) => {
  const { searchQuery, setSearchQuery } = useCartStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Smooth scroll to menu if user starts typing
    if (e.target.value.trim() !== '') {
      const menuElement = document.getElementById('menu');
      if (menuElement) {
        menuElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bakery-cream/90 border-b border-bakery-dough">
      {/* 24x7 Midnight Live Ticker */}
      <div className="bg-bakery-espresso text-bakery-cream text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bakery-crimson opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-bakery-crimson"></span>
          </span>
          <span className="font-medium tracking-wide">
            Ovens are hot & baking right now • 24x7 Midnight Delivery in 30 Mins
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-bakery-honey text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>Avg. Prep Time: 18 mins</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-bakery-crust/10 flex items-center justify-center text-bakery-crust font-serif font-bold text-xl">
            🥐
          </div>
          <div>
            <span className="font-serif font-bold text-2xl text-bakery-espresso tracking-tight">
              Oven<span className="text-bakery-crust">Glow</span>
            </span>
            <span className="block text-[10px] tracking-widest uppercase font-semibold text-bakery-cocoaMuted">
              Artisan 24x7 Patisserie
            </span>
          </div>
        </div>

        {/* Live Interactive Search Bar */}
        <div className="flex items-center flex-1 max-w-md mx-4 md:mx-8 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search sourdough, truffle cake, brownies..."
            className="w-full bg-bakery-dough/80 border border-transparent focus:border-bakery-crust/30 rounded-full py-2.5 pl-11 pr-10 text-xs sm:text-sm text-bakery-espresso placeholder-bakery-cocoaMuted/70 outline-none transition-all"
          />
          <Search className="w-4 h-4 text-bakery-cocoaMuted absolute left-4" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 p-1 rounded-full text-bakery-cocoaMuted hover:text-bakery-espresso"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            aria-label="Night Vibe"
            className="p-2.5 rounded-full hover:bg-bakery-dough text-bakery-espresso transition-colors hidden sm:block"
          >
            <Moon className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-bakery-espresso hover:bg-bakery-crust text-white px-4 sm:px-5 py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 shadow-warm hover:shadow-warm-hover"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag</span>
            {cartCount > 0 && (
              <span className="bg-bakery-honey text-bakery-espresso font-bold text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};