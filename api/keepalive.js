import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    const supabaseUrl = process.env.DATABASE_URL || process.env.database_url;
    const supabaseKey = process.env.DATABASE_ANON_KEY || process.env.database_anon_key;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Missing Supabase configuration' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data, error } = await supabase.from('rooms').select('id').limit(1);

        if (error) throw error;

        res.status(200).json({ 
            success: true, 
            message: 'Database pinged successfully', 
            timestamp: new Date().toISOString() 
        });
    } catch (error) {
        console.error('Keepalive Error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
