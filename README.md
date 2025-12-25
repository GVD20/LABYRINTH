# LABYRINTH | 逻辑迷宫 | AI驱动的海龟汤游戏

<p align="center">
  <img src="banner.svg" width="800" alt="LABYRINTH Banner">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-GPL--3.0-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/LLM-Powered-orange.svg" alt="LLM Powered">
  <img src="https://img.shields.io/badge/Physics-Engine-green.svg" alt="Physics Engine">
</p>

---

> **探索逻辑的迷宫，还原故事的真相。**

**LABYRINTH** 是一款由大语言模型（LLM）驱动的侧向思维（Lateral Thinking）解谜游戏（海龟汤）。玩家需要通过不断的提问和推理，揭开一个个神秘故事背后的真相。

## ✨ 特性

- 🤖 **LLM 驱动**: 动态生成谜题，智能判定玩家提问，每个故事都是独一无二的。
- 🫧 **物理引擎**: 基于原生 JavaScript 开发的 Bubble Physics Engine，提供丝滑的关键词选择体验。
- ⚙️ **高度自定义**: 支持自定义 API Base URL 和模型，完美适配 DeepSeek, OpenAI, LM Studio 等各种服务。
- 📱 **响应式设计**: 采用磨砂玻璃质感 UI，适配桌面端。
- 🎨 **沉浸式体验**: 精致的动画效果与排版，带你进入逻辑的深渊。

## 🎮 如何开始

1. **访问应用**: [Labyrinth | 逻辑迷宫](https://gvd20.github.io/LABYRINTH/)
2. **配置 API**: 点击首页右上角的设置图标，填写您的 `API Key` 和 `Base URL`，并设置对应模型名称。
3. **选择关键词**: 在首页的气泡池中点击选择 1-4 个感兴趣的关键词。
4. **开始推理**: 
   - **提问模式**: 输入只能用“是/否/无关”回答的问题。
   - **猜谜模式**: 当你确信掌握真相时，输入你的推理。
5. **达成结局**: 还原真相后，系统将根据你的表现进行结算。

## 🤖 推荐配置

为了获得最佳的游戏体验，建议使用以下模型组合：

| 角色 | 推荐模型 | 说明 |
| :--- | :--- | :--- |
| **故事模型 (Reasoning)** | `Deepseek-R1` | 负责生成高质量、逻辑严密的谜题。 |
| **裁判模型 (Chat)** | `Qwen3-30B-A3B` | 负责快速、准确地回答玩家的提问。 |

⚠️如果 **裁判模型 (Chat)** 的参数量较小，建议使用带有Thinking模式的模型，以提高准确度。

## 🛠️ 技术栈

- **核心**: HTML5, CSS3 (Variables, Flexbox, Animations), Vanilla JavaScript
- **图标**: [Iconify](https://iconify.design/)
- **字体**: Noto Sans SC, Noto Serif SC, JetBrains Mono
- **物理**: Bubble Physics Engine

## 📄 开源协议

本项目采用 [GPL-3.0 License](LICENSE) 协议。

