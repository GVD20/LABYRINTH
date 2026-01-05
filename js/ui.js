const UI = {
    switchPage(to) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(to).classList.add('active');
    },

    addMsg(role, txt, id=null, isHtml=false) {
        const div = document.createElement('div');
        div.className = `msg msg-${role}`;

        if(role === 'ai' && !isHtml) {
            const lower = txt.toLowerCase();
            if(lower.includes('提示') || lower.includes('hint') || lower.includes('💡')) {
                div.classList.add('ai-hint');
            }
            else if(txt.includes('是') && !txt.includes('不是')) div.classList.add('ai-yes');
            else if(txt.includes('不是')) div.classList.add('ai-no');
            else if(txt.includes('无关')) div.classList.add('ai-irr');
            else if(txt.includes('是') && txt.includes('不是')) div.classList.add('ai-amb');
        }

        if(isHtml) div.innerHTML = txt;
        else div.innerText = txt;
        if(id) div.id = id;
        const list = document.getElementById('chatList');
        list.appendChild(div);
        this.scroll();
    },

    addPlaceholder(text) {
        const id = 'ph-'+Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'placeholder-msg';
        div.innerHTML = `<div class="thinking-dot"></div> ${text}`;
        document.getElementById('chatList').appendChild(div);
        this.scroll();
        return id;
    },

    replacePlaceholder(id, content, role, isHtml=false) {
        const el = document.getElementById(id);
        if(!el) return;

        if (content === null) {
            el.remove();
            return;
        }

        el.className = `msg msg-${role}`;

        if(role === 'ai' && !isHtml) {
            const lower = content.toLowerCase();
            if(lower.includes('提示') || lower.includes('hint') || lower.includes('💡')) {
                el.classList.add('ai-hint');
            }
            else if(content.includes('是') && !content.includes('不是')) el.classList.add('ai-yes');
            else if(content.includes('不是')) el.classList.add('ai-no');
            else if(content.includes('无关')) el.classList.add('ai-irr');
        }

        if(role === 'system-error') {
            // Clear existing content
            el.innerHTML = '';

            // Build error card structure safely without injecting raw HTML
            const card = document.createElement('div');
            card.className = 'error-card';

            const info = document.createElement('div');
            info.className = 'error-info';

            const icon = document.createElement('span');
            icon.className = 'iconify';
            icon.setAttribute('data-icon', 'lucide:alert-circle');

            const textSpan = document.createElement('span');
            textSpan.textContent = content;

            info.appendChild(icon);
            info.appendChild(textSpan);

            const retryBtn = document.createElement('button');
            retryBtn.className = 'retry-btn';
            retryBtn.setAttribute('onclick', 'Game.retry(this)');

            const retryIcon = document.createElement('span');
            retryIcon.className = 'iconify';
            retryIcon.setAttribute('data-icon', 'lucide:refresh-cw');

            const retryText = document.createTextNode(' 重试');

            retryBtn.appendChild(retryIcon);
            retryBtn.appendChild(retryText);

            card.appendChild(info);
            card.appendChild(retryBtn);

            el.appendChild(card);
        } else {
            if(isHtml) el.innerHTML = content;
            else el.innerText = content;
        }
        this.scroll();
    },

    scroll() {
        const list = document.getElementById('chatList');
        list.scrollTo({ top: list.scrollHeight + 150, behavior: 'smooth' });
    },

    setThinkingState(state) {
        const bar = document.getElementById('thinkingBar');
        if(!state) {
            bar.classList.remove('active');
            bar.classList.remove('generating');
            this.PhaseMgr.reset();
            this.SmoothText.reset();
            return;
        }
        bar.classList.add('active');
        if(state === 'thinking') {
            bar.classList.remove('generating');
        }
    },

    updateTitleSmooth(newTitle) {
        const el = document.getElementById('gameTitle');
        el.classList.add('switching');
        setTimeout(() => {
            el.innerText = newTitle;
            el.classList.remove('switching');
        }, 300);
    },

    // 平滑文字滚动模块 (Typewriter effect with buffer)
    SmoothText: {
        buffer: "",
        el: null,
        interval: null,
        init() { this.el = document.getElementById('thinkingText'); },
        push(text) {
            this.buffer += text.replace(/[\r\n]/g, " ");
            if(!this.interval) this.play();
        },
        play() {
            this.interval = requestAnimationFrame(() => {
                if(this.buffer.length > 0) {
                    // 动态速度：积压越多跑越快
                    const speed = Math.max(1, Math.floor(this.buffer.length / 5));
                    const chunk = this.buffer.slice(0, speed);
                    this.buffer = this.buffer.slice(speed);

                    // 限制 DOM 长度防止内存溢出，但利用 Flex-End 实现左移
                    let current = this.el.innerText + chunk;
                    if(current.length > 300) current = current.slice(-300);
                    this.el.innerText = current;

                    this.play();
                } else {
                    this.interval = null;
                }
            });
        },
        reset() {
            this.buffer = "";
            if(this.el) this.el.innerText = "";
            cancelAnimationFrame(this.interval);
            this.interval = null;
        }
    },

    // 阶段标签管理器 (Intelligent Delay & Sync)
    PhaseMgr: {
        queue: [],
        currentIdx: 0,
        lastScheduledIdx: 0,
        lastSwitch: 0,
        timer: null,
        completionCallback: null,

        request(idx) {
            // Only allow moving forward
            if(idx <= this.lastScheduledIdx) return;
            this.lastScheduledIdx = idx;
            this.queue.push(idx);
            this.process();
        },

        waitAndFinish(cb) {
            this.completionCallback = cb;
            // Trigger process in case queue is already empty
            if(this.queue.length === 0 && !this.timer) {
                cb();
                this.completionCallback = null;
            }
            return;
        },

        process() {
            if(this.timer) return; // 正在等待中

            const nextIdx = this.queue[0];
            if(nextIdx === undefined) {
                // Queue empty, check if we need to finish
                if(this.completionCallback) {
                    this.completionCallback();
                    this.completionCallback = null;
                }
                return;
            }

            const now = Date.now();
            const elapsed = now - this.lastSwitch;

            // 智能延迟逻辑：如果当前标签展示已超过1s，立即切换；否则只等待剩余时间
            const delay = elapsed >= 1000 ? 0 : (1000 - elapsed);

            this.timer = setTimeout(() => {
                this.queue.shift();
                this.currentIdx = nextIdx;

                // Update visuals
                document.getElementById('thinkingLabelTrack').style.transform = `translateY(-${nextIdx * 20}px)`;

                // SYNC COLOR: Add 'generating' class only if index > 0
                // This ensures color changes exactly when the label scrolls
                const bar = document.getElementById('thinkingBar');
                if(nextIdx > 0) bar.classList.add('generating');
                else bar.classList.remove('generating');

                this.lastSwitch = Date.now();
                this.timer = null;
                this.process(); // Continue processing queue
            }, delay);
        },

        reset() {
            clearTimeout(this.timer);
            this.timer = null;
            this.queue = [];
            this.currentIdx = 0;
            this.lastScheduledIdx = 0;
            this.lastSwitch = 0;
            this.completionCallback = null;
            document.getElementById('thinkingLabelTrack').style.transform = `translateY(0)`;
            document.getElementById('thinkingBar').classList.remove('generating');
        }
    }
};
