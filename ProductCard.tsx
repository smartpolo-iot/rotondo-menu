import React, { useState, useEffect } from 'react';
import { MenuItem, Language } from '../types.ts';
import { formatPrice } from '../services/sheetService.ts';
import { TRANSLATIONS } from '../constants.ts';
import { generateAIImage } from '../services/geminiService.ts';

interface Props {
  item: MenuItem;
  lang: Language;
  showImage?: boolean;
  hidePrices?: boolean;
};

const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  'PARA EMPEZAR': 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800',
  'ENSALADAS': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
  'PLATOS CALIENTES': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
  'CAFETERIA': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800',
  'TORTAS': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
  'BEBIDAS CON ALCOHOL': 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800',
  'BEBIDAS SIN ALCOHOL': 'https://images.unsplash.com/photo-1544145945-f904253d0c71?auto=format&fit=crop&q=80&w=800',
  'SANDWICHES': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800',
};

const ProductCard: React.FC<Props> = ({ item, lang, showImage = false, hidePrices = false }) => {
  const t = TRANSLATIONS[lang];
  const defaultMockup = CATEGORY_PLACEHOLDERS[item.category.toUpperCase()] || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800';

  const [imgUrl, setImgUrl] = useState<string>(item.imageUrl || defaultMockup);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setImgUrl(item.imageUrl || defaultMockup);
  }, [item.imageUrl, defaultMockup]);

  useEffect(() => {
    if (showImage && item.isSpecial && !item.imageUrl) {
      const timer = setTimeout(handleGenerateImage, 1000);
      return () => clearTimeout(timer);
    }
  }, [item.id, item.isSpecial, item.imageUrl, showImage]);

  const handleGenerateImage = async () => {
    if (isGenerating || item.imageUrl) return;
    setIsGenerating(true);
    const aiImg = await generateAIImage(item.name, item.ingredients);
    if (aiImg) setImgUrl(aiImg);
    setIsGenerating(false);
  };

  const isAvailable = item.available;

  return (
    <div className={`bg-transparent border-b border-[#394869]/20 flex flex-col mb-10 transition-all relative group pb-8 ${!isAvailable ? 'opacity-50 grayscale contrast-75' : ''}`}>

      {!isAvailable && (
        <div className="absolute top-0 right-0 z-20 bg-gray-500 text-white font-montserrat font-bold px-3 py-1 uppercase tracking-widest text-[10px] shadow-sm">
          {t.unavailable}
        </div>
      )}

      {showImage && (
        <div className="relative h-64 w-full overflow-hidden bg-gray-50 mb-6">
          {item.isSpecial && isAvailable && (
            <div className="absolute top-4 left-4 z-10 bg-[#394869] text-white font-montserrat font-bold px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] shadow-md">
              {lang === 'es' ? 'PROMO' : 'SPECIAL'}
            </div>
          )}
          <img
            src={imgUrl}
            alt={item.name}
            className={`w-full h-full object-cover transition-all duration-1000 ${isGenerating ? 'blur-md' : ''}`}
          />
        </div>
      )}

      <div className="flex flex-col flex-grow font-montserrat">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 pr-4">
            <h3 className={`text-xl font-semibold uppercase tracking-tight leading-tight mb-2 ${!isAvailable ? 'text-gray-400' : 'text-black'}`}>
              {item.name}
            </h3>
          </div>

          <div className="text-right flex flex-col items-end pt-1">
            {!hidePrices && (
              !item.variants ? (
                <>
                  <span className={`text-xl font-bold leading-none ${!isAvailable ? 'text-gray-400' : 'text-gray-800'}`}>
                    {t.currency}{formatPrice(item.price)}
                  </span>
                  {item.unit && (
                    <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${!isAvailable ? 'text-gray-300' : 'text-gray-400'}`}>Por {item.unit}</span>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  {item.variants.map((v, i) => (
                    <div key={i} className="flex flex-col items-end border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                      <span className={`text-xl font-bold leading-none ${!isAvailable ? 'text-gray-400' : 'text-gray-800'}`}>
                        {t.currency}{formatPrice(v.price)}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-tighter ${!isAvailable ? 'text-gray-300' : 'text-gray-400'}`}>
                        {v.unit || v.comment}
                      </span>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
        {item.ingredients && (
          <p className={`text-sm leading-relaxed font-normal mb-2 whitespace-pre-line ${!isAvailable ? 'text-gray-400' : 'text-gray-600'}`}>
            {item.ingredients}
          </p>
        )}
        {item.comments && !item.variants && (
          <p className={`text-[10px] font-bold uppercase tracking-wider italic ${!isAvailable ? 'text-gray-300' : 'text-[#394869]'}`}>
            {item.comments}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;