Object.assign(Game, {
    // 更新页面标题
    updatePageTitle(puzzleTitle = null) {
        if (puzzleTitle) {
            document.title = `${puzzleTitle} - Labyrinth`;
        } else {
            document.title = this.defaultTitle;
        }
    },

    TipsCarousel: {
        tips: [
            { icon: 'lucide:message-circle-question', text: '使用 <strong>提问模式</strong> 探索线索,裁判会回答"是/否/无关/是也不是"' },
            { icon: 'lucide:search-check', text: '在 <strong>猜谜模式</strong> 输入完整推理，系统会评分并高亮正确/错误片段' },
            { icon: 'lucide:lightbulb', text: '遇到困难？点击 <strong>获取提示</strong> 按钮，AI 会引导你关注被忽略的要点' },
            { icon: 'lucide:target', text: '猜谜得分 = <strong>(本轮匹配要点数 / 总要点数) × 100 - 错误数 × 10</strong>' },
            { icon: 'lucide:trophy', text: '评级规则：<strong>S ≥ 90分</strong>，<strong>A ≥ 80分</strong>，<strong>B ≥ 60分</strong>，<strong>C < 60分</strong>' },
            { icon: 'lucide:clock', text: '简单模式无限轮次，常规模式 <strong>40 轮</strong>，困难模式仅 <strong>25 轮</strong>' },
            { icon: 'lucide:zap', text: '提示机会：简单模式 <strong>∞</strong>，常规模式 <strong>5 次</strong>，困难模式 <strong>0 次</strong>' },
            { icon: 'lucide:brain', text: '侧向思维是关键：不要被表面现象迷惑，从 <strong>不寻常的细节</strong> 入手' },
            { icon: 'lucide:shield-check', text: '所有进度 <strong>自动保存</strong>，随时可退出并从历史记录继续挑战' },
            { icon: 'lucide:cpu', text: '提示总是出错？尝试更换 <strong>带有思考模式的 LLM</strong>（如 DeepSeek-R1）' },
            { icon: 'lucide:layers', text: '不同难度下谜题的 <strong>复杂度和诡计深度</strong> 也会有显著区别' },
            { icon: 'lucide:refresh-cw', text: '觉得标签太单调？在主页可点击 <strong>"换一批"</strong> 来刷新标签' },
            { icon: 'lucide:heart', text: '喜欢这个游戏？欢迎分享给朋友们，一起挑战脑力极限！' },
            { icon: 'lucide:star', text: '新手建议从 <strong>简单模式</strong> 入手，逐步提升到困难模式' },
            { icon: 'lucide:info-circle', text: '为避免幻觉和干扰，<strong>提问和猜谜均不具备完整的上下文</strong>，请使用完整的语句提问或回答' }
        ],
        container: null,
        currentIndex: 0,
        interval: null,
        stopped: false,

        init() {
            const container = document.createElement('div');
            container.className = 'game-tips-container';
            container.id = 'gameTips';

            this.tips.forEach((tip, index) => {
                const item = document.createElement('div');
                item.className = 'tip-item';
                item.innerHTML = `
                    <div class="tip-icon">
                        <span class="iconify" data-icon="${tip.icon}" style="color:var(--primary); font-size:1.1rem;"></span>
                    </div>
                    <div class="tip-text">${tip.text}</div>
                `;
                container.appendChild(item);
            });

            const header = document.querySelector('.game-header');
            header.parentNode.insertBefore(container, header.nextSibling);

            this.container = container;
        },

        start() {
            if (!this.container) this.init();

            this.stopped = false;
            this.currentIndex = 0;

            // 显示容器并重置高度
            this.container.style.height = '60px';
            this.container.style.marginTop = '20px';
            this.container.classList.add('active');

            this.container.children[0].classList.add('active');

            this.interval = setInterval(() => this.next(), 4000);
        },

        next() {
            if (this.stopped) return;

            const items = this.container.children;
            const current = items[this.currentIndex];

            current.classList.remove('active');
            current.classList.add('exit');

            this.currentIndex = (this.currentIndex + 1) % this.tips.length;
            const next = items[this.currentIndex];

            setTimeout(() => {
                current.classList.remove('exit');
                next.classList.add('active');
            }, 300);
        },

        freeze() {
            this.stop();
        },

        stop() {
            this.stopped = true;
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }

            if (this.container) {
                this.container.classList.remove('active');
                this.container.style.height = '0';
                this.container.style.marginTop = '0';
                Array.from(this.container.children).forEach(item => {
                    item.classList.remove('active', 'exit');
                });
            }
        }
    },

    createEmojiContainer(emoji, opacity = '1') {
        const titleEl = document.getElementById('gameTitle');
        const titleRow = titleEl.closest('.puzzle-title-row');

        let container = document.getElementById('puzzleEmoji');
        if (!container) {
            container = document.createElement('div');
            container.id = 'puzzleEmoji';
            container.className = 'puzzle-emoji';
            titleEl.parentNode.insertBefore(container, titleEl);
        }

        container.innerText = emoji;
        container.style.opacity = opacity;
        container.style.transform = opacity === '1' ? 'scale(1)' : 'scale(0)';

        if (opacity === '1') {
            titleRow.classList.add('has-emoji');
        } else {
            titleRow.classList.remove('has-emoji');
        }
        return container;
    },

    updateTitleWithEmoji(title, emoji, instant = false) {
        const titleEl = document.getElementById('gameTitle');
        const emojiContainer = this.createEmojiContainer(emoji, instant ? '1' : '0');

        if (instant) {
            titleEl.innerText = title;
        } else {
            titleEl.classList.add('switching');
            setTimeout(() => {
                titleEl.innerText = title;
                titleEl.classList.remove('switching');
            }, 300);
        }
    },

    updateStats() {
        const turnEl = document.getElementById('turnCounter');
        const hintEl = document.getElementById('hintCounter');

        if(this.state.turnsMax === 0) {
            turnEl.innerHTML = `<span class="iconify" data-icon="lucide:hourglass"></span> ∞ 轮`;
        } else {
            const left = this.state.turnsMax - this.state.turnsUsed;
            turnEl.innerHTML = `<span class="iconify" data-icon="lucide:hourglass"></span> ${left} 轮`;
            turnEl.style.color = left<=5 ? 'var(--c-no)' : 'var(--text-muted)';
        }

        const hBtn = document.getElementById('hintBtn');
        if(this.state.hintsMax === 0) {
            hintEl.innerHTML = `<span class="iconify" data-icon="lucide:lightbulb-off"></span> 0 提示`;
            hBtn.style.display = 'none';
        } else if (this.state.hintsMax > 100) {
            hintEl.innerHTML = `<span class="iconify" data-icon="lucide:lightbulb"></span> ∞ 提示`;
            hBtn.style.display = 'block';
            hBtn.innerHTML = `<span class="iconify" data-icon="lucide:lightbulb"></span> 获取提示`;
        } else {
            const hLeft = this.state.hintsMax - this.state.hintsUsed;
            hintEl.innerHTML = `<span class="iconify" data-icon="lucide:lightbulb"></span> ${hLeft} 提示`;
            hBtn.style.display = 'block';
            hBtn.innerHTML = `<span class="iconify" data-icon="lucide:lightbulb"></span> 提示 (${hLeft})`;
            if(hLeft <= 0) hBtn.style.display = 'none';
        }
    },

    updateSettleButton() {
        const btn = document.getElementById('settleBtn');
        if (btn) {
            if (this.state.canSettle) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }
    },

    showSettlePrompt() {
        const currentPoints = this.state.foundPoints.length;
        if (currentPoints <= this.state.lastSettlePromptPoints) return;
        
        this.state.lastSettlePromptPoints = currentPoints;
        this.updateSettleButton();

        const card = document.createElement('div');
        card.className = 'settle-prompt';
        card.id = 'settlePromptCard';
        card.innerHTML = `
            <h3>🎊 表现出色！</h3>
            <p>你已经揭开了大部分真相，是否现在结束游戏进行结算？<br>
            <span style="font-size:0.8rem; color:var(--text-muted)">提前结算将根据当前最高得分 (${this.state.highestScore}%) 折算最终评级</span></p>
            <div class="settle-prompt-btns">
                <button class="btn-primary" onclick="Game.settle(); document.getElementById('settlePromptCard')?.remove();">
                    <span class="iconify" data-icon="lucide:check-circle"></span> 结束并结算
                </button>
                <button class="btn-secondary" onclick="document.getElementById('settlePromptCard')?.remove();">
                    继续挑战
                </button>
            </div>
        `;
        document.getElementById('chatList').appendChild(card);
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
