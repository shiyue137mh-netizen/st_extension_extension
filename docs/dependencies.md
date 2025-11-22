# 依赖管理

Extension Extension 提供了强大的依赖管理系统，让你可以轻松使用和共享外部JavaScript库。

## 概述

依赖管理系统的核心优势：

- ✅ **CDN 加载** - 从CDN动态加载库，无需打包
- ✅ **全局共享** - 一次加载，所有扩展共享，节省内存
- ✅ **自动加载** - 支持设置自动加载，启动时自动加载指定库
- ✅ **版本锁定** - 使用固定版本URL，确保稳定性

## 预注册的库

Extension Extension 预先注册了以下 **30+ 常用库**，专为剧情模拟和游戏开发优化：

### 基础工具库

| 库名 | 全局变量 | 描述 |
|------|---------|------|
| **react** | `React` | React 框架 (已内置) |
| **axios** | `axios` | HTTP 客户端 |
| **lodash** | `_` | JavaScript 工具库 |
| **dayjs** | `dayjs` | 轻量级日期时间库 |
| **luxon** | `luxon` | 现代化日期时间库，支持时区 |
| **marked** | `marked` | Markdown 解析器 |
| **showdown** | `showdown` | Markdown 转 HTML |
| **dompurify** | `DOMPurify` | XSS 防护库 |
| **zod** | `z` | 数据验证库 |

### UI 和动画

| 库名 | 全局变量 | 描述 |
|------|---------|------|
| **vue** | `Vue` | Vue 3 框架 |
| **pinia** | `Pinia` | Vue 3 状态管理 |
| **sweetalert2** | `Swal` | 美观的弹窗提示 |
| **toastify** | `Toastify` | Toast 通知库 |
| **anime** | `anime` | JavaScript 动画库 |

### 游戏和可视化

| 库名 | 全局变量 | 描述 |
|------|---------|------|
| **phaser** | `Phaser` | 2D 游戏引擎 |
| **three** | `THREE` | 3D 图形库 |
| **howler** | `Howler` | 音频管理库 |
| **leaflet** | `L` | 交互式地图（世界观/场景） |
| **d3** | `d3` | 数据可视化（关系图、技能树） |
| **cytoscape** | `cytoscape` | 图论可视化（角色关系图） |
| **chart.js** | `Chart` | 图表绘制库 |

### 数据处理

| 库名 | 全局变量 | 描述 |
|------|---------|------|
| **fuse** | `Fuse` | 模糊搜索库 |
| **papaparse** | `Papa` | CSV 解析工具 |
| **jszip** | `JSZip` | ZIP 文件操作 |
| **localforage** | `localforage` | 统一本地存储 API |

### 随机和生成

| 库名 | 全局变量 | 描述 |
|------|---------|------|
| **seedrandom** | `seedrandom` | 可重复随机数生成器 |
| **chance** | `Chance` | 随机内容生成（名字、文本等） |

### 其他工具

| 库名 | 全局变量 | 描述 |
|------|---------|------|
| **sortablejs** | `Sortable` | 拖放排序库 |
| **validator** | `validator` | 字符串验证库 |
| **clipboard.js** | `ClipboardJS` | 剪贴板操作 |
| **highlight.js** | `hljs` | 代码高亮 |
| **katex** | `katex` | 数学公式渲染 |

### SillyTavern 预加载

| 库名 | 全局变量 | 描述 |
|------|---------|------|
| **fontawesome** | `FontAwesome` | Font Awesome 图标 ✅ 默认可用 |
| **jquery** | `$` | jQuery 库 ✅ 默认可用 |
| **bootstrap** | `bootstrap` | Bootstrap 框架 ✅ 默认可用 |

## 使用已注册的库

### 方法 1: UI 界面加载（推荐）

1. 打开 Extension Extension 管理器
2. 进入 `依赖` 标签页
3. 找到需要的库，点击 `加载` 按钮
4. (可选) 启用 `自动加载` 开关，下次启动时自动加载

### 方法 2: 编程方式加载

```javascript
// 检查库是否已加载
if (!window.axios) {
    // 加载库
    await window.ExtensionExtension.dependencyManager.load('axios');
}

// 使用库
const response = await window.axios.get('/api/data');
```

### 方法 3: 在 manifest.json 中声明依赖

```json
{
    "display_name": "My Extension",
    "requires": [],
    "optional": [],
    "ee_dependencies": ["axios",  "lodash"] // Extension Extension 依赖
}
```

然后在代码中直接使用：

```javascript
// Extension Extension 会在加载扩展前确保这些库已加载
const _ = window._;
const axios = window.axios;
```

## 注册自定义库

### UI 界面注册

1. 打开 `依赖` 页面
2. 点击 `+ 添加自定义` 按钮
3. 填写库信息：
   - **名称**: 库的标识符 (如 `moment`)
   - **CDN URL**: 库的 CDN 链接
   - **全局变量名**: 库在 window 上的变量名 (如 `moment`)
   - **描述**: 简短的功能描述

### 编程方式注册

```javascript
const depManager = window.ExtensionExtension.dependencyManager;

depManager.register(
    'moment',                                           // 名称
    'https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js', // URL
    'moment',                                           // 全局变量
    '强大的日期时间处理库'                                 // 描述 (可选)
);

// 注册后即可加载
await depManager.load('moment');

// 使用
const now = window.moment().format('YYYY-MM-DD');
```

## 自动加载

设置某个库为自动加载后，Extension Extension 会在启动时自动加载它:

```javascript
const depManager = window.ExtensionExtension.dependencyManager;

// 启用自动加载
depManager.setAutoload('axios', true);

// 禁用自动加载
depManager.setAutoload('axios', false);
```

自动加载状态会保存在 SillyTavern 设置中，下次启动时自动恢复。

## 最佳实践

### 1. 优先使用已注册的库

Extension Extension 已经注册了许多常用库，优先使用这些库而不是自己打包，可以：
- 减小扩展体积
- 提高加载速度
- 与其他扩展共享依赖

### 2. 使用版本锁定的 CDN URL

```javascript
// ✅ 好 - 使用固定版本
'https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js'

// ❌ 差 - 使用 latest
'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js'
```

### 3. 检查加载状态

```javascript
const depManager = window.ExtensionExtension.dependencyManager;

// 检查是否已加载
if (depManager.isLoaded('axios')) {
    console.log('Axios 已加载');
} else {
    await depManager.load('axios');
}
```

### 4. 批量加载

```javascript
const depManager = window.ExtensionExtension.dependencyManager;

// 一次加载多个库
await depManager.loadMultiple(['axios', 'lodash', 'dayjs']);
```

## API 参考

### DependencyManager

#### `register(name, url, globalName, description?)`

注册一个新的依赖库。

```typescript
register(
    name: string,           // 库名
    url: string,            // CDN URL
    globalName: string,     // window 上的变量名
    description?: string    // 描述（可选）
): void
```

#### `load(name)`

加载一个已注册的库。

```typescript
load(name: string): Promise<any>
```

#### `loadMultiple(names)`

批量加载多个库。

```typescript
loadMultiple(names: string[]): Promise<any[]>
```

#### `setAutoload(name, autoload)`

设置库的自动加载状态。

```typescript
setAutoload(name: string, autoload: boolean): void
```

#### `isLoaded(name)`

检查库是否已加载。

```typescript
isLoaded(name: string): boolean
```

#### `getAllDependencies()`

获取所有已注册的库。

```typescript
getAllDependencies(): Dependency[]
```

## 示例

### 使用 Axios 发送请求

```javascript
// 确保 axios 已加载
const depManager = window.ExtensionExtension.dependencyManager;
if (!window.axios) {
    await depManager.load('axios');
}

// 使用 axios
async function fetchCharacterData(characterId) {
    try {
        const response = await window.axios.get(`/api/characters/${characterId}`);
        return response.data;
    } catch (error) {
        console.error('获取角色数据失败:', error);
        throw error;
    }
}
```

### 使用 Lodash 处理数据

```javascript
// 加载 lodash
const depManager = window.ExtensionExtension.dependencyManager;
await depManager.load('lodash');

const _ = window._;

// 数组去重
const uniqueItems = _.uniq([1, 2, 2, 3, 4, 4, 5]);

// 深拷贝
const cloned = _.cloneDeep(complexObject);

// 分组
const grouped = _.groupBy(users, 'role');
```

### 使用 DOMPurify 清理 HTML

```javascript
// 加载 DOMPurify
await window.ExtensionExtension.dependencyManager.load('dompurify');

const DOMPurify = window.DOMPurify;

// 清理用户输入的 HTML
function sanitizeHTML(dirty) {
    return DOMPurify.sanitize(dirty);
}

// 安全地插入 HTML
function insertSafeHTML(element, html) {
    element.innerHTML = sanitizeHTML(html);
}
```

## 故障排除

### 库加载失败

如果库加载失败，检查：

1. **网络连接** - 确保能访问 CDN
2. **URL 正确性** - 检查 CDN URL 是否有效
3. **CORS 问题** - 某些 CDN 可能有跨域限制
4. **控制台错误** - 查看浏览器控制台的详细错误信息

### 版本冲突

如果多个扩展需要同一个库的不同版本：

1. 协商使用兼容的版本
2. 或者在扩展内部打包特定版本
3. 使用命名空间避免全局变量冲突

### 性能优化

- 只加载真正需要的库
- 使用自动加载避免重复手动加载
- 考虑库的大小，优先使用轻量级替代品
