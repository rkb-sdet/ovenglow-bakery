import React from 'react';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 bg-gradient-to-b from-bakery-cream via-bakery-dough/40 to-bakery-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-bakery-honey/15 border border-bakery-honey/30 px-3.5 py-1.5 rounded-full text-bakery-crustDark text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh From The Hearth • 24 Hours Non-Stop</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-bakery-espresso leading-[1.1]">
              Craving artisan bakes at <span className="italic text-bakery-crust font-normal">2:00 AM?</span>
            </h1>

            <p className="text-bakery-cocoaMuted text-base sm:text-lg max-w-xl leading-relaxed">
              Warm sourdough, molten lava cakes, and flaky Belgian croissants baked on-demand and delivered to your doorstep within 30 minutes.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#menu"
                className="flex items-center gap-2 bg-bakery-crust hover:bg-bakery-crustDark text-white px-7 py-4 rounded-full font-semibold text-base transition-all duration-300 shadow-warm hover:shadow-warm-hover transform hover:-translate-y-0.5"
              >
                <span>Explore Live Oven Menu</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-3 px-4 py-3 bg-white/70 backdrop-blur rounded-2xl border border-bakery-dough">
                <Flame className="w-5 h-5 text-bakery-crimson" />
                <div className="text-xs">
                  <p className="font-bold text-bakery-espresso">Active Batch</p>
                  <p className="text-bakery-cocoaMuted">Truffle Pastries in oven</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-bakery-dough max-w-lg">
              <div>
                <p className="font-serif text-2xl font-bold text-bakery-espresso">30<span className="text-bakery-crust">m</span></p>
                <p className="text-xs text-bakery-cocoaMuted font-medium mt-0.5">Express Delivery</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-bakery-espresso">100<span className="text-bakery-crust">%</span></p>
                <p className="text-xs text-bakery-cocoaMuted font-medium mt-0.5">Eggless Options</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-bakery-espresso">4.9<span className="text-bakery-honey">★</span></p>
                <p className="text-xs text-bakery-cocoaMuted font-medium mt-0.5">5,000+ Reviews</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-md">
              <div className="relative bg-white rounded-3xl p-5 shadow-warm border border-bakery-dough space-y-4">
                <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-bakery-dough">
                  <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
                    alt="Midnight Chocolate Truffle Cake"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-bakery-espresso/80 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-bakery-crimson animate-ping"></span>
                    <span>Baking Now</span>
                  </div>
                  <span className="absolute top-3 right-3 bg-bakery-sage text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    Eggless
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-bakery-espresso">
                      Midnight Belgian Truffle Cake
                    </h3>
                    <p className="text-xs text-bakery-cocoaMuted">70% Pure Dark Cocoa • Fresh Sponge</p>
                  </div>
                  <span className="font-serif text-xl font-bold text-bakery-crust">
                    ₹549
                  </span>
                </div>

                <button className="w-full bg-bakery-dough hover:bg-bakery-crust hover:text-white text-bakery-espresso font-semibold py-3 rounded-xl transition-all duration-200 text-sm">
                  Quick Add to Bag +
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};