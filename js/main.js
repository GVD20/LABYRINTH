window.onload = () => {
    App.init();
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

    // F12 调试信息口令保护
    window.addEventListener('keydown', e => {
        if (e.key === 'F12') {
            if (!Game.state.debugEnabled) {
                const pwd = prompt("请输入调试口令以查看谜题真相:");
                if (pwd === "呜呜呜我是傻逼我不会") {
                    Game.state.debugEnabled = true;
                    Game.debugPrint();
                }
            } else {
                Game.debugPrint();
            }
        }
    });
};
