
export type Language = 'en' | 'es';

export interface MenuItemVariant {
  unit: string;
  price: number;
  comment?: string;
}

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  ingredients?: string;
  comments?: string;
  unit: string;
  price: number;
  available: boolean;
  imageUrl?: string;
  isSpecial?: boolean;
  variants?: MenuItemVariant[];
}

/**
 * Fix for error: Module '"../types"' has no exported member 'CartItem'.
 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  ingredients?: string;
}

/**
 * Added missing translation keys to resolve property existence errors.
 */
export interface TranslationStrings {
  landingTitle: string;
  selectLanguage: string;
  categories: string;
  backToMenu: string;
  ingredients: string;
  sides: string;
  available: string;
  unavailable: string;
  currency: string;
  specials: string;
  // Added properties for Cart and Reviews
  orderSummary: string;
  emptyCart: string;
  total: string;
  checkout: string;
  continueOrdering: string;
  reviews: string;
}
