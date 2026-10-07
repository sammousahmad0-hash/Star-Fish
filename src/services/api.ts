import type {
  Product,
  Category,
  Reservation,
  RestaurantSettings,
  GalleryItem,
  AuthStatusResponse
} from '../types.js';

const TOKEN_KEY = 'starfish_manager_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ------------------------------------
// AUTHENTICATION API
// ------------------------------------

export async function checkAuthStatus(): Promise<AuthStatusResponse> {
  const res = await fetch('/api/auth/status');
  if (!res.ok) throw new Error('Failed to fetch auth status');
  return res.json();
}

export async function setupManagerAccount(data: {
  username: string;
  password: string;
  confirmPassword: string;
}): Promise<{ success: boolean; token: string; username: string }> {
  const res = await fetch('/api/auth/setup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Setup failed');
  setStoredToken(json.token);
  return json;
}

export async function loginManager(data: {
  username: string;
  password: string;
}): Promise<{ success: boolean; token: string; username: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Authentication failed');
  setStoredToken(json.token);
  return json;
}

export async function changeManagerPassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update password');
  return json;
}

export async function logoutManager(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders()
    });
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    clearStoredToken();
  }
}

export async function verifyCurrentManagerSession(): Promise<{ username?: string } | null> {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      clearStoredToken();
      return null;
    }
    return res.json();
  } catch {
    clearStoredToken();
    return null;
  }
}

// ------------------------------------
// SETTINGS & CURRENCY API
// ------------------------------------

export async function getSettings(): Promise<RestaurantSettings> {
  const res = await fetch('/api/settings');
  if (!res.ok) throw new Error('Failed to fetch restaurant settings');
  return res.json();
}

export async function updateSettings(data: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to save settings');
  return json;
}

// ------------------------------------
// CATEGORIES API
// ------------------------------------

export async function getCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createCategory(data: Partial<Category>): Promise<Category> {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create category');
  return json;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  const res = await fetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update category');
  return json;
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete category');
}

// ------------------------------------
// PRODUCTS API
// ------------------------------------

export async function getProducts(): Promise<Product[]> {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create dish');
  return json;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update dish');
  return json;
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete dish');
}

// ------------------------------------
// RESERVATIONS API
// ------------------------------------

export async function getReservations(): Promise<Reservation[]> {
  const res = await fetch('/api/reservations');
  if (!res.ok) throw new Error('Failed to fetch reservations');
  return res.json();
}

export async function createReservation(data: {
  fullName: string;
  phone: string;
  email: string;
  guests: number;
  date: string;
  time: string;
  specialRequest?: string;
}): Promise<Reservation> {
  const res = await fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to submit reservation');
  return json;
}

export async function updateReservationStatus(id: string, status: Reservation['status']): Promise<Reservation> {
  const res = await fetch(`/api/reservations/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update reservation');
  return json;
}

export async function deleteReservation(id: string): Promise<void> {
  const res = await fetch(`/api/reservations/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete reservation');
}

// ------------------------------------
// GALLERY API
// ------------------------------------

export async function getGallery(): Promise<GalleryItem[]> {
  const res = await fetch('/api/gallery');
  if (!res.ok) throw new Error('Failed to fetch gallery');
  return res.json();
}

export async function createGalleryItem(data: Partial<GalleryItem>): Promise<GalleryItem> {
  const res = await fetch('/api/gallery', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to add gallery image');
  return json;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const res = await fetch(`/api/gallery/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete gallery image');
}
