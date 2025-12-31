export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, systemPrompt, config, stream = false } = req.body;

    if (!config || !config.base || !config.key || !config.model) {
        return res.status(400).json({ error: 'Missing configuration' });
    }

    try {
        const response = await fetch(`${config.base}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.key}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                stream: stream,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        if (stream) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                res.write(value);
            }
            res.end();
        } else {
            const data = await response.json();
            res.status(200).json(data);
        }
    } catch (error) {
        console.error('LLM Proxy Error:', error);
        res.status(500).json({ error: error.message });
    }
}
