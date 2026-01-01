const Api = {
    cfg: { base:"", key:"", storyModel:"", fastModel:"" },
    isVerified: false,
    availableModels: [],
    activeTarget: null,

    init() {
        const s = localStorage.getItem('labyrinth_cfg');
        if(s) {
            this.cfg = JSON.parse(s);
            this.isVerified = this.cfg.isVerified || false;
        }
        this.updateSettingsButton();

        // 监听输入变化，重置验证状态
        const resetVerify = () => { this.isVerified = false; };
        document.getElementById('apiBase')?.addEventListener('input', resetVerify);
        document.getElementById('apiKey')?.addEventListener('input', resetVerify);
        document.getElementById('modelStory')?.addEventListener('input', resetVerify);
        // 裁判模型不影响思考模式验证状态
        // document.getElementById('modelFast')?.addEventListener('input', resetVerify);

        // Auto close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.input-with-btn')) {
                document.querySelectorAll('.model-dropdown').forEach(el => el.classList.remove('active'));
            }
        });
    },
    open(force) {
        document.getElementById('apiModal').classList.add('active');
        document.getElementById('apiBase').value = this.cfg.base || "";
        document.getElementById('apiKey').value = this.cfg.key || "";
        document.getElementById('modelStory').value = this.cfg.storyModel || "";
        document.getElementById('modelFast').value = this.cfg.fastModel || "";
    },
    close() {
        document.getElementById('apiModal').classList.remove('active');
        this.closePicker();
    },
    save() {
        this.cfg.base = document.getElementById('apiBase').value.replace(/\/$/, "");
        this.cfg.key = document.getElementById('apiKey').value;
        this.cfg.storyModel = document.getElementById('modelStory').value;
        this.cfg.fastModel = document.getElementById('modelFast').value;
        if(!this.cfg.base || !this.cfg.storyModel) return alert("请填写完整配置");
        
        this.cfg.isVerified = this.isVerified; // 同步验证状态
        localStorage.setItem('labyrinth_cfg', JSON.stringify(this.cfg));
        this.updateSettingsButton();
        this.close();
    },
    updateSettingsButton() {
        const btn = document.getElementById('apiSettingsBtn');
        if (!btn) return;
        if (!this.cfg.base || !this.cfg.key || !this.cfg.storyModel) {
            btn.style.color = 'var(--c-no)';
            btn.style.borderColor = 'var(--c-no)';
            btn.classList.add('pulse-error');
        } else {
            btn.style.color = '';
            btn.style.borderColor = '';
            btn.classList.remove('pulse-error');
        }
    },
    setBaseUrl(url) {
        document.getElementById('apiBase').value = url;
        this.isVerified = false;
    },

    // Model Fetching & Dropdown Logic
    async fetchModels() {
        const base = document.getElementById('apiBase').value.replace(/\/$/, "");
        const key = document.getElementById('apiKey').value;
        if(!base) return alert("请先填写 Base URL");

        const btn = document.querySelector('.scan-success');
        const iconHtml = btn.innerHTML;
        btn.innerHTML = `<span class="iconify" data-icon="lucide:loader-2"></span> 扫描中...`;

        try {
            const res = await fetch(`${base}/models`, {
                headers: { 'Authorization': `Bearer ${key}` }
            });
            const data = await res.json();
            if(data && data.data) {
                this.availableModels = data.data.map(m => m.id).sort();

                // Show small success message
                const statusEl = document.getElementById('scanStatus');
                statusEl.innerText = `已获取 ${this.availableModels.length} 个模型`;
                statusEl.style.opacity = 1;
                setTimeout(() => statusEl.style.opacity = 0, 3000);
            } else {
                alert("未找到模型列表，请检查配置");
            }
        } catch(e) {
            alert("获取模型列表失败: " + e.message);
        } finally {
            btn.innerHTML = iconHtml;
        }
    },

    handleInput(target, val) {
        if (target === 'story') this.isVerified = false;
        const dd = document.getElementById(target === 'story' ? 'dd-story' : 'dd-fast');
        if (this.availableModels.length === 0) {
            dd.classList.remove('active');
            return;
        }

        const filtered = this.availableModels.filter(m => m.toLowerCase().includes(val.toLowerCase()));
        dd.innerHTML = '';

        if (filtered.length > 0) {
            dd.classList.add('active');
            filtered.forEach(m => {
                const div = document.createElement('div');
                div.className = 'model-option';
                div.innerText = m;
                div.onclick = (e) => {
                    e.stopPropagation();
                    document.getElementById(target === 'story' ? 'modelStory' : 'modelFast').value = m;
                    dd.classList.remove('active');
                };
                dd.appendChild(div);
            });
        } else {
            dd.classList.remove('active');
        }
    },

    // Legacy full picker (kept for list button)
    openPicker(target) {
        if(this.availableModels.length === 0) {
            if(confirm("暂无模型数据，是否立即扫描？")) this.fetchModels().then(() => {
                if(this.availableModels.length > 0) this.openPicker(target);
            });
            return;
        }
        this.activeTarget = target;
        document.getElementById('modelPicker').classList.add('active');
        this.renderPicker(this.availableModels);
    },
    closePicker() {
        document.getElementById('modelPicker').classList.remove('active');
        document.getElementById('modelSearch').value = '';
    },
    renderPicker(list) {
        const el = document.getElementById('modelList');
        el.innerHTML = '';
        list.forEach(m => {
            const d = document.createElement('div');
            d.className = 'model-item';
            d.innerText = m;
            d.onclick = () => {
                document.getElementById(this.activeTarget === 'story' ? 'modelStory' : 'modelFast').value = m;
                if (this.activeTarget === 'story') this.isVerified = false;
                this.closePicker();
            };
            el.appendChild(d);
        });
    },
    filterModels(q) {
        if(!q) return this.renderPicker(this.availableModels);
        const filtered = this.availableModels.filter(m => m.toLowerCase().includes(q.toLowerCase()));
        this.renderPicker(filtered);
    },

    async test(type) {
        const el = document.getElementById(type==='story'?'testStory':'testFast');
        const model = document.getElementById(type==='story'?'modelStory':'modelFast').value;
        const base = document.getElementById('apiBase').value.replace(/\/$/, "");
        const key = document.getElementById('apiKey').value;
        el.innerText = "连接中...";
        el.style.color = "var(--text-muted)";

        const payload = { model: model, messages: [{role:"user", content:"hi"}], max_tokens:1 };

        try {
            const res = await fetch(`${base}/chat/completions`, {
                method:'POST',
                headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${key}` },
                body: JSON.stringify(payload)
            });
            if(res.ok) {
                el.innerHTML = `<span style="color:var(--c-yes)">✅ 连接成功</span>`;
            } else {
                el.innerHTML = `<span style="color:var(--c-no)">❌ 失败 ${res.status}</span>`;
            }
        } catch(e) { el.innerHTML = `<span style="color:var(--c-no)">❌ 网络错误</span>`; }
    },

    // 测试思考模式
    async testThinking(type) {
        const el = document.getElementById(type==='story'?'testStory':'testFast');
        const model = document.getElementById(type==='story'?'modelStory':'modelFast').value;
        const base = document.getElementById('apiBase').value.replace(/\/$/, "");
        const key = document.getElementById('apiKey').value;

        if (!model) {
            el.innerHTML = `<span style="color:var(--c-no)">❌ 请先填写模型</span>`;
            return;
        }

        el.innerHTML = `<span style="color:var(--guess)">🧠 测试思考中...</span>`;

        const payload = {
            model: model,
            messages: [{role:"user", content:"1+1=?"}],
            max_tokens: 100,
            stream: true,
            enable_thinking: true
        };

        try {
            const res = await fetch(`${base}/chat/completions`, {
                method:'POST',
                headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${key}` },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                el.innerHTML = `<span style="color:var(--c-no)">❌ 请求失败 ${res.status}</span>`;
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let hasThinking = false;
            let thinkingContent = "";
            let normalContent = "";

            while(true) {
                const {done, value} = await reader.read();
                if(done) break;
                const lines = decoder.decode(value, {stream:true}).split('\n');
                for(const line of lines) {
                    if(line.startsWith('data: ') && !line.includes('[DONE]')) {
                        try {
                            const json = JSON.parse(line.substring(6));
                            const delta = json.choices?.[0]?.delta;

                            if(delta?.reasoning_content) {
                                hasThinking = true;
                                thinkingContent += delta.reasoning_content;
                            }
                            if(delta?.content) {
                                normalContent += delta.content;
                            }
                        } catch(e){}
                    }
                }
            }

            if(hasThinking) {
                el.innerHTML = `<span style="color:var(--c-yes)">✅ 支持思考模式</span>`;
                if (type === 'story') {
                    this.isVerified = true;
                    this.cfg.isVerified = true;
                    localStorage.setItem('labyrinth_cfg', JSON.stringify(this.cfg));
                }
            } else if(normalContent) {
                el.innerHTML = `<span style="color:var(--guess)">⚠️ 无思考输出</span>`;
            } else {
                el.innerHTML = `<span style="color:var(--c-no)">❌ 无有效响应</span>`;
            }

        } catch(e) {
            el.innerHTML = `<span style="color:var(--c-no)">❌ ${e.message}</span>`;
        }
    },

    async stream(model, messages, callbacks, options={}) {
        const payload = {
            model: model, messages: messages, stream: true
        };
        if(options.temp !== undefined) payload.temperature = options.temp;
        if(options.thinking) payload.enable_thinking = true;

        console.group(`🚀 [API REQ] ${model}`);
        console.log("URL:", `${this.cfg.base}/chat/completions`);
        console.log("Headers:", { 'Content-Type':'application/json', 'Authorization':`Bearer ${this.cfg.key}` });
        console.log("Body:", JSON.stringify(payload, null, 2));
        console.groupEnd();

        try {
            const res = await fetch(`${this.cfg.base}/chat/completions`, {
                method:'POST',
                headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${this.cfg.key}` },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let fullText = "";
            let thinkingText = "";  // 单独记录思考内容
            let started = false;

            while(true) {
                const {done, value} = await reader.read();
                if(done) break;
                const lines = decoder.decode(value, {stream:true}).split('\n');
                for(const line of lines) {
                    if(line.startsWith('data: ')) {
                        try {
                            const json = JSON.parse(line.substring(6));
                            const delta = json.choices[0].delta;

                            // 统一合并 think 和 content 用于回调
                            let chunk = "";
                            if(delta.reasoning_content) {
                                chunk += delta.reasoning_content;
                                thinkingText += delta.reasoning_content;  // 累加思考内容
                            }
                            if(delta.content) {
                                chunk += delta.content;
                                fullText += delta.content;  // 只累加正式内容
                            }

                            if(chunk) {
                                if(!started && callbacks.onStart) { callbacks.onStart(); started = true; }
                                if(callbacks.onContent) callbacks.onContent(chunk, fullText);
                            }
                        } catch(e){}
                    }
                }
            }

            // 打印完整响应，包含思考内容
            console.group("%c[API RES] Complete", "color:green; font-weight:bold");
            if(thinkingText) {
                console.log("%c🧠 Thinking:", "color:#f59e0b; font-weight:bold");
                console.log(thinkingText);
            }
            console.log("%c📝 Content:", "color:#4ade80; font-weight:bold");
            console.log(fullText);
            console.groupEnd();

            if(callbacks.onFinish) callbacks.onFinish(fullText);
        } catch(e) {
            console.error(e);
            if(callbacks.onError) callbacks.onError(e);
        }
    }
};
