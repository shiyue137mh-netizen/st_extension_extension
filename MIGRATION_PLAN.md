# Extension Extension V2 - 功能迁移计划

## 老版功能清单

根据对 `/extension-extension` 的分析，以下是需要迁移的功能：

### 核心功能 (已迁移 ✓)

| 功能 | 老版实现 | V2 状态 | 说明 |
|------|---------|--------|------|
| **EventEmitter** | 自定义事件系统 | ✓ 已升级 | V2 直接使用 `@sillytavern/script` 的 `eventSource` |
| **FrameworkLoader** | 动态加载 Vue/React CDN | ✓ 保留 | V2 Core 已内置 React，可选择性保留 Vue 加载器 |
| **DependencyManager** | CDN 依赖管理 | ✓ 保留 | 可保留，但优先使用 npm 依赖 |
| **Slash Commands** | `/ee-load-vue`, `/ee-status` | ⚠️ 待迁移 | 需要在 V2 中重新注册 |

### UI 相关功能

| 功能 | 老版实现 | V2 状态 | 说明 |
|------|---------|--------|------|
| **设置面板** | HTML 模板 + jQuery | ⚠️ 待完善 | V2 已有 `SettingsPanel.tsx`，但未正确挂载 |
| **绑定管理面板** | `BindingPanelManager` + HTML | ❌ 未迁移 | 用于管理扩展与角色的绑定关系 |
| **扩展元数据** | `setExtensionMetadata` | ✓ 已有 | V2 通过 `SettingsManager` 实现 |

### 高级功能

| 功能 | 老版实现 | V2 状态 | 说明 |
|------|---------|--------|------|
| **作用域绑定** | `ScopeManager` | ❌ 未迁移 | 允许扩展只对特定角色生效 |
| **自定义加载动画** | `LoaderCustomizer` | 🚫 不迁移 | 用户要求跳过 |
| **动态扩展加载** | `ExtensionLoader` | ❌ 未迁移 | 支持运行时加载/卸载扩展 |
| **编译器管理** | `CompilerManager` | ❌ 未迁移 | 用途不明，需确认 |

---

## 迁移优先级

### Phase 1: 修复核心问题 (当前)

1. **✅ 修复设置面板挂载**
   - **问题**: React UI 未自动挂载
   - **原因**: `UIManager.mount()` 未被调用
   - **方案**: 在 `index.ts` 中主动调用 `uiManager.mount()`

2. **待做：重新实现设置项**
   - 迁移老版的配置选项（自动加载框架、调试模式等）
   - 使用 React 组件替代 HTML 模板

### Phase 2: 核心功能完善

3. **作用域绑定系统 (ScopeManager)**
   - **功能**: 允许扩展绑定到特定角色/聊天
   - **重要性**: ⭐⭐⭐⭐ (很多用户依赖此功能)
   - **方案**:
     ```typescript
     // V2 实现
     interface ScopeManager {
       bindToCharacter(extensionId: string, characterId: string): void;
       unbind(extensionId: string, targetId: string): void;
       isActive(extensionId: string, currentCharacterId: string): boolean;
     }
     ```

4. **扩展绑定管理面板**
   - **功能**: 可视化管理扩展绑定关系
   - **方案**: 使用 React + 酒馆助手的 UI 组件重写
   - **依赖**: 需要先完成 `ScopeManager`

### Phase 3: 高级特性

5. **动态扩展加载器 (ExtensionLoader)**
   - **功能**: 运行时加载/卸载扩展，无需刷新页面
   - **重要性**: ⭐⭐⭐ (提升开发体验)
   - **方案**: 拦截 SillyTavern 的扩展加载流程

6. **Slash Commands**
   - 重新注册老版的斜杠命令
   - 添加新的 V2 专有命令（如 `/ee-context`）

---

## 老版设置面板结构分析

### HTML 模板 (`ui/settings/settings.html`)

```html
<div id="plugin_framework_settings">
    <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>Extension Extension</b>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            <!-- 配置项 -->
            <input id="pf_enabled" type="checkbox" />
            <input id="pf_auto_load_vue" type="checkbox" />
            <!-- ... 更多配置 -->
        </div>
    </div>
</div>
```

### jQuery 绑定逻辑 (`index.js:444-596`)

```javascript
async function loadSettings() {
    // 1. 渲染模板
    const settingsHtml = await renderExtensionTemplateAsync(MODULE_NAME, 'ui/settings/settings');
    $('#extensions_settings2').append(settingsHtml);

    // 2. 绑定事件
    $('#pf_enabled').prop('checked', extension_settings.extensionExtension.enabled)
        .on('change', function () {
            extension_settings.extensionExtension.enabled = $(this).prop('checked');
            saveSettingsDebounced();
        });
    // ... 更多绑定
}

// 3. 初始化时调用
jQuery(async () => {
    await loadSettings();
});
```

### V2 对应实现

**问题**: V2 的 `SettingsPanel.tsx` 已经实现，但未正确挂载到 `#extensions_settings`。

**修复方案**:

```typescript
// packages/core/src/managers/UIManager.tsx
export class UIManager {
    mount() {
        // 1. 等待 DOM 加载
        const mountUI = () => {
            const container = document.getElementById('extensions_settings');
            if (!container) {
                console.warn('[UIManager] #extensions_settings not found, retrying...');
                setTimeout(mountUI, 100);
                return;
            }

            // 2. 创建挂载点
            const root = document.createElement('div');
            root.id = 'extension-extension-ui-root';
            container.appendChild(root);

            // 3. 挂载 React
            const reactRoot = createRoot(root);
            reactRoot.render(<App />);
        };

        // 初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', mountUI);
        } else {
            mountUI();
        }
    }
}
```

---

## 行动计划

### 本次迭代 (立即执行)

1. ✅ **创建本文档** (`MIGRATION_PLAN.md`)
2. **修复 UIManager 挂载逻辑**
   - 检查 `index.ts` 是否调用了 `uiManager.mount()`
   - 修复 `UIManager.mount()` 的等待逻辑
3. **测试设置面板显示**
   - 部署到 SillyTavern
   - 确认在扩展设置页面中正确显示

### 下一迭代

4. **完善设置面板内容**
   - 添加所有老版配置项
   - 实现保存/加载逻辑
5. **实现 ScopeManager**
6. **创建绑定管理面板**

### 后续迭代

7. **动态扩展加载器**
8. **Slash Commands**
9. **文档和示例**

---

## 不迁移的功能

- **自定义加载动画** (`LoaderCustomizer`): 用户明确表示跳过
- **编译器管理** (`CompilerManager`):用途不明，待确认需求后决定

---

## 参考

- 老版源码: `/Users/macbookair/Desktop/extension_extension_project/extension-extension`
- V2 源码: `/Users/macbookair/Desktop/extension_extension_project/new_extension_extension`
