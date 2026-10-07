import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext.js';
import { LanguageSelector } from '../LanguageSelector.js';
import { CurrencySelector } from '../CurrencySelector.js';
import type { Product, Category, Reservation } from '../../types.js';
import {
  Waves,
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  CalendarCheck,
  Image as ImageIcon,
  Sliders,
  KeyRound,
  LogOut,
  Eye,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Search,
  Check,
  X,
  Menu as MenuIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';

export function ManagerDashboard() {
  const {
    t,
    settings,
    updateSettings,
    products,
    categories,
    reservations,
    gallery,
    formatPrice,
    currency,
    managerUsername,
    logoutManagerUser,
    setCurrentView,
    addProduct,
    editProduct,
    removeProduct,
    addCategory,
    editCategory,
    removeCategory,
    updateReservationStatus,
    removeReservation,
    addGalleryItem,
    removeGalleryItem,
    changePassword,
    language
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'reservations' | 'gallery' | 'settings' | 'security'
  >('overview');

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ----------------------------------------------------
  // PRODUCT MANAGEMENT MODALS
  // ----------------------------------------------------
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    nameFr: '',
    nameAr: '',
    description: '',
    descFr: '',
    descAr: '',
    price: 35,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    available: true,
    featured: false,
    ingredients: '',
    allergens: '',
    winePairing: '',
    calories: 450
  });

  const [productFilterCat, setProductFilterCat] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      nameFr: '',
      nameAr: '',
      description: '',
      descFr: '',
      descAr: '',
      price: 45,
      category: categories[0]?.slug || 'starters',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
      available: true,
      featured: false,
      ingredients: 'Fresh lobster, Coral butter, Herbs',
      allergens: 'Crustaceans, Dairy',
      winePairing: 'Puligny-Montrachet',
      calories: 480
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      nameFr: prod.nameFr || '',
      nameAr: prod.nameAr || '',
      description: prod.description,
      descFr: prod.descFr || '',
      descAr: prod.descAr || '',
      price: prod.price,
      category: prod.category,
      image: prod.image,
      available: prod.available,
      featured: Boolean(prod.featured),
      ingredients: prod.ingredients?.join(', ') || '',
      allergens: prod.allergens?.join(', ') || '',
      winePairing: prod.winePairing || '',
      calories: prod.calories || 400
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Product> = {
      name: productForm.name,
      nameFr: productForm.nameFr,
      nameAr: productForm.nameAr,
      description: productForm.description,
      descFr: productForm.descFr,
      descAr: productForm.descAr,
      price: Number(productForm.price),
      category: productForm.category,
      image: productForm.image,
      available: productForm.available,
      featured: productForm.featured,
      ingredients: productForm.ingredients.split(',').map(s => s.trim()).filter(Boolean),
      allergens: productForm.allergens.split(',').map(s => s.trim()).filter(Boolean),
      winePairing: productForm.winePairing || undefined,
      calories: Number(productForm.calories) || undefined
    };

    if (editingProduct) {
      await editProduct(editingProduct.id, payload);
    } else {
      await addProduct(payload);
    }
    setIsProductModalOpen(false);
  };

  // ----------------------------------------------------
  // CATEGORY MODALS
  // ----------------------------------------------------
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({
    name: '',
    nameFr: '',
    nameAr: '',
    slug: '',
    enabled: true
  });

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatForm({ name: '', nameFr: '', nameAr: '', slug: '', enabled: true });
    setIsCatModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatForm({
      name: cat.name,
      nameFr: cat.nameFr,
      nameAr: cat.nameAr,
      slug: cat.slug,
      enabled: cat.enabled
    });
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await editCategory(editingCategory.id, catForm);
    } else {
      await addCategory(catForm);
    }
    setIsCatModalOpen(false);
  };

  // ----------------------------------------------------
  // GALLERY MODAL
  // ----------------------------------------------------
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    titleFr: '',
    titleAr: '',
    url: '',
    category: 'Cuisine'
  });

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    await addGalleryItem(galleryForm);
    setIsGalleryModalOpen(false);
    setGalleryForm({ title: '', titleFr: '', titleAr: '', url: '', category: 'Cuisine' });
  };

  // ----------------------------------------------------
  // SETTINGS FORM
  // ----------------------------------------------------
  const [settingsForm, setSettingsForm] = useState(() => ({
    name: settings?.name || 'Star Fish',
    tagline: settings?.tagline || '',
    phone: settings?.phone || '',
    email: settings?.email || '',
    address: settings?.address || '',
    lunch: settings?.openingHours?.lunch || '12:00 PM – 3:30 PM',
    dinner: settings?.openingHours?.dinner || '7:00 PM – 11:30 PM',
    days: settings?.openingHours?.days || 'Tuesday – Sunday (Closed Mondays)',
    aboutStory: settings?.aboutStory || ''
  }));

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      name: settingsForm.name,
      tagline: settingsForm.tagline,
      phone: settingsForm.phone,
      email: settingsForm.email,
      address: settingsForm.address,
      aboutStory: settingsForm.aboutStory,
      openingHours: {
        lunch: settingsForm.lunch,
        dinner: settingsForm.dinner,
        days: settingsForm.days
      }
    });
  };

  // ----------------------------------------------------
  // SECURITY & CHANGE PASSWORD FORM
  // Form contains EXACTLY:
  // Current Password, New Password, Confirm New Password
  // ----------------------------------------------------
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ error?: string; success?: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordStatus({ error: t.fillAllFields });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordStatus({ error: t.passwordsDoNotMatch });
      return;
    }

    if (newPassword.length < 3) {
      setPasswordStatus({ error: 'New password must be at least 3 characters long.' });
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword, confirmNewPassword);
      setPasswordStatus({ success: t.passwordUpdatedSuccess });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update password';
      setPasswordStatus({ error: msg });
    } finally {
      setPasswordLoading(false);
    }
  };

  // ----------------------------------------------------
  // RESERVATIONS FILTER & DETAILS
  // ----------------------------------------------------
  const [resFilter, setResFilter] = useState<string>('all');
  const [resSearch, setResSearch] = useState<string>('');
  const [selectedResDetails, setSelectedResDetails] = useState<Reservation | null>(null);

  const filteredReservations = reservations.filter(r => {
    if (resFilter !== 'all' && r.status !== resFilter) return false;
    if (resSearch.trim()) {
      const q = resSearch.toLowerCase();
      return (
        r.fullName.toLowerCase().includes(q) ||
        r.refCode.toLowerCase().includes(q) ||
        r.phone.includes(q)
      );
    }
    return true;
  });

  // Calculate Overview Statistics
  const totalProductsCount = products.length;
  const availableProductsCount = products.filter(p => p.available).length;
  const featuredCount = products.filter(p => p.featured).length;
  const totalReservationsCount = reservations.length;
  const pendingReservationsCount = reservations.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#040810] text-[#E2E8F0] flex flex-col selection:bg-[#60A5FA] selection:text-[#040810]">
      {/* Top Manager Header */}
      <header className="sticky top-0 z-30 bg-[#081220]/95 border-b border-slate-800 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#60A5FA] to-[#1E3A8A] p-[1px] shadow-md">
              <div className="w-full h-full bg-[#081220] rounded-xl flex items-center justify-center">
                <Waves className="w-4 h-4 text-[#60A5FA]" />
              </div>
            </div>
            <div>
              <span className="font-display tracking-[0.2em] text-sm font-bold text-white uppercase block">
                {settings?.name || 'STAR FISH'}
              </span>
              <span className="text-[10px] tracking-wider text-[#60A5FA] font-medium uppercase">
                {t.managerTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Selector with Live Editing */}
          <CurrencySelector allowChange={true} />

          {/* Language Switcher */}
          <LanguageSelector variant="minimal" />

          {/* Switch to Client View */}
          <button
            type="button"
            onClick={() => setCurrentView('client')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F2238] hover:bg-[#152E4D] border border-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            title={t.switchToClient}
          >
            <Eye className="w-3.5 h-3.5 text-[#E2B774]" />
            <span className="hidden sm:inline">{t.switchToClient}</span>
          </button>

          {/* Logged in badge & Logout */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
            <span className="text-slate-400">
              {managerUsername || 'admin'}
            </span>
          </div>

          <button
            type="button"
            onClick={logoutManagerUser}
            className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 transition-colors cursor-pointer"
            title={t.logout}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Desktop + Mobile) */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 rtl:left-auto rtl:right-0 z-40 w-64 bg-[#060D17] border-r rtl:border-r-0 rtl:border-l border-slate-800/90 flex flex-col justify-between p-4 transition-transform duration-300 lg:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-1.5 pt-2">
            <button
              type="button"
              onClick={() => { setActiveTab('overview'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.tabOverview}</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('products'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>{t.tabProducts}</span>
              <span className="ml-auto rtl:ml-0 rtl:mr-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
                {products.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('categories'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{t.tabCategories}</span>
              <span className="ml-auto rtl:ml-0 rtl:mr-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
                {categories.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('reservations'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'reservations'
                  ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{t.tabReservations}</span>
              {pendingReservationsCount > 0 && (
                <span className="ml-auto rtl:ml-0 rtl:mr-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-black">
                  {pendingReservationsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('gallery'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>{t.tabGallery}</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{t.tabCustomization}</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('security'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>{t.tabSecurity}</span>
            </button>
          </div>

          {/* Bottom active currency status */}
          <div className="p-3.5 rounded-xl bg-[#091524] border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>{t.activeCurrency}</span>
              <strong className="text-[#E2B774] font-mono">{currency}</strong>
            </div>
            <p className="text-[11px] text-slate-500 font-light">
              Reflected on all client menu rates.
            </p>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Dashboard Main Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#040810]">
          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW & STATS */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in text-left rtl:text-right">
              {/* Header */}
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  {t.tabOverview}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {t.managerTagline}
                </p>
              </div>

              {/* 6 Key Metrics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="p-4 rounded-2xl bg-[#081220] border border-slate-800 shadow-md">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    {t.statTotalProducts}
                  </span>
                  <strong className="font-display text-2xl text-white block">
                    {totalProductsCount}
                  </strong>
                </div>

                <div className="p-4 rounded-2xl bg-[#081220] border border-slate-800 shadow-md">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                    {t.statAvailableProducts}
                  </span>
                  <strong className="font-display text-2xl text-emerald-300 block">
                    {availableProductsCount}
                  </strong>
                </div>

                <div className="p-4 rounded-2xl bg-[#081220] border border-slate-800 shadow-md">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    {t.statCategories}
                  </span>
                  <strong className="font-display text-2xl text-white block">
                    {categories.length}
                  </strong>
                </div>

                <div className="p-4 rounded-2xl bg-[#081220] border border-slate-800 shadow-md">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    {t.statTotalReservations}
                  </span>
                  <strong className="font-display text-2xl text-white block">
                    {totalReservationsCount}
                  </strong>
                </div>

                <div className="p-4 rounded-2xl bg-[#081220] border border-slate-800 shadow-md">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block mb-1">
                    {t.statPendingReservations}
                  </span>
                  <strong className="font-display text-2xl text-amber-300 block">
                    {pendingReservationsCount}
                  </strong>
                </div>

                <div className="p-4 rounded-2xl bg-[#081220] border border-slate-800 shadow-md">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#E2B774] block mb-1">
                    {t.statFeatured}
                  </span>
                  <strong className="font-display text-2xl text-[#E2B774] block">
                    {featuredCount}
                  </strong>
                </div>
              </div>

              {/* Recent Reservations Table */}
              <div className="rounded-2xl bg-[#081220] border border-slate-800 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-lg font-bold text-white">
                    {t.recentReservations}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('reservations')}
                    className="text-xs text-[#60A5FA] hover:underline cursor-pointer"
                  >
                    View All Bookings
                  </button>
                </div>

                {reservations.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">{t.noReservationsYet}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left rtl:text-right">
                      <thead className="text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Reference</th>
                          <th className="py-2.5 px-3">Guest</th>
                          <th className="py-2.5 px-3">Date & Time</th>
                          <th className="py-2.5 px-3">Guests</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right rtl:text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {reservations.slice(0, 5).map(r => (
                          <tr key={r.id} className="hover:bg-slate-800/30">
                            <td className="py-3 px-3 font-mono font-bold text-[#E2B774]">{r.refCode}</td>
                            <td className="py-3 px-3 font-medium text-white">{r.fullName}</td>
                            <td className="py-3 px-3 text-slate-300">{r.date} at {r.time}</td>
                            <td className="py-3 px-3">{r.guests} pers.</td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  r.status === 'confirmed'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                    : r.status === 'pending'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                                    : r.status === 'completed'
                                    ? 'bg-blue-950 text-blue-300 border border-blue-500/30'
                                    : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                                }`}
                              >
                                {r.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right rtl:text-left space-x-2 rtl:space-x-reverse">
                              {r.status === 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => updateReservationStatus(r.id, 'confirmed')}
                                  className="px-2 py-1 rounded bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800 text-[11px] font-medium transition-colors cursor-pointer"
                                >
                                  Accept
                                </button>
                              )}
                              {r.status === 'confirmed' && (
                                <button
                                  type="button"
                                  onClick={() => updateReservationStatus(r.id, 'completed')}
                                  className="px-2 py-1 rounded bg-blue-900/60 text-blue-300 hover:bg-blue-800 text-[11px] font-medium transition-colors cursor-pointer"
                                >
                                  Complete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PRODUCT MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in text-left rtl:text-right">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    {t.tabProducts}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live seafood and culinary menu items.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] text-white text-xs font-semibold flex items-center gap-2 shadow-lg cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addProduct}</span>
                </button>
              </div>

              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute inset-y-0 left-3.5 rtl:left-auto rtl:right-3.5 my-auto text-slate-500" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder={t.search}
                    className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-2 rounded-xl bg-[#081220] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                  />
                </div>

                <select
                  value={productFilterCat}
                  onChange={(e) => setProductFilterCat(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#081220] border border-slate-700 text-xs text-slate-200 outline-none"
                >
                  <option value="all">{t.filterAll}</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Products Table */}
              <div className="rounded-2xl bg-[#081220] border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left rtl:text-right">
                    <thead className="bg-[#050C17] text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Dish</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Base Price</th>
                        <th className="py-3 px-4">Active Currency</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4">Featured</th>
                        <th className="py-3 px-4 text-right rtl:text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {products
                        .filter(p => {
                          if (productFilterCat !== 'all' && p.category !== productFilterCat) return false;
                          if (productSearch.trim()) {
                            return p.name.toLowerCase().includes(productSearch.toLowerCase());
                          }
                          return true;
                        })
                        .map(p => (
                          <tr key={p.id} className="hover:bg-slate-800/30">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                                />
                                <div>
                                  <strong className="text-white block font-medium">{p.name}</strong>
                                  <span className="text-[11px] text-slate-400 line-clamp-1">{p.description}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono uppercase text-slate-300">{p.category}</td>
                            <td className="py-3 px-4 font-mono font-semibold">${p.price}</td>
                            <td className="py-3 px-4 font-mono font-semibold text-[#E2B774]">{formatPrice(p.price)}</td>
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => editProduct(p.id, { available: !p.available })}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer transition-colors ${
                                  p.available
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900'
                                    : 'bg-rose-950 text-rose-300 border border-rose-500/30 hover:bg-rose-900'
                                }`}
                              >
                                {p.available ? t.inStock : t.soldOut}
                              </button>
                            </td>
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => editProduct(p.id, { featured: !p.featured })}
                                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                  p.featured
                                    ? 'bg-[#E2B774] text-[#050C17]'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                                title="Toggle Featured"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                            </td>
                            <td className="py-3 px-4 text-right rtl:text-left space-x-2 rtl:space-x-reverse">
                              <button
                                type="button"
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                                title={t.edit}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(t.deleteProductConfirm)) {
                                    removeProduct(p.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition-colors cursor-pointer"
                                title={t.delete}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: CATEGORY MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6 animate-fade-in text-left rtl:text-right">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    {t.tabCategories}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Organize restaurant menu divisions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] text-white text-xs font-semibold flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addCategory}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(c => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-[#081220] border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#C59A53]">
                          slug: {c.slug}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Order: #{c.order}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-white mb-1">
                        {c.name}
                      </h3>
                      <div className="text-xs text-slate-400 space-y-0.5">
                        <p>FR: {c.nameFr}</p>
                        <p>AR: {c.nameAr}</p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => editCategory(c.id, { enabled: !c.enabled })}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                          c.enabled
                            ? 'bg-emerald-950 text-emerald-300'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {c.enabled ? 'Enabled' : 'Disabled'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditCategory(c)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Delete category?')) {
                              removeCategory(c.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: RESERVATION MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'reservations' && (
            <div className="space-y-6 animate-fade-in text-left rtl:text-right">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  {t.tabReservations}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Oversee table bookings, guest arrivals and status transitions.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute inset-y-0 left-3.5 rtl:left-auto rtl:right-3.5 my-auto text-slate-500" />
                  <input
                    type="text"
                    value={resSearch}
                    onChange={(e) => setResSearch(e.target.value)}
                    placeholder="Search by guest name, phone, or reference..."
                    className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-2 rounded-xl bg-[#081220] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setResFilter(st)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                        resFilter === st
                          ? 'bg-[#1E3A8A] text-white'
                          : 'bg-[#081220] text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="rounded-2xl bg-[#081220] border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left rtl:text-right">
                    <thead className="bg-[#050C17] text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Ref Code</th>
                        <th className="py-3 px-4">Guest Info</th>
                        <th className="py-3 px-4">Date & Time</th>
                        <th className="py-3 px-4">Party Size</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Special Note</th>
                        <th className="py-3 px-4 text-right rtl:text-left">Change Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredReservations.map(r => (
                        <tr key={r.id} className="hover:bg-slate-800/30">
                          <td className="py-3 px-4 font-mono font-bold text-[#E2B774]">{r.refCode}</td>
                          <td className="py-3 px-4">
                            <strong className="text-white block">{r.fullName}</strong>
                            <span className="text-[11px] text-slate-400 block">{r.phone}</span>
                            <span className="text-[11px] text-slate-500 block">{r.email}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            <span className="block font-medium">{r.date}</span>
                            <span className="text-[11px] text-slate-400">{r.time}</span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-white">{r.guests} Guests</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                r.status === 'confirmed'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                  : r.status === 'pending'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                                  : r.status === 'completed'
                                  ? 'bg-blue-950 text-blue-300 border border-blue-500/30'
                                  : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                            {r.specialRequest || '—'}
                          </td>
                          <td className="py-3 px-4 text-right rtl:text-left space-x-1.5 rtl:space-x-reverse">
                            <button
                              type="button"
                              onClick={() => updateReservationStatus(r.id, 'confirmed')}
                              className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 hover:bg-emerald-900 text-[10px] font-medium cursor-pointer"
                              title="Accept / Confirm"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => updateReservationStatus(r.id, 'completed')}
                              className="px-2 py-1 rounded bg-blue-950 text-blue-300 hover:bg-blue-900 text-[10px] font-medium cursor-pointer"
                              title="Mark Completed"
                            >
                              Complete
                            </button>
                            <button
                              type="button"
                              onClick={() => updateReservationStatus(r.id, 'cancelled')}
                              className="px-2 py-1 rounded bg-rose-950 text-rose-300 hover:bg-rose-900 text-[10px] font-medium cursor-pointer"
                              title="Cancel"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Delete reservation?')) {
                                  removeReservation(r.id);
                                }
                              }}
                              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: GALLERY MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-fade-in text-left rtl:text-right">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    {t.tabGallery}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Showcase photography for the customer portal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] text-white text-xs font-semibold flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Image</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map(g => (
                  <div
                    key={g.id}
                    className="relative rounded-2xl overflow-hidden bg-[#081220] border border-slate-800 shadow-xl group"
                  >
                    <img
                      src={g.url}
                      alt={g.title}
                      className="w-full h-48 object-cover object-center"
                    />
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#C59A53] block">
                          {g.category}
                        </span>
                        <h4 className="text-sm font-semibold text-white">
                          {g.title}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Delete image?')) {
                            removeGalleryItem(g.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition-colors cursor-pointer"
                        title="Delete Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: RESTAURANT CUSTOMIZATION */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl animate-fade-in text-left rtl:text-right">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  {t.tabCustomization}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update restaurant brand identity, contact information and operating hours.
                </p>
              </div>

              {/* Active Currency Section */}
              <div className="p-6 rounded-2xl bg-[#081220] border border-[#60A5FA]/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      {t.settingsCurrency}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {t.settingsCurrencyNotice}
                    </p>
                  </div>
                  <CurrencySelector allowChange={true} />
                </div>
              </div>

              {/* General Settings Form */}
              <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-[#081220] border border-slate-800 shadow-xl space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t.settingsRestName}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t.settingsTagline}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t.settingsPhone}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t.settingsEmail}
                    </label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {t.settingsAddress}
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t.settingsLunch}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.lunch}
                      onChange={(e) => setSettingsForm({ ...settingsForm, lunch: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t.settingsDinner}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.dinner}
                      onChange={(e) => setSettingsForm({ ...settingsForm, dinner: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t.settingsDays}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.days}
                      onChange={(e) => setSettingsForm({ ...settingsForm, days: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {t.settingsAboutStory}
                  </label>
                  <textarea
                    rows={4}
                    value={settingsForm.aboutStory}
                    onChange={(e) => setSettingsForm({ ...settingsForm, aboutStory: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] text-white text-xs font-semibold cursor-pointer shadow-lg"
                >
                  {t.save}
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: SECURITY & CHANGE PASSWORD */}
          {/* Form contains EXACTLY:
              Current Password
              New Password
              Confirm New Password */}
          {/* ========================================================= */}
          {activeTab === 'security' && (
            <div className="max-w-md animate-fade-in text-left rtl:text-right space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  {t.changePasswordTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.changePasswordSubtitle}
                </p>
              </div>

              {passwordStatus?.error && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{passwordStatus.error}</span>
                </div>
              )}

              {passwordStatus?.success && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{passwordStatus.success}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="p-6 rounded-2xl bg-[#081220] border border-slate-800 shadow-xl space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {t.fieldCurrentPassword} *
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {t.fieldNewPassword} *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {t.fieldConfirmNewPassword} *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] text-white text-xs font-semibold tracking-wide shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.loading}</span>
                    </>
                  ) : (
                    <span>{t.btnUpdatePassword}</span>
                  )}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* ADD / EDIT PRODUCT MODAL */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-[#081220] border border-slate-700 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-left rtl:text-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="font-display text-lg font-bold text-white">
                {editingProduct ? t.editProduct : t.addProduct}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {t.prodName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {t.prodNameFr}
                  </label>
                  <input
                    type="text"
                    value={productForm.nameFr}
                    onChange={(e) => setProductForm({ ...productForm, nameFr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {t.prodNameAr}
                  </label>
                  <input
                    type="text"
                    value={productForm.nameAr}
                    onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {t.prodPrice} *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {t.prodCategory} *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  {t.prodImage} *
                </label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  {t.prodDesc}
                </label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {t.prodIngredients}
                  </label>
                  <input
                    type="text"
                    value={productForm.ingredients}
                    onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {t.prodAllergens}
                  </label>
                  <input
                    type="text"
                    value={productForm.allergens}
                    onChange={(e) => setProductForm({ ...productForm, allergens: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {t.prodWine}
                  </label>
                  <input
                    type="text"
                    value={productForm.winePairing}
                    onChange={(e) => setProductForm({ ...productForm, winePairing: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {t.prodCalories}
                  </label>
                  <input
                    type="number"
                    value={productForm.calories}
                    onChange={(e) => setProductForm({ ...productForm, calories: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={productForm.available}
                    onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-[#040810] border-slate-700"
                  />
                  <span>{t.prodAvailable}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-[#040810] border-slate-700"
                  />
                  <span>{t.prodFeatured}</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] text-xs font-semibold text-white shadow-lg cursor-pointer"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD / EDIT CATEGORY MODAL */}
      {/* ========================================================= */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#081220] border border-slate-700 rounded-2xl p-6 shadow-2xl text-left rtl:text-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-display text-lg font-bold text-white">
                {editingCategory ? 'Edit Category' : t.addCategory}
              </h3>
              <button
                type="button"
                onClick={() => setIsCatModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.catNameEn} *
                </label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({
                    ...catForm,
                    name: e.target.value,
                    slug: catForm.slug || e.target.value.toLowerCase().replace(/\s+/g, '-')
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.catSlug} *
                </label>
                <input
                  type="text"
                  required
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.catNameFr}
                </label>
                <input
                  type="text"
                  value={catForm.nameFr}
                  onChange={(e) => setCatForm({ ...catForm, nameFr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.catNameAr}
                </label>
                <input
                  type="text"
                  value={catForm.nameAr}
                  onChange={(e) => setCatForm({ ...catForm, nameAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD GALLERY MODAL */}
      {/* ========================================================= */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#081220] border border-slate-700 rounded-2xl p-6 shadow-2xl text-left rtl:text-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-display text-lg font-bold text-white">
                Add Gallery Photo
              </h3>
              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={galleryForm.url}
                  onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-700 text-xs text-white outline-none focus:border-[#60A5FA]"
                >
                  <option value="Cuisine">Cuisine</option>
                  <option value="Ambience">Ambience</option>
                  <option value="Artistry">Artistry</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
