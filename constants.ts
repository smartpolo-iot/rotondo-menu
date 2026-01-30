{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 \
import \{ TranslationStrings, Language \} from './types';\
\
export const GOOGLE_SHEET_URLS: Record<Language, string> = \{\
  es: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSkltO3QCOt-X1FS-imHKMxN3IIsQW5715nFqng0FbW1MDH7ClpPo8f-yHXO_Y-a02YLsHiP2f6JTpq/pub?gid=0&single=true&output=csv",\
  en: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSkltO3QCOt-X1FS-imHKMxN3IIsQW5715nFqng0FbW1MDH7ClpPo8f-yHXO_Y-a02YLsHiP2f6JTpq/pub?gid=0&single=true&output=csv"\
\};\
\
export const THEME = \{\
  primary: "#394869",\
  accent: "#B0946D",\
  lines: "#394869",\
  background: "#ffffff",\
  surface: "#ffffff",\
  textLight: "#ffffff",\
  textDark: "#1a1a1a",\
\};\
\
export const TRANSLATIONS: Record<Language, TranslationStrings> = \{\
  en: \{\
    landingTitle: "Welcome to Rotondo Caf\'e9",\
    selectLanguage: "Choose your language",\
    categories: "Our Menu",\
    backToMenu: "Back to Menu",\
    ingredients: "Ingredients",\
    sides: "Sides",\
    available: "Available",\
    unavailable: "Out of Stock",\
    currency: "$",\
    specials: "Promotions",\
    // Added English translations\
    orderSummary: "Order Summary",\
    emptyCart: "Your cart is empty",\
    total: "Total",\
    checkout: "Checkout",\
    continueOrdering: "Continue Ordering",\
    reviews: "Reviews",\
  \},\
  es: \{\
    landingTitle: "Bienvenidos a Rotondo Caf\'e9",\
    selectLanguage: "Elija su idioma",\
    categories: "Nuestro Men\'fa",\
    backToMenu: "Volver al Men\'fa",\
    ingredients: "Ingredientes",\
    sides: "Guarnici\'f3n",\
    available: "Disponible",\
    unavailable: "No disponible",\
    currency: "$",\
    specials: "Promociones",\
    // Added Spanish translations\
    orderSummary: "Resumen del Pedido",\
    emptyCart: "Tu carrito est\'e1 vac\'edo",\
    total: "Total",\
    checkout: "Finalizar Pedido",\
    continueOrdering: "Seguir Comprando",\
    reviews: "Rese\'f1as",\
  \},\
\};\
}