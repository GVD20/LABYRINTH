export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    res.status(200).json({
        url: process.env.database_url || process.env.DATABASE_URL,
        anonKey: process.env.database_anon_key || process.env.DATABASE_ANON_KEY
    });
}
