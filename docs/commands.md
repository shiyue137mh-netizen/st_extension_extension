# 命令系统 (Commands)

命令系统允许你创建可以在聊天输入框中使用的斜杠命令 (Slash Commands)。

## 什么是斜杠命令？

斜杠命令以 `/` 开头，可以执行特定的操作，如：
- `/help` - 显示帮助信息
- `/clear` - 清空聊天
- `/roll 2d6` - 掷骰子

## 注册命令

### 基本命令

```javascript
ExtensionExtension.registerCommand({
    name: 'hello',
    description: '打个招呼',
    callback: () => {
        return '你好！';
    }
});

// 使用: /hello
```

### 带参数的命令

```javascript
ExtensionExtension.registerCommand({
    name: 'greet',
    description: '向某人打招呼',
    callback: (args) => {
        const name = args.trim() || '朋友';
        return `你好, ${name}！`;
    }
});

// 使用: /greet 张三  → "你好, 张三！"
```

### 异步命令

```javascript
ExtensionExtension.registerCommand({
    name: 'weather',
    description: '查询天气',
    callback: async (args) => {
        const city = args.trim() || 'Beijing';
        const response = await fetch(`/api/weather?city=${city}`);
        const data = await response.json();
        return `${city} 的天气: ${data.weather}`;
    }
});
```

## 命令选项

### 完整的命令配置

```typescript
ExtensionExtension.registerCommand({
    name: string,              // 命令名 (必须)
    description: string,       // 描述 (必须)
    aliases?: string[],        // 别名 (可选)
    callback: (args, message) => string | Promise<string>, // 回调函数 (必须)
    interruptGeneration?: boolean,  // 是否中断 AI 生成 (默认 false)
    purgeMessage?: boolean          // 是否清除命令消息 (默认 false)
});
```

### 示例：带别名的命令

```javascript
ExtensionExtension.registerCommand({
    name: 'roll',
    description: '掷骰子',
    aliases: ['dice', 'r'],  // 可以用 /dice 或 /r
    callback: (args) => {
        const sides = parseInt(args) || 6;
        const result = Math.floor(Math.random() * sides) + 1;
        return `🎲 掷出了 ${result} (1-${sides})`;
    }
});

// 使用: /roll 20
// 或: /dice 20
// 或: /r 20
```

## 高级用法

### 访问消息上下文

```javascript
ExtensionExtension.registerCommand({
    name: 'quote',
    description: '引用上一条消息',
    callback: (args, message) => {
        // message 包含完整的消息对象
        console.log('消息内容:', message);
        
        const ctx = window.SillyTavern.getContext();
        const lastMessage = ctx.chat[ctx.chat.length - 1];
        
        if (lastMessage) {
            return `> ${lastMessage.mes}\n\n${args}`;
        }
        return args;
    }
});
```

### 中断 AI 生成

```javascript
ExtensionExtension.registerCommand({
    name: 'stop',
    description: '停止 AI 生成',
    interruptGeneration: true,  // 执行时中断生成
    callback: () => {
        return 'AI 生成已停止';
    }
});
```

### 不显示命令消息

```javascript
ExtensionExtension.registerCommand({
    name: 'silent',
    description: '静默执行的命令',
    purgeMessage: true,  // 不在聊天中显示命令
    callback: (args) => {
        // 执行某些操作但不显示在聊天中
        console.log('静默执行:', args);
        return '';  // 返回空字符串
    }
});
```

## 参数解析

### 简单参数

```javascript
ExtensionExtension.registerCommand({
    name: 'calc',
    description: '简单计算器',
    callback: (args) => {
        try {
            const result = eval(args);  // 注意: 生产环境应该用安全的解析器
            return `结果: ${result}`;
        } catch (error) {
            return '计算错误';
        }
    }
});

// 使用: /calc 2 + 2  → "结果: 4"
```

### 命名参数

```javascript
function parseNamedArgs(argsString) {
    const args = {

};
    const regex = /(\w+)=([^\s]+)/g;
    let match;
    
    while ((match = regex.exec(argsString)) !== null) {
        args[match[1]] = match[2];
    }
    
    return args;
}

ExtensionExtension.registerCommand({
    name: 'config',
    description: '配置设置',
    callback: (argsString) => {
        const args = parseNamedArgs(argsString);
        
        // /config lang=zh temp=0.8
        console.log('参数:', args);  // { lang: 'zh', temp: '0.8' }
        
        return `配置已更新: ${JSON.stringify(args)}`;
    }
});
```

## 完整示例

### 掷骰命令

```javascript
ExtensionExtension.registerCommand({
    name: 'roll',
    description: '掷骰子 (格式: /roll 2d6+3)',
    aliases: ['dice', 'r'],
    callback: (args) => {
        // 解析掷骰表达式
        const match = args.match(/(\d+)?d(\d+)([+\-]\d+)?/);
        
        if (!match) {
            return '❌ 格式错误。使用: /roll [数量]d[面数][+修正值]';
        }
        
        const count = parseInt(match[1] || '1');
        const sides = parseInt(match[2]);
        const modifier = parseInt(match[3] || '0');
        
        if (count > 100) {
            return '❌ 最多掷100个骰子';
        }
        
        if (sides > 1000) {
            return '❌ 骰子面数不能超过1000';
        }
        
        // 掷骰
        const rolls = [];
        let total = 0;
        
        for (let i = 0; i < count; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;
        }
        
        total += modifier;
        
        // 格式化输出
        let result = `🎲 **掷骰结果**\n`;
        result += `表达式: ${count}d${sides}`;
        if (modifier !== 0) {
            result += ` ${modifier > 0 ? '+' : ''}${modifier}`;
        }
        result += `\n骰子: [${rolls.join(', ')}]`;
        result += `\n总计: **${total}**`;
        
        return result;
    }
});
```

### 提醒命令

```javascript
ExtensionExtension.registerCommand({
    name: 'remind',
    description: '设置提醒 (格式: /remind 10s 消息)',
    callback: (args) => {
        const match = args.match(/^(\d+)(s|m|h)\s+(.+)$/);
        
        if (!match) {
            return '❌ 格式: /remind <时间><单位> <消息>\n单位: s=秒, m=分钟, h=小时';
        }
        
        const amount = parseInt(match[1]);
        const unit = match[2];
        const message = match[3];
        
        // 转换为毫秒
        const multipliers = { s: 1000, m: 60000, h: 3600000 };
        const delay = amount * multipliers[unit];
        
        // 设置定时器
        setTimeout(() => {
            // 发送系统消息
            const ctx = window.SillyTavern.getContext();
            ctx.sendSystemMessage('reminder', `⏰ 提醒: ${message}`);
        }, delay);
        
        return `✅ 提醒已设置: ${amount}${unit} 后提醒你 "${message}"`;
    }
});
```

## 注销命令

```javascript
// 注销不再需要的命令
ExtensionExtension.unregisterCommand('myCommand');
```

## 最佳实践

### 1. 提供帮助信息

```javascript
ExtensionExtension.registerCommand({
    name: 'mycommand',
    description: '完整描述命令的用途和用法',
    callback: (args) => {
        if (!args || args === 'help') {
            return `
**使用方法:**
/mycommand <参数1> <参数2>

**示例:**
/mycommand foo bar

**说明:**
这个命令会做某事...
            `.trim();
        }
        
        // 实际命令逻辑
        return '执行结果';
    }
});
```

### 2. 错误处理

```javascript
ExtensionExtension.registerCommand({
    name: 'api',
    description: '调用 API',
    callback: async (args) => {
        try {
            const response = await fetch(`/api/${args}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            return `✅ 成功: ${JSON.stringify(data)}`;
            
        } catch (error) {
            console.error('[命令错误]', error);
            return `❌ 错误: ${error.message}`;
        }
    }
});
```

### 3. 输入验证

```javascript
ExtensionExtension.registerCommand({
    name: 'settemp',
    description: '设置温度参数',
    callback: (args) => {
        const temp = parseFloat(args);
        
        // 验证输入
        if (isNaN(temp)) {
            return '❌ 请提供有效的数字';
        }
        
        if (temp < 0 || temp > 2) {
            return '❌ 温度必须在 0-2 之间';
        }
        
        // 设置温度
        const ctx = window.SillyTavern.getContext();
        ctx.chatCompletionSettings.temp = temp;
        
        return `✅ 温度已设置为 ${temp}`;
    }
});
```

## API 参考

### registerCommand(config)

注册一个新的斜杠命令。

```typescript
registerCommand(config: {
    name: string;                    // 命令名称
    description: string;             // 命令描述
    aliases?: string[];              // 命令别名
    callback: CommandCallback;        // 回调函数
    interruptGeneration?: boolean;   // 是否中断生成
    purgeMessage?: boolean;          // 是否清除消息
}): void

type CommandCallback = (
    args: string,      // 命令参数
    message?: any      // 消息对象
) => string | Promise<string>
```

### unregisterCommand(name)

注销一个命令。

```typescript
unregisterCommand(name: string): void
```
