import { corsHeaders, handleOptions } from '../_shared/cors.ts'
import { verifyAuthToken } from '../_shared/jwt.ts'
import { readAuthCookie } from '../_shared/cookie.ts'
import { ADOBE_CATEGORIES, SHUTTERSTOCK_CATEGORIES } from '../_shared/categories.ts'

const GEMINI_MODEL = 'gemini-3.8-flash'

function categoryNamesFor(platform: string): string[] {
  return platform === 'adobe' ? ADOBE_CATEGORIES.map((c) => c.name) : SHUTTERSTOCK_CATEGORIES
}

function buildPrompt(platform: string): string {
  // User-supplied style/SEO instruction, applied to title + keyword generation.
  const customInstruction = Deno.env.get('PRMOPT_IMAGE_GENERATION') ?? ''
  const categories = categoryNamesFor(platform)
  const keywordRange = platform === 'adobe' ? '5 to 49' : '7 to 50'
  const titleRule =
    platform === 'adobe'
      ? 'Write a "title" of at most 200 characters. It doubles as the description.'
      : 'Write a short "title" and a concise, accurate "description".'

  return [
    `You are writing stock photo metadata for ${platform === 'adobe' ? 'Adobe Stock' : 'Shutterstock'}.`,
    'Describe only what is visible in the image. No brand names, trademarks, or artist names.',
    titleRule,
    `Write ${keywordRange} relevant keywords as a "keywords" array, ordered from most to least important, no duplicates.`,
    customInstruction,
    `Pick exactly one "category", copying the name exactly from this list: ${JSON.stringify(categories)}.`,
    'Respond with ONLY a JSON object of this shape: {"title": string, "description": string, "keywords": string[], "category": string}',
  ]
    .filter(Boolean)
    .join('\n')
}

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

async function callGemini(apiKey: string, prompt: string, mimeType: string, base64Data: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: base64Data } }],
          },
        ],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    },
  )

  if (!res.ok) {
    throw new Error(`Gemini request failed: ${res.status} ${await res.text().catch(() => '')}`)
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (typeof text !== 'string') throw new Error('Gemini returned no content')
  return JSON.parse(text)
}

function validCategory(platform: string, category: unknown): string | null {
  if (typeof category !== 'string') return null
  return categoryNamesFor(platform).includes(category) ? category : null
}

Deno.serve(async (req) => {
  const preflight = handleOptions(req)
  if (preflight) return preflight
  const headers = { ...corsHeaders(req), 'Content-Type': 'application/json' }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  }

  // Auth gate: verify the JWT cookie before any call against the AI
  // provider is made. See claude/spec/dashboard-logic.md.
  const token = readAuthCookie(req)
  if (!token) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers })
  }
  try {
    await verifyAuthToken(token)
  } catch {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers })
  }

  const apiKey = Deno.env.get('GEMINI_API_KEY')
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set')
    return new Response(JSON.stringify({ error: 'AI provider not configured' }), { status: 500, headers })
  }

  const form = await req.formData().catch(() => null)
  const file = form?.get('image')
  const platform = form?.get('platform') === 'shutterstock' ? 'shutterstock' : 'adobe'

  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: 'No image provided' }), { status: 400, headers })
  }

  const base64Data = toBase64(new Uint8Array(await file.arrayBuffer()))
  const prompt = buildPrompt(platform)

  let result
  try {
    result = await callGemini(apiKey, prompt, file.type, base64Data)
    // One retry if the category came back outside the allowed list.
    if (!validCategory(platform, result.category)) {
      result = await callGemini(apiKey, prompt, file.type, base64Data)
    }
  } catch (err) {
    console.error(err)
    if (err instanceof Error && /Gemini request failed: 429/.test(err.message)) {
      return new Response(JSON.stringify({ error: 'Daily limit reached' }), { status: 429, headers })
    }
    return new Response(JSON.stringify({ error: 'AI generation failed' }), { status: 502, headers })
  }

  const categories = categoryNamesFor(platform)
  const category = validCategory(platform, result.category) ?? categories[0]
  const categoryNumber = platform === 'adobe' ? ADOBE_CATEGORIES.find((c) => c.name === category)?.number ?? 1 : null
  const keywordMax = platform === 'adobe' ? 49 : 50
  const keywords = Array.isArray(result.keywords) ? result.keywords.filter((k: unknown) => typeof k === 'string') : []

  return new Response(
    JSON.stringify({
      title: typeof result.title === 'string' ? result.title.slice(0, 200) : '',
      description: typeof result.description === 'string' ? result.description : '',
      keywords: keywords.slice(0, keywordMax),
      category,
      categoryNumber,
    }),
    { status: 200, headers },
  )
})
