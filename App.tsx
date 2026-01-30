{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;\f1\fnil\fcharset0 AppleColorEmoji;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import React, \{ useState, useEffect, useMemo, useRef \} from 'react';\
import \{ MenuItem, Language \} from './types.ts';\
import \{ fetchMenuData \} from './services/sheetService.ts';\
import LanguageLanding from './components/LanguageLanding.tsx';\
import ProductCard from './components/ProductCard.tsx';\
\
const CATEGORY_ORDER_ES = [\
  'MA\'d1ANAS Y TARDES',\
  'MEDIODIAS Y TARDES',\
  'QUESOS Y UNTABLES',\
  'ADICIONALES',\
  'LAMINADOS',\
  'PANES',\
  'PASTELERIA',\
  'MINI CAKES',\
  'CAFE',\
  'BEBIDAS SIN ALCOHOL',\
  'BEBIDAS CON ALCOHOL'\
];\
\
const CATEGORY_ORDER_EN = [\
  'MORNINGS & AFTERNOONS',\
  'LUNCH & AFTERNOONS',\
  'CHEESES & SPREADS',\
  'EXTRAS',\
  'LAMINATED',\
  'BREADS',\
  'PASTRY',\
  'MINI CAKES',\
  'COFFEE',\
  'NON-ALCOHOLIC BEVERAGES',\
  'ALCOHOLIC BEVERAGES'\
];\
\
const EXCLUDED_CATEGORIES = [\
  'PROMOCIONES',\
  'PROMOTIONS',\
  'MENU DEL DIA',\
  'MENU OF THE DAY',\
  'MENU EJECUTIVO',\
  'EXECUTIVE MENU',\
  'GUARNICION',\
  'GUARNICIONES',\
  'SIDES'\
];\
\
const normalizeStr = (s: string) => \
  s.trim().toUpperCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");\
\
const STICKY_HEADER_HEIGHT = 145; \
\
const App: React.FC = () => \{\
  const [lang, setLang] = useState<Language | null>(null);\
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);\
  const [activeCategory, setActiveCategory] = useState<string>('');\
  const [loading, setLoading] = useState(true);\
\
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>(\{\});\
  const carouselRef = useRef<HTMLDivElement | null>(null);\
  const autoScrollTimer = useRef<number | null>(null);\
  const isAutoScrolling = useRef(false);\
\
  useEffect(() => \{\
    if (lang) \{\
      setLoading(true);\
      fetchMenuData(lang).then(data => \{\
        setAllMenuItems(data);\
        setLoading(false);\
      \});\
    \}\
  \}, [lang]);\
\
  const menuItems = useMemo(() => \{\
    return allMenuItems.filter(item => \{\
      const normCat = normalizeStr(item.category);\
      return !['GUARNICION', 'GUARNICIONES', 'SIDES'].includes(normCat);\
    \});\
  \}, [allMenuItems]);\
\
  const categories = useMemo(() => \{\
    const catsWithItems = (Array.from(new Set(menuItems.filter(i => i.category.trim() !== "").map(item => item.category.trim().toUpperCase()))) as string[])\
      .filter(cat => \{\
        const norm = normalizeStr(cat);\
        return !EXCLUDED_CATEGORIES.some(ex => normalizeStr(ex) === norm);\
      \});\
    \
    const orderList = lang === 'en' ? CATEGORY_ORDER_EN : CATEGORY_ORDER_ES;\
\
    return catsWithItems.sort((a, b) => \{\
      const indexA = orderList.findIndex(co => normalizeStr(a).includes(normalizeStr(co)));\
      const indexB = orderList.findIndex(co => normalizeStr(b).includes(normalizeStr(co)));\
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);\
      if (indexA === -1) return 1;\
      if (indexB === -1) return -1;\
      return indexA - indexB;\
    \});\
  \}, [menuItems, lang]);\
\
  const promotionItems = useMemo(() => \{\
    return menuItems\
      .filter(item => \{\
        const isOferta = item.isSpecial === true;\
        const isPromoCat = normalizeStr(item.category) === 'PROMOCIONES' || normalizeStr(item.category) === 'PROMOTIONS';\
        return isOferta || isPromoCat;\
      \});\
  \}, [menuItems]);\
\
  const itemsByCategory = useMemo(() => \{\
    const map: Record<string, any[]> = \{\};\
    categories.forEach(cat => \{\
      const catItems = menuItems.filter(item => normalizeStr(item.category) === normalizeStr(cat));\
      const normalizedCat = normalizeStr(cat);\
\
      const isGroupedCat = \
        normalizedCat === 'PASTELERIA' || \
        normalizedCat === 'PASTRY' || \
        normalizedCat === 'CAFE' || \
        normalizedCat === 'COFFEE';\
\
      if (isGroupedCat) \{\
        const groupedMap = new Map<string, MenuItem[]>();\
        catItems.forEach(item => \{\
          const subCat = item.name.trim(); \
          if (!groupedMap.has(subCat)) groupedMap.set(subCat, []);\
          groupedMap.get(subCat)!.push(item);\
        \});\
        \
        map[cat] = Array.from(groupedMap.entries()).map(([subCat, items]) => (\{\
          isGroup: true,\
          subcategory: subCat,\
          items: items\
        \}));\
      \} else \{\
        map[cat] = catItems;\
      \}\
    \});\
    return map;\
  \}, [menuItems, categories]);\
\
  useEffect(() => \{\
    if (loading || !lang || (categories.length === 0 && promotionItems.length === 0)) return;\
\
    const observerOptions = \{\
      root: null,\
      rootMargin: `-$\{STICKY_HEADER_HEIGHT\}px 0px -70% 0px`,\
      threshold: 0\
    \};\
\
    const observer = new IntersectionObserver((entries) => \{\
      if (isAutoScrolling.current) return;\
      entries.forEach((entry) => \{\
        if (entry.isIntersecting) setActiveCategory(entry.target.id);\
      \});\
    \}, observerOptions);\
\
    if (sectionRefs.current['PROMOCIONES']) observer.observe(sectionRefs.current['PROMOCIONES']);\
    categories.forEach(cat => \{\
      const el = sectionRefs.current[cat];\
      if (el) observer.observe(el);\
    \});\
\
    return () => observer.disconnect();\
  \}, [loading, lang, categories, promotionItems]);\
\
  useEffect(() => \{\
    if (activeCategory && carouselRef.current && !isAutoScrolling.current) \{\
      const activeBtn = carouselRef.current.querySelector(`[data-cat="$\{activeCategory\}"]`);\
      if (activeBtn) \{\
        activeBtn.scrollIntoView(\{ behavior: 'smooth', inline: 'center', block: 'nearest' \});\
      \}\
    \}\
  \}, [activeCategory]);\
\
  const scrollToCategory = (cat: string) => \{\
    const section = sectionRefs.current[cat];\
    const carouselBtn = carouselRef.current?.querySelector(`[data-cat="$\{cat\}"]`);\
\
    if (section) \{\
      isAutoScrolling.current = true;\
      if (autoScrollTimer.current) window.clearTimeout(autoScrollTimer.current);\
      if (carouselBtn) carouselBtn.scrollIntoView(\{ behavior: 'smooth', inline: 'center', block: 'nearest' \});\
      setActiveCategory(cat);\
      const elementPosition = section.getBoundingClientRect().top;\
      const offsetPosition = elementPosition + window.pageYOffset - STICKY_HEADER_HEIGHT + 2;\
      window.scrollTo(\{ top: offsetPosition, behavior: 'smooth' \});\
      autoScrollTimer.current = window.setTimeout(() => \{ isAutoScrolling.current = false; \}, 1000);\
    \}\
  \};\
\
  if (!lang) return <LanguageLanding onSelect=\{setLang\} menuItems=\{menuItems\} />;\
\
  return (\
    <div className="min-h-screen flex flex-col font-montserrat bg-white">\
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">\
        <header className="px-4 py-4 flex items-center justify-between border-b border-gray-100">\
          <div className="flex items-center gap-4">\
            <button \
              onClick=\{() => \{\
                setLang(null);\
                setAllMenuItems([]);\
              \}\}\
              className="w-10 h-10 flex items-center justify-center text-gray-800 bg-gray-50 hover:bg-gray-100 transition-colors"\
            >\
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">\
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth=\{3\} d="M15 19l-7-7 7-7" />\
              </svg>\
            </button>\
            <div className="flex items-center gap-3">\
               <img \
                src="https://ugc.production.linktr.ee/58bb7b2e-b642-4a14-ba30-c6433f4e149a_linktree.png?io=true&size=avatar-v3_0" \
                alt="Logo" \
                className="w-10 h-10 rounded-full"\
              />\
              <h1 className="text-2xl font-jost font-normal uppercase text-[#394869] tracking-tight">Rotondo Caf\'e9</h1>\
            </div>\
          </div>\
        </header>\
        \
        <div ref=\{carouselRef\} className="flex items-center gap-2 p-3 overflow-x-auto hide-scrollbar scroll-smooth whitespace-nowrap bg-white shadow-inner">\
          \{promotionItems.length > 0 && (\
            <button\
              type="button"\
              data-cat="PROMOCIONES"\
              onClick=\{() => scrollToCategory('PROMOCIONES')\}\
              className=\{`px-6 py-3 text-[11px] font-bold font-montserrat uppercase tracking-[0.15em] cursor-pointer transition-all $\{\
                activeCategory === 'PROMOCIONES' ? 'bg-[#394869] text-white shadow-md scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'\
              \}`\}\
            >\
              \{lang === 'es' ? 'Promociones' : 'Promotions'\}\
            </button>\
          )\}\
          \{categories.map((cat) => (\
            <button\
              key=\{cat\}\
              type="button"\
              data-cat=\{cat\}\
              onClick=\{() => scrollToCategory(cat)\}\
              className=\{`px-6 py-3 text-[11px] font-bold font-montserrat uppercase tracking-[0.15em] cursor-pointer transition-all $\{\
                activeCategory === cat ? 'bg-[#394869] text-white shadow-md scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'\
              \}`\}\
            >\
              \{cat\}\
            </button>\
          ))\}\
        </div>\
      </div>\
\
      <main className="max-w-4xl mx-auto w-full p-6 pb-20 fade-in bg-white">\
        \{loading ? (\
          <div className="py-32 text-center text-gray-400 font-montserrat text-2xl animate-pulse tracking-[0.15em] uppercase">\
            \{lang === 'es' ? 'Cargando Men\'fa...' : 'Loading Menu...'\}\
          </div>\
        ) : (\
          <div className="space-y-16">\
            \{promotionItems.length > 0 && (\
              <div id="PROMOCIONES" ref=\{el => \{ sectionRefs.current['PROMOCIONES'] = el; \}\} className="pt-2 scroll-mt-[160px]">\
                <h2 className="bg-[#394869] text-white font-montserrat font-bold text-lg uppercase tracking-[0.15em] px-6 py-2.5 mb-10 inline-block shadow-sm">\
                  \{lang === 'es' ? 'PROMOCIONES' : 'PROMOTIONS'\}\
                </h2>\
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">\
                  \{promotionItems.map(item => (\
                    <ProductCard \
                      key=\{item.id\} \
                      item=\{item\} \
                      lang=\{lang\} \
                      showImage=\{!!item.imageUrl\} \
                    />\
                  ))\}\
                </div>\
              </div>\
            )\}\
\
            \{categories.map((cat) => \{\
              const data = itemsByCategory[cat];\
              return (\
                <div key=\{cat\} id=\{cat\} ref=\{el => \{ sectionRefs.current[cat] = el; \}\} className="pt-2 scroll-mt-[160px]">\
                  <h2 className="bg-[#394869] text-white font-montserrat font-bold text-lg uppercase tracking-[0.15em] px-6 py-2.5 mb-12 inline-block shadow-sm">\
                    \{cat\}\
                  </h2>\
                  \
                  \{data && data.length > 0 && data[0].isGroup ? (\
                    <div className="space-y-20 mb-20">\
                      \{data.map((group, gIdx) => (\
                        <div key=\{gIdx\} className="w-full">\
                          <div className="mb-10 flex items-center">\
                            <div className="h-10 w-1 bg-[#394869]"></div>\
                            <h3 className="text-sm font-montserrat font-extrabold text-gray-700 uppercase tracking-[0.2em] px-4 py-2.5 bg-gray-50 flex-grow">\
                              \{group.subcategory\}\
                            </h3>\
                          </div>\
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">\
                            \{group.items.map((subItem: MenuItem) => (\
                              <ProductCard \
                                key=\{subItem.id\} \
                                item=\{\{\
                                  ...subItem,\
                                  name: subItem.ingredients || subItem.name,\
                                  ingredients: subItem.ingredients ? '' : subItem.ingredients\
                                \}\} \
                                lang=\{lang\} \
                                showImage=\{false\} \
                              />\
                            ))\}\
                          </div>\
                        </div>\
                      ))\}\
                    </div>\
                  ) : (\
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">\
                      \{data?.map(item => (\
                        <ProductCard \
                          key=\{item.id\} \
                          item=\{item\} \
                          lang=\{lang\} \
                          showImage=\{false\} \
                        />\
                      ))\}\
                    </div>\
                  )\}\
                </div>\
              );\
            \})\}\
          </div>\
        )\}\
      </main>\
\
      \{!loading && (\
        <footer className="p-10 text-center text-gray-400 font-montserrat uppercase tracking-[0.15em] text-[10px] border-t border-gray-50 bg-white">\
          Rotondo Caf\'e9 &copy; \{new Date().getFullYear()\}\
        </footer>\
      )\}\
    </div>\
  );\
\};\
\
export default App;import React, \{ useState, useEffect, useMemo, useRef \} from 'react';\
import \{ MenuItem, Language \} from './types.ts';\
import \{ fetchMenuData, formatPrice \} from './services/sheetService.ts';\
import \{ TRANSLATIONS \} from './constants.ts';\
import LanguageLanding from './components/LanguageLanding.tsx';\
import ProductCard from './components/ProductCard.tsx';\
\
const CATEGORY_ORDER_ES = [\
  'PARA EMPEZAR',\
  'SANDWICHES Y WRAPS',\
  'ENSALADAS',\
  'PLATOS CALIENTES',\
  'TARTAS',\
  'HUEVOS',\
  'POSTRES',\
  'BEBIDAS SIN ALCOHOL',\
  'BEBIDAS CON ALCOHOL',\
  'BEBIDAS ALCOHOLICAS',\
  'PASTELER\'cdA',\
  'CAFETER\'cdA',\
  'TE EN HEBRAS',\
  'TORTAS'\
];\
\
const CATEGORY_ORDER_EN = [\
  'TO START WITH',\
  'SANDWICHES AND WRAPS',\
  'SALADS',\
  'WARM DISHES',\
  'SAVORY TARTES',\
  'EGGS',\
  'DESSERTS',\
  'NON-ALCOHOLIC BEVERAGES',\
  'ALCOHOLIC BEVERAGES',\
  'PASTRY',\
  'CAFETERIA',\
  'LEAF-TEA INFUSIONS',\
  'CAKES'\
];\
\
const EXCLUDED_CATEGORIES = [\
  'PROMOCIONES',\
  'PROMOTIONS',\
  'MENU DEL DIA',\
  'MENU OF THE DAY',\
  'MENU EJECUTIVO',\
  'EXECUTIVE MENU',\
  'GUARNICION',\
  'GUARNICIONES',\
  'SIDES'\
];\
\
const normalizeStr = (s: string) => \
  s.trim().toUpperCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");\
\
const STICKY_HEADER_HEIGHT = 145; \
\
const App: React.FC = () => \{\
  const [lang, setLang] = useState<Language | null>(null);\
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);\
  const [activeCategory, setActiveCategory] = useState<string>('');\
  const [loading, setLoading] = useState(true);\
\
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>(\{\});\
  const carouselRef = useRef<HTMLDivElement | null>(null);\
  const autoScrollTimer = useRef<number | null>(null);\
  const isAutoScrolling = useRef(false);\
\
  useEffect(() => \{\
    if (lang) \{\
      setLoading(true);\
      fetchMenuData(lang).then(data => \{\
        setAllMenuItems(data);\
        setLoading(false);\
      \});\
    \}\
  \}, [lang]);\
\
  // STRICT GLOBAL FILTER: Filter out excluded categories from the very beginning\
  const menuItems = useMemo(() => \{\
    return allMenuItems.filter(item => \{\
      const normCat = normalizeStr(item.category);\
      // We explicitly check against GUARNICION and SIDES here to be "hardcore"\
      return !['GUARNICION', 'GUARNICIONES', 'SIDES'].includes(normCat);\
    \});\
  \}, [allMenuItems]);\
\
  const categories = useMemo(() => \{\
    const catsWithItems = (Array.from(new Set(menuItems.filter(i => i.category.trim() !== "").map(item => item.category.trim().toUpperCase()))) as string[])\
      .filter(cat => \{\
        const norm = normalizeStr(cat);\
        return !EXCLUDED_CATEGORIES.some(ex => normalizeStr(ex) === norm);\
      \});\
    \
    const orderList = lang === 'en' ? CATEGORY_ORDER_EN : CATEGORY_ORDER_ES;\
\
    return catsWithItems.sort((a, b) => \{\
      const indexA = orderList.findIndex(co => normalizeStr(a).includes(normalizeStr(co)));\
      const indexB = orderList.findIndex(co => normalizeStr(b).includes(normalizeStr(co)));\
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);\
      if (indexA === -1) return 1;\
      if (indexB === -1) return -1;\
      return indexA - indexB;\
    \});\
  \}, [menuItems, lang]);\
\
  const promotionItems = useMemo(() => \{\
    return menuItems\
      .filter(item => \{\
        const isOferta = item.isSpecial === true;\
        const isPromoCat = normalizeStr(item.category) === 'PROMOCIONES' || normalizeStr(item.category) === 'PROMOTIONS';\
        return isOferta || isPromoCat;\
      \});\
  \}, [menuItems]);\
\
  const itemsByCategory = useMemo(() => \{\
    const map: Record<string, MenuItem[]> = \{\};\
    categories.forEach(cat => \{\
      const catItems = menuItems.filter(item => normalizeStr(item.category) === normalizeStr(cat));\
      \
      const normalizedCat = normalizeStr(cat);\
      const isDrinks = normalizedCat.includes('BEVERAGES') || \
                       normalizedCat.includes('BEBIDAS') || \
                       normalizedCat.includes('ALCOHOLIC');\
                       \
      const isTortas = normalizedCat === 'TORTAS' || normalizedCat === 'CAKES';\
\
      if (isDrinks) \{\
        const groupedMap = new Map<string, MenuItem>();\
        catItems.forEach(item => \{\
          if (item.comments && item.comments.trim() !== '') \{\
            if (!groupedMap.has(item.name)) \{\
              groupedMap.set(item.name, \{ ...item, variants: [] \});\
            \}\
            const grouped = groupedMap.get(item.name)!;\
            grouped.variants = grouped.variants || [];\
            grouped.variants.push(\{ unit: item.unit, price: item.price, comment: item.comments \});\
          \} else \{\
            groupedMap.set(item.id, item);\
          \}\
        \});\
        map[cat] = Array.from(groupedMap.values());\
      \} else if (isTortas) \{\
        const groupedMap = new Map<string, MenuItem>();\
        catItems.forEach(item => \{\
          if (!groupedMap.has(item.name)) \{\
            groupedMap.set(item.name, \{ ...item, variants: [] \});\
          \}\
          const grouped = groupedMap.get(item.name)!;\
          grouped.variants = grouped.variants || [];\
          grouped.variants.push(\{ unit: item.unit, price: item.price, comment: item.comments \});\
        \});\
        map[cat] = Array.from(groupedMap.values());\
      \} else \{\
        map[cat] = catItems;\
      \}\
    \});\
    return map;\
  \}, [menuItems, categories]);\
\
  const tortasUnitPrices = useMemo(() => \{\
    const tortas = menuItems.filter(item => \{\
      const n = normalizeStr(item.category);\
      return (n === 'TORTAS' || n === 'CAKES');\
    \});\
    const unitMap = new Map<string, number>();\
    tortas.forEach(t => \{\
      if (t.unit && t.price) \{\
        if (!unitMap.has(t.unit)) unitMap.set(t.unit, t.price);\
      \}\
    \});\
    return Array.from(unitMap.entries()).sort((a,b) => a[1] - b[1]);\
  \}, [menuItems]);\
\
  useEffect(() => \{\
    if (loading || !lang || (categories.length === 0 && promotionItems.length === 0)) return;\
\
    const observerOptions = \{\
      root: null,\
      rootMargin: `-$\{STICKY_HEADER_HEIGHT\}px 0px -70% 0px`,\
      threshold: 0\
    \};\
\
    const observer = new IntersectionObserver((entries) => \{\
      if (isAutoScrolling.current) return;\
      entries.forEach((entry) => \{\
        if (entry.isIntersecting) setActiveCategory(entry.target.id);\
      \});\
    \}, observerOptions);\
\
    if (sectionRefs.current['PROMOCIONES']) observer.observe(sectionRefs.current['PROMOCIONES']);\
    categories.forEach(cat => \{\
      const el = sectionRefs.current[cat];\
      if (el) observer.observe(el);\
    \});\
\
    return () => observer.disconnect();\
  \}, [loading, lang, categories, promotionItems]);\
\
  useEffect(() => \{\
    if (activeCategory && carouselRef.current && !isAutoScrolling.current) \{\
      const activeBtn = carouselRef.current.querySelector(`[data-cat="$\{activeCategory\}"]`);\
      if (activeBtn) \{\
        activeBtn.scrollIntoView(\{ behavior: 'smooth', inline: 'center', block: 'nearest' \});\
      \}\
    \}\
  \}, [activeCategory]);\
\
  const scrollToCategory = (cat: string) => \{\
    const section = sectionRefs.current[cat];\
    const carouselBtn = carouselRef.current?.querySelector(`[data-cat="$\{cat\}"]`);\
\
    if (section) \{\
      isAutoScrolling.current = true;\
      if (autoScrollTimer.current) window.clearTimeout(autoScrollTimer.current);\
      if (carouselBtn) carouselBtn.scrollIntoView(\{ behavior: 'smooth', inline: 'center', block: 'nearest' \});\
      setActiveCategory(cat);\
      const elementPosition = section.getBoundingClientRect().top;\
      const offsetPosition = elementPosition + window.pageYOffset - STICKY_HEADER_HEIGHT + 2;\
      window.scrollTo(\{ top: offsetPosition, behavior: 'smooth' \});\
      autoScrollTimer.current = window.setTimeout(() => \{ isAutoScrolling.current = false; \}, 1000);\
    \}\
  \};\
\
  if (!lang) return <LanguageLanding onSelect=\{setLang\} menuItems=\{menuItems\} />;\
\
  return (\
    <div className="min-h-screen flex flex-col font-dosis bg-[#f0ecea]">\
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md">\
        <header className="px-4 py-3 flex items-center justify-between border-b border-gray-100">\
          <div className="flex items-center gap-3">\
            <button \
              onClick=\{() => \{\
                setLang(null);\
                setAllMenuItems([]);\
              \}\}\
              className="w-10 h-10 flex items-center justify-center text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors"\
            >\
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">\
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth=\{3\} d="M15 19l-7-7 7-7" />\
              </svg>\
            </button>\
            <h1 className="text-xl font-voltaire font-bold uppercase text-gray-900 tracking-tight">CoCo Caf\'e9</h1>\
          </div>\
        </header>\
        \
        <div ref=\{carouselRef\} className="flex items-center gap-2 p-3 overflow-x-auto hide-scrollbar scroll-smooth whitespace-nowrap bg-white shadow-inner">\
          \{promotionItems.length > 0 && (\
            <button\
              type="button"\
              data-cat="PROMOCIONES"\
              onClick=\{() => scrollToCategory('PROMOCIONES')\}\
              className=\{`px-6 py-2.5 text-sm font-voltaire font-bold uppercase tracking-widest cursor-pointer transition-all $\{\
                activeCategory === 'PROMOCIONES' ? 'bg-[#7D9A88] text-white shadow-md scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'\
              \}`\}\
            >\
              \{lang === 'es' ? 'Promociones' : 'Promotions'\}\
            </button>\
          )\}\
          \{categories.map((cat) => (\
            <button\
              key=\{cat\}\
              type="button"\
              data-cat=\{cat\}\
              onClick=\{() => scrollToCategory(cat)\}\
              className=\{`px-6 py-2.5 text-sm font-voltaire font-bold uppercase tracking-widest cursor-pointer transition-all $\{\
                activeCategory === cat ? 'bg-[#7D9A88] text-white shadow-md scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'\
              \}`\}\
            >\
              \{cat\}\
            </button>\
          ))\}\
        </div>\
      </div>\
\
      <main className="max-w-4xl mx-auto w-full p-4 pb-20 fade-in">\
        \{loading ? (\
          <div className="py-32 text-center text-gray-400 font-voltaire text-2xl animate-pulse tracking-widest">\
            \{lang === 'es' ? 'CARGANDO MEN\'da...' : 'LOADING MENU...'\}\
          </div>\
        ) : (\
          <div className="space-y-4">\
            \{promotionItems.length > 0 && (\
              <div id="PROMOCIONES" ref=\{el => \{ sectionRefs.current['PROMOCIONES'] = el; \}\} className="pt-2 scroll-mt-[160px]">\
                <h2 className="bg-[#7D9A88] text-white font-voltaire font-bold text-xl uppercase tracking-[0.2em] px-5 py-2 mb-8 inline-block shadow-sm">\
                  \{lang === 'es' ? 'PROMOCIONES' : 'PROMOTIONS'\}\
                </h2>\
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">\
                  \{promotionItems.map(item => (\
                    <ProductCard \
                      key=\{item.id\} \
                      item=\{item\} \
                      lang=\{lang\} \
                      showImage=\{!!item.imageUrl\} \
                    />\
                  ))\}\
                </div>\
              </div>\
            )\}\
\
            \{categories.map((cat) => \{\
              const isTortas = normalizeStr(cat) === 'TORTAS' || normalizeStr(cat) === 'CAKES';\
              return (\
                <div key=\{cat\} id=\{cat\} ref=\{el => \{ sectionRefs.current[cat] = el; \}\} className="pt-2 scroll-mt-[160px]">\
                  <h2 className="bg-[#7D9A88] text-white font-voltaire font-bold text-xl uppercase tracking-[0.2em] px-5 py-2 mb-8 inline-block shadow-sm">\
                    \{cat\}\
                  </h2>\
                  \
                  \{isTortas && (\
                    <div className="space-y-6 mb-12">\
                      <div className="bg-[#B0946D] p-4 shadow-md border-l-8 border-gray-800/20 flex items-center gap-4">\
                        <span className="text-2xl">
\f1 \uc0\u9888 \u65039 
\f0 </span>\
                        <p className="text-sm md:text-lg font-montserrat font-black text-white uppercase tracking-widest leading-none">\
                          \{lang === 'es' ? 'Consultar disponibilidad' : 'Check availability'\}\
                        </p>\
                      </div>\
\
                      \{tortasUnitPrices.length > 0 && (\
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">\
                          \{tortasUnitPrices.map(([unit, price], idx) => (\
                            <div key=\{idx\} className="bg-white p-5 shadow-md flex items-center justify-between border-b-4 border-[#5C7A5E] hover:scale-[1.02] transition-transform">\
                              <span className="text-sm font-black text-gray-800 uppercase tracking-widest">\
                                \{unit\}\
                              </span>\
                              <span className="text-2xl font-voltaire font-bold text-[#5C7A5E]">\
                                \{TRANSLATIONS[lang].currency\}\{formatPrice(price)\}\
                              </span>\
                            </div>\
                          ))\}\
                        </div>\
                      )\}\
                    </div>\
                  )\}\
\
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">\
                    \{itemsByCategory[cat]?.map(item => (\
                      <ProductCard \
                        key=\{item.id\} \
                        item=\{item\} \
                        lang=\{lang\} \
                        showImage=\{false\} \
                        hidePrices=\{isTortas\}\
                      />\
                    ))\}\
                  </div>\
                </div>\
              );\
            \})\}\
          </div>\
        )\}\
      </main>\
\
      \{!loading && (\
        <footer className="p-8 text-center text-gray-400 font-voltaire uppercase tracking-widest text-[10px] border-t border-gray-100 bg-white">\
          CoCo Caf\'e9 &copy; \{new Date().getFullYear()\}\
        </footer>\
      )\}\
    </div>\
  );\
\};\
\
export default App;}