
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

export interface CartItem extends MenuItem {
  quantity: number;
}

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
  orderSummary: string;
  emptyCart: string;
  total: string;
  checkout: string;
  continueOrdering: string;
  // Fix: Added missing property 'reviews' required by ReviewsModal.tsx
  reviews: string;
}
