import React, { useState, useEffect } from 'react';
import { Star, Clock, Plus, Check, Loader2, SearchX } from 'lucide-react';
import type { Product } from '../store/useCartStore';
import { useCartStore } from '../store/useCartStore';
import { supabase } from '../lib/supabaseClient';

const CATEGORIES = [
  { label: 'All Bakes', value: 'all' },
  { label: 'Midnight Cakes', value: 'cakes' },
  { label: 'Artisan Breads', value: 'breads' },
  { label: 'Warm Pastries', value: 'pastries' },
  { label: 'Brownies & Cookies', value: 'cookies' },
];

export const ProductSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [egglessOnly, setEgglessOnly] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const addItem = useCartStore((state) => state.addItem);
  const searchQuery = useCartStore((state) => state.searchQuery);
  const setSearchQuery = useCartStore((state) => state.setSearchQuery);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;

        if (data) {
          const formatted: Product[] = data.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: Number(item.price),
            image: item.image,
            description: item.description,
            isEggless: item.is_eggless,
            prepTime: item.prep_time,
            rating: Number(item.rating),
          }));
          setProducts(formatted);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Multi-tier filtering: Category + Eggless Toggle + Live Search Query
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesEggless = egglessOnly ? prod.isEggless : true;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesEggless && matchesSearch;
  });

  const handleAdd = (product: Product) => {
    addItem(product);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  return (
    <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-bakery-crust">
            From The Oven
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-espresso mt-1">
            24x7 Fresh Bakes Menu
          </h2>
          {searchQuery && (
            <p className="text-xs text-bakery-cocoaMuted mt-1">
              Showing results for: <span className="font-bold text-bakery-espresso">"{searchQuery}"</span>
            </p>
          )}
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              checked={egglessOnly}
              onChange={(e) => setEgglessOnly(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-11 h-6 rounded-full transition-colors ${
                egglessOnly ? 'bg-bakery-sage' : 'bg-bakery-dough'
              }`}
            ></div>
            <div
              className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                egglessOnly ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></div>
          </div>
          <span className="text-sm font-semibold text-bakery-espresso">100% Eggless Only</span>
        </label>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat.value
                ? 'bg-bakery-espresso text-white shadow-warm'
                : 'bg-white hover:bg-bakery-dough text-bakery-cocoaMuted border border-bakery-dough'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-bakery-crust">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm font-medium text-bakery-cocoaMuted">Fetching fresh bakes from database...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-bakery-dough flex items-center justify-center text-bakery-cocoaMuted mb-3">
            <SearchX className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-bakery-espresso">No bakes matched your search</h3>
          <p className="text-xs text-bakery-cocoaMuted mt-1">
            Try searching for "Cake", "Croissant", or clear your search term.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setEgglessOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-bakery-espresso text-white text-xs font-semibold rounded-xl hover:bg-bakery-crust transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const isRecentlyAdded = addedIds[product.id];

            return (
              <div
                key={product.id}
                className="group bg-white rounded-3xl p-4 border border-bakery-dough/80 shadow-sm hover:shadow-warm transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 rounded-2xl overflow-hidden bg-bakery-dough mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-semibold text-bakery-espresso">
                      <Clock className="w-3 h-3 text-bakery-crust" />
                      <span>{product.prepTime}</span>
                    </div>

                    {product.isEggless && (
                      <span className="absolute top-3 right-3 bg-bakery-sage text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Eggless
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-bakery-honey text-xs font-bold mb-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-bakery-espresso group-hover:text-bakery-crust transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-bakery-cocoaMuted mt-1 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-bakery-dough">
                  <div>
                    <span className="text-[10px] text-bakery-cocoaMuted uppercase block">Price</span>
                    <span className="font-serif text-xl font-bold text-bakery-espresso">
                      ₹{product.price}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAdd(product)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 ${
                      isRecentlyAdded
                        ? 'bg-bakery-sage text-white'
                        : 'bg-bakery-espresso hover:bg-bakery-crust text-white'
                    }`}
                  >
                    {isRecentlyAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};