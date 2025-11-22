import React from 'react';

export interface Dependency {
    name: string;
    url: string;
    globalName: string;
    loaded: boolean;
    description?: string; // Add description field
    autoload?: boolean; // Whether to auto-load on startup
}

export class DependencyManager {
    private dependencies: Map<string, Dependency> = new Map();
    private loadingPromises: Map<string, Promise<any>> = new Map();

    constructor() {
        console.log('[DependencyManager] Initialized');

        // Detect and register bundled libraries (already loaded in our bundle)
        this.detectBundledLibraries();

        // Register common CDN dependencies with descriptions
        this.register('axios', 'https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js', 'axios',
            '基于 Promise 的 HTTP 客户端，支持浏览器和 Node.js');

        this.register('lodash', 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js', '_',
            '强大的 JavaScript 工具库，提供数组、对象、函数等实用方法');

        this.register('dayjs', 'https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js', 'dayjs',
            '轻量级日期时间处理库，Moment.js 的替代品');

        this.register('vue', 'https://cdn.jsdelivr.net/npm/vue@3.4.21/dist/vue.global.prod.js', 'Vue',
            'Vue 3 前端框架，用于构建动态 UI 组件');

        this.register('marked', 'https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js', 'marked',
            'Markdown 解析器，将 Markdown 转换为 HTML');

        this.register('dompurify', 'https://cdn.jsdelivr.net/npm/dompurify@3.0.9/dist/purify.min.js', 'DOMPurify',
            'XSS 防护库，清理 HTML 防止脚本注入');

        this.register('zod', 'https://cdn.jsdelivr.net/npm/zod@3.22.4/index.min.js', 'z',
            'TypeScript 优先的数据验证库');

        this.register('fuse', 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js', 'Fuse',
            '轻量级模糊搜索库，适合客户端搜索');

        this.register('sortablejs', 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js', 'Sortable',
            '拖放排序库，支持拖拽重排元素');

        this.register('chart.js', 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js', 'Chart',
            '强大的图表绘制库，支持多种图表类型');

        // UI 和样式库
        this.register('animate.css', 'https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css', 'undefined',
            'CSS 动画库，提供开箱即用的动画效果（加载后直接使用 CSS 类）');

        this.register('sweetalert2', 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js', 'Swal',
            '美观的弹窗提示库，替代原生 alert');

        this.register('toastify', 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.js', 'Toastify',
            '轻量级 Toast 通知库');

        // 数据处理
        this.register('papaparse', 'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js', 'Papa',
            'CSV 解析和序列化工具');

        this.register('jszip', 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js', 'JSZip',
            '创建和读取 ZIP 文件');

        this.register('localforage', 'https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js', 'localforage',
            '统一的本地存储 API，supports IndexedDB、WebSQL、localStorage');

        // 工具类
        this.register('validator', 'https://cdn.jsdelivr.net/npm/validator@13.11.0/validator.min.js', 'validator',
            '字符串验证和消毒库');

        this.register('clipboard.js', 'https://cdn.jsdelivr.net/npm/clipboard@2.0.11/dist/clipboard.min.js', 'ClipboardJS',
            '现代化的剪贴板操作库');

        // 状态管理
        this.register('pinia', 'https://cdn.jsdelivr.net/npm/pinia@2.1.7/dist/pinia.iife.js', 'Pinia',
            'Vue 3 状态管理库，轻量级的 Vuex 替代品');

        // 地图和可视化
        this.register('leaflet', 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js', 'L',
            '交互式地图库，适合世界观地图、场景地图展示');

        this.register('d3', 'https://cdn.jsdelivr.net/npm/d3@7.8.5/dist/d3.min.js', 'd3',
            '强大的数据可视化库，可用于关系图、技能树等');

        this.register('cytoscape', 'https://cdn.jsdelivr.net/npm/cytoscape@3.28.1/dist/cytoscape.min.js', 'cytoscape',
            '图论可视化库，适合角色关系图、剧情分支图');

        // 游戏引擎和动画
        this.register('phaser', 'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.js', 'Phaser',
            '2D 游戏引擎，适合制作小游戏、互动场景');

        this.register('howler', 'https://cdn.jsdelivr.net/npm/howler@2.2.4/dist/howler.min.js', 'Howler',
            '音频库，支持背景音乐、音效管理');

        this.register('anime', 'https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js', 'anime',
            'JavaScript 动画库，创建流畅的UI动画');

        this.register('three', 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js', 'THREE',
            '3D 图形库，可用于 3D 场景、角色模型展示');

        // 文本处理和渲染
        this.register('showdown', 'https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js', 'showdown',
            'Markdown 转 HTML 转换器');

        this.register('highlight.js', 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/index.min.js', 'hljs',
            '代码高亮库');

        this.register('katex', 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js', 'katex',
            '数学公式渲染库');

        // 随机和生成
        this.register('seedrandom', 'https://cdn.jsdelivr.net/npm/seedrandom@3.0.5/seedrandom.min.js', 'seedrandom',
            '可重复的随机数生成器，适合程序化生成内容');

        this.register('chance', 'https://cdn.jsdelivr.net/npm/chance@1.1.11/dist/chance.min.js', 'Chance',
            '随机内容生成器（名字、地址、文本等）');

        // 时间和日期
        this.register('luxon', 'https://cdn.jsdelivr.net/npm/luxon@3.4.4/build/global/luxon.min.js', 'luxon',
            '现代化日期时间库，支持时区、国际化');

        // Load dependencies that are set to autoload
        this.loadAutoloadDependencies();
    }

    /**
     * Detect libraries that are bundled with extension-extension and expose them globally
     */
    private detectBundledLibraries(): void {
        // React is bundled in our code - expose it globally
        (window as any).React = React;
        this.dependencies.set('react', {
            name: 'react',
            url: 'bundled',
            globalName: 'React',
            loaded: true
        });
        console.log('[DependencyManager] Exposed bundled React');

        // ReactDOM is also bundled - check if available
        const ReactDOM = (window as any).ReactDOM;
        if (ReactDOM) {
            this.dependencies.set('react-dom', {
                name: 'react-dom',
                url: 'bundled',
                globalName: 'ReactDOM',
                loaded: true
            });
            console.log('[DependencyManager] Detected bundled ReactDOM');
        }

        // Check for zustand if it's available
        try {
            const zustand = (window as any).zustand;
            if (zustand) {
                this.dependencies.set('zustand', {
                    name: 'zustand',
                    url: 'bundled',
                    globalName: 'zustand',
                    loaded: true
                });
                console.log('[DependencyManager] Detected bundled Zustand');
            }
        } catch (e) {
            // Zustand not available, that's okay
        }

        // Check for other common libraries (including SillyTavern's preloaded ones)
        const commonLibs = [
            { name: 'lodash', global: '_', description: '强大的 JavaScript 工具库' },
            { name: 'axios', global: 'axios', description: 'HTTP 客户端' },
            { name: 'dayjs', global: 'dayjs', description: '日期时间处理' },
            { name: 'fontawesome', global: 'FontAwesome', description: 'Font Awesome 图标库（SillyTavern 已加载）' },
            { name: 'jquery', global: '$', description: 'jQuery 库（SillyTavern 已加载）' },
            { name: 'bootstrap', global: 'bootstrap', description: 'Bootstrap 框架（SillyTavern 已加载）' }
        ];

        commonLibs.forEach(({ name, global, description }) => {
            if ((window as any)[global]) {
                if (!this.dependencies.has(name)) {
                    this.dependencies.set(name, {
                        name,
                        url: 'preloaded',
                        globalName: global,
                        loaded: true,
                        description
                    });
                    console.log(`[DependencyManager] Detected preloaded ${name}`);
                }
            }
        });
    }

    /**
     * Register a dependency
     */
    register(name: string, url: string, globalName: string, description?: string): void {
        if (!this.dependencies.has(name)) {
            // Check if this dependency has autoload set in settings
            const autoload = this.getAutoloadStatus(name);

            this.dependencies.set(name, {
                name,
                url,
                globalName,
                loaded: !!(window as any)[globalName], // Check if already loaded
                description,
                autoload
            });
        }
    }

    /**
     * Get autoload status from settings
     */
    private getAutoloadStatus(name: string): boolean {
        const ctx = (window as any).SillyTavern?.getContext?.();
        const settings = ctx?.extensionSettings?.extensionExtension;
        if (!settings?.autoloadDependencies) {
            return false;
        }
        return settings.autoloadDependencies.includes(name);
    }

    /**
     * Set autoload status for a dependency
     */
    setAutoload(name: string, autoload: boolean): void {
        const dep = this.dependencies.get(name);
        if (!dep) return;

        dep.autoload = autoload;

        // Save to settings
        const ctx = (window as any).SillyTavern?.getContext?.();
        const settings = ctx?.extensionSettings?.extensionExtension;
        if (!settings) return;

        if (!settings.autoloadDependencies) {
            settings.autoloadDependencies = [];
        }

        if (autoload) {
            if (!settings.autoloadDependencies.includes(name)) {
                settings.autoloadDependencies.push(name);
            }
        } else {
            settings.autoloadDependencies = settings.autoloadDependencies.filter((n: string) => n !== name);
        }

        // Save settings
        if (ctx?.saveSettingsDebounced) {
            ctx.saveSettingsDebounced();
            console.log(`[DependencyManager] Autoload ${autoload ? 'enabled' : 'disabled'} for ${name}`);
        }
    }

    /**
     * Load dependencies that are set to autoload
     */
    private async loadAutoloadDependencies(): Promise<void> {
        const autoloadDeps = Array.from(this.dependencies.values())
            .filter(dep => dep.autoload && !dep.loaded);

        if (autoloadDeps.length > 0) {
            console.log(`[DependencyManager] Auto-loading ${autoloadDeps.length} dependencies...`);
            for (const dep of autoloadDeps) {
                try {
                    await this.load(dep.name);
                } catch (e) {
                    console.error(`[DependencyManager] Failed to autoload ${dep.name}:`, e);
                }
            }
        }
    }

    /**
     * Load a dependency
     */
    async load(name: string): Promise<any> {
        const dep = this.dependencies.get(name);

        if (!dep) {
            throw new Error(`Dependency ${name} not registered`);
        }

        // Check if already loaded
        if (dep.loaded && (window as any)[dep.globalName]) {
            console.log(`[DependencyManager] ${name} already loaded`);
            return (window as any)[dep.globalName];
        }

        // Check if currently loading
        if (this.loadingPromises.has(name)) {
            return this.loadingPromises.get(name);
        }

        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = dep.url;
            script.onload = () => {
                dep.loaded = true;
                console.log(`[DependencyManager] ${name} loaded successfully`);
                resolve((window as any)[dep.globalName]);
            };
            script.onerror = () => reject(new Error(`Failed to load ${name}`));
            document.head.appendChild(script);
        });

        this.loadingPromises.set(name, promise);
        return promise;
    }

    /**
     * Load multiple dependencies
     */
    async loadMultiple(names: string[]): Promise<any[]> {
        return Promise.all(names.map(name => this.load(name)));
    }

    /**
     * Get all registered dependencies
     */
    getAllDependencies(): Dependency[] {
        return Array.from(this.dependencies.values());
    }

    /**
     * Check if a dependency is loaded
     */
    isLoaded(name: string): boolean {
        const dep = this.dependencies.get(name);
        return dep?.loaded || false;
    }
}
