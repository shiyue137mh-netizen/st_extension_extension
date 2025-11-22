# 快速开始

Extension Extension V2 是一个 **monorepo架构** 的扩展框架，为 SillyTavern 扩展开发提供现代化工具和API。

## 项目架构

```
extension-extension/
├── packages/
│   ├── core/              # 核心框架 (打包为 extension-extension)
│   │   ├── src/
│   │   │   ├── managers/  # 管理器：依赖、宏、命令、作用域等
│   │   │   ├── ui/        # React UI 组件
│   │   │   └── index.ts   # 暴露的公共 API
│   │   ├── manifest.json  # SillyTavern 扩展清单
│   │   └── vite.config.ts # Vite 构建配置
│   ├── build-tools/       # 构建工具 CLI
│   └── ui/                # 共享 UI 组件库
├── examples/              # 示例扩展项目
│   └── basic-extension/   # 基础扩展示例
└── docs/                  # 开发者文档
```

## 创建新扩展

### 方式 1: 使用示例模板（推荐）

复制 `examples/basic-extension` 作为起点：

```bash
cd SillyTavern/public/scripts/extensions/
cp -r /path/to/extension-extension/examples/basic-extension my-extension
cd my-extension
pnpm install
pnpm run build
```

### 方式 2: 手动创建

#### 1. 创建扩展目录和 manifest.json

```bash
mkdir -p SillyTavern/public/scripts/extensions/my-extension
cd my-extension
```

创建 `manifest.json`:

```json
{
    "display_name": "My Extension",
    "loading_order": 100,
    "requires": [],
    "optional": []
}
```

#### 2. 创建 index.js

```javascript
// 从 extension-extension 导入 API
// 注意：路径是相对于 SillyTavern/public/scripts/extensions/
import { ExtensionExtension } from '../extension-extension/dist/index.js';

console.log('[My Extension] 开始加载...');

// 可选：等待 Extension Extension 完全初始化
ExtensionExtension.on('ready', () => {
    console.log('[My Extension] Extension Extension 已就绪');
    
    // 注册宏
    ExtensionExtension.registerMacro('{{mygreeting}}', (args) => {
        return `你好, ${args || '世界'}！`;
    });
    
    // 注册命令
    ExtensionExtension.registerCommand({
        name: 'hello',
        description: '打个招呼',
        callback: (args) => {
            return `你好, ${args || '朋友'}！`;
        }
    });
});

console.log('[My Extension] 加载完成');
```

#### 3. 在 SillyTavern 中启用

1. 刷新 SillyTavern (Cmd/Ctrl + Shift + R)
2. 进入扩展管理
3. 启用你的扩展

## 使用公共依赖库

Extension Extension 提供了 **30+ 预注册的 CDN 库**，包括：

### 工具库
- `axios` - HTTP 客户端
- `lodash` - JavaScript 工具函数
- `dayjs` / `luxon` - 日期时间处理

### UI 和动画
- `sweetalert2` - 美观的弹窗
- `anime` - 动画库
- `howler` - 音频管理

### 游戏和可视化
- `phaser` - 2D 游戏引擎
- `three` - 3D 图形
- `leaflet` - 交互式地图
- `d3` / `cytoscape` - 数据可视化

### 已预加载（SillyTavern 自带）
- `fontawesome` - Font Awesome 图标
- `jquery` - jQuery
- `bootstrap` - Bootstrap

### 使用方法

#### 方法 1: UI 界面加载

1. 打开 Extension Extension 管理器
2. 进入"依赖"标签
3. 搜索并点击"加载"
4. 启用"自动加载"开关（可选）

####方法 2: 编程加载

```javascript
const depManager = window.ExtensionExtension.dependencyManager;

// 加载单个库
if (!window.axios) {
    await depManager.load('axios');
}

// 使用
const response = await window.axios.get('/api/data');

// 批量加载
await depManager.loadMultiple(['axios', 'lodash', 'dayjs']);
```

## 注册宏

```javascript
// 简单宏
ExtensionExtension.registerMacro('{{timestamp}}', () => {
    return new Date().toISOString();
});

// 带参数的宏
ExtensionExtension.registerMacro('{{dice}}', (args) => {
    const sides = parseInt(args) || 6;
    return Math.floor(Math.random() * sides) + 1;
});
// 使用: {{dice::20}} → 1-20的随机数

// 异步宏
ExtensionExtension.registerMacro('{{weather}}', async (args) => {
    const city = args || 'Beijing';
    const data = await fetch(`/api/weather?city=${city}`).then(r => r.json());
    return `${city}: ${data.temp}°C`;
});
```

## 注册命令

```javascript
// 简单命令
ExtensionExtension.registerCommand({
    name: 'time',
    description: '显示当前时间',
    callback: () => {
        return new Date().toLocaleString();
    }
});
// 使用: /time

// 带参数的命令
ExtensionExtension.registerCommand({
    name: 'roll',
    description: '掷骰子',
    aliases: ['r', 'dice'],  // 别名
    callback: (args) => {
        const sides = parseInt(args) || 6;
        const result = Math.floor(Math.random() * sides) + 1;
        return `🎲 ${result} (1-${sides})`;
    }
});
// 使用: /roll 20  或  /r 20  或  /dice 20
```

## 角色绑定

将扩展绑定到特定角色：

```javascript
const scopeManager = window.ExtensionExtension.scopeManager;

// 绑定到当前角色
const currentChar = ExtensionExtension.st.currentCharacterName;
scopeManager.bindToCharacter('my-extension', currentChar);

// 检查是否绑定
const bindings = scopeManager.getBindings('my-extension');
console.log('绑定的角色:', bindings);

// 解绑
scopeManager.unbindFromCharacter('my-extension', currentChar);
```

也可以通过 UI 界面操作：
1. 打开 Extension Extension 管理器
2. 进入"扩展"标签
3. 选择角色后点击"绑定当前"

## 完整示例

查看 `examples/basic-extension/` 获取完整的工作示例。

## 下一步

- [依赖管理](./dependencies.md) - 深入了解依赖系统
- [宏系统](./macros.md) - 宏的高级用法
- [命令系统](./commands.md) - 命令的高级用法
- [API 参考](./api-reference.md) - 完整 API 文档

## 故障排除

### 扩展未加载

1. 确保 Extension Extension 已启用
2. 检查 `manifest.json` 格式
3. 查看浏览器控制台错误
4. 确认文件路径正确

### 依赖加载失败

1. 检查网络连接
2. 确认 CDN 可访问
3. 在"依赖"页面查看状态
4. 查看控制台错误信息

### 获取更多帮助

- 查看 [完整文档](./README.md)
- 提交 [GitHub Issue](https://github.com/your-repo/issues)
