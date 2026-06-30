// api/codal.js — Vercel Serverless Function
// دریافت گزارش‌های کدال (ن۳۰ و ن۱۰) از BrsApi

const API_KEY = process.env.BRSAPI_KEY || 'BbIG8Hx9jkUhG4vzVcqAKSsXZZDSw8Wb';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { symbol, category = '3' } = req.query;
  if (!symbol) return res.status(400).json({ ok: false, error: 'symbol required' });

  try {
    const params = new URLSearchParams({
      key: API_KEY,
      l18: symbol,
      category,
      page: '1',
    });
    const url = `https://brsapi.ir/Api/Codal/Announcement.php?${params}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 BourseProxy/1.0',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) throw new Error(`BrsApi HTTP ${response.status}`);
    const data = await response.json();
    return res.status(200).json({ ok: true, symbol, category, data, ts: Date.now() });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
