{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import React, \{ useState, useEffect \} from 'react';\
import \{ Language, MenuItem \} from '../types';\
import \{ TRANSLATIONS \} from '../constants';\
\
interface Review \{\
  id: string;\
  author: string;\
  rating: number;\
  comment: string;\
  date: string;\
\}\
\
const MOCK_REVIEWS: Review[] = [\
  \{ id: '1', author: 'Luc\'eda M.', rating: 5, comment: 'Los bu\'f1uelos de zucchini son de otro planeta.', date: '2024-03-10' \},\
  \{ id: '2', author: 'James W.', rating: 4, comment: 'Great coffee and cozy atmosphere.', date: '2024-03-08' \},\
];\
\
const ReviewsModal: React.FC<\{ lang: Language, onClose: () => void, menuItems: MenuItem[] \}> = (\{ lang, onClose, menuItems \}) => \{\
  const t = TRANSLATIONS[lang];\
  const [reviews, setReviews] = useState<Review[]>([]);\
  const [newReview, setNewReview] = useState(\{ author: '', rating: 5, comment: '' \});\
  const [showForm, setShowForm] = useState(false);\
\
  useEffect(() => \{\
    const saved = localStorage.getItem('coco_cafe_reviews');\
    if (saved) \{\
      setReviews(JSON.parse(saved));\
    \} else \{\
      setReviews(MOCK_REVIEWS);\
    \}\
  \}, []);\
\
  const handleSubmit = (e: React.FormEvent) => \{\
    e.preventDefault();\
    if (!newReview.author || !newReview.comment) return;\
\
    const reviewToAdd: Review = \{\
      id: Date.now().toString(),\
      author: newReview.author,\
      rating: newReview.rating,\
      comment: newReview.comment,\
      date: new Date().toISOString().split('T')[0],\
    \};\
\
    const updatedReviews = [reviewToAdd, ...reviews];\
    setReviews(updatedReviews);\
    localStorage.setItem('coco_cafe_reviews', JSON.stringify(updatedReviews));\
    setNewReview(\{ author: '', rating: 5, comment: '' \});\
    setShowForm(false);\
  \};\
\
  return (\
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">\
      <div className="bg-[#fdf9ef] w-full max-w-2xl max-h-[90vh] rounded-none shadow-2xl flex flex-col overflow-hidden border-t-8 border-[#dbe4c9]">\
        \
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">\
          <h2 className="text-2xl font-voltaire font-bold text-gray-800 uppercase tracking-tighter">\{t.reviews\}</h2>\
          <button onClick=\{onClose\} className="text-4xl text-gray-300 hover:text-red-500 transition-colors leading-none">&times;</button>\
        </div>\
\
        <div className="flex-grow overflow-y-auto">\
          \{/* Add Review Toggle */\}\
          <div className="p-6 bg-white border-b border-gray-100">\
            \{!showForm ? (\
              <button \
                onClick=\{() => setShowForm(true)\}\
                className="w-full py-4 bg-[#dbe4c9] text-gray-800 font-voltaire font-bold uppercase tracking-widest shadow-md active:scale-95 transition-all text-sm"\
              >\
                + \{lang === 'es' ? 'DEJANOS TU RESE\'d1A' : 'LEAVE A REVIEW'\}\
              </button>\
            ) : (\
              <form onSubmit=\{handleSubmit\} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">\
                <div className="flex justify-between items-center mb-2">\
                  <h3 className="font-voltaire font-bold text-lg uppercase text-gray-700">Nueva Rese\'f1a</h3>\
                  <button type="button" onClick=\{() => setShowForm(false)\} className="text-gray-400 text-xs underline">Cancelar</button>\
                </div>\
                \
                <div className="flex gap-2 mb-4">\
                  \{[1, 2, 3, 4, 5].map((star) => (\
                    <button\
                      key=\{star\}\
                      type="button"\
                      onClick=\{() => setNewReview(\{ ...newReview, rating: star \})\}\
                      className=\{`text-2xl transition-transform active:scale-125 $\{newReview.rating >= star ? 'text-yellow-400' : 'text-gray-200'\}`\}\
                    >\
                      \uc0\u9733 \
                    </button>\
                  ))\}\
                </div>\
\
                <input\
                  type="text"\
                  placeholder=\{lang === 'es' ? 'Tu nombre' : 'Your name'\}\
                  value=\{newReview.author\}\
                  onChange=\{(e) => setNewReview(\{ ...newReview, author: e.target.value \})\}\
                  className="w-full p-3 border border-gray-200 rounded-none font-montserrat outline-none focus:border-[#dbe4c9] transition-colors bg-white text-gray-800 text-sm"\
                  required\
                />\
                \
                <textarea\
                  placeholder=\{lang === 'es' ? 'Escribe tu experiencia...' : 'Write your experience...'\}\
                  value=\{newReview.comment\}\
                  onChange=\{(e) => setNewReview(\{ ...newReview, comment: e.target.value \})\}\
                  className="w-full p-3 border border-gray-200 rounded-none font-montserrat outline-none focus:border-[#dbe4c9] transition-colors h-32 resize-none bg-white text-gray-800 text-sm"\
                  required\
                />\
\
                <button \
                  type="submit"\
                  className="w-full py-4 bg-[#dbe4c9] text-gray-800 font-voltaire font-bold uppercase tracking-widest shadow-xl active:scale-95 transition-all text-sm"\
                >\
                  \{lang === 'es' ? 'ENVIAR RESE\'d1A' : 'SUBMIT REVIEW'\}\
                </button>\
              </form>\
            )\}\
          </div>\
\
          <div className="p-6 space-y-4 bg-[#fdf9ef]">\
            \{reviews.map(r => (\
              <div key=\{r.id\} className="p-6 bg-white border border-gray-100 rounded-none shadow-sm relative overflow-hidden group">\
                <div className="flex justify-between items-start mb-2">\
                  <span className="font-voltaire font-bold text-lg text-gray-800 uppercase tracking-tight">\{r.author\}</span>\
                  <span className="text-[10px] font-montserrat text-gray-400">\{r.date\}</span>\
                </div>\
                <div className="flex gap-0.5 mb-3">\
                  \{[...Array(5)].map((_, i) => (\
                    <span key=\{i\} className=\{`text-xs $\{i < r.rating ? 'text-yellow-400' : 'text-gray-200'\}`\}>\uc0\u9733 </span>\
                  ))\}\
                </div>\
                <p className="text-gray-600 font-montserrat leading-relaxed italic text-xs">"\{r.comment\}"</p>\
                <div className="absolute top-0 right-0 w-1 h-full bg-[#dbe4c9] opacity-0 group-hover:opacity-100 transition-opacity" />\
              </div>\
            ))\}\
          </div>\
        </div>\
      </div>\
    </div>\
  );\
\};\
\
export default ReviewsModal;}