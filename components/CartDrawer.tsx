import React from 'react';
import { CartItem, Language } from '../types.ts';
import { TRANSLATIONS, THEME } from '../constants.ts';
import { formatPrice } from '../services/sheetService.ts';

interface Props {
  items: CartItem[];
  lang: Language;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClose: () => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<Props> = ({ items, lang, onUpdateQuantity, onClose, onCheckout }) => {
  const t = TRANSLATIONS[lang];
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex justify-end">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-[#fdf9ef] h-full flex flex-col shadow-2xl font-dosis animate-in slide-in-from-right duration-300">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white">
          <h2 className="text-4xl font-voltaire font-bold text-teal-600 uppercase tracking-tighter">{t.orderSummary}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 text-5xl leading-none hover:text-teal-600 transition-colors">&times;</button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 italic">
              <span className="text-8xl mb-6">🛒</span>
              <p className="text-2xl font-voltaire uppercase tracking-widest">{t.emptyCart}</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="bg-white p-6 rounded-none shadow-md border border-gray-100 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <h4 className="font-voltaire font-bold text-2xl text-gray-800 uppercase tracking-tight leading-none mb-1">{item.name}</h4>
                    <p className="text-teal-600 font-voltaire font-bold text-xl">{t.currency}{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-none border border-gray-100">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-10 h-10 rounded-none bg-white text-teal-600 flex items-center justify-center text-2xl font-bold active:scale-90 shadow-sm"
                    >
                      -
                    </button>
                    <span className="text-xl font-voltaire font-bold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-10 h-10 rounded-none bg-white text-teal-600 flex items-center justify-center text-2xl font-bold active:scale-90 shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {item.ingredients && (
                  <p className="text-xs font-montserrat text-gray-400 line-clamp-1 italic">
                    {item.ingredients}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-10 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
          <div className="flex justify-between items-center mb-8">
            <span className="text-2xl font-voltaire font-bold text-gray-400 uppercase tracking-widest">{t.total}</span>
            <span className="text-5xl font-voltaire font-bold text-teal-600 leading-none">{t.currency}{formatPrice(total)}</span>
          </div>

          <div className="flex flex-col gap-5">
            <button
              onClick={onCheckout}
              disabled={items.length === 0}
              className="w-full py-6 bg-[#e2b04c] text-white rounded-none text-2xl font-voltaire font-bold uppercase tracking-[0.2em] shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 hover:bg-[#d1a03b]"
            >
              {t.checkout}
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 text-gray-400 font-montserrat font-bold text-sm uppercase tracking-widest hover:text-teal-600 transition-colors"
            >
              {t.continueOrdering}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;