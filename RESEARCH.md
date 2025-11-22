# SillyTavern & TavernHelper 调研报告

## 概述

本文档总结了对 SillyTavern 核心机制和 TavernHelper (酒馆助手) 扩展的调研成果，作为 Extension Extension V2 项目的技术参考。

---

## SillyTavern 核心机制

### 事件系统 (Event Source)

SillyTavern 提供了基于 `eventSource` 的全局事件总线，所有扩展都可以访问。

**位置**: `@sillytavern/script` 模块

**核心 API**:
- `eventSource.on(event, handler)` - 注册事件监听器
- `eventSource.emit(event, ...args)` - 触发事件
- `eventSource.off(event, handler)` - 移除监听器
- `eventSource.once(event, handler)` - 一次性监听器

**标准事件** (部分):
- `app_ready` - 应用加载完成
- `message_sent` / `message_received` - 消息发送/接收
- `generation_started` / `generation_ended` - 生成开始/结束
- `chat_id_changed` - 聊天切换
- `extensions_first_load` - 扩展首次加载
- `generate_after_data` - 生成数据准备完成（可用于拦截 Prompt）

### 扩展加载机制

**目录结构**:
```
SillyTavern/public/scripts/extensions/
├── extension-name/
│   ├── manifest.json
│   ├── index.js
│   └── index.css (可选)
```

**`manifest.json` 格式**:
```json
{
  "display_name": "扩展名称",
  "loading_order": 100,
  "requires": [],
  "optional": [],
  "js": "index.js",
  "css": "index.css"
}
```

### 扩展 UI 注入

扩展的设置面板需要使用 SillyTavern 的 UI 样式规范：

**关键 CSS 类**:
- `.inline-drawer` - 可折叠面板容器
- `.inline-drawer-toggle` - 折叠按钮
- `.inline-drawer-header` - 标题栏
- `.inline-drawer-content` - 内容区域
- `.inline-drawer-icon` - 折叠图标

**挂载点**: `#extensions_settings` (在设置页面中)

---

## TavernHelper (酒馆助手) 架构分析

### 项目结构

TavernHelper 采用 **Vue 3 + TypeScript + Vite** 技术栈：

```
JS-Slash-Runner/
├── src/
│   ├── function/          # 核心功能模块
│   │   ├── event.ts       # 事件封装
│   │   ├── macro_like.ts  # 宏系统
│   │   ├── generate/      # 生成管道
│   │   └── index.ts       # API 聚合
│   ├── panel/             # UI 面板组件
│   ├── slash_command/     # Slash 命令
│   └── index.ts           # 入口
├── vite.config.ts
└── manifest.json
```

### 核心设计模式

#### 1. 全局 API 暴露

TavernHelper 通过 `window.TavernHelper` 暴露了一个巨大的 API 对象：

```typescript
globalThis.TavernHelper = {
  // 事件系统
  tavern_events,
  iframe_events,
  
  // 宏系统
  registerMacroLike,
  unregisterMacroLike,
  
  // 生成功能
  generate,
  generateRaw,
  stopGenerationById,
  
  // Lorebook, Preset, Variables, etc.
  // ... 数十个其他 API
};
```

**优点**:
- 扩展可以直接通过 `TavernHelper.xxx` 调用功能
- 提供了对 ST 原生功能的高级封装

**借鉴**: Extension Extension V2 应该类似地暴露 `window.ExtensionExtension`。

#### 2. 事件系统封装

TavernHelper 并未重新实现事件总线，而是**封装了 `eventSource`**：

```typescript
// src/function/event.ts
export function _eventOn<T extends EventType>(
  this: Window, 
  event_type: T, 
  listener: ListenerType[T]
): void {
  register_listener.call(this, event_type, listener);
  eventSource.on(event_type, listener);  // 直接使用 ST 原生
}
```

**核心价值**:
- 自动追踪每个扩展注册的监听器（通过 iframe_event_listeners_map）
- 提供 `_eventClearAll` 等清理功能，方便扩展卸载

**借鉴**: V2 的 `ExtensionContext.events` 应该类似地包装 `eventSource`，提供自动清理。

#### 3. 宏系统实现

TavernHelper 使用**正则替换**实现宏：

```typescript
// src/function/macro_like.ts
export interface MacroLike {
  regex: RegExp;
  replace: (context: MacroLikeContext, substring: string, ...args: any[]) => string;
}

export const macros: MacroLike[] = [
  {
    regex: /\{\{(get|format)_(message|chat|character|preset|global)_variable::(.*?)\}\}/gi,
    replace: (context, _substring, action, type, path) => {
      // 从 variables 中提取值
      const variables = get_variables_without_clone({ type, message_id: context.message_id });
      return _.get(variables, _.unescape(path), null);
    },
  },
];

export function registerMacroLike(regex: RegExp, replace: Function) {
  macros.push({ regex, replace });
}
```

**评价**:
- 灵活但底层，需要扩展自己写正则
- 不如 Handlebars 语义化强

**替代方案**: V2 使用 Handlebars，提供更友好的 API。

#### 4. Vite 配置要点

**核心技巧**: 自定义 Resolver 处理 `@sillytavern/*` 导入

```typescript
// vite.config.ts
{
  name: 'sillytavern_resolver',
  enforce: 'pre',
  resolveId(id) {
    if (id.startsWith('@sillytavern/')) {
      return {
        id: path.join(relative_sillytavern_path, id.replace('@sillytavern/', '')).replaceAll('\\', '/') + '.js',
        external: true,
      };
    }
  },
}
```

**效果**:
- 开发时有类型提示
- 构建时不打包 ST 代码，而是映射到相对路径
- 运行时直接使用 ST 的全局对象

**借鉴**: V2 需要类似的配置。

---

## V2 架构决策

基于调研，Extension Extension V2 应该：

### 1. 不重复造轮子

- **事件总线**: 直接使用 `@sillytavern/script` 的 `eventSource`，不引入 `mitt`
- **宏处理**: 依赖 TavernHelper 已有的基础，专注于提供**更简单的 API**

### 2. 填补 TavernHelper 的空白

TavernHelper **没有** 或 **不够强大** 的功能：

#### 配置系统 (Settings Management)
- **问题**: TavernHelper 没有提供统一的配置管理框架
- **V2 方案**: 提供 `context.settings.get/set` API，自动持久化到 `localStorage` 或 ST 的扩展设置

#### 宏注册简化 (Simplified Macro API)
- **问题**: `registerMacroLike` 需要手写正则，门槛高
- **V2 方案**: 
  ```typescript
  context.macros.register('myMacro', (arg1, arg2) => {
    return `Processed: ${arg1}, ${arg2}`;
  });
  // 使用: {{myMacro "hello" "world"}}
  ```

#### 依赖管理 (Dependency Resolution)
- **问题**: 扩展之间的依赖目前靠手动检查
- **V2 方案**: 在 `manifest.json` 定义依赖，Core 自动检查和加载顺序

### 3. 现代化 DX (开发体验)

- **TypeScript 优先**: 提供完整的类型定义
- **React 组件库**: 提供预制 UI 组件（基于 shadcn/ui）
- **Build Tools**: `st-extension build` 一键打包

---

## 关键发现总结

| 方面 | SillyTavern | TavernHelper | V2 策略 |
|------|-------------|--------------|---------|
| **事件系统** | 原生 `eventSource` | 封装 + 清理追踪 | 使用 TH 模式，提供 Context 包装 |
| **宏系统** | 无 | 正则替换 | Handlebars + 简化 API |
| **配置管理** | 无统一方案 | 无 | 提供标准化 API |
| **UI 框架** | jQuery | Vue 3 | React 18 |
| **构建工具** | 手动 | Vite (自定义 Resolver) | Vite + CLI 工具 |

---

## 参考资料

- SillyTavern 源码: [SillyTavern-release](https://github.com/SillyTavern/SillyTavern-release)
- TavernHelper 源码: `/Users/macbookair/Desktop/extension_extension_project/JS-Slash-Runner`
- 事件列表: `JS-Slash-Runner/src/function/event.ts` (Line 118-192)
