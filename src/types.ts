export type CurrencyCode = 'USD' | 'EUR' | 'MAD';
export type Language = 'en' | 'fr' | 'ar';

export interface Product {
  id: string;
  name: string;
  nameFr?: string;
  nameAr?: string;
  description: string;
  descFr?: string;
  descAr?: string;
  price: number; // Base USD price
  category: string; // slug e.g. 'starters', 'seafood', 'main-courses', 'grilled', 'pasta', 'salads', 'desserts', 'drinks'
  image: string;
  available: boolean;
  featured?: boolean;
  ingredients?: string[];
  allergens?: string[];
  calories?: number;
  winePairing?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameFr: string;
  nameAr: string;
  order: number;
  enabled: boolean;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  refCode: string;
  fullName: string;
  phone: string;
  email: string;
  guests: number;
  date: string;
  time: string;
  specialRequest?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  titleFr?: string;
  titleAr?: string;
  category: string;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  openingHours: {
    lunch: string;
    dinner: string;
    days: string;
  };
  currency: CurrencyCode;
  currencyRates: Record<CurrencyCode, number>;
  socials: {
    instagram: string;
    facebook: string;
    tripadvisor: string;
  };
  aboutStory: string;
  heroImage: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  specialNote?: string;
}

export interface ManagerUser {
  username: string;
  password?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface AuthStatusResponse {
  hasAccount: boolean;
  username?: string;
}
