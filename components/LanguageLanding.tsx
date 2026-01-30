import React from 'react';
import { Language, MenuItem } from '../types.ts';

interface Props {
  onSelect: (lang: Language) => void;
  menuItems: MenuItem[];
}

const LanguageLanding: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-[#394869]">
      <div className="mb-14 flex flex-col items-center z-10">
        <img
          src="https://ugc.production.linktr.ee/58bb7b2e-b642-4a14-ba30-c6433f4e149a_linktree.png?io=true&size=avatar-v3_0"
          alt="Rotondo Café Logo"
          className="w-56 md:w-64 h-auto object-contain z-10 rounded-full border-4 border-white/20 shadow-2xl"
        />
      </div>

      <div className="text-white font-montserrat font-bold text-3xl uppercase tracking-[0.2em] mb-14 z-10">
        MENÚ
      </div>

      <div className="w-56 md:w-64 flex flex-col gap-8 z-10">
        <button
          onClick={() => onSelect('es')}
          className="w-full py-6 bg-white text-[#394869] rounded-none shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-none outline-none focus:ring-0"
        >
          <span className="text-xl font-montserrat font-bold uppercase tracking-[0.15em]">ESPAÑOL</span>
        </button>
        <button
          onClick={() => onSelect('en')}
          className="w-full py-6 bg-white text-[#394869] rounded-none shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-none outline-none focus:ring-0"
        >
          <span className="text-xl font-montserrat font-bold uppercase tracking-[0.15em]">ENGLISH</span>
        </button>
      </div>

      <div className="absolute bottom-10 text-white/40 font-montserrat font-bold text-[10px] uppercase tracking-[0.2em] z-10">
        Rotondo Café &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default LanguageLanding;