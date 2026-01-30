{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 \
export type Language = 'en' | 'es';\
\
export interface MenuItemVariant \{\
  unit: string;\
  price: number;\
  comment?: string;\
\}\
\
export interface MenuItem \{\
  id: string;\
  category: string;\
  name: string;\
  ingredients?: string;\
  comments?: string;\
  unit: string;\
  price: number;\
  available: boolean;\
  imageUrl?: string;\
  isSpecial?: boolean;\
  variants?: MenuItemVariant[];\
\}\
\
// Added CartItem interface for the shopping cart\
export interface CartItem \{\
  id: string;\
  name: string;\
  price: number;\
  quantity: number;\
  ingredients?: string;\
\}\
\
export interface TranslationStrings \{\
  landingTitle: string;\
  selectLanguage: string;\
  categories: string;\
  backToMenu: string;\
  ingredients: string;\
  sides: string;\
  available: string;\
  unavailable: string;\
  currency: string;\
  specials: string;\
  // Added missing translation strings\
  orderSummary: string;\
  emptyCart: string;\
  total: string;\
  checkout: string;\
  continueOrdering: string;\
  reviews: string;\
\}\
}