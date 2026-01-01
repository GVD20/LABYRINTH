Object.assign(Game, {
    setDiff(d, el) {
        this.state.diff = d;
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        if(el) el.classList.add('active');
        if(d === 'easy') { this.state.turnsMax = 0; this.state.hintsMax = 999; }
        else if(d === 'normal') { this.state.turnsMax = 40; this.state.hintsMax = 5; }
        else { this.state.turnsMax = 25; this.state.hintsMax = 0; }

        const desc = document.getElementById('diffDesc');
        if(d === 'easy') desc.innerHTML = "逻辑直观，线索明显。<br>无限次提问与提示机会。";
        else if(d === 'normal') desc.innerHTML = "标准海龟汤，需要一定的联想力和脑洞。<br>包含40轮提问，5次提示。";
        else desc.innerHTML = "逻辑极度隐晦，包含复杂诡计或心理盲区。<br>仅25轮提问，无提示机会。";
    },

    initNew() {
        if(!Api.cfg.base || !Api.cfg.key || !Api.cfg.storyModel) {
            alert("请先点击右上角设置按钮配置 API Key 和模型");
            Api.open();
            return;
        }
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
        this.state.lastSettlePromptPoints = 0;
        this.state.canSettle = false;
        this.state.highestScore = 0;

        this.setDiff(this.state.diff, document.querySelector('.diff-btn.active'));

        UI.switchPage('page-game');
        this.updatePageTitle('正在构建迷宫...');

        const container = document.getElementById('gameContainer');
        container.className = 'game-container state-init';

        document.getElementById('inputWrapper').style.display = 'flex';
        document.getElementById('inputWrapper').style.opacity = '0';

        document.getElementById('gameTitle').innerText = "正在构建迷宫...";
        document.getElementById('gameTags').innerHTML = this.state.tags.join(' / ') + ` <span class="diff-badge">${this.state.diff}</span>`;
        document.getElementById('chatList').innerHTML = '';
        document.getElementById('gamePuzzle').style.display = 'none';

        const titleRow = document.querySelector('.puzzle-title-row');
        titleRow.classList.remove('has-emoji');
        const existingEmoji = document.getElementById('puzzleEmoji');
        if (existingEmoji) existingEmoji.remove();

        this.updateSettleButton();
        this.updateStats();
        this.setMode('ask');
        UI.SmoothText.init();
        this.TipsCarousel.start();

        this.generate();
    },

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
            onStart: () => { UI.setThinkingState('generating'); },
            onContent: (chunk, fullText) => {
                UI.SmoothText.push(chunk);
                if(fullText.includes('"title":')) UI.PhaseMgr.request(1);
                if(fullText.includes('"puzzle":')) UI.PhaseMgr.request(2);
                if(fullText.includes('"answer":')) UI.PhaseMgr.request(3);
                if(fullText.includes('"key_points":')) {
                    UI.PhaseMgr.request(4);
                    this.TipsCarousel.freeze();
                }
                if (!this.state.titleFound) {
                    const emojiMatch = fullText.match(/"emoji"\s*:\s*"(.+?)"/);
                    const titleMatch = fullText.match(/"title"\s*:\s*"(.*?)"/);
                    if (titleMatch && titleMatch[1]) {
                        this.state.titleFound = true;
                        const emoji = emojiMatch ? emojiMatch[1] : '🎭';
                        this.updateTitleWithEmoji(titleMatch[1], emoji);
                        this.updatePageTitle(titleMatch[1]);
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
                        if (!data.emoji) data.emoji = '🎭';
                        this.applyGeneratedPuzzle(data);
                        if (App.mode === 'multi') {
                            Multiplayer.sendMessage('story_init', JSON.stringify(data));
                            Multiplayer.syncGameState();
                        }
                    } catch(e) {
                        console.error(e);
                        alert("生成格式错误，请检查 API 配置或重试");
                        this.TipsCarousel.stop();
                        this.backToHome();
                    }
                });
            },
            onError: (err) => {
                console.error(err);
                alert("生成失败: " + err.message);
                this.TipsCarousel.stop();
                this.backToHome();
            }
        }, { thinking: true });
    },

    applyGeneratedPuzzle(data) {
        this.state.puzzle = data;
        UI.switchPage('page-game');
        this.updateTitleWithEmoji(data.title, data.emoji, true);
        document.getElementById('gamePuzzle').innerText = data.puzzle;
        document.getElementById('gamePuzzle').style.display = 'block';
        document.getElementById('gameContainer').className = 'game-container state-active';
        document.getElementById('inputWrapper').style.opacity = '1';
        this.state.status = 'active';
        this.saveHistory('active');
        this.updateStats();
        UI.addMsg('sys', '谜题已呈现。请提问/猜谜');
    },

    loadFromHistory(item) {
        const emoji = item.puzzle?.emoji || item.state?.puzzle?.emoji || '🎭';
        this.updatePageTitle(item.title);

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

            setTimeout(() => {
                card.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);

            console.group('%c📚 历史记录 (已完成)', 'color: #94a3b8; font-size: 14px;');
            console.log('标题:', item.title);
            console.log('评级:', item.rank);
            console.log('真相:', item.puzzle?.answer || item.answer);
            console.groupEnd();

            return;
        }

        this.state = JSON.parse(JSON.stringify(item.state));
        if (this.state.lastSettlePromptPoints === undefined) this.state.lastSettlePromptPoints = 0;
        if (this.state.canSettle === undefined) this.state.canSettle = false;
        if (this.state.highestScore === undefined) this.state.highestScore = 0;

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

        this.updateSettleButton();
        UI.addMsg('sys', '存档已恢复，可继续提问。');
        this.updateStats();
        this.setMode('ask');
    },

    finish(success, isReplay=false, earlySettle=false) {
        if(success && !isReplay) Confetti.start();

        const wrap = document.getElementById('inputWrapper');
        wrap.style.opacity = '0';
        setTimeout(() => wrap.style.display = 'none', 300);
        document.getElementById('gameContainer').classList.add('state-over');

        document.getElementById('settlePromptCard')?.remove();

        let rank = 'F';
        let rankColor = 'var(--c-no)';
        let finalScore = 0;

        if(success) {
            const base = 100;
            const ded = this.state.turnsUsed * 2;
            let s = Math.max(0, base - ded);
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
        this.updatePageTitle(null);
        location.reload();
    }
});
