const Utils = {
    sleep: (ms) => new Promise(r => setTimeout(r, ms))
};

const App = {
    mode: 'single', // 'single' or 'multi'

    async init() {
        const CACHE_KEY = 'supabase_config';
        const TTL = 24 * 60 * 60 * 1000; // 24h

        try {
            // 尝试从缓存读取
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < TTL) {
                    if (data.url && data.anonKey) {
                        supabaseClient = window.supabase.createClient(data.url, data.anonKey);
                        return;
                    }
                }
            }

            let res = await fetch('/api/config').catch(() => ({ ok: false }));
            if (!res.ok) {
                res = await fetch('https://LABYRINTH.tokisaki.top/api/config');
            }
            const config = await res.json();
            if (config.url && config.anonKey) {
                supabaseClient = window.supabase.createClient(config.url, config.anonKey);
                // 写入缓存
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: config,
                    timestamp: Date.now()
                }));
            }
        } catch (e) {
            console.warn("Supabase config fetch failed, multiplayer may not work:", e);
        }
    },

    showSinglePlayer() {
        this.mode = 'single';
        document.getElementById('btnSingle').classList.add('primary');
        document.getElementById('btnMulti').classList.remove('primary');
        document.getElementById('singlePlayerMenu').style.display = 'flex';
        document.getElementById('multiplayerLobby').style.display = 'none';
    },

    switchPage(to) {
        UI.switchPage(to);
    }
};
