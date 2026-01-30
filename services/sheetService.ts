{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ MenuItem, Language \} from '../types';\
import \{ GOOGLE_SHEET_URLS \} from '../constants';\
\
export async function fetchMenuData(lang: Language = 'es'): Promise<MenuItem[]> \{\
  try \{\
    const url = GOOGLE_SHEET_URLS[lang];\
    const response = await fetch(url);\
    if (!response.ok) return [];\
    const csvText = await response.text();\
    const rows = parseCSV(csvText);\
    if (rows.length === 0) return [];\
    \
    return rows.map((row: any, index: number) => \{\
      // Robust header mapping\
      const priceRaw = row['Precios'] || row['Price'] || row['price'] || row['precio'] || '0';\
      const cleanPrice = String(priceRaw).replace(/\\./g, '').replace(',', '.').replace(/[^0-9.]+/g, "");\
      const price = parseFloat(cleanPrice) || 0;\
      \
      const availableRaw = String(row['Disponibilidad'] || row['Availability'] || row['availability'] || row['disponibilidad'] || 'NO').toUpperCase();\
      const available = ['SI', 'YES', 'TRUE', 'VERDADERO', '1'].includes(availableRaw);\
      \
      const isSpecialRaw = String(row['Oferta'] || row['Offer'] || row['Special'] || row['special'] || row['oferta'] || 'NO').toUpperCase();\
      const isSpecial = ['SI', 'YES', 'TRUE', 'VERDADERO', '1'].includes(isSpecialRaw);\
      \
      return \{\
        id: String(row['Code'] || row['code'] || `item-$\{index\}`),\
        category: String(row['Categor\'eda'] || row['Category'] || row['category'] || row['categor\'eda'] || '').trim(),\
        name: String(row['Producto'] || row['Product'] || row['product'] || row['producto'] || 'Sin Nombre').trim(),\
        ingredients: String(row['Ingredientes o variedad'] || row['Ingredients'] || row['ingredients'] || ''),\
        comments: String(row['Comentarios'] || row['Comments'] || row['comments'] || ''),\
        unit: String(row['UNIDAD'] || row['UNIDADES'] || row['Unit'] || row['unit'] || '').trim(),\
        price,\
        available,\
        imageUrl: row['Image'] || row['image'] || '',\
        isSpecial\
      \};\
    \});\
  \} catch (error) \{\
    console.error("Error fetching menu data:", error);\
    return [];\
  \}\
\}\
\
function parseCSV(text: string): any[] \{\
  const lines = text.split(/\\r?\\n/).filter(line => line.trim() !== "");\
  if (lines.length < 2) return [];\
  \
  // Clean headers to remove quotes and invisible characters\
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ''));\
  const result = [];\
  \
  for (let i = 1; i < lines.length; i++) \{\
    const currentLine = parseCSVLine(lines[i]);\
    const obj: any = \{\};\
    headers.forEach((header, index) => \{\
      obj[header] = (currentLine[index] || "").trim().replace(/^"|"$/g, '');\
    \});\
    result.push(obj);\
  \}\
  return result;\
\}\
\
function parseCSVLine(line: string): string[] \{\
  const result = [];\
  let current = "";\
  let inQuotes = false;\
  for (let i = 0; i < line.length; i++) \{\
    const char = line[i];\
    if (char === '"') inQuotes = !inQuotes;\
    else if (char === ',' && !inQuotes) \{\
      result.push(current);\
      current = "";\
    \} else current += char;\
  \}\
  result.push(current);\
  return result;\
\}\
\
export function formatPrice(price: number): string \{\
  return price.toLocaleString('es-AR', \{ minimumFractionDigits: 0, maximumFractionDigits: 0 \});\
\}}