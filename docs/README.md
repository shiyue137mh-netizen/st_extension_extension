# Extension Extension V2 - 开发者文档

欢迎来到 Extension Extension V2 开发者文档！

## 📚 文档导航

### 入门指南
- [快速开始](./getting-started.md) - 创建你的第一个扩展
- [项目结构](./project-structure.md) - 了解项目组织方式
- [开发环境设置](./dev-setup.md) - 配置开发工具

### 核心概念
- [扩展注册](./extension-registration.md) - 如何注册和配置扩展
- [生命周期](./lifecycle.md) - 扩展的加载和卸载过程
- [事件系统](./events.md) - 扩展间通信

### 功能模块
- [宏系统](./macros.md) - 创建和使用宏
- [命令系统](./commands.md) - 注册斜杠命令
- [依赖管理](./dependencies.md) - 使用和注册外部库
- [UI 组件](./ui-components.md) - 创建 UI 界面
- [角色绑定](./character-binding.md) - 实现角色特定功能

### API 参考
- [ExtensionExtension API](./api-reference.md) - 完整 API 文档
- [类型定义](./types.md) - TypeScript 类型定义
- [工具函数](./utilities.md) - 实用工具方法

### 高级主题
- [性能优化](./performance.md) - 提升扩展性能
- [安全最佳实践](./security.md) - 安全编码指南
- [测试](./testing.md) - 编写和运行测试
- [发布](./publishing.md) - 发布你的扩展

### 示例和教程
- [示例扩展](../examples/) - 完整的示例项目
- [常见模式](./patterns.md) - 常用开发模式
- [故障排除](./troubleshooting.md) - 常见问题解答

## 🚀 快速链接

### 我想...

- **创建一个简单扩展** → [快速开始](./getting-started.md)
- **添加一个命令** → [命令系统](./commands.md)
- **创建自定义宏** → [宏系统](./macros.md)
- **使用外部库** → [依赖管理](./dependencies.md)
- **绑定到特定角色** → [角色绑定](./character-binding.md)
- **构建 UI 界面** → [UI 组件](./ui-components.md)

## 💡 核心特性速览

### 依赖管理
```javascript
// 加载依赖
await window.ExtensionExtension.dependencyManager.load('axios');

// 使用依赖
const response = await window.axios.get('/api/data');
```

### 宏系统
```javascript
// 注册宏
ExtensionExtension.registerMacro('{{myMacro}}', (args) => {
    return `宏的输出: ${args}`;
});
```

### 命令系统
```javascript
// 注册命令
ExtensionExtension.registerCommand({
    name: 'mycommand',
    description: '我的命令',
    callback: (args) => {
        return `命令执行: ${args}`;
    }
});
```

### 角色绑定
```javascript
// 绑定到角色
const scopeManager = window.ExtensionExtension.scopeManager;
scopeManager.bindToCharacter('my-extension', '角色名');
```

## 📖 学习路径

### 初学者
1. 阅读 [快速开始](./getting-started.md)
2. 查看 [示例扩展](../examples/basic-extension/)
3. 学习 [宏系统](./macros.md)
4. 尝试 [命令系统](./commands.md)

### 中级开发者
1. 深入了解 [依赖管理](./dependencies.md)
2. 学习 [角色绑定](./character-binding.md)
3. 探索 [事件系统](./events.md)
4. 查看 [API 参考](./api-reference.md)

### 高级开发者
1. 研究 [性能优化](./performance.md)
2. 实现 [自定义 UI](./ui-components.md)
3. 贡献 [核心功能](../CONTRIBUTING.md)

## 🛠️ 开发工具

- **VSCode 插件** - 代码提示和自动补全
- **Chrome DevTools** - 调试工具
- **React DevTools** - UI 调试

## 🤝 获取帮助

- **GitHub Issues** - 报告 bug 或提建议
- **GitHub Discussions** - 技术讨论和问答
- **Discord** - 实时聊天和社区支持

## 📝 文档贡献

发现文档问题？欢迎提交 PR！

1. Fork 仓库
2. 编辑 `docs/` 中的 Markdown 文件
3. 提交 Pull Request

## 🔄 版本历史

- **V2.0.0** (Current) - 完全重写，React UI，现代化架构
- **V1.x** - 旧版本，已废弃

## 📜 许可证

本项目基于 [MIT License](../LICENSE) 开源。

---

**Happy Coding! 🎉**

如果有任何问题，欢迎在 [Issues](https://github.com/your-username/extension-extension/issues) 中提问！
