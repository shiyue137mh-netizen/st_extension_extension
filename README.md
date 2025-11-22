# Extension Extension V2

<div align="center">

**强大的 SillyTavern 扩展框架，让扩展开发更简单、更高效**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![SillyTavern](https://img.shields.io/badge/SillyTavern-Compatible-blue)](https://github.com/SillyTavern/SillyTavern)

[English](./README.en.md) | 简体中文

</div>

## ✨ 特性

### 🎯 核心功能

- **🔧 扩展管理** - 统一管理所有 SillyTavern 扩展，支持启用/禁用、搜索过滤
- **🎭 角色绑定** - 将扩展绑定到特定角色，实现角色切换时的自动启用/禁用
- **📦 依赖管理** - 30+ CDN 依赖库自动加载和共享，包括 React、Vue、Phaser、Three.js 等
- **🛠️ 开发框架** - 提供宏系统、命令注册、UI 注入等开发工具

### 🎨 用户界面

- **现代化设计** - 精美的 Glassmorphism 风格 UI
- **响应式布局** - 完美适配各种屏幕尺寸
- **中文本地化** - 完整的中文界面支持
- **流畅动画** - Framer Motion 驱动的平滑过渡效果

### 🚀 开发体验

- **TypeScript 优先** - 完整的类型定义和 IDE 支持
- **React 18** - 使用最新的 React 特性构建 UI
- **Monorepo 架构** - pnpm workspace + Vite 构建系统
- **热更新** - 开发时自动部署到 SillyTavern

## 📥 安装

### 直接使用（推荐 - 用户）

1. 下载本仓库：
```bash
git clone https://github.com/shiyue137mh-netizen/st_extension_extension.git
```

2. 复制预编译文件到 SillyTavern：
```bash
# 复制整个 dist 文件夹
cp -r st_extension_extension/packages/core/dist \
  /path/to/SillyTavern/public/scripts/extensions/extension-extension
```

3. 刷新 SillyTavern，启用扩展即可使用！

### 开发模式（开发者）

```bash
cd st_extension_extension
pnpm install
pnpm run build

# 配置自动部署
cp local-config.example.json local-config.json
# 编辑 local-config.json，设置你的 SillyTavern 路径

# 开发模式（自动热更新）
pnpm run dev
```

## 🎮 使用方法

### 打开管理器

点击 SillyTavern 扩展设置中的 **Extension Extension** 面板，点击"🧩 打开管理面板"按钮。

### 管理扩展

- **启用/禁用** - 点击扩展卡片右侧的开关
- **角色绑定** - 选择角色后，点击 `绑定当前` 按钮
- **搜索过滤** - 使用搜索栏快速找到扩展

### 管理依赖

1. 进入 `依赖` 标签页
2. 点击 `加载` 按钮加载所需的库
3. 启用 `自动加载` 开关，下次启动时自动加载

**可用库**：axios、lodash、Vue、Phaser、Three.js、Leaflet、D3、Howler 等 30+ 个库

## 🛠️ 开发指南

详细的开发文档请查看 [docs](./docs/) 目录：

- [快速开始](./docs/getting-started.md) - 创建你的第一个扩展
- [依赖管理](./docs/dependencies.md) - 使用和注册外部库
- [宏系统](./docs/macros.md) - 注册和使用宏命令
- [命令系统](./docs/commands.md) - 创建斜杠命令

### 快速开始示例

```javascript
// 从 extension-extension 导入 API
import { ExtensionExtension } from '../extension-extension/dist/index.js';

// 注册宏
ExtensionExtension.registerMacro('{{myMacro}}', () => {
    return '宏的输出内容';
});

// 注册命令
ExtensionExtension.registerCommand({
    name: 'mycommand',
    description: '我的命令',
    callback: (args) => {
        return `命令执行: ${args}`;
    }
});
```

## 🏗️ 项目结构

```
st_extension_extension/
├── packages/
│   ├── core/              # 核心框架
│   │   ├── src/           # 源代码
│   │   ├── dist/          # ✨ 预编译文件（用户直接使用）
│   │   │   ├── manifest.json
│   │   │   ├── index.js
│   │   │   └── style.css
│   │   └── manifest.json  # 指向 dist/ 的清单
│   ├── build-tools/       # 构建工具
│   └── ui/                # 共享 UI 组件
├── examples/              # 示例扩展
├── docs/                  # 开发者文档
└── README.md
```

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详情。

## 📜 许可证

本项目基于 [MIT License](./LICENSE) 开源。

## 🙏 致谢

- [SillyTavern](https://github.com/SillyTavern/SillyTavern) - 强大的 AI 聊天平台
- [React](https://react.dev/) - UI 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Lucide](https://lucide.dev/) - 图标库

## 📞 联系方式

- **GitHub**: [shiyue137mh-netizen/st_extension_extension](https://github.com/shiyue137mh-netizen/st_extension_extension)
- **Issues**: [GitHub Issues](https://github.com/shiyue137mh-netizen/st_extension_extension/issues)

---

<div align="center">
Made with ❤️ for the SillyTavern community
</div>
