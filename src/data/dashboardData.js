export const platforms = {
  adobe: {
    id: 'adobe',
    name: 'Adobe Stock',
    logoText: 'Ad',
    logoBg: 'bg-red-600',
    tagline: "Optimized for Adobe Sensei indexing & search",
    description:
      "Generates precise titles (up to 200 chars), strictly 5–49 weighted keywords ordered by relevancy, and matches one of Adobe's 21 official categories.",
    badges: ['Max: 49 tags', '1 Category Required', 'Standard CSV Schema'],
    formatLabel: 'ADOBE STOCK (CSV v2)',
  },
  shutterstock: {
    id: 'shutterstock',
    name: 'Shutterstock',
    logoText: 'St',
    logoIcon: 'lens',
    logoBg: 'bg-red-700',
    tagline: 'Optimized for Shutterstock catalog & mShot algorithm',
    description:
      'Generates high-intent descriptions, required 7–50 keywords with comma separators, plus primary & optional secondary categories.',
    badges: ['Range: 7-50 tags', '2nd Categories', 'MShot CSV Schema'],
    formatLabel: 'SHUTTERSTOCK (MSHOT CSV)',
  },
}

// Adobe Stock categories, number -> name. See claude/spec/dashboard-logic.md.
export const adobeCategories = [
  { number: 1, name: 'Animals' },
  { number: 2, name: 'Buildings and Architecture' },
  { number: 3, name: 'Business' },
  { number: 4, name: 'Drinks' },
  { number: 5, name: 'The Environment' },
  { number: 6, name: 'States of Mind' },
  { number: 7, name: 'Food' },
  { number: 8, name: 'Graphic Resources' },
  { number: 9, name: 'Hobbies and Leisure' },
  { number: 10, name: 'Industry' },
  { number: 11, name: 'Landscapes' },
  { number: 12, name: 'Lifestyle' },
  { number: 13, name: 'People' },
  { number: 14, name: 'Plants and Flowers' },
  { number: 15, name: 'Culture and Religion' },
  { number: 16, name: 'Science' },
  { number: 17, name: 'Social Issues' },
  { number: 18, name: 'Sports' },
  { number: 19, name: 'Technology' },
  { number: 20, name: 'Transport' },
  { number: 21, name: 'Travel' },
]

// Shutterstock categories, by name. See claude/spec/dashboard-logic.md.
export const shutterstockCategories = [
  'Abstract',
  'Animals/Wildlife',
  'Arts',
  'Backgrounds/Textures',
  'Beauty/Fashion',
  'Buildings/Landmarks',
  'Business/Finance',
  'Celebrities',
  'Education',
  'Food and Drink',
  'Healthcare/Medical',
  'Holidays',
  'Industrial',
  'Interiors',
  'Miscellaneous',
  'Nature',
  'Objects',
  'Parks/Outdoor',
  'People',
  'Religion',
  'Science',
  'Signs/Symbols',
  'Sports/Recreation',
  'Technology',
  'Transportation',
  'Vintage',
]

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

const MOCK_KEYWORD_POOL = [
  'stock photo',
  'commercial use',
  'high resolution',
  'copy space',
  'professional',
  'background',
  'closeup',
  'studio',
  'natural light',
  'editorial',
]

export function densityFor(total, max) {
  const ratio = total / max
  if (ratio >= 0.9) return 'Maximum'
  if (ratio >= 0.6) return 'High'
  if (ratio >= 0.3) return 'Normal'
  return 'Low'
}

// Placeholder metadata used until a real AI provider is wired into the
// `generate` function (see claude/spec/dashboard-logic.md). Lets the
// upload -> generate -> review -> export flow be exercised end to end.
export function buildMockMetadata(filename, platform) {
  let base = filename.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim()
  if (!base || /^\d+$/.test(base)) base = 'Untitled Stock Photo'
  const titleCase = base.replace(/\b\w/g, (c) => c.toUpperCase())

  const words = titleCase.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
  const keywordMax = platform === 'adobe' ? 49 : 50
  const keywords = Array.from(new Set([...words, ...MOCK_KEYWORD_POOL])).slice(0, Math.min(15, keywordMax))

  const description = `${titleCase}, a high-resolution commercial stock image suitable for editorial and marketing use.`

  if (platform === 'adobe') {
    const cat = adobeCategories[Math.floor(Math.random() * adobeCategories.length)]
    return {
      title: `${titleCase} — Professional Stock Photography`,
      description,
      keywords,
      keywordTotal: keywords.length,
      keywordMax,
      density: densityFor(keywords.length, keywordMax),
      category: cat.name,
      categoryNumber: cat.number,
      categoryOptions: adobeCategories.map((c) => c.name),
    }
  }

  const categoryName = shutterstockCategories[Math.floor(Math.random() * shutterstockCategories.length)]
  return {
    title: titleCase,
    description,
    keywords,
    keywordTotal: keywords.length,
    keywordMax,
    density: densityFor(keywords.length, keywordMax),
    category: categoryName,
    categoryNumber: null,
    categoryOptions: shutterstockCategories,
  }
}

export const initialMetadataRows = [
  // {
  //   id: 1,
  //   filename: 'autumn_forest_cabin_fog_01.jpg',
  //   dims: '6000 x 4000',
  //   size: '14.2 MB',
  //   badge: '✓ ISO 100 • 35mm',
  //   img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT3cDMYdbeo74Mhf57Nmt2Vvn2JrYzhtzLNLFCj3pub5V1Ujlhwb0KIivJqLncj4Ud65UwFc_33A6DiQWFh7Cnl1PLLSYzC1qPCy5Gg3i4gkjqWcwIn7UI6S91qsWgzZylOG_iOcDF0hOb63JIaLnO0vbNcX86MfAWi8pghVc6vk53_7raaEhT_MPUOAZkc1r83QNLdmGS0s24lLwC3D04LMWwERCbMkhx7B1ypgvi',
  //   title: 'Cozy Wooden A-Frame Cabin in Misty Autumn Forest with Golden Foliage',
  //   seoNote: 'SEO High Relevance',
  //   keywords: ['autumn', 'cabin', 'forest', 'fog', 'fall foliage', 'woods', 'peaceful'],
  //   moreCount: 28,
  //   keywordTotal: 35,
  //   keywordMax: 49,
  //   density: 'Optimal',
  //   category: 'Landscapes',
  //   categoryOptions: ['Landscapes', 'Buildings and Architecture', 'Travel', 'Nature', 'Lifestyle'],
  //   categoryNumber: 11,
  // },
  // {
  //   id: 2,
  //   filename: 'modern_fintech_office_meeting.jpg',
  //   dims: '5400 x 3600',
  //   size: '18.6 MB',
  //   badge: '✓ Model Release Verified',
  //   img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQCdbHCCN_RUUSp3nv1qAV9xRJgzSUQ4xJSX7oTufjmOiZ8ag-XRm3q_7pm6QOcXhyeISJXHQHPw37y443u4sAhmNme5wSlXVJP3WBY8yjb1ezidnTyCDHJS7UM4yLrJieF2EVvjYrGY8cDcNWmjQw3G2A052fntRoFa9F5Qr5w8erKfWwtx-3zUSS4gDTsGtgj4Xyd7_e5Zy8bT3OL4U7iYBea7SQjiy4J0Q4-B-M',
  //   title: 'Diverse Corporate Executives Analyzing Financial Analytics on Digital Tablet in Modern High-Rise Office',
  //   seoNote: 'High Commercial Value',
  //   keywords: ['fintech', 'business', 'teamwork', 'office', 'analytics', 'diversity'],
  //   moreCount: 36,
  //   keywordTotal: 42,
  //   keywordMax: 49,
  //   density: 'High',
  //   category: 'Business',
  //   categoryOptions: ['Business', 'Technology', 'Industry', 'People'],
  //   categoryNumber: 3,
  // },
  // {
  //   id: 3,
  //   filename: 'minimalist_ceramic_coffee_mug.png',
  //   dims: '4500 x 4500',
  //   size: '9.4 MB',
  //   badge: '✓ Property Release N/A',
  //   img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkCXyx0l52-6awqrMBefIFWNmOFNEFvrqijtWKtMrhVTjy18SlndzQRahlZMGpKCH6CgYQ20PTvCGzXuIdhzgp_CrjsijGLSsKHb44nV1Fzal1PVIwoekFAu4TIEQOPfXqAhFWz5l7Bo8WJtPqZn_QXOfvYGTb6FL7sL4lGOGiXkBkr9QnEv1pVaDUtZRcte_hfBR_5XHNxNeRNUkhDMb6m_4h35MVMRXVZSX3Fw8U',
  //   title: 'Handmade Stoneware Ceramic Coffee Mug with Soft Geometric Shadow on Neutral Background',
  //   seoNote: 'Clean Copy Space',
  //   keywords: ['ceramic', 'coffee mug', 'minimalist', 'stoneware', 'pottery'],
  //   moreCount: 23,
  //   keywordTotal: 28,
  //   keywordMax: 49,
  //   density: 'Normal',
  //   category: 'Still Life',
  //   categoryOptions: ['Still Life', 'Food and Drink', 'Lifestyle', 'Hobbies and Crafts'],
  //   categoryNumber: 17,
  // },
  // {
  //   id: 4,
  //   filename: 'abstract_cyberpunk_neon_sphere.jpg',
  //   dims: '8000 x 5000',
  //   size: '22.1 MB',
  //   badge: '✓ Generative AI Disclosure Tagged',
  //   img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3y-HC-tvI_4RrCESH2tIHb7mgVljyFwVr3g616FYV6-QyeRe66XlpmSDi6OfJVeJ3Coux6kjuxkl74ajEI0wvTBeXw2M7kkB-fcWyck914fberHHNPhb2OC5gXYSH5jD5sDro_PbuuLt2iQToE4VntRq2zqtxiyNSicX5Ux7bZdqlWncjKuEqGT_KVvidjJiivwqFTBFe3y-BR8yu4lSM6Qg9nX4QQ-_4zzz0HVIW',
  //   title: 'Futuristic Glowing Cyberpunk Sphere with Violet and Cyan Light Streaks in Dark Virtual Reality Space',
  //   seoNote: 'High Tech Trending',
  //   keywords: ['cyberpunk', 'futuristic', 'neon sphere', 'technology', '3d render', 'virtual reality'],
  //   moreCount: 43,
  //   keywordTotal: 49,
  //   keywordMax: 49,
  //   density: 'Maximum',
  //   category: 'Technology',
  //   categoryOptions: ['Technology', 'Graphic Resources', 'Science'],
  //   categoryNumber: 19,
  // },
]
