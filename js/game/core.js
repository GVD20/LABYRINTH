Object.assign(Game, {
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
        if(this.state.isProcessing) return;
        const input = this.mode === 'ask' ? document.getElementById('inputAsk') : document.getElementById('inputGuess');
        const val = input.value.trim();
        if(!val) return;
        if(this.state.turnsMax > 0 && this.state.turnsUsed >= this.state.turnsMax) return;

        this.state.isProcessing = true;
        input.value = '';

        this.state.lastInput = val;
        this.state.lastMode = this.mode;

        UI.addMsg(this.mode==='ask'?'user-ask':'user-guess', val);
        this.state.history.push({role:"user", content: this.mode==='ask' ? `[提问] ${val}` : `[猜谜] ${val}`});

        if (App.mode === 'multi') {
            Multiplayer.sendMessage('chat', (this.mode==='ask' ? '[提问] ' : '[猜谜] ') + val);
        }

        this.state.turnsUsed++;
        this.updateStats();

        if(this.mode === 'ask') this.handleAsk(val);
        else this.handleGuess(val);

        if(this.state.turnsMax > 0 && this.state.turnsUsed >= this.state.turnsMax) {
            setTimeout(()=>this.finish(false), 2000);
        }
    },

    retry(btn = null) {
        if(!this.state.lastInput || this.state.isProcessing) return;

        const lastMsg = document.querySelector('#chatList .msg:last-child');
        if(!lastMsg || !lastMsg.classList.contains('msg-system-error')) {
            return;
        }

        this.state.isProcessing = true;

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `<span class="iconify" data-icon="lucide:loader-2" style="animation: spin 1s linear infinite"></span> 重试中...`;
        }

        lastMsg.remove();

        const val = this.state.lastInput;
        const id = UI.addPlaceholder(this.state.lastMode === 'ask' ? "分析中..." : "裁判正在评估...");

        if(this.state.lastMode === 'ask') this.handleAsk(val, id);
        else this.handleGuess(val, id);
    },

    handleAsk(q, existingId = null) {
        const sys = `你是一个海龟汤裁判。
        【谜面】：${this.state.puzzle.puzzle}
        【真相】：${this.state.puzzle.answer}

        任务：根据真相回答用户的提问 "${q}"。

        判定准则（优先级从高到低）：
        1. 【真相至上】：真相是客观世界的唯一准则。如果谜面描述与真相冲突，必须以真相为准。
        2. 【逻辑推断】：进行合理的常识推断（如：死在室内 -> 尸体在室内）。
        3. 【区分主客观】：客观事实以真相为准；角色主观感知（如幻觉）与真相矛盾时，可回答"是也不是"。
        4. 【回答限制】：只能回答：是、不是、无关、是也不是。
           - "是/不是"：用于事实明确且与谜题逻辑相关的情况。
           - "无关"：如果问题涉及的细节在真相中未提及，且对还原真相没有任何帮助（如天气、颜色、无关背景等），必须回答"无关"。不要试图猜测真相未定义的细节。
           - "是也不是"：用于问题存在前提错误、部分正确、或涉及主观错觉。
        5. 【严禁剧透】：严禁透露任何真相细节。

        必须返回JSON格式：{"res": "你的回答"}`;

        const id = existingId || UI.addPlaceholder("分析中...");

        Api.stream(Api.cfg.fastModel, [{role:"system", content:sys}], {
            onFinish: (txt) => {
                this.state.isProcessing = false;
                try {
                    const j = JSON.parse(txt.replace(/```json|```/g,''));
                    if (App.mode === 'multi') {
                        Multiplayer.sendMessage('chat', j.res);
                        Multiplayer.syncGameState();
                        UI.replacePlaceholder(id, null);
                    } else {
                        UI.replacePlaceholder(id, j.res, 'ai');
                        this.state.history.push({role:"assistant", content:j.res});
                    }
                    this.saveHistory('active');
                } catch(e) {
                    UI.replacePlaceholder(id, `解析错误: ${e.message}`, 'system-error', true);
                }
            },
            onError: (err) => {
                this.state.isProcessing = false;
                UI.replacePlaceholder(id, `系统错误 (${err.message})`, 'system-error', true);
            }
        }, { thinking: true });
    },

    handleGuess(g, existingId = null) {
        const kps = JSON.stringify(this.state.puzzle.key_points);
        const sys = `你是一个海龟汤裁判。
        【谜面】：${this.state.puzzle.puzzle}
        【真相】：${this.state.puzzle.answer}
        【真相要点表】：${kps}

        任务：分析用户猜测 "${g}"。

        判定规则：
        1. 【语义匹配】：不要死板地进行字面匹配。如果用户表达的意思与要点一致（即使措辞不同），也应判定为猜中。
        2. 【要点提取】：
           - matched_segments: 用户猜测中与真相吻合的原文片段。
           - wrong_segments: 用户猜测中与真相明显矛盾、或完全错误的原文片段。
           - achieved_points: 对应真相要点表中的要点原文。必须是用户已经实质性猜中的要点。
        3. 【严禁幻觉】：如果用户只是在提问或进行模糊的假设，没有明确的推理结论，不要强行关联要点。
        4. 【评价准则】：comment 应简短（15字以内），评价用户的推理逻辑（如：方向正确、细节有误、脑洞大开等），严禁透露任何未猜中的真相细节。

        返回JSON格式：
        {
            "matched_segments": [],
            "wrong_segments": [],
            "achieved_points": [],
            "comment": ""
        }
        注意：matched_segments 和 wrong_segments 必须是用户输入文本 "${g}" 的子串。`;

        const id = existingId || UI.addPlaceholder("裁判正在评估...");

        Api.stream(Api.cfg.fastModel, [{role:"system", content:sys}], {
            onThink: () => {},
            onFinish: (txt) => {
                this.state.isProcessing = false;
                try {
                    const clean = txt.replace(/```json/g,'').replace(/```/g,'').replace(/<think>[\s\S]*?<\/think>/g,'');
                    const res = JSON.parse(clean);

                    const thisRoundMatched = (res.achieved_points || []).length;

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

                    if (score > this.state.highestScore) {
                        this.state.highestScore = score;
                    }

                    let htmlText = this.applyHighlights(g, res.matched_segments || [], res.wrong_segments || []);

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
                                <span style="font-size:0.8rem;color:#94a3b8">本轮匹配 ${thisRoundMatched}/${total}</span>
                                ${errorInfo}
                            </div>
                        </div>
                        <div class="report-body">${htmlText}</div>
                        <div class="report-comment"><span class="iconify" data-icon="lucide:message-square"></span> ${res.comment || "继续努力！"}</div>
                    </div>`;

                    if (App.mode === 'multi') {
                        Multiplayer.sendMessage('chat', html);
                        Multiplayer.syncGameState();
                        UI.replacePlaceholder(id, null);
                    } else {
                        UI.replacePlaceholder(id, html, 'ai', true);
                        this.state.history.push({role:"assistant", content:html});
                    }
                    this.saveHistory('active');

                    if(cumulativeFound >= total && score >= 100) {
                        setTimeout(()=>this.finish(true), 1500);
                        return;
                    }

                    if (score >= 80) {
                        this.state.canSettle = true;
                        if (this.state.foundPoints.length > this.state.lastSettlePromptPoints) {
                            setTimeout(() => this.showSettlePrompt(), 1000);
                        } else {
                            this.updateSettleButton();
                        }
                    }

                } catch(e) {
                    UI.replacePlaceholder(id, `解析错误: ${e.message}`, 'system-error', true);
                }
            },
            onError: (err) => {
                this.state.isProcessing = false;
                UI.replacePlaceholder(id, `系统错误 (${err.message})`, 'system-error', true);
            }
        }, { thinking: true });
    },

    applyHighlights(text, matchedSegments, wrongSegments) {
        const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const findAllOccurrences = (text, segment) => {
            const positions = [];
            let idx = 0;
            while ((idx = text.indexOf(segment, idx)) !== -1) {
                positions.push({ start: idx, end: idx + segment.length });
                idx++;
            }
            return positions;
        };
        const mergeIntervals = (intervals) => {
            if (intervals.length === 0) return [];
            intervals.sort((a, b) => a.start - b.start);
            const merged = [intervals[0]];
            for (let i = 1; i < intervals.length; i++) {
                const last = merged[merged.length - 1];
                const curr = intervals[i];
                if (curr.start <= last.end) {
                    last.end = Math.max(last.end, curr.end);
                } else {
                    merged.push(curr);
                }
            }
            return merged;
        };

        let okIntervals = [];
        let noIntervals = [];
        matchedSegments.forEach(seg => { okIntervals = okIntervals.concat(findAllOccurrences(text, seg)); });
        wrongSegments.forEach(seg => { noIntervals = noIntervals.concat(findAllOccurrences(text, seg)); });

        okIntervals = mergeIntervals(okIntervals);
        noIntervals = mergeIntervals(noIntervals);

        const subtractIntervals = (base, subtract) => {
            const result = [];
            base.forEach(b => {
                let current = [{ start: b.start, end: b.end }];
                subtract.forEach(s => {
                    const newCurrent = [];
                    current.forEach(c => {
                        if (s.end <= c.start || s.start >= c.end) {
                            newCurrent.push(c);
                        } else {
                            if (c.start < s.start) newCurrent.push({ start: c.start, end: s.start });
                            if (c.end > s.end) newCurrent.push({ start: s.end, end: c.end });
                        }
                    });
                    current = newCurrent;
                });
                result.push(...current);
            });
            return mergeIntervals(result);
        };

        okIntervals = subtractIntervals(okIntervals, noIntervals);

        const marks = [];
        okIntervals.forEach(i => {
            marks.push({ pos: i.start, type: 'ok-start' });
            marks.push({ pos: i.end, type: 'ok-end' });
        });
        noIntervals.forEach(i => {
            marks.push({ pos: i.start, type: 'no-start' });
            marks.push({ pos: i.end, type: 'no-end' });
        });

        marks.sort((a, b) => {
            if (a.pos !== b.pos) return a.pos - b.pos;
            const order = { 'ok-end': 0, 'no-end': 1, 'ok-start': 2, 'no-start': 3 };
            return order[a.type] - order[b.type];
        });

        let result = '';
        let lastPos = 0;
        let inOk = false;
        let inNo = false;

        marks.forEach(m => {
            if (m.pos > lastPos) {
                const segment = escapeHtml(text.slice(lastPos, m.pos));
                if (inNo) result += `<span class="hl-no">${segment}</span>`;
                else if (inOk) result += `<span class="hl-ok">${segment}</span>`;
                else result += segment;
            }
            lastPos = m.pos;
            if (m.type === 'ok-start') inOk = true;
            else if (m.type === 'ok-end') inOk = false;
            else if (m.type === 'no-start') inNo = true;
            else if (m.type === 'no-end') inNo = false;
        });

        if (lastPos < text.length) {
            const segment = escapeHtml(text.slice(lastPos));
            if (inNo) result += `<span class="hl-no">${segment}</span>`;
            else if (inOk) result += `<span class="hl-ok">${segment}</span>`;
            else result += segment;
        }
        return result;
    },

    settle() {
        if (!this.state.canSettle) return;
        this.finish(true, false, true);
    },

    getHint() {
        if(this.state.isProcessing) return;
        if(this.state.hintsMax > 0 && this.state.hintsUsed >= this.state.hintsMax) return;

        this.state.isProcessing = true;
        this.state.hintsUsed++;
        this.updateStats();

        const allPoints = this.state.puzzle.key_points || [];
        const foundPoints = this.state.foundPoints || [];
        const unfoundPoints = allPoints.filter(p => !foundPoints.includes(p));

        const askHistory = this.state.history
            .filter(m => m.role === 'user' && m.content.includes('[提问]'))
            .map(m => m.content.replace('[提问] ', ''));

        const pastHints = this.state.history
            .filter(m => m.role === 'assistant' && (m.content.includes('💡') || m.content.includes('提示')))
            .map(m => m.content);

        const sys = `你是一个海龟汤引导者。
        【谜面】：${this.state.puzzle.puzzle}
        【真相】：${this.state.puzzle.answer}

        【用户已猜中】：
        ${foundPoints.length > 0 ? foundPoints.map((p, i) => `${i + 1}. ${p}`).join('\n') : '（暂无）'}

        【用户尚未猜中】：
        ${unfoundPoints.length > 0 ? unfoundPoints.map((p, i) => `${i + 1}. ${p}`).join('\n') : '（已全部猜中）'}

        【近期提问记录】：
        ${askHistory.length > 0 ? askHistory.slice(-5).map((q, i) => `${i + 1}. ${q}`).join('\n') : '（暂无）'}

        任务：给出一句反问式的提示，引导用户思考尚未猜中的要点。

        要求：
        1. 【渐进式引导】：不要直接说出答案，也不要提示得太明显。通过反问激发用户的侧向思维。
        2. 【关联性】：优先结合用户最近的提问方向进行引导。如果用户跑偏了，巧妙地将其拉回。
        3. 【不重复】：严禁重复已有的提示或已猜中的内容。
        4. 【简洁】：只输出提示正文，不带任何前缀（如"提示："），字数控制在30字以内。`;

        const hintId = UI.addPlaceholder("正在生成提示...");

        Api.stream(Api.cfg.fastModel, [{role:"system", content:sys}], {
            onThink: () => {},
            onFinish: (txt) => {
                this.state.isProcessing = false;
                const clean = txt.replace(/<think>[\s\S]*?<\/think>/g,'').trim();
                const hintMsg = `💡 提示：${clean}`;
                UI.replacePlaceholder(hintId, hintMsg, 'ai');
                this.state.history.push({role:"assistant", content:hintMsg});
                this.saveHistory('active');
            },
            onError: (err) => {
                this.state.isProcessing = false;
                UI.replacePlaceholder(hintId, `获取提示失败 (${err.message})`, 'system-error', true);
            }
        }, { thinking: true });
    }
});
