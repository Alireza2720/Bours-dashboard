// api/tsetmc.js — Vercel Serverless Function
// دریافت داده قیمتی از BrsApi و ارسال به مرورگر

const API_KEY = process.env.BRSAPI_KEY || 'BbIG8Hx9jkUhG4vzVcqAKSsXZZDSw8Wb';

export default async function handler(req, res) {
  // CORS — اجازه دسترسی از هر مرورگری
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const url = `https://brsapi.ir/FreeTsetmcBourseApi/TsetmcApi.php?key=${API_KEY}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 BourseProxy/1.0',
      },
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) throw new Error(`BrsApi HTTP ${response.status}`);
    const data = await response.json();
    return res.status(200).json({ ok: true, data, ts: Date.now() });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
