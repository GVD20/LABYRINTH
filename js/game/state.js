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
        lastSettlePromptPoints: 0, // 记录上次显示结算提示时的要点数
        canSettle: false,          // 是否可以结算
        highestScore: 0,           // 历史最高单次得分
        lastInput: "",             // 记录最后一次输入用于重试
        lastMode: "",              // 记录最后一次模式用于重试
        isProcessing: false,       // 标记是否正在处理请求，防止重复提交
        debugEnabled: false        // 是否已开启调试模式
    },

    // 默认页面标题
    defaultTitle: 'Labyrinth | 逻辑迷宫 | AI海龟汤',
};
