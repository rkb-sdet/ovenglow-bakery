import React from 'react';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-bakery-espresso text-bakery-cream/90 pt-16 pb-12 border-t border-bakery-dough/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-bakery-honey flex-shrink-0">
              🥐
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-white">100% Artisan Made</h4>
              <p className="text-xs text-bakery-cream/70 mt-1 leading-relaxed">
                Fermented naturally with organic stone-ground flours and French cultured butter.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-bakery-honey flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-white">Active 24x7 Night Shift</h4>
              <p className="text-xs text-bakery-cream/70 mt-1 leading-relaxed">
                Our bakers knead and bake around the clock so you never eat cold leftovers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-bakery-honey flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-white">Insulated Thermal Packaging</h4>
              <p className="text-xs text-bakery-cream/70 mt-1 leading-relaxed">
                Special steam-vented eco boxes preserve crisp crusts and warm centers.
              </p>
            </div>
          </div>
        </div>

        {/* Brand & Copyright */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-bakery-cream/60">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg text-white">
              Oven<span className="text-bakery-crust">Glow</span>
            </span>
            <span>• 24x7 Artisan Patisserie & Express Delivery</span>
          </div>

          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-bakery-crimson fill-current" /> for nocturnal gourmets.
          </p>
        </div>

      </div>
    </footer>
  );
};