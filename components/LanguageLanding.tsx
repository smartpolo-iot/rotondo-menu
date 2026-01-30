{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import React from 'react';\
import \{ Language, MenuItem \} from '../types';\
\
interface Props \{\
  onSelect: (lang: Language) => void;\
  menuItems: MenuItem[];\
\}\
\
const LanguageLanding: React.FC<Props> = (\{ onSelect \}) => \{\
  return (\
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-[#394869]">\
      <div className="mb-14 flex flex-col items-center z-10">\
        <img \
          src="https://ugc.production.linktr.ee/58bb7b2e-b642-4a14-ba30-c6433f4e149a_linktree.png?io=true&size=avatar-v3_0" \
          alt="Rotondo Caf\'e9 Logo" \
          className="w-56 md:w-64 h-auto object-contain z-10 rounded-full border-4 border-white/20 shadow-2xl"\
        />\
      </div>\
      \
      <div className="text-white font-montserrat font-bold text-3xl uppercase tracking-[0.2em] mb-14 z-10">\
        MEN\'da\
      </div>\
      \
      <div className="w-56 md:w-64 flex flex-col gap-8 z-10">\
        <button \
          onClick=\{() => onSelect('es')\} \
          className="w-full py-6 bg-white text-[#394869] rounded-none shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 group border-none outline-none ring-0"\
        >\
          <span className="text-xl font-montserrat font-bold uppercase tracking-[0.15em]">ESPA\'d1OL</span>\
        </button>\
        <button \
          onClick=\{() => onSelect('en')\} \
          className="w-full py-6 bg-white text-[#394869] rounded-none shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 group border-none outline-none ring-0"\
        >\
          <span className="text-xl font-montserrat font-bold uppercase tracking-[0.15em]">ENGLISH</span>\
        </button>\
      </div>\
\
      <div className="absolute bottom-10 text-white/40 font-montserrat font-bold text-[10px] uppercase tracking-[0.2em] z-10">\
        Rotondo Caf\'e9 &copy; \{new Date().getFullYear()\}\
      </div>\
    </div>\
  );\
\};\
\
export default LanguageLanding;}