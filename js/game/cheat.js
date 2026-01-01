Object.assign(Game, {
    // 调试打印方法
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

    // 作弊工具集
    cheat: {
        showAnswer() {
            if (!Game.state.puzzle) return console.log('谜题未生成');
            console.log('%c📜 完整真相:', 'color: #f87171; font-size: 14px; font-weight: bold;');
            console.log(Game.state.puzzle.answer);
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
    }
});
