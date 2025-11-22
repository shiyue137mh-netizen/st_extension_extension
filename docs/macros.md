# 宏系统 (Macros)

宏系统允许你创建可以在聊天消息中动态替换的文本占位符。

## 什么是宏？

宏是用双花括号 `{{}}` 包裹的特殊标记，在消息发送前会被替换成实际内容。

例如：
- `{{char}}` - 当前角色名称
- `{{user}}` - 用户名称
- `{{time}}` - 当前时间

## 注册宏

### 基本用法

```javascript
ExtensionExtension.registerMacro('{{myMacro}}', () => {
    return '宏的输出内容';
});
```

### 带参数的宏

```javascript
ExtensionExtension.registerMacro('{{greet}}', (args) => {
    // args 是传递给宏的参数
    const name = args || '朋友';
    return `你好, ${name}！`;
});

// 使用: {{greet::张三}}  → "你好, 张三！"
// 使用: {{greet}}       → "你好, 朋友！"
```

### 异步宏

```javascript
ExtensionExtension.registerMacro('{{weather}}', async (args) => {
    const city = args || 'Beijing';
    const response = await fetch(`/api/weather?city=${city}`);
    const data = await response.json();
    return `${city} 的天气: ${data.weather}，温度: ${data.temp}°C`;
});
```

## 高级用法

### 访问上下文信息

```javascript
ExtensionExtension.registerMacro('{{charInfo}}', () => {
    const ctx = window.SillyTavern.getContext();
    const charName = ctx.name2;
    const chatId = ctx.chatId;
    
    return `角色: ${charName}, 对话ID: ${chatId}`;
});
```

### 条件宏

```javascript
ExtensionExtension.registerMacro('{{isEvening}}', () => {
    const hour = new Date().getHours();
    if (hour >= 18) {
        return '晚上好';
    } else if (hour >= 12) {
        return '下午好';
    } else {
        return '早上好';
    }
});
```

### 随机选择宏

```javascript
ExtensionExtension.registerMacro('{{randomGreeting}}', () => {
    const greetings = ['你好', 'Hi', 'Hello', '嗨', 'Hey'];
    const random = Math.floor(Math.random() * greetings.length);
    return greetings[random];
});
```

## 宏命名规范

- 使用小写字母和下划线
- 使用描述性名称
- 避免与内置宏冲突

```javascript
//✅ 好的命名
{{my_custom_macro}}
{{character_mood}}
{{random_quote}}

// ❌ 差的命名
{{macro1}}
{{temp}}
{{x}}
```

## 内置宏参考

Extension Extension 扩展了 SillyTavern 的宏系统，以下是一些有用的内置宏：

| 宏 | 描述 | 示例输出 |
|---|------|---------|
| `{{char}}` | 当前角色名 | Alice |
| `{{user}}` | 用户名 | 小明 |
| `{{time}}` | 当前时间 | 14:30 |
| `{{date}}` | 当前日期 | 2024-03-15 |
| `{{random::a::b::c}}` | 随机选择 | a 或 b 或 c |

## 完整示例

```javascript
// 创建一个骰子宏
ExtensionExtension.registerMacro('{{roll}}', (args) => {
    // 参数格式: dice (如 "2d6" 表示掷两个6面骰)
    const match = (args || '1d6').match(/(\d+)d(\d+)/);
    
    if (!match) {
        return '无效的骰子格式。使用格式如: {{roll::2d6}}';
    }
    
    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    
    let total = 0;
    const rolls = [];
    
    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
    }
    
    return `🎲 掷骰: ${rolls.join(' + ')} = ${total}`;
});

// 使用示例:
// {{roll::2d6}}  → "🎲 掷骰: 4 + 3 = 7"
// {{roll::3d20}} → "🎲 掷骰: 15 + 8 + 12 = 35"
```

## 调试宏

```javascript
ExtensionExtension.registerMacro('{{debug}}', (args) => {
    console.log('[宏调试]', args);
    console.log('[上下文]', window.SillyTavern.getContext());
    return `调试信息已输出到控制台`;
});
```

## 注销宏

```javascript
// 注销不再需要的宏
ExtensionExtension.unregisterMacro('{{myMacro}}');
```

## 最佳实践

1. **错误处理** - 宏应该优雅地处理错误
```javascript
ExtensionExtension.registerMacro('{{safeAPI}}', async () => {
    try {
        const data = await fetchAPI();
        return data.result;
    } catch (error) {
        console.error('[宏错误]', error);
        return '[API 调用失败]';
    }
});
```

2. **性能考虑** - 避免在宏中执行耗时操作
```javascript
// ❌ 差 - 每次都重新计算
ExtensionExtension.registerMacro('{{heavy}}', () => {
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
        result += Math.random();
    }
    return result;
});

// ✅ 好 - 使用缓存
let cachedResult = null;
ExtensionExtension.registerMacro('{{cached}}', () => {
    if (!cachedResult) {
        cachedResult = performHeavyCalculation();
    }
    return cachedResult;
});
```

3. **用户友好的输出** - 提供有意义的默认值和错误消息

```javascript
ExtensionExtension.registerMacro('{{userData}}', (args) => {
    if (!args) {
        return '[请提供用户ID: {{userData::user123}}]';
    }
    
    const user = getUserData(args);
    if (!user) {
        return `[未找到用户: ${args}]`;
    }
    
    return user.name;
});
```
