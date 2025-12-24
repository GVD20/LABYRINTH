const Utils = {
    sleep: (ms) => new Promise(r => setTimeout(r, ms))
};

// ==================== Physics Bubble Engine 3.2 ====================
const Bubble = {
    nodes: [],
    tags: [
    {t:"校园",w:0.8},    {t:"都市",w:0.9},    {t:"罪案",w:0.9},    {t:"轻松",w:0.7},    {t:"反转",w:0.9},
    {t:"恐怖",w:0.6},    {t:"日式",w:0.5},    {t:"科幻",w:0.4},    {t:"复仇",w:0.7},    {t:"误会",w:0.9},
    {t:"温情",w:0.6},    {t:"逻辑",w:0.5},    {t:"心理",w:0.5},    {t:"怪谈",w:0.4},    {t:"职场",w:0.7},
    {t:"家庭",w:0.8},    {t:"循环",w:0.3},    {t:"梦境",w:0.4},    {t:"食物",w:0.7},    {t:"童话",w:0.3},
    {t:"古代",w:0.4},    {t:"密室",w:0.4},    {t:"规则",w:0.2},    {t:"双胞胎",w:0.4},    {t:"失忆",w:0.5},
    {t:"遗产",w:0.5},    {t:"车祸",w:0.6},    {t:"电梯",w:0.4},    {t:"镜子",w:0.3},    {t:"日记",w:0.5},
    {t:"剧本",w:0.6},    {t:"时间",w:0.4},    {t:"代码",w:0.2},    {t:"荒岛",w:0.3},    {t:"战争",w:0.4},
    {t:"医院",w:0.7},    {t:"火车",w:0.5},    {t:"照片",w:0.6},    {t:"邻居",w:0.8},    {t:"外星",w:0.1},
    {t:"魔术师",w:0.3},    {t:"小丑",w:0.3},    {t:"警察",w:0.7},    {t:"医生",w:0.7},    {t:"作家",w:0.5},
    {t:"盲人",w:0.4},    {t:"哑巴",w:0.3},    {t:"替身",w:0.4},    {t:"间谍",w:0.4},    {t:"杀手",w:0.6},
    {t:"玩偶",w:0.5},    {t:"机器人",w:0.3},    {t:"偶像",w:0.4},    {t:"粉丝",w:0.4},    {t:"流浪汉",w:0.3},
    {t:"祖孙",w:0.5},    {t:"继母",w:0.3},    {t:"前任",w:0.6},    {t:"同桌",w:0.5},    {t:"室友",w:0.7},
    {t:"手机",w:0.8},    {t:"信件",w:0.6},    {t:"录音",w:0.5},    {t:"礼物",w:0.7},    {t:"戒指",w:0.6},
    {t:"毒药",w:0.6},    {t:"药物",w:0.5},    {t:"眼镜",w:0.4},    {t:"鞋子",w:0.3},    {t:"头发",w:0.3},
    {t:"画作",w:0.4},    {t:"雕塑",w:0.2},    {t:"面具",w:0.4},    {t:"日历",w:0.3},    {t:"闹钟",w:0.4},
    {t:"广播",w:0.3},    {t:"电视",w:0.4},    {t:"彩票",w:0.4},    {t:"保险单",w:0.6},    {t:"遗嘱",w:0.5},
    {t:"暴风雪",w:0.3},    {t:"游乐园",w:0.4},    {t:"图书馆",w:0.5},    {t:"监狱",w:0.4},    {t:"法庭",w:0.4},
    {t:"葬礼",w:0.5},    {t:"婚礼",w:0.5},    {t:"酒店",w:0.7},    {t:"阳台",w:0.6},    {t:"地下室",w:0.4},
    {t:"阁楼",w:0.3},    {t:"井",w:0.2},    {t:"森林",w:0.4},    {t:"雪山",w:0.3},    {t:"深海",w:0.2},
    {t:"太空",w:0.1},    {t:"网络",w:0.6},    {t:"直播间",w:0.5},    {t:"梦游",w:0.3},    {t:"平行世界",w:0.2},
    {t:"谎言",w:0.9},    {t:"嫉妒",w:0.8},    {t:"偷窥",w:0.6},    {t:"暗恋",w:0.7},    {t:"守护",w:0.6},
    {t:"绑架",w:0.6},    {t:"越狱",w:0.3},    {t:"自首",w:0.4},    {t:"整容",w:0.4},    {t:"变性",w:0.2},
    {t:"催眠",w:0.4},    {t:"赌博",w:0.5},    {t:"交易",w:0.6},    {t:"契约",w:0.4},    {t:"献祭",w:0.2},
    {t:"恶作剧",w:0.6},    {t:"试胆",w:0.3},    {t:"捉迷藏",w:0.4},    {t:"真心话",w:0.5},    {t:"生存游戏",w:0.3},
    {t:"叙述性",w:0.5},    {t:"黑色幽默",w:0.4},    {t:"细思极恐",w:0.8},    {t:"致郁",w:0.4},    {t:"治愈",w:0.3},
    {t:"宿命",w:0.3},    {t:"巧合",w:0.6},    {t:"蝴蝶效应",w:0.3},    {t:"AI觉醒",w:0.2},
    {t:"颜色",w:0.3},    {t:"气味",w:0.3},    {t:"声音",w:0.4},    {t:"温度",w:0.3},    {t:"重力",w:0.1},
    {t:"双重人格",w:0.4},    {t:"精神病",w:0.5},    {t:"色盲",w:0.2},    {t:"过敏",w:0.3},    {t:"强迫症",w:0.3},
    {t:"电脑",w:0.6},    {t:"收音机",w:0.3},    {t:"钟表",w:0.5},    {t:"血液",w:0.5},    {t:"炸弹",w:0.3},
    {t:"绳索",w:0.3},    {t:"钥匙",w:0.6},    {t:"锁",w:0.5},    {t:"地图",w:0.3},    {t:"蜡烛",w:0.3},
    {t:"博物馆",w:0.4},    {t:"动物园",w:0.3},    {t:"餐厅",w:0.6},    {t:"酒吧",w:0.5},    {t:"网吧",w:0.4},
    {t:"派对",w:0.6},    {t:"隧道",w:0.3},    {t:"桥",w:0.4},    {t:"秘密",w:0.8},    {t:"贪婪",w:0.6},
    {t:"救赎",w:0.5},    {t:"背叛",w:0.7},    {t:"承诺",w:0.6},    {t:"诅诅咒",w:0.3},    {t:"预言",w:0.3},
    {t:"既视感",w:0.3},    {t:"开放结局",w:0.4},    {t:"模仿",w:0.5},    {t:"审讯",w:0.4},    {t:"逃亡",w:0.5},
    {t:"秘密通道",w:0.3},    {t:"隐藏身份",w:0.4},    {t:"时间旅行",w:0.2},    {t:"记忆碎片",w:0.4},    {t:"幻觉",w:0.3},

],
    selected: new Set(),
    
    init() {
        this.container = document.getElementById('bubbleContainer');
        this.refresh();
        this.loop();
    },

    async refresh() {
        if(this.nodes.length > 0) {
            this.nodes.forEach(n => n.el.classList.add('exit'));
            await Utils.sleep(400); 
        }
        
        this.container.innerHTML = '';
        this.selected.clear();
        this.updateTip();
        this.nodes = [];

        const shuffled = [...this.tags].sort(() => 0.5 - Math.random()).slice(0, 25);
        const rect = this.container.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        shuffled.forEach((tag, i) => {
            const el = document.createElement('div');
            el.className = 'bubble';
            el.innerText = tag.t;
            
            const baseR = 32 + tag.w * 35 + Math.random() * 8;
            
            const node = {
                id: i,
                x: cx + (Math.random()-0.5)*50, 
                y: cy + (Math.random()-0.5)*50,
                vx: (Math.random()-0.5)*0.5, 
                vy: (Math.random()-0.5)*0.5,
                radius: baseR,
                targetRadius: baseR,
                mass: baseR * 2,
                el: el,
                tag: tag.t,
                hover: false
            };
            
            el.style.width = (node.radius * 2) + 'px';
            el.style.height = (node.radius * 2) + 'px';
            
            el.onmouseenter = () => node.hover = true;
            el.onmouseleave = () => node.hover = false;
            el.onclick = () => this.toggle(node);
            
            this.container.appendChild(el);
            this.nodes.push(node);
        });
    },

    toggle(node) {
        if(this.selected.has(node.tag)) {
            this.selected.delete(node.tag);
            node.el.classList.remove('selected');
            node.targetRadius = node.targetRadius / 1.3;
        } else {
            if(this.selected.size >= 4) return;
            this.selected.add(node.tag);
            node.el.classList.add('selected');
            node.targetRadius = node.targetRadius * 1.3;
        }
        this.updateTip();
    },

    updateTip() {
        document.getElementById('tagTip').innerHTML = this.selected.size ? `<span class="iconify" data-icon="lucide:check-circle" style="color:var(--c-yes)"></span> 已选: ${Array.from(this.selected).join(', ')}` : `<span class="iconify" data-icon="lucide:mouse-pointer-2"></span> 请选择 1-4 个关键词`;
    },

    loop() {
        const W = this.container.offsetWidth;
        const H = this.container.offsetHeight;
        const center = { x: W/2, y: H/2 };
        const kCenter = 0.005; 
        const kColl = 0.3;      
        const damping = 0.92;   
        const maxV = 2.5;       

        this.nodes.forEach(node => {
            if(node.hover) {
                node.vx = 0; node.vy = 0; 
            } else {
                node.vx += (center.x - node.x) * kCenter;
                node.vy += (center.y - node.y) * kCenter;
            }

            if(Math.abs(node.radius - node.targetRadius) > 0.1) {
                node.radius += (node.targetRadius - node.radius) * 0.1;
                node.el.style.width = (node.radius*2) + 'px';
                node.el.style.height = (node.radius*2) + 'px';
            }

            this.nodes.forEach(other => {
                if(node === other) return;
                const dx = other.x - node.x;
                const dy = other.y - node.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                const minDist = node.radius + other.radius + 4; 

                if(dist < minDist) {
                    if (dist === 0) dist = 0.1;
                    const overlap = minDist - dist;
                    const nx = dx / dist;
                    const ny = dy / dist;
                    
                    const p = overlap * 0.08; 
                    if(!node.hover) { node.x -= nx * p; node.y -= ny * p; }
                    if(!other.hover) { other.x += nx * p; other.y += ny * p; }

                    const dvx = node.vx - other.vx;
                    const dvy = node.vy - other.vy;
                    const velAlongNormal = dvx * nx + dvy * ny;

                    if (velAlongNormal < 0) {
                        const j = -(1 + 0.5) * velAlongNormal;
                        const impulse = j * 0.5;
                        if(!node.hover) {
                            node.vx += impulse * nx * kColl;
                            node.vy += impulse * ny * kColl;
                        }
                        if(!other.hover) {
                            other.vx -= impulse * nx * kColl;
                            other.vy -= impulse * ny * kColl;
                        }
                    } else {
                        if(!node.hover) { node.vx *= 0.6; node.vy *= 0.6; }
                        if(!other.hover) { other.vx *= 0.6; other.vy *= 0.6; }
                    }
                }
            });

            if(!node.hover) {
                const v = Math.sqrt(node.vx*node.vx + node.vy*node.vy);
                if(v > maxV) { node.vx = (node.vx/v)*maxV; node.vy = (node.vy/v)*maxV; }
                
                node.vx *= damping;
                node.vy *= damping;
                node.x += node.vx;
                node.y += node.vy;

                if(node.x - node.radius < 0) { node.x = node.radius; node.vx *= -1; }
                if(node.x + node.radius > W) { node.x = W - node.radius; node.vx *= -1; }
                if(node.y - node.radius < 0) { node.y = node.radius; node.vy *= -1; }
                if(node.y + node.radius > H) { node.y = H - node.radius; node.vy *= -1; }
            }

            node.el.style.left = (node.x - node.radius) + 'px';
            node.el.style.top = (node.y - node.radius) + 'px';
        });

        requestAnimationFrame(() => this.loop());
    }
};

// ==================== API Module ====================
const Api = {
    cfg: { base:"", key:"", storyModel:"", fastModel:"" },
    availableModels: [],
    activeTarget: null,
    
    init() {
        const s = localStorage.getItem('labyrinth_cfg');
        if(s) this.cfg = JSON.parse(s);
        if(!this.cfg.base) this.open(true);
        
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
        const btn = document.getElementById('apiCloseBtn');
        if(btn) btn.style.display = force ? 'none' : 'block';
    },
    close() { 
        if(document.getElementById('apiCloseBtn').style.display === 'none' && !localStorage.getItem('labyrinth_cfg')) return;
        document.getElementById('apiModal').classList.remove('active'); 
        this.closePicker();
    },
    save() {
        this.cfg.base = document.getElementById('apiBase').value.replace(/\/$/, "");
        this.cfg.key = document.getElementById('apiKey').value;
        this.cfg.storyModel = document.getElementById('modelStory').value;
        this.cfg.fastModel = document.getElementById('modelFast').value;
        if(!this.cfg.base || !this.cfg.storyModel) return alert("请填写完整配置");
        localStorage.setItem('labyrinth_cfg', JSON.stringify(this.cfg));
        this.close();
    },
    setBaseUrl(url) {
        document.getElementById('apiBase').value = url;
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
        el.innerText = "连接中...";
        el.style.color = "var(--text-muted)";
        
        const payload = { model: model, messages: [{role:"user", content:"hi"}], max_tokens:1 };
        console.group(`🚀 [API REQ] ${model}`);
        console.log("URL:", `${document.getElementById('apiBase').value}/chat/completions`);
        console.log("Headers:", { 'Content-Type':'application/json', 'Authorization':`Bearer ${document.getElementById('apiKey').value}` });
        console.log("Body:", JSON.stringify(payload, null, 2));
        console.groupEnd();

        try {
            const res = await fetch(`${document.getElementById('apiBase').value}/chat/completions`, {
                method:'POST',
                headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${document.getElementById('apiKey').value}` },
                body: JSON.stringify(payload)
            });
            if(res.ok) {
                el.innerHTML = `<span style="color:var(--c-yes)">✅ 连接成功</span>`;
            } else {
                el.innerHTML = `<span style="color:var(--c-no)">❌ 失败 ${res.status}</span>`;
            }
        } catch(e) { el.innerHTML = `<span style="color:var(--c-no)">❌ 网络错误</span>`; }
    },

    // 新增：测试思考模式
    async testThinking(type) {
        const el = document.getElementById(type==='story'?'testStory':'testFast');
        const model = document.getElementById(type==='story'?'modelStory':'modelFast').value;
        const base = document.getElementById('apiBase').value;
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
        
        console.group(`🧠 [THINKING TEST] ${model}`);
        console.log("URL:", `${base}/chat/completions`);
        console.log("Body:", JSON.stringify(payload, null, 2));
        console.groupEnd();

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
                            
                            // 检测 reasoning_content (思考内容)
                            if(delta?.reasoning_content) {
                                hasThinking = true;
                                thinkingContent += delta.reasoning_content;
                            }
                            // 检测普通 content
                            if(delta?.content) {
                                normalContent += delta.content;
                            }
                        } catch(e){}
                    }
                }
            }
            
            console.log('%c[THINKING TEST RESULT]', 'color: #f59e0b; font-weight: bold;');
            console.log('Has Thinking:', hasThinking);
            console.log('Thinking Content:', thinkingContent);
            console.log('Normal Content:', normalContent);

            if(hasThinking) {
                el.innerHTML = `<span style="color:var(--c-yes)">✅ 支持思考模式</span>`;
                console.log('%c✅ 模型支持 enable_thinking', 'color: #4ade80; font-size: 12px;');
            } else if(normalContent) {
                el.innerHTML = `<span style="color:var(--guess)">⚠️ 无思考输出</span>`;
                console.log('%c⚠️ 模型响应正常但无 reasoning_content，可能不支持思考模式', 'color: #f59e0b; font-size: 12px;');
            } else {
                el.innerHTML = `<span style="color:var(--c-no)">❌ 无有效响应</span>`;
            }

        } catch(e) { 
            console.error(e);
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

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let fullText = "";
            let thinkingText = "";  // 新增：单独记录思考内容
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

// ==================== UI & Logic ====================
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

        if(isHtml) el.innerHTML = content;
        else el.innerText = content;
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

const Game = {
    state: {
        tags: [],
        diff: 'normal',
        puzzle: null,
        history: [],
        foundPoints: [],      // 累计已猜中的要点
        turnsMax: 40,
        turnsUsed: 0,
        hintsMax: 5,
        hintsUsed: 0,
        startTime: null,
        mode: 'ask',
        draftAsk: "",
        draftGuess: "",
        status: 'idle',
        titleFound: false,
        settlePromptShown: false,  // 是否已显示过结算提示
        canSettle: false,          // 是否可以结算
        highestScore: 0            // 新增：历史最高单次得分
    },

    setDiff(d, el) {
        this.state.diff = d;
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        if(el) el.classList.add('active');
        if(d === 'easy') { this.state.turnsMax = 0; this.state.hintsMax = 999; }
        else if(d === 'normal') { this.state.turnsMax = 40; this.state.hintsMax = 5; }
        else { this.state.turnsMax = 25; this.state.hintsMax = 0; }

        // Update description
        const desc = document.getElementById('diffDesc');
        if(d === 'easy') desc.innerHTML = "逻辑直观，线索明显。<br>无限次提问与提示机会。";
        else if(d === 'normal') desc.innerHTML = "标准海龟汤，需要一定的联想力和脑洞。<br>包含40轮提问，5次提示。";
        else desc.innerHTML = "逻辑极度隐晦，包含复杂诡计或心理盲区。<br>仅25轮提问，无提示机会。";
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
            // 修改：freeze 时彻底隐藏，而不是停留在当前
            this.stop();
        },
        
        stop() {
            this.stopped = true;
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
            
            if (this.container) {
                // 移除激活状态
                this.container.classList.remove('active');
                
                // 平滑收缩到 0 高度并移除 margin
                this.container.style.height = '0';
                this.container.style.marginTop = '0';
                
                // 重置所有项
                Array.from(this.container.children).forEach(item => {
                    item.classList.remove('active', 'exit');
                });
            }
        }
    },

    // 修改：initNew 方法，重置新状态
    initNew() {
        if(Bubble.selected.size === 0) return alert("请至少选择 1 个关键词");
        this.state.tags = Array.from(Bubble.selected);
        this.state.history = [];
        this.state.foundPoints = [];
        this.state.turnsUsed = 0;
        this.state.hintsUsed = 0;
        this.state.startTime = Date.now();
        this.state.draftAsk = ""; 
        this.state.draftGuess = "";
        this.state.status = 'generating';
        this.state.titleFound = false;
        this.state.settlePromptShown = false;  // 重置结算提示状态
        this.state.canSettle = false;          // 重置结算按钮状态
        this.state.highestScore = 0;           // 重置最高分

        this.setDiff(this.state.diff, document.querySelector('.diff-btn.active'));

        UI.switchPage('page-game');
        
        const container = document.getElementById('gameContainer');
        container.className = 'game-container state-init';
        
        document.getElementById('inputWrapper').style.display = 'flex';
        document.getElementById('inputWrapper').style.opacity = '0';
        
        document.getElementById('gameTitle').innerText = "正在构建迷宫...";
        document.getElementById('gameTags').innerHTML = this.state.tags.join(' / ') + ` <span class="diff-badge">${this.state.diff}</span>`;
        document.getElementById('chatList').innerHTML = '';
        document.getElementById('gamePuzzle').style.display = 'none';
        
        // 重置 Emoji 容器和左边距
        const titleRow = document.querySelector('.puzzle-title-row');
        titleRow.classList.remove('has-emoji');
        const existingEmoji = document.getElementById('puzzleEmoji');
        if (existingEmoji) existingEmoji.remove();
        
        // 隐藏结算按钮
        this.updateSettleButton();
        
        this.updateStats();
        this.setMode('ask');
        UI.SmoothText.init();
        this.TipsCarousel.start();
        
        this.generate();
    },

    createEmojiContainer(emoji) {
        const titleEl = document.getElementById('gameTitle');
        const titleRow = titleEl.closest('.puzzle-title-row');
        
        const existing = document.getElementById('puzzleEmoji');
        if (existing) {
            existing.innerText = emoji;
            existing.style.opacity = '1';
            existing.style.transform = 'scale(1)';
            titleRow.classList.add('has-emoji');
            return;
        }
        
        const container = document.createElement('div');
        container.id = 'puzzleEmoji';
        container.className = 'puzzle-emoji';
        container.innerText = emoji;
        container.style.opacity = '1';
        container.style.transform = 'scale(1)';
        
        titleEl.parentNode.insertBefore(container, titleEl);
        
        // 添加 has-emoji 类触发左边距
        titleRow.classList.add('has-emoji');
    },

        // 新增：调试打印方法
    debugPrint() {
        if (!this.state.puzzle) {
            console.log('%c[DEBUG] 谜题尚未生成', 'color: orange');
            return;
        }
        
        console.group('%c🎭 谜题调试信息', 'color: #38bdf8; font-size: 14px; font-weight: bold;');
        console.log('%c标题:', 'color: #fbbf24; font-weight: bold;', this.state.puzzle.title);
        console.log('%cEmoji:', 'color: #fbbf24; font-weight: bold;', this.state.puzzle.emoji || '🎭');
        console.log('%c谜面:', 'color: #4ade80; font-weight: bold;', this.state.puzzle.puzzle);
        console.log('%c真相:', 'color: #f87171; font-weight: bold;', this.state.puzzle.answer);
        console.log('%c要点列表:', 'color: #a78bfa; font-weight: bold;');
        this.state.puzzle.key_points.forEach((kp, i) => {
            const found = this.state.foundPoints.includes(kp);
            console.log(`  ${found ? '✅' : '⬜'} ${i + 1}. ${kp}`);
        });
        console.log('%c游戏状态:', 'color: #94a3b8; font-weight: bold;', {
            难度: this.state.diff,
            已用轮次: this.state.turnsUsed,
            剩余轮次: this.state.turnsMax === 0 ? '∞' : this.state.turnsMax - this.state.turnsUsed,
            已用提示: this.state.hintsUsed,
            剩余提示: this.state.hintsMax > 100 ? '∞' : this.state.hintsMax - this.state.hintsUsed,
            已猜中要点: `${this.state.foundPoints.length}/${this.state.puzzle.key_points.length}`,
            最高得分: this.state.highestScore,
            可结算: this.state.canSettle
        });
        console.groupEnd();
        
        // 作弊提示
        console.log('%c💡 作弊指令:', 'color: #facc15; font-weight: bold;');
        console.log('  Game.cheat.autoWin()     - 直接通关');
        console.log('  Game.cheat.addTurns(n)   - 增加 n 轮次');
        console.log('  Game.cheat.addHints(n)   - 增加 n 次提示');
    },

        // 新增：作弊工具集
    cheat: {
        showAnswer() {
            if (!Game.state.puzzle) return console.log('谜题未生成');
            console.log('%c📜 完整真相:', 'color: #f87171; font-size: 14px; font-weight: bold;');
            console.log(Game.state.puzzle.answer);
            // 同时复制到剪贴板
            navigator.clipboard?.writeText(Game.state.puzzle.answer);
            console.log('(已复制到剪贴板)');
        },
        
        showHints() {
            if (!Game.state.puzzle) return console.log('谜题未生成');
            console.log('%c🎯 所有要点:', 'color: #a78bfa; font-size: 14px; font-weight: bold;');
            Game.state.puzzle.key_points.forEach((kp, i) => {
                const found = Game.state.foundPoints.includes(kp);
                console.log(`${found ? '✅' : '❌'} ${i + 1}. ${kp}`);
            });
        },
        
        autoWin() {
            if (!Game.state.puzzle) return console.log('谜题未生成');
            // 标记所有要点为已找到
            Game.state.foundPoints = [...Game.state.puzzle.key_points];
            Game.state.highestScore = 100;
            Game.state.canSettle = true;
            console.log('%c🏆 作弊通关中...', 'color: #4ade80; font-size: 14px;');
            Game.finish(true);
        },
        
        addTurns(n = 10) {
            if (Game.state.turnsMax === 0) return console.log('当前为无限轮次模式');
            Game.state.turnsMax += n;
            Game.updateStats();
            console.log(`%c⏱️ 已增加 ${n} 轮次，当前剩余: ${Game.state.turnsMax - Game.state.turnsUsed}`, 'color: #38bdf8;');
        },
        
        addHints(n = 5) {
            if (Game.state.hintsMax > 100) return console.log('当前为无限提示模式');
            Game.state.hintsMax += n;
            Game.updateStats();
            console.log(`%c💡 已增加 ${n} 次提示，当前剩余: ${Game.state.hintsMax - Game.state.hintsUsed}`, 'color: #facc15;');
        },
        
        unlockSettle() {
            Game.state.canSettle = true;
            Game.state.highestScore = Math.max(Game.state.highestScore, 80);
            Game.updateSettleButton();
            console.log('%c🔓 已解锁提前结算', 'color: #a78bfa;');
        }
    },

    // 修改 loadFromHistory 方法，在恢复后打印调试信息
    loadFromHistory(item) {
        const emoji = item.puzzle?.emoji || item.state?.puzzle?.emoji || '🎭';
        
        if(item.status === 'completed' || item.rank !== '-' || item.rank === 'F') {
            UI.switchPage('page-game');
            const container = document.getElementById('gameContainer');
            container.className = 'game-container state-active state-over';
            
            const titleEl = document.getElementById('gameTitle');
            const titleRow = titleEl.closest('.puzzle-title-row');
            const tagsEl = document.getElementById('gameTags');
            
            titleRow.style.transition = 'none';
            titleEl.style.transition = 'none';
            tagsEl.style.transition = 'none';
            
            titleEl.innerText = item.title;
            tagsEl.innerHTML = item.tags.join(' / ') + ' [已归档]';
            
            this.createEmojiContainer(emoji);
            
            titleRow.offsetHeight;
            titleRow.style.transition = '';
            titleEl.style.transition = '';
            tagsEl.style.transition = '';
            
            document.getElementById('gamePuzzle').style.display = 'block';
            document.getElementById('gamePuzzle').innerText = item.puzzle.puzzle || item.puzzle;
            
            const list = document.getElementById('chatList');
            list.innerHTML = '';
            item.state.history.forEach(msg => {
                if(msg.role === 'user') {
                    let txt = msg.content.replace(/^\[提问\]\s*/, '').replace(/^\[猜谜\]\s*/, '');
                    const isAsk = msg.content.includes('[提问]');
                    UI.addMsg(isAsk?'user-ask':'user-guess', txt);
                } else if(msg.role === 'assistant') {
                    const isHtml = msg.content.trim().startsWith('<div');
                    UI.addMsg('ai', msg.content, null, isHtml);
                }
            });
            
            let rankColor = 'var(--c-no)';
            if(item.rank === 'S') rankColor = '#fbbf24';
            else if(item.rank === 'A') rankColor = '#a78bfa';
            else if(item.rank === 'B') rankColor = 'var(--primary)';
            else if(item.rank === 'C') rankColor = 'var(--c-yes)';
            
            const card = document.createElement('div');
            card.className = 'inline-result';
            card.innerHTML = `
                <h2>${item.rank!=='F'?"🎉 任务完成":"💀 任务失败"}</h2>
                <div class="score" style="color:${rankColor}">${item.rank}</div>
                <div style="font-size:0.9rem; color:#94a3b8">轮次: ${item.state.turnsUsed} | 提示: ${item.state.hintsUsed}</div>
                <div class="truth-box"><strong>真相：</strong><br>${item.puzzle.answer || item.answer}</div>
                <button class="btn" onclick="Game.backToHome()"><span class="iconify" data-icon="lucide:home"></span> 返回主页</button>
            `;
            document.getElementById('chatList').appendChild(card);
            document.getElementById('inputWrapper').style.display = 'none';
            
            // ✨ 新增：打印已完成游戏的调试信息
            console.group('%c📚 历史记录 (已完成)', 'color: #94a3b8; font-size: 14px;');
            console.log('标题:', item.title);
            console.log('评级:', item.rank);
            console.log('真相:', item.puzzle?.answer || item.answer);
            console.groupEnd();
            
            return;
        }
        
        this.state = JSON.parse(JSON.stringify(item.state));
        
        // 恢复结算相关状态
        if (this.state.settlePromptShown === undefined) {
            this.state.settlePromptShown = false;
        }
        if (this.state.canSettle === undefined) {
            this.state.canSettle = false;
        }
        if (this.state.highestScore === undefined) {
            this.state.highestScore = 0;
        }
        
        UI.switchPage('page-game');
        
        const container = document.getElementById('gameContainer');
        container.className = 'game-container state-active';
        
        const wrap = document.getElementById('inputWrapper');
        wrap.style.display = 'flex';
        wrap.style.opacity = '1';
        
        const titleEl = document.getElementById('gameTitle');
        const titleRow = titleEl.closest('.puzzle-title-row');
        const tagsEl = document.getElementById('gameTags');
        
        titleRow.style.transition = 'none';
        titleEl.style.transition = 'none';
        tagsEl.style.transition = 'none';
        
        titleEl.innerText = this.state.puzzle.title;
        tagsEl.innerHTML = this.state.tags.join(' / ') + ` <span class="diff-badge">${this.state.diff}</span>`;
        
        this.createEmojiContainer(emoji);
        
        titleRow.offsetHeight;
        titleRow.style.transition = '';
        titleEl.style.transition = '';
        tagsEl.style.transition = '';
        
        document.getElementById('gamePuzzle').style.display = 'block';
        document.getElementById('gamePuzzle').innerText = this.state.puzzle.puzzle;
        
        const list = document.getElementById('chatList');
        list.innerHTML = '';
        this.state.history.forEach(msg => {
            if(msg.role === 'user') {
                let txt = msg.content.replace(/^\[提问\]\s*/, '').replace(/^\[猜谜\]\s*/, '');
                const isAsk = msg.content.includes('[提问]');
                UI.addMsg(isAsk?'user-ask':'user-guess', txt);
            } else if(msg.role === 'assistant') {
                const isHtml = msg.content.trim().startsWith('<div');
                UI.addMsg('ai', msg.content, null, isHtml);
            }
        });
        
        // 恢复结算按钮状态
        this.updateSettleButton();
        
        UI.addMsg('sys', '存档已恢复，可继续提问。');
        this.updateStats();
        this.setMode('ask');
        
        // ✨ 新增：打印调试信息
        console.log('%c📂 从历史记录恢复', 'color: #38bdf8; font-size: 14px;');
        this.debugPrint();
    },

    // 修改 generate 方法，在生成完成后打印调试信息
    generate() {
        let diffPrompt = "";
        let kpCount = "";
        if(this.state.diff === 'easy') {
            diffPrompt = "谜题应当逻辑直观，线索在谜面中较为明显，不需要过于复杂的脑洞。";
            kpCount = "2-4";
        } else if (this.state.diff === 'normal') {
            diffPrompt = "谜题应当具备标准的海龟汤难度，需要玩家进行一定的联想和侧向思维，可以适当设置思维陷阱。";
            kpCount = "4-6";
        } else {
            diffPrompt = "谜题应当极具挑战性，核心诡计非常隐晦，涉及复杂的因果链、心理盲区或冷门知识，需要极强的逻辑跳跃能力。";
            kpCount = "6-10";
        }

        const prompt = `你是一位侧向思维谜题大师。任务：根据标签[${this.state.tags}]创作一个逻辑严密的悬疑海龟汤。
        编写要求：
            1. 谜题要基于物理或心理逻辑，适合通过问答和推理在有限轮次内解开。谜面不应太复杂，以免信息过多影响判断。谜底的复杂程度视难度调整。
            2. 核心诡计应当在谜面中隐含线索，避免无厘头的谜底逻辑、过度依赖巧合或谜面与谜底脱节。
            3. 谜面应构建一个不寻常、引人入胜的场景，激发用户的好奇心和探索真相的欲望；谜面应当引出对真相的提问（以"发生了什么"或"为什么？"等结尾）
            4. 谜底应包含适当的反转或意外元素，但必须在逻辑上与整个谜题自洽且可被推理揭示。
            5. 难度设置：当前难度为"${this.state.diff}"。${diffPrompt}
        格式要求：
            1. 必须提取出 ${kpCount} 个"谜底要点"（Key Points），这些要点用于匹配用户猜谜结果，量化其准确性和完整性。每个要点应为一句简短描述，涵盖谜底的关键方面，不应包含任何谜面已知的信息。
            2. 选择一个最符合谜题氛围和核心主题的 Emoji 表情符号。
            3. 最终输出严格JSON：{"emoji":"(符合当前谜题主题的Emoji)","title":"中文标题","puzzle":"简短谜面","answer":"完整真相", "key_points":["要点1","要点2"...]}。`;

        UI.setThinkingState('thinking');

        Api.stream(Api.cfg.storyModel, [{role:"user", content:prompt}], {
            onStart: () => {
                UI.setThinkingState('generating');
            },
            onContent: (chunk, fullText) => {
                UI.SmoothText.push(chunk);

                if(fullText.includes('"title":')) UI.PhaseMgr.request(1); 
                if(fullText.includes('"puzzle":')) UI.PhaseMgr.request(2); 
                if(fullText.includes('"answer":')) UI.PhaseMgr.request(3); 
                if(fullText.includes('"key_points":')) {
                    UI.PhaseMgr.request(4);
                    this.TipsCarousel.freeze();
                }

                // 实时提取 Emoji 和标题
                if (!this.state.titleFound) {
                    const emojiMatch = fullText.match(/"emoji"\s*:\s*"(.+?)"/);
                    const titleMatch = fullText.match(/"title"\s*:\s*"(.*?)"/);
                    
                    if (titleMatch && titleMatch[1]) {
                        this.state.titleFound = true;
                        const emoji = emojiMatch ? emojiMatch[1] : '🎭';
                        this.updateTitleWithEmoji(titleMatch[1], emoji);
                    }
                }
            },
            onFinish: (txt) => {
                UI.PhaseMgr.request(3);
                UI.PhaseMgr.request(4);

                UI.PhaseMgr.waitAndFinish(() => {
                    UI.setThinkingState(null);
                    this.TipsCarousel.stop();
                    try {
                        const clean = txt.replace(/```json/g,'').replace(/```/g,'').replace(/<think>[\s\S]*?<\/think>/g,'');
                        const data = JSON.parse(clean);
                        
                        // 设置默认 Emoji
                        if (!data.emoji) data.emoji = '🎭';
                        
                        this.state.puzzle = data;
                        
                        // 最终确保一致
                        this.updateTitleWithEmoji(data.title, data.emoji, true);
                        
                        document.getElementById('gamePuzzle').innerText = data.puzzle;
                        document.getElementById('gamePuzzle').style.display = 'block';
                        
                        document.getElementById('gameContainer').className = 'game-container state-active';
                        document.getElementById('inputWrapper').style.opacity = '1';
                        
                        this.state.status = 'active';
                        this.saveHistory('active');
                        this.updateStats();
                        UI.addMsg('sys', '谜题已呈现。请提问/猜谜');

                        // ✨ 新增：打印调试信息
                        this.debugPrint();

                    } catch(e) {
                        console.error(e);
                        alert("生成格式错误，请检查 API 配置或重试");
                        this.TipsCarousel.stop();
                        this.backToHome();
                    }
                });
            }
        }, { thinking: true });
    },

    updateTitleWithEmoji(title, emoji, instant = false) {
        const titleEl = document.getElementById('gameTitle');
        const titleRow = titleEl.closest('.puzzle-title-row'); // 获取父容器
        let emojiContainer = document.getElementById('puzzleEmoji');
        
        if (!emojiContainer) {
            // 首次创建 Emoji 容器
            const container = document.createElement('div');
            container.id = 'puzzleEmoji';
            container.className = 'puzzle-emoji';
            container.innerText = emoji;
            container.style.opacity = '0';
            container.style.transform = 'scale(0)';
            
            titleEl.parentNode.insertBefore(container, titleEl);
            emojiContainer = container;
        }
        
        if (instant) {
            // 最终确认时直接显示
            titleEl.innerText = title;
            emojiContainer.innerText = emoji;
            emojiContainer.style.opacity = '1';
            emojiContainer.style.transform = 'scale(1)';
            titleRow.classList.add('has-emoji'); // 添加类触发左边距
        } else {
            // 动画展示
            titleEl.classList.add('switching');
            setTimeout(() => {
                titleEl.innerText = title;
                titleEl.classList.remove('switching');
                
                // 同时添加 has-emoji 类，触发左边距过渡
                titleRow.classList.add('has-emoji');
                
                // Emoji 淡入动画
                emojiContainer.innerText = emoji;
                setTimeout(() => {
                    emojiContainer.style.opacity = '1';
                    emojiContainer.style.transform = 'scale(1)';
                }, 100);
            }, 300);
        }
    },

    mode: 'ask',
    setMode(m) {
        this.mode = m;
        const wrap = document.getElementById('inputWrapper');
        const bAsk = document.getElementById('btnAsk');
        const bGuess = document.getElementById('btnGuess');
        const glider = document.getElementById('modeGlider');
        const iAsk = document.getElementById('inputAsk');
        const iGuess = document.getElementById('inputGuess');

        const activeBtn = m === 'ask' ? bAsk : bGuess;
        glider.style.width = activeBtn.offsetWidth + 'px';
        glider.style.left = activeBtn.offsetLeft + 'px';

        if(m === 'ask') {
            wrap.className = 'input-wrapper glass-panel mode-ask';
            bAsk.classList.add('active'); bGuess.classList.remove('active');
            setTimeout(()=>iAsk.focus(), 100);
        } else {
            wrap.className = 'input-wrapper glass-panel mode-guess';
            bGuess.classList.add('active'); bAsk.classList.remove('active');
            setTimeout(()=>iGuess.focus(), 100);
        }
    },

    send() {
        const input = this.mode === 'ask' ? document.getElementById('inputAsk') : document.getElementById('inputGuess');
        const val = input.value.trim();
        if(!val) return;
        if(this.state.turnsMax > 0 && this.state.turnsUsed >= this.state.turnsMax) return;

        input.value = '';
        
        UI.addMsg(this.mode==='ask'?'user-ask':'user-guess', val);
        this.state.history.push({role:"user", content: this.mode==='ask' ? `[提问] ${val}` : `[猜谜] ${val}`});
        
        this.state.turnsUsed++;
        this.updateStats();

        if(this.mode === 'ask') this.handleAsk(val);
        else this.handleGuess(val);

        if(this.state.turnsMax > 0 && this.state.turnsUsed >= this.state.turnsMax) {
            setTimeout(()=>this.finish(false), 2000);
        }
    },

    handleAsk(q) {
        const sys = `谜面：${this.state.puzzle.puzzle}。真相是：${this.state.puzzle.answer}。用户问：${q}。请回复JSON：{"res":"是/不是/无关/是也不是"}。提示：当用户的问题或判断在真相逻辑中明确成立时，回答“是”；当用户的问题或判断在真相逻辑中明确不成立时，回答“不是”；当问题与谜题无关或真相没有提供相关解释时，回答“无关”；当问题或答案本身存在二义性或悖论时，回答“是也不是”。不要包含任何多余解释。`;
        const id = UI.addPlaceholder("分析中...");
        
        Api.stream(Api.cfg.fastModel, [{role:"system", content:sys}], {
            onFinish: (txt) => {
                try {
                    const j = JSON.parse(txt.replace(/```json|```/g,''));
                    UI.replacePlaceholder(id, j.res, 'ai');
                    this.state.history.push({role:"assistant", content:j.res});
                    this.saveHistory('active');
                } catch(e) { UI.replacePlaceholder(id, "系统错误", 'ai'); }
            }
        }, { thinking: true }); 
    },

    // 修改：handleGuess 方法
    handleGuess(g) {
        const kps = JSON.stringify(this.state.puzzle.key_points);
        const sys = `你是一个海龟汤裁判。
        谜面：${this.state.puzzle.puzzle}
        真相：${this.state.puzzle.answer}
        真相要点表：${kps}
        任务：分析用户猜测 "${g}"。
        请逐句分析用户是否猜中了要点表中的内容。
        返回JSON：
        {
            "matched_segments": ["用户猜测中与要点吻合的原文片段1"],
            "wrong_segments": ["用户猜测中与真相明显矛盾的原文片段1"],
            "achieved_points": ["对应真相要点表中的要点原文1"],
            "comment": "温和而鼓励式的一句话评价，仅评价用户本轮的推理表现（如：思路清晰、有所进展、需要调整方向等），不涉及谜题内容"
        }
        注意：matched_segments 和 wrong_segments 必须是用户猜测文本的子串。achieved_points 必须是 key_points 中被用户明显猜中的内容。`;

        const id = UI.addPlaceholder("裁判正在评估...");
        
        Api.stream(Api.cfg.fastModel, [{role:"system", content:sys}], {
            onThink: () => {}, 
            onFinish: (txt) => {
                try {
                    const clean = txt.replace(/```json/g,'').replace(/```/g,'').replace(/<think>[\s\S]*?<\/think>/g,'');
                    const res = JSON.parse(clean);
                    
                    const thisRoundMatched = (res.achieved_points || []).length;
                    
                    // 累加到总进度
                    if(res.achieved_points) {
                        res.achieved_points.forEach(p => { 
                            if(!this.state.foundPoints.includes(p)) 
                                this.state.foundPoints.push(p); 
                        });
                    }

                    const total = this.state.puzzle.key_points.length;
                    const cumulativeFound = this.state.foundPoints.length;
                    const wrong = (res.wrong_segments||[]).length;
                    
                    let score = Math.round((thisRoundMatched / total) * 100) - (wrong * 10);
                    score = Math.max(0, Math.min(100, score));

                    // 更新历史最高分
                    if (score > this.state.highestScore) {
                        this.state.highestScore = score;
                    }

                    let htmlText = g.replace(/&/g, "&amp;").replace(/</g, "&lt;");
                    (res.matched_segments||[]).forEach(s => htmlText = htmlText.split(s).join(`<span class="hl-ok">${s}</span>`));
                    (res.wrong_segments||[]).forEach(s => htmlText = htmlText.split(s).join(`<span class="hl-no">${s}</span>`));
                    
                    // 分数颜色
                    let scoreColor = 'var(--c-no)';
                    if (score >= 90) scoreColor = '#fbbf24';
                    else if (score >= 80) scoreColor = '#a78bfa';
                    else if (score >= 60) scoreColor = 'var(--primary)';
                    else if (score >= 40) scoreColor = 'var(--c-yes)';
                    
                    const deduction = wrong > 0 ? ` <span style="font-size:0.7rem; color:var(--c-no)">(-${wrong * 10})</span>` : '';
                    const errorInfo = wrong > 0 ? `<span style="font-size:0.8rem;color:var(--c-no);margin-left:10px;">错误 ${wrong}</span>` : '';
                    
                    const html = `
                    <div class="report">
                        <div class="report-head">
                            <span class="report-score" style="color:${scoreColor}">${score}分${deduction}</span>
                            <div style="display:flex; gap:8px; align-items:center;">
                                <span style="font-size:0.8rem;color:#94a3b8">已匹配 ${cumulativeFound}/${total}</span>
                                ${errorInfo}
                            </div>
                        </div>
                        <div class="report-body">${htmlText}</div>
                        <div class="report-comment"><span class="iconify" data-icon="lucide:message-square"></span> ${res.comment || "继续努力！"}</div>
                    </div>`;

                    UI.replacePlaceholder(id, html, 'ai', true);
                    this.state.history.push({role:"assistant", content:html});
                    this.saveHistory('active');

                    // 通关条件：累计进度达到 100% 且本次满分 - 直接结算，不弹窗
                    if(cumulativeFound >= total && score >= 100) {
                        setTimeout(()=>this.finish(true), 1500);
                        return; // 直接返回，不执行后续的结算提示逻辑
                    }

                    // 检查是否可以结算（得分 >= 80 但未满分）
                    if (score >= 80 && !this.state.canSettle) {
                        this.state.canSettle = true;
                        
                        // 首次达到80分（但未满分），1秒后显示结算提示
                        if (!this.state.settlePromptShown) {
                            setTimeout(() => this.showSettlePrompt(), 1000);
                        } else {
                            // 之后只更新按钮状态
                            this.updateSettleButton();
                        }
                    }

                } catch(e) { 
                    console.error(e);
                    UI.replacePlaceholder(id, "评分失败", 'ai'); 
                }
            }
        }, { thinking: true });
    },

    // 新增：结算方法
    settle() {
        if (!this.state.canSettle) return;
        // 提前结算时，评级分数 *= 最高得分/100
        this.finish(true, false, true);
    },

    // 新增：显示结算提示卡片
    showSettlePrompt() {
        if (this.state.settlePromptShown) return;
        this.state.settlePromptShown = true;
        
        // 显示结算按钮
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
    },

    // 新增：显示/隐藏结算按钮
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

    getHint() {
        if(this.state.hintsMax > 0 && this.state.hintsUsed >= this.state.hintsMax) return;
        this.state.hintsUsed++;
        this.updateStats();

        // 获取已猜中和未猜中的要点列表
        const allPoints = this.state.puzzle.key_points || [];
        const foundPoints = this.state.foundPoints || [];
        const unfoundPoints = allPoints.filter(p => !foundPoints.includes(p));

        // 提取用户的提问记录（不包含猜谜评价）
        const askHistory = this.state.history
            .filter(m => m.role === 'user' && m.content.includes('[提问]'))
            .map(m => m.content.replace('[提问] ', ''));

        // 提取之前的提示
        const pastHints = this.state.history
            .filter(m => m.role === 'assistant' && (m.content.includes('💡') || m.content.includes('提示')))
            .map(m => m.content);

        const sys = `谜面：${this.state.puzzle.puzzle}
真相：${this.state.puzzle.answer}

用户已猜中的要点：
${foundPoints.length > 0 ? foundPoints.map((p, i) => `${i + 1}. ${p}`).join('\n') : '（暂无）'}

用户尚未猜中的要点：
${unfoundPoints.length > 0 ? unfoundPoints.map((p, i) => `${i + 1}. ${p}`).join('\n') : '（已全部猜中）'}

用户的提问记录：
${askHistory.length > 0 ? askHistory.slice(-10).map((q, i) => `${i + 1}. ${q}`).join('\n') : '（暂无提问）'}

已提供的提示：
${pastHints.length > 0 ? pastHints.join('\n') : '（暂无）'}

任务：根据用户的提问记录和尚未猜中的要点，给出一句反问式提示，引导用户向未猜中的要点思考。
要求：
1. 不要重复之前的提示
2. 不要提示用户已经猜中的内容
3. 优先引导用户关注尚未猜中的关键要点
4. 根据用户的提问方向，巧妙地引导思考
5. 不要直接透露谜底
6. 只输出提示正文，不要其他内容`;
        
        const hintId = UI.addPlaceholder("正在生成提示...");

        Api.stream(Api.cfg.fastModel, [{role:"system", content:sys}], {
            onThink: () => {},
            onFinish: (txt) => {
                const clean = txt.replace(/<think>[\s\S]*?<\/think>/g,'').trim();
                const hintMsg = `💡 提示：${clean}`;
                UI.replacePlaceholder(hintId, hintMsg, 'ai');
                this.state.history.push({role:"assistant", content:hintMsg});
                this.saveHistory('active');
            }
        }, { thinking: true });
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

    // 修改：finish 方法，支持提前结算的分数折算
    finish(success, isReplay=false, earlySettle=false) {
        if(success && !isReplay) Confetti.start();
        
        const wrap = document.getElementById('inputWrapper');
        wrap.style.opacity = '0';
        setTimeout(() => wrap.style.display = 'none', 300);
        document.getElementById('gameContainer').classList.add('state-over');

        // 移除可能存在的结算提示卡片
        document.getElementById('settlePromptCard')?.remove();

        let rank = 'F';
        let rankColor = 'var(--c-no)';
        let finalScore = 0;
        
        if(success) {
            const base = 100;
            const ded = this.state.turnsUsed * 2;
            let s = Math.max(0, base - ded);
            
            // 提前结算时，分数按最高得分比例折算
            if (earlySettle && this.state.highestScore < 100) {
                s = Math.round(s * (this.state.highestScore / 100));
            }
            
            finalScore = s;
            
            if(s >= 90) { rank = 'S'; rankColor = '#fbbf24'; }
            else if(s >= 80) { rank = 'A'; rankColor = '#a78bfa'; }
            else if(s >= 60) { rank = 'B'; rankColor = 'var(--primary)'; }
            else { rank = 'C'; rankColor = 'var(--c-yes)'; }
        }

        if(!isReplay || !document.querySelector('.inline-result')) {
            const card = document.createElement('div');
            card.className = 'inline-result';
            
            // 显示提前结算信息
            const earlyInfo = earlySettle && this.state.highestScore < 100 
                ? `<div style="font-size:0.8rem; color:var(--text-muted); margin-top:5px;">提前结算 (最高得分 ${this.state.highestScore}%)</div>` 
                : '';
            
            card.innerHTML = `
                <h2>${success ? "🎉 任务完成" : "💀 任务失败"}</h2>
                <div class="score" style="color:${rankColor}">${rank}</div>
                <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">得分: ${finalScore}</div>
                ${earlyInfo}
                <div style="font-size:0.9rem; color:#94a3b8">轮次: ${this.state.turnsUsed} | 提示: ${this.state.hintsUsed}</div>
                <div class="truth-box"><strong>真相：</strong><br>${this.state.puzzle.answer}</div>
                <button class="btn" onclick="Game.backToHome()"><span class="iconify" data-icon="lucide:home"></span> 返回主页</button>
            `;
            document.getElementById('chatList').appendChild(card);
            setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        }

        if(!isReplay) {
            this.state.status = 'completed'; 
            this.saveHistory('completed', rank);
        }
    },

    saveHistory(status, rank='-') {
        const item = {
            id: this.state.startTime,
            title: this.state.puzzle ? this.state.puzzle.title : "未知",
            tags: this.state.tags,
            date: new Date().toLocaleString(),
            status: status,
            rank: rank,
            state: this.state,
            puzzle: this.state.puzzle, 
            answer: this.state.puzzle ? this.state.puzzle.answer : ""
        };
        History.save(item);
    },

    quit() { if(confirm("确定放弃？真相将揭晓。")) this.finish(false); },
    backToHome() {
        if(this.state.status === 'active') this.saveHistory('active');
        location.reload();
    }
};

// ==================== History ====================
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

// ==================== Start ====================
window.onload = () => {
    Api.init();
    Bubble.init();
    History.init();
    Confetti.init(); 

    const handleEnter = (e, isGuess) => {
        if(e.key === 'Enter') {
            if(!isGuess && !e.shiftKey) { e.preventDefault(); Game.send(); }
            if(isGuess && e.ctrlKey) { e.preventDefault(); Game.send(); }
        }
    };
    document.getElementById('inputAsk').addEventListener('keydown', e => handleEnter(e, false));
    document.getElementById('inputGuess').addEventListener('keydown', e => handleEnter(e, true));
};

const Confetti = {
    ctx: null, w:0, h:0, particles:[],
    init() { 
        const c = document.getElementById('confetti'); 
        this.ctx = c.getContext('2d');
        const resize = () => { this.w=c.width=window.innerWidth; this.h=c.height=window.innerHeight; };
        window.onresize = resize; resize();
    },
    start() {
        this.particles = [];
        const cols = ['#38bdf8','#f59e0b','#4ade80','#f87171'];
        for(let i=0; i<150; i++) {
            this.particles.push({
                x: this.w/2, y: this.h/2,
                vx: (Math.random()-0.5)*25, vy: (Math.random()-0.5)*25,
                c: cols[Math.floor(Math.random()*4)], s: Math.random()*6+3, l:1
            });
        }
        this.loop();
    },
    loop() {
        this.ctx.clearRect(0,0,this.w,this.h);
        let active = false;
        this.particles.forEach(p => {
            if(p.l > 0) {
                p.x+=p.vx; p.y+=p.vy; p.vy+=0.5; p.l-=0.02;
                this.ctx.globalAlpha = p.l; this.ctx.fillStyle = p.c;
                this.ctx.fillRect(p.x, p.y, p.s, p.s);
                active = true;
            }
        });
        if(active) requestAnimationFrame(() => this.loop());
    }
};