export type Language = 'zh-CN' | 'en-US';

export const translations = {
    'zh-CN': {
        // Manager Title
        'manager.title': 'Extension Extension 管理器',

        // Sidebar
        'sidebar.dashboard': 'Dashboard',
        'sidebar.extensions': '扩展',
        'sidebar.frameworks': '框架',
        'sidebar.dependencies': '依赖',
        'sidebar.settings': '设置',

        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.subtitle': 'Extension Extension 状态概览',
        'dashboard.extensions': '已加载扩展',
        'dashboard.frameworks': '活跃框架',
        'dashboard.dependencies': '已加载依赖',
        'dashboard.frameworkStatus': '框架状态',
        'dashboard.noFrameworks': '尚未加载框架',
        'dashboard.quickActions': '快速操作',
        'dashboard.loadVue': '加载 Vue 3',
        'dashboard.loadReact': '加载 React 18',
        'dashboard.loadAllDeps': '加载全部依赖',

        // Extensions
        'extensions.title': '扩展管理',
        'extensions.subtitle': '管理已加载扩展',
        'extensions.activeCount': '个已激活',
        'extensions.register': '注册扩展',
        'extensions.registerTitle': '注册新扩展',
        'extensions.extensionId': '扩展 ID',
        'extensions.extensionIdPlaceholder': '例如: my-custom-extension',
        'extensions.extensionIdHint': '使用扩展调用 Extension Extension API 时使用的相同 ID',
        'extensions.cancel': '取消',
        'extensions.registerButton': '注册',
        'extensions.noExtensions': '暂无已注册扩展',
        'extensions.noExtensionsDesc': '当扩展使用 Extension Extension API 注册后，将出现在此处',
        'extensions.registerFirst': '注册第一个扩展',
        'extensions.statusActive': '激活',
        'extensions.disable': '禁用',
        'extensions.enable': '启用',
        'extensions.remove': '移除',
        'extensions.removeConfirm': '确定要移除扩展 "%s" 吗？这将删除所有作用域绑定。',
        'extensions.scopeBindings': '作用域绑定',
        'extensions.infoTitle': '扩展管理',
        'extensions.info1': '使用 Extension Extension API 的扩展将自动注册',
        'extensions.info2': '启用/禁用：无需卸载即可全局切换扩展',
        'extensions.info3': '作用域绑定：将扩展绑定到特定角色/聊天的高级功能（即将推出）',

        // Frameworks
        'frameworks.title': '框架管理',
        'frameworks.subtitle': '管理 Framework 插件和 API 状态',
        'frameworks.coreApi': '核心 API',
        'frameworks.macros': '宏系统',
        'frameworks.macrosDesc': '文本处理宏注册',
        'frameworks.commands': '命令系统',
        'frameworks.commandsDesc': '斜杠命令注册',
        'frameworks.registered': '已注册',
        'frameworks.registeredFrameworks': '已注册 Frameworks',
        'frameworks.noFrameworks': '暂无已注册 Framework',
        'frameworks.active': '运行中',
        'frameworks.inactive': '已停止',
        'frameworks.openSettings': '打开设置',
        'frameworks.infoText': 'ℹ️ Frameworks 可以注册自己的管理面板。点击"打开设置"查看 Framework 的图形化配置界面。',

        // Dependencies
        'dependencies.title': '依赖管理',
        'dependencies.subtitle': '管理共享外部库',
        'dependencies.loaded': '已加载',
        'dependencies.addCustom': '添加自定义',
        'dependencies.loadAll': '加载全部',
        'dependencies.addCustomTitle': '添加自定义依赖',
        'dependencies.packageName': '包名',
        'dependencies.packageNamePlaceholder': '例如: zod',
        'dependencies.cdnUrl': 'CDN URL',
        'dependencies.cdnUrlPlaceholder': 'https://cdn.jsdelivr.net/npm/...',
        'dependencies.globalVar': '全局变量名',
        'dependencies.globalVarPlaceholder': '例如: zod (window.zod)',
        'dependencies.cancel': '取消',
        'dependencies.add': '添加依赖',
        'dependencies.load': '加载',
        'dependencies.viewCdn': '查看 CDN',
        'dependencies.infoText': 'ℹ️ 共享依赖从 CDN 加载，全局可用于所有扩展。这避免了重复加载并减少了打包大小。',

        // Settings
        'settings.title': '设置',
        'settings.subtitle': 'Extension Extension 配置',
        'settings.language': '语言',
        'settings.languageDesc': '选择界面显示语言',
        'settings.theme': '主题',
        'settings.themeDesc': '自定义界面外观（即将推出）',

        // Common
        'common.version': '版本',
        'common.author': '作者',
        'common.description': '描述',
        'common.loading': '加载中...',
        'common.success': '成功',
        'common.error': '错误',
    },
    'en-US': {
        // Manager Title
        'manager.title': 'Extension Extension Manager',

        // Sidebar
        'sidebar.dashboard': 'Dashboard',
        'sidebar.extensions': 'Extensions',
        'sidebar.frameworks': 'Frameworks',
        'sidebar.dependencies': 'Dependencies',
        'sidebar.settings': 'Settings',

        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.subtitle': 'Overview of Extension Extension status',
        'dashboard.extensions': 'Loaded Extensions',
        'dashboard.frameworks': 'Active Frameworks',
        'dashboard.dependencies': 'Loaded Dependencies',
        'dashboard.frameworkStatus': 'Framework Status',
        'dashboard.noFrameworks': 'No frameworks loaded yet',
        'dashboard.quickActions': 'Quick Actions',
        'dashboard.loadVue': 'Load Vue 3',
        'dashboard.loadReact': 'Load React 18',
        'dashboard.loadAllDeps': 'Load All Dependencies',

        // Extensions
        'extensions.title': 'Extensions',
        'extensions.subtitle': 'Manage loaded extensions',
        'extensions.activeCount': 'active',
        'extensions.register': 'Register Extension',
        'extensions.registerTitle': 'Register New Extension',
        'extensions.extensionId': 'Extension ID',
        'extensions.extensionIdPlaceholder': 'e.g., my-custom-extension',
        'extensions.extensionIdHint': 'Use the same ID that the extension uses when calling Extension Extension API',
        'extensions.cancel': 'Cancel',
        'extensions.registerButton': 'Register',
        'extensions.noExtensions': 'No Extensions Registered',
        'extensions.noExtensionsDesc': 'Extensions will appear here when they register with Extension Extension API',
        'extensions.registerFirst': 'Register First Extension',
        'extensions.statusActive': 'Active',
        'extensions.disable': 'Disable',
        'extensions.enable': 'Enable',
        'extensions.remove': 'Remove',
        'extensions.removeConfirm': 'Remove extension "%s"? This will remove all scope bindings.',
        'extensions.scopeBindings': 'Scope Bindings',
        'extensions.infoTitle': 'Extension Management',
        'extensions.info1': 'Extensions using Extension Extension API will auto-register',
        'extensions.info2': 'Enable/Disable: Toggle extensions globally without uninstalling',
        'extensions.info3': 'Scope Bindings: Advanced feature to bind extensions to specific characters/chats (coming soon)',

        // Frameworks
        'frameworks.title': 'Frameworks',
        'frameworks.subtitle': 'Manage Framework plugins and API status',
        'frameworks.coreApi': 'Core API',
        'frameworks.macros': 'Macro System',
        'frameworks.macrosDesc': 'Text processing macro registration',
        'frameworks.commands': 'Command System',
        'frameworks.commandsDesc': 'Slash command registration',
        'frameworks.registered': 'Registered',
        'frameworks.registeredFrameworks': 'Registered Frameworks',
        'frameworks.noFrameworks': 'No registered Frameworks',
        'frameworks.active': 'Active',
        'frameworks.inactive': 'Inactive',
        'frameworks.openSettings': 'Open Settings',
        'frameworks.infoText': 'ℹ️ Frameworks can register their own management panels. Click "Open Settings" to view Framework graphical configuration interface.',

        // Dependencies
        'dependencies.title': 'Dependencies',
        'dependencies.subtitle': 'Manage shared external libraries',
        'dependencies.loaded': 'loaded',
        'dependencies.addCustom': 'Add Custom',
        'dependencies.loadAll': 'Load All',
        'dependencies.addCustomTitle': 'Add Custom Dependency',
        'dependencies.packageName': 'Package Name',
        'dependencies.packageNamePlaceholder': 'e.g., zod',
        'dependencies.cdnUrl': 'CDN URL',
        'dependencies.cdnUrlPlaceholder': 'https://cdn.jsdelivr.net/npm/...',
        'dependencies.globalVar': 'Global Variable Name',
        'dependencies.globalVarPlaceholder': 'e.g., zod (window.zod)',
        'dependencies.cancel': 'Cancel',
        'dependencies.add': 'Add Dependency',
        'dependencies.load': 'Load',
        'dependencies.viewCdn': 'View CDN',
        'dependencies.infoText': 'ℹ️ Shared dependencies are loaded from CDN and available globally for all extensions. This avoids duplicate loading and reduces bundle sizes.',

        // Settings
        'settings.title': 'Settings',
        'settings.subtitle': 'Extension Extension Configuration',
        'settings.language': 'Language',
        'settings.languageDesc': 'Select interface display language',
        'settings.theme': 'Theme',
        'settings.themeDesc': 'Customize interface appearance (coming soon)',

        // Common
        'common.version': 'Version',
        'common.author': 'Author',
        'common.description': 'Description',
        'common.loading': 'Loading...',
        'common.success': 'Success',
        'common.error': 'Error',
    },
};

class I18nManager {
    private currentLanguage: Language = 'zh-CN';
    private listeners: Set<() => void> = new Set();

    constructor() {
        // Load saved language preference
        const saved = localStorage.getItem('ee_language');
        if (saved && (saved === 'zh-CN' || saved === 'en-US')) {
            this.currentLanguage = saved;
        }
    }

    /**
     * Get current language
     */
    getLanguage(): Language {
        return this.currentLanguage;
    }

    /**
     * Set language
     */
    setLanguage(lang: Language) {
        this.currentLanguage = lang;
        localStorage.setItem('ee_language', lang);
        this.notifyListeners();
    }

    /**
     * Translate a key
     */
    t(key: string, ...args: any[]): string {
        const langData = translations[this.currentLanguage] as Record<string, string>;
        let text = langData[key] || key;

        // Simple placeholder replacement (%s)
        args.forEach(arg => {
            text = text.replace('%s', String(arg));
        });

        return text;
    }

    /**
     * Subscribe to language changes
     */
    subscribe(callback: () => void) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    private notifyListeners() {
        this.listeners.forEach(cb => cb());
    }
}

export const i18n = new I18nManager();

// React hook for i18n
export function useTranslation() {
    const [, setUpdate] = React.useState(0);

    React.useEffect(() => {
        return i18n.subscribe(() => setUpdate(prev => prev + 1));
    }, []);

    return {
        t: i18n.t.bind(i18n),
        language: i18n.getLanguage(),
        setLanguage: i18n.setLanguage.bind(i18n),
    };
}

// Add React import
import React from 'react';
