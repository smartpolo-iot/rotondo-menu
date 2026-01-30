
import { TranslationStrings, Language } from './types';

export const GOOGLE_SHEET_URLS: Record<Language, string> = {
  es: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSkltO3QCOt-X1FS-imHKMxN3IIsQW5715nFqng0FbW1MDH7ClpPo8f-yHXO_Y-a02YLsHiP2f6JTpq/pub?gid=0&single=true&output=csv",
  en: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSkltO3QCOt-X1FS-imHKMxN3IIsQW5715nFqng0FbW1MDH7ClpPo8f-yHXO_Y-a02YLsHiP2f6JTpq/pub?gid=0&single=true&output=csv"
};

export const THEME = {
  primary: "#394869",
  accent: "#B0946D",
  lines: "#394869",
  background: "#ffffff",
  surface: "#ffffff",
  textLight: "#ffffff",
  textDark: "#1a1a1a",
};

/**
 * Updated TRANSLATIONS to include required keys for CartDrawer and ReviewsModal.
 */
export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    landingTitle: "Welcome to Rotondo Café",
    selectLanguage: "Choose your language",
    categories: "Our Menu",
    backToMenu: "Back to Menu",
    ingredients: "Ingredients",
    sides: "Sides",
    available: "Available",
    unavailable: "Out of Stock",
    currency: "$",
    specials: "Promotions",
    // Added keys
    orderSummary: "Order Summary",
    emptyCart: "Your cart is empty",
    total: "Total",
    checkout: "Checkout",
    continueOrdering: "Continue Ordering",
    reviews: "Reviews",
  },
  es: {
    landingTitle: "Bienvenidos a Rotondo Café",
    selectLanguage: "Elija su idioma",
    categories: "Nuestro Menú",
    backToMenu: "Volver al Menú",
    ingredients: "Ingredientes",
    sides: "Guarnición",
    available: "Disponible",
    unavailable: "No disponible",
    currency: "$",
    specials: "Promociones",
    // Added keys
    orderSummary: "Resumen del Pedido",
    emptyCart: "Tu carrito está vacío",
    total: "Total",
    checkout: "Finalizar Pedido",
    continueOrdering: "Seguir Pidiendo",
    reviews: "Reseñas",
  },
};
