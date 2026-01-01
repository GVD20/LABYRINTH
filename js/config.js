const Utils = {
    sleep: (ms) => new Promise(r => setTimeout(r, ms))
};

const App = {
    mode: 'single', // 'single' or 'multi'

    async init() {
        try {
            const res = await fetch('/api/config');
            const config = await res.json();
            if (config.url && config.anonKey) {
                supabaseClient = window.supabase.createClient(config.url, config.anonKey);
                //console.log("Supabase initialized via Vercel env vars");
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
