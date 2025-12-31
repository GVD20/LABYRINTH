export default async function handler(req, res) {
  // 简单保活：向 Supabase 发起 GET 请求到根或 info 接口
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL) {
    return res.status(400).json({ ok: false, error: 'Missing SUPABASE_URL' });
  }

  try {
    const target = `${SUPABASE_URL.replace(/\/+$/, '')}/rest/v1?select=`; // 简单请求到 REST 根不改变数据
    const r = await fetch(target, {
      method: 'GET',
      headers: {
        'Authorization': SUPABASE_ANON_KEY ? `Bearer ${SUPABASE_ANON_KEY}` : '',
        'Accept': 'application/json'
      },
      // 设短超时
      signal: (new AbortController()).signal
    });

    // 仅返回状态，避免泄露响应体
    return res.status(200).json({ ok: true, status: r.status });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
