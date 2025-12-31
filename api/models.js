export default async function handler(req, res) {
    const { base, key } = req.query;

    if (!base) {
        return res.status(400).json({ error: 'Missing base URL' });
    }

    try {
        const response = await fetch(`${base}/models`, {
            headers: {
                'Authorization': `Bearer ${key}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
