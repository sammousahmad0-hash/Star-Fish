import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Product,
  Category,
  Reservation,
  RestaurantSettings,
  GalleryItem,
  CartItem,
  Language,
  CurrencyCode
} from '../types.js';
import { translations } from '../i18n/translations.js';
import * as api from '../services/api.js';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface RestaurantContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRtl: boolean;
  t: typeof translations.en;
  
  currency: CurrencyCode;
  formatPrice: (usdPrice: number) => string;
  
  settings: RestaurantSettings | null;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => Promise<void>;
  
  categories: Category[];
  products: Product[];
  reservations: Reservation[];
  gallery: GalleryItem[];
  
  refreshData: () => Promise<void>;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  
  // View navigation
  currentView: 'role-selection' | 'client' | 'manager';
  setCurrentView: (view: 'role-selection' | 'client' | 'manager') => void;
  
  // Manager Auth
  isManagerAuthenticated: boolean;
  hasManagerAccount: boolean;
  managerUsername: string | null;
  authLoading: boolean;
  loginManagerUser: (u: string, p: string) => Promise<void>;
  setupManagerUser: (u: string, p: string, c: string) => Promise<void>;
  changePassword: (curr: string, newP: string, conf: string) => Promise<void>;
  logoutManagerUser: () => Promise<void>;
  checkManagerAuthStatus: () => Promise<void>;

  // Products CRUD
  addProduct: (data: Partial<Product>) => Promise<Product>;
  editProduct: (id: string, data: Partial<Product>) => Promise<Product>;
  removeProduct: (id: string) => Promise<void>;

  // Categories CRUD
  addCategory: (data: Partial<Category>) => Promise<Category>;
  editCategory: (id: string, data: Partial<Category>) => Promise<Category>;
  removeCategory: (id: string) => Promise<void>;

  // Reservations CRUD
  addReservation: (data: Parameters<typeof api.createReservation>[0]) => Promise<Reservation>;
  updateReservationStatus: (id: string, status: Reservation['status']) => Promise<void>;
  removeReservation: (id: string) => Promise<void>;

  // Gallery CRUD
  addGalleryItem: (data: Partial<GalleryItem>) => Promise<GalleryItem>;
  removeGalleryItem: (id: string) => Promise<void>;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  // Multilingual state
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('starfish_lang');
    return (saved === 'fr' || saved === 'ar') ? saved : 'en';
  });

  const isRtl = language === 'ar';
  const t = translations[language];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('starfish_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Main data states
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  
  // View & Auth state
  const [currentView, setCurrentView] = useState<'role-selection' | 'client' | 'manager'>('role-selection');
  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState<boolean>(false);
  const [hasManagerAccount, setHasManagerAccount] = useState<boolean>(true); // default true until checked
  const [managerUsername, setManagerUsername] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('starfish_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('starfish_cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart:', err);
    }
  }, [cart]);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // Fetch all data
  const refreshData = useCallback(async () => {
    try {
      const [s, c, p, r, g] = await Promise.all([
        api.getSettings().catch(() => null),
        api.getCategories().catch(() => []),
        api.getProducts().catch(() => []),
        api.getReservations().catch(() => []),
        api.getGallery().catch(() => [])
      ]);
      if (s) setSettings(s);
      setCategories(c);
      setProducts(p);
      setReservations(r);
      setGallery(g);
    } catch (err) {
      console.error('Error refreshing restaurant data:', err);
    }
  }, []);

  // Check manager auth status
  const checkManagerAuthStatus = useCallback(async () => {
    setAuthLoading(true);
    try {
      const status = await api.checkAuthStatus();
      setHasManagerAccount(status.hasAccount);
      if (status.username) {
        setManagerUsername(status.username);
      }
      
      // If token exists, verify session
      const session = await api.verifyCurrentManagerSession();
      if (session) {
        setIsManagerAuthenticated(true);
        if (session.username) setManagerUsername(session.username);
      } else {
        setIsManagerAuthenticated(false);
      }
    } catch (err) {
      console.error('Failed checking auth status:', err);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
    checkManagerAuthStatus();
  }, [refreshData, checkManagerAuthStatus]);

  // Active currency
  const currency: CurrencyCode = settings?.currency || 'USD';

  const formatPrice = useCallback((usdPrice: number): string => {
    const rates = settings?.currencyRates || { USD: 1, EUR: 0.92, MAD: 10.0 };
    if (currency === 'EUR') {
      const rate = rates.EUR || 0.92;
      const converted = Math.round(usdPrice * rate);
      return `${converted} €`;
    }
    if (currency === 'MAD') {
      const rate = rates.MAD || 10.0;
      const converted = Math.round(usdPrice * rate);
      return `${converted} د.م.`;
    }
    // USD default
    return `$${usdPrice.toFixed(0)}`;
  }, [currency, settings?.currencyRates]);

  // Manager Actions
  const loginManagerUser = async (u: string, p: string) => {
    const res = await api.loginManager({ username: u, password: p });
    setIsManagerAuthenticated(true);
    setManagerUsername(res.username);
    showToast(t.loginSuccess, 'success');
  };

  const setupManagerUser = async (u: string, p: string, c: string) => {
    const res = await api.setupManagerAccount({ username: u, password: p, confirmPassword: c });
    setIsManagerAuthenticated(true);
    setHasManagerAccount(true);
    setManagerUsername(res.username);
    showToast(t.loginSuccess, 'success');
  };

  const changePassword = async (curr: string, newP: string, conf: string) => {
    const res = await api.changeManagerPassword({ currentPassword: curr, newPassword: newP, confirmPassword: conf });
    showToast(res.message || t.passwordUpdatedSuccess, 'success');
  };

  const logoutManagerUser = async () => {
    await api.logoutManager();
    setIsManagerAuthenticated(false);
    setCurrentView('client');
    showToast('Logged out of manager portal', 'info');
  };

  // Settings update
  const updateSettings = async (newSettings: Partial<RestaurantSettings>) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
    showToast(t.savedSuccess, 'success');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(t.orderAddedToast, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Products CRUD
  const addProduct = async (data: Partial<Product>) => {
    const newProd = await api.createProduct(data);
    setProducts(prev => [newProd, ...prev]);
    showToast('Dish successfully added to menu', 'success');
    return newProd;
  };

  const editProduct = async (id: string, data: Partial<Product>) => {
    const updated = await api.updateProduct(id, data);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    showToast('Dish details updated', 'success');
    return updated;
  };

  const removeProduct = async (id: string) => {
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Dish removed from menu', 'info');
  };

  // Categories CRUD
  const addCategory = async (data: Partial<Category>) => {
    const newCat = await api.createCategory(data);
    setCategories(prev => [...prev, newCat]);
    showToast('Category created', 'success');
    return newCat;
  };

  const editCategory = async (id: string, data: Partial<Category>) => {
    const updated = await api.updateCategory(id, data);
    setCategories(prev => prev.map(c => c.id === id ? updated : c));
    showToast('Category updated', 'success');
    return updated;
  };

  const removeCategory = async (id: string) => {
    await api.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category deleted', 'info');
  };

  // Reservations CRUD
  const addReservation = async (data: Parameters<typeof api.createReservation>[0]) => {
    const newRes = await api.createReservation(data);
    setReservations(prev => [newRes, ...prev]);
    return newRes;
  };

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    const updated = await api.updateReservationStatus(id, status);
    setReservations(prev => prev.map(r => r.id === id ? updated : r));
    showToast(`Reservation status marked as ${status}`, 'success');
  };

  const removeReservation = async (id: string) => {
    await api.deleteReservation(id);
    setReservations(prev => prev.filter(r => r.id !== id));
    showToast('Reservation deleted', 'info');
  };

  // Gallery CRUD
  const addGalleryItem = async (data: Partial<GalleryItem>) => {
    const item = await api.createGalleryItem(data);
    setGallery(prev => [item, ...prev]);
    showToast('Gallery image added', 'success');
    return item;
  };

  const removeGalleryItem = async (id: string) => {
    await api.deleteGalleryItem(id);
    setGallery(prev => prev.filter(g => g.id !== id));
    showToast('Gallery image deleted', 'info');
  };

  return (
    <RestaurantContext.Provider
      value={{
        language,
        setLanguage,
        isRtl,
        t,
        currency,
        formatPrice,
        settings,
        updateSettings,
        categories,
        products,
        reservations,
        gallery,
        refreshData,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        currentView,
        setCurrentView,
        isManagerAuthenticated,
        hasManagerAccount,
        managerUsername,
        authLoading,
        loginManagerUser,
        setupManagerUser,
        changePassword,
        logoutManagerUser,
        checkManagerAuthStatus,
        addProduct,
        editProduct,
        removeProduct,
        addCategory,
        editCategory,
        removeCategory,
        addReservation,
        updateReservationStatus,
        removeReservation,
        addGalleryItem,
        removeGalleryItem,
        toasts,
        showToast
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error('useRestaurant must be used within RestaurantProvider');
  return ctx;
}
