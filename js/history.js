const History = {
    key: 'labyrinth_hist_v8',
    list: [],
    init() {
        const s = localStorage.getItem(this.key);
        if(s) this.list = JSON.parse(s);
        this.render();
    },
    save(item) {
        this.list = this.list.filter(i => i.id !== item.id);
        this.list.unshift(item);
        localStorage.setItem(this.key, JSON.stringify(this.list));
        this.render();
    },
    del(id, e) {
        e.stopPropagation();
        if(confirm("删除此记录？")) {
            this.list = this.list.filter(i => i.id !== id);
            localStorage.setItem(this.key, JSON.stringify(this.list));
            this.render();
        }
    },
    render() {
        const el = document.getElementById('historyList');
        const sec = document.getElementById('historySection');
        el.innerHTML = '';
        if(this.list.length === 0) { sec.style.display = 'none'; return; }
        sec.style.display = 'flex';

        this.list.forEach(item => {
            const d = document.createElement('div');
            d.className = 'history-item';
            const isActive = item.status === 'active';

            let statusText = isActive ? '进行中' : (item.rank === 'F' ? '已投降' : `已通关 ${item.rank}`);
            let statusClass = isActive ? 'tag-active' : (item.rank === 'F' ? 'tag-fail' : 'tag-done');

            const diffMap = { 'easy': '简单', 'normal': '常规', 'hard': '困难' };
            const diffText = diffMap[item.state.diff] || '未知';

            // 获取 Emoji，提供默认值
            const emoji = item.puzzle?.emoji || item.state?.puzzle?.emoji || '🎭';

            d.innerHTML = `
                <div class="history-emoji">${emoji}</div>
                <div style="flex:1">
                    <div style="font-weight:700; color:${isActive?'var(--primary)':'var(--text-main)'}; font-family:var(--font-serif);">${item.title}</div>
                    <div style="font-size:0.75rem; margin-top:4px; color:#64748b; display:flex; gap:6px; align-items:center;">
                        <span class="tag-diff">${diffText}</span>
                        <span class="${statusClass}">${statusText}</span>
                        ${item.date.split(' ')[0]}
                    </div>
                </div>
                <button class="btn" style="padding:4px 8px; color:var(--c-no); border:none; background:transparent;" onclick="History.del(${item.id}, event)">
                    <span class="iconify" data-icon="lucide:trash-2"></span>
                </button>
            `;
            d.onclick = () => Game.loadFromHistory(item);
            el.appendChild(d);
        });
    }
};
