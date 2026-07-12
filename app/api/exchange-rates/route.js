/**
 * Next.js Route Handler — /api/exchange-rates
 *
 * Acts as a server-side proxy for the Frankfurter API so the browser
 * never calls it directly (avoids CORS restrictions from Frankfurter).
 *
 * GET /api/exchange-rates
 * Returns: { IDR: 1, USD: 0.000062, EUR: 0.000057, ... }
 */

const FALLBACK_RATES = {
  IDR: 1,
  USD: 0.000062,
  EUR: 0.000057,
  SGD: 0.000084,
  MYR: 0.000292,
  JPY: 0.0095,
  GBP: 0.000049,
  AUD: 0.000097,
}

export async function GET() {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?base=IDR', {
      // Cache on Vercel's edge for 1 hour — avoids rate-limit hammering
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      throw new Error(`Frankfurter responded with ${res.status}`)
    }

    const data = await res.json()
    const rates = { IDR: 1, ...data.rates }

    return Response.json(rates, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    })
  } catch (err) {
    console.warn('[Finvera] Exchange rate fetch failed, using fallback:', err.message)
    return Response.json(FALLBACK_RATES, { status: 200 })
  }
}
