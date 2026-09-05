import React, { useEffect, useState } from 'react';
import { Flame, Bike, PackageCheck, RefreshCw, ArrowLeft, Lock, Mail, LogOut, Loader2, BellRing } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderRecord {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_slot: string;
  total_amount: number;
  order_status: 'baking' | 'out_for_delivery' | 'delivered';
  items: OrderItem[];
  created_at: string;
}

interface AdminOrdersProps {
  onBackToStore: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ onBackToStore }) => {
  const [session, setSession] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Login form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Orders data states
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [livePing, setLivePing] = useState(false);

  // Check initial active session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setOrders(data as OrderRecord[]);
    } catch (err: any) {
      console.error('Error fetching admin orders:', err.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Realtime listener setup
  useEffect(() => {
    if (!session) return;

    fetchOrders();

    // Subscribe to database changes live
    const channel = supabase
      .channel('orders-realtime-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const newOrder = payload.new as OrderRecord;
          setOrders((prev) => [newOrder, ...prev]);
          setLivePing(true);
          setTimeout(() => setLivePing(false), 3000);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const updatedOrder = payload.new as OrderRecord;
          setOrders((prev) =>
            prev.map((ord) => (ord.id === updatedOrder.id ? updatedOrder : ord))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOrders([]);
  };

  const updateStatus = async (orderId: string, nextStatus: 'baking' | 'out_for_delivery' | 'delivered') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: nextStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: nextStatus } : o))
      );
    } catch (err: any) {
      alert('Status update failed: ' + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'baking':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-bakery-crimson bg-bakery-crimson/10 px-3 py-1 rounded-full border border-bakery-crimson/20">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            In Oven
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-bakery-crust bg-bakery-crust/10 px-3 py-1 rounded-full border border-bakery-crust/20">
            <Bike className="w-3.5 h-3.5" />
            Out for Delivery
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-bakery-sage bg-bakery-sage/10 px-3 py-1 rounded-full border border-bakery-sage/20">
            <PackageCheck className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      default:
        return null;
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center text-bakery-cocoaMuted">
        <Loader2 className="w-8 h-8 animate-spin text-bakery-crust" />
      </div>
    );
  }

  // View 1: If Staff is NOT logged in, show Staff Login Form
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-bakery-dough p-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBackToStore}
              className="flex items-center gap-1 text-xs font-semibold text-bakery-cocoaMuted hover:text-bakery-espresso transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-bakery-crust/10 text-bakery-crust rounded-full">
              Enterprise Auth
            </span>
          </div>

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-bakery-crust/10 text-bakery-crust rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-bakery-espresso">Kitchen Staff Access</h2>
            <p className="text-xs text-bakery-cocoaMuted mt-1">
              Sign in with your authorized oven dispatch credentials
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-bakery-crimson/10 border border-bakery-crimson/20 rounded-xl text-xs text-bakery-crimson">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="w-4 h-4 text-bakery-cocoaMuted absolute left-3.5 top-3.5" />
              <input
                required
                type="email"
                placeholder="staff@ovenglow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bakery-dough/30 border border-bakery-dough focus:border-bakery-crust rounded-xl py-2.5 pl-10 pr-4 text-xs text-bakery-espresso outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-bakery-cocoaMuted absolute left-3.5 top-3.5" />
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bakery-dough/30 border border-bakery-dough focus:border-bakery-crust rounded-xl py-2.5 pl-10 pr-4 text-xs text-bakery-espresso outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-2 bg-bakery-crust hover:bg-bakery-crustDark text-white py-3 rounded-xl font-bold text-xs transition-all shadow-warm hover:shadow-warm-hover disabled:opacity-50"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Access Kitchen Console</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // View 2: Authenticated Live Kitchen Console
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Realtime Live Incoming Notification Toast */}
      {livePing && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-bakery-crimson text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 animate-bounce">
          <BellRing className="w-5 h-5 animate-pulse" />
          <div>
            <p className="text-xs font-bold">New Midnight Order Placed!</p>
            <p className="text-[10px] opacity-90">Auto-inserted to kitchen dispatch list</p>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-bakery-dough">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStore}
            className="p-2 rounded-xl bg-white border border-bakery-dough hover:bg-bakery-dough text-bakery-espresso transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-3xl font-bold text-bakery-espresso">
                Live Kitchen Dispatch
              </h1>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bakery-sage opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-bakery-sage"></span>
              </span>
            </div>
            <p className="text-xs text-bakery-cocoaMuted">
              WebSocket Connected • Logged in as: <span className="font-semibold text-bakery-espresso">{session.user.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-bakery-dough rounded-xl text-xs font-bold text-bakery-espresso hover:bg-bakery-dough transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-bakery-espresso hover:bg-bakery-crimson text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Orders List */}
      {loadingOrders ? (
        <div className="py-24 text-center text-sm font-semibold text-bakery-cocoaMuted flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-bakery-crust" />
          <span>Fetching orders under secure RLS session...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-24 text-center text-sm text-bakery-cocoaMuted">
          No orders in the database. Place an order from the storefront in another tab to watch it appear in real-time!
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-bakery-dough shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-warm transition-all"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-bold text-bakery-crust bg-bakery-crust/10 px-2.5 py-0.5 rounded-md">
                    #{order.id.slice(0, 8)}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-bakery-espresso">
                    {order.customer_name}
                  </h3>
                  <span className="text-xs text-bakery-cocoaMuted">
                    ({order.customer_phone})
                  </span>
                  {getStatusBadge(order.order_status)}
                </div>

                <p className="text-xs text-bakery-cocoaMuted">
                  <span className="font-semibold text-bakery-espresso">Address:</span> {order.delivery_address}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {order.items?.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-bakery-cream border border-bakery-dough px-2.5 py-1 rounded-lg text-bakery-espresso font-medium"
                    >
                      {item.name} × <b>{item.quantity}</b>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-bakery-dough">
                <div className="lg:text-right">
                  <span className="text-[10px] uppercase font-bold text-bakery-cocoaMuted block">Amount</span>
                  <span className="font-serif text-2xl font-bold text-bakery-espresso">
                    ₹{order.total_amount}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateStatus(order.id, 'baking')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      order.order_status === 'baking'
                        ? 'bg-bakery-crimson text-white border-bakery-crimson'
                        : 'bg-white text-bakery-espresso border-bakery-dough hover:bg-bakery-dough'
                    }`}
                  >
                    Bake
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, 'out_for_delivery')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      order.order_status === 'out_for_delivery'
                        ? 'bg-bakery-crust text-white border-bakery-crust'
                        : 'bg-white text-bakery-espresso border-bakery-dough hover:bg-bakery-dough'
                    }`}
                  >
                    Dispatch
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, 'delivered')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      order.order_status === 'delivered'
                        ? 'bg-bakery-sage text-white border-bakery-sage'
                        : 'bg-white text-bakery-espresso border-bakery-dough hover:bg-bakery-dough'
                    }`}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};