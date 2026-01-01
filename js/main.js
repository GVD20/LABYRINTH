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
};
