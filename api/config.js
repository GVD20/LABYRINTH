export default function handler(req, res) {
    res.status(200).json({
        url: process.env.database_url || process.env.DATABASE_URL,
        anonKey: process.env.database_anon_key || process.env.DATABASE_ANON_KEY
    });
}
