import './index.css';
import { PluginManager } from './managers/PluginManager';
import { MacroSystem } from './managers/MacroSystem';
import { UIManager } from './managers/UIManager';
import { CommandManager } from './managers/CommandManager';
import { SettingsManager } from './managers/SettingsManager';
import { FrameworkLoader } from './managers/FrameworkLoader';
import { DependencyManager } from './managers/DependencyManager';

console.log('Extension Extension Core Loading...');

// Extension Context Interface
export interface ExtensionContext {
    id: string;
    manifest: any;
    events: {
        on: (event: string, handler: (...args: any[]) => void) => void;
        emit: (event: string, ...args: any[]) => void;
        off: (event: string, handler: (...args: any[]) => void) => void;
    };
    macros: MacroSystem;
    commands: CommandManager;
    settings: SettingsManager;
    onCleanup: (fn: () => void) => void;
}

// Global Registry
export const globalRegistry = {
    frameworks: new Map(),
    macros: new Map(),
    pluginManager: null as PluginManager | null,
    macroSystem: null as MacroSystem | null,
    uiManager: null as UIManager | null,
    commandManager: null as CommandManager | null,
    settingsManager: null as SettingsManager | null,
    frameworkLoader: null as FrameworkLoader | null,
    dependencyManager: null as DependencyManager | null,

    // Factory for creating extension contexts
    createContext: (id: string, manifest: any): ExtensionContext => {
        const cleanupTasks: (() => void)[] = [];

        // Helper to safely access eventSource
        const getEventSource = () => (window as any).eventSource;

        const context: ExtensionContext = {
            id,
            manifest,
            events: {
                on: (event, handler) => {
                    const es = getEventSource();
                    if (es && es.on) {
                        es.on(event, handler);
                        cleanupTasks.push(() => es.off && es.off(event, handler));
                    } else {
                        console.warn('[ExtensionContext] eventSource not available');
                    }
                },
                emit: (event, ...args) => {
                    const es = getEventSource();
                    if (es && es.emit) {
                        es.emit(event, ...args);
                    }
                },
                off: (event, handler) => {
                    const es = getEventSource();
                    if (es && es.off) {
                        es.off(event, handler);
                    }
                },
            },
            macros: globalRegistry.macroSystem!,
            commands: globalRegistry.commandManager!,
            settings: globalRegistry.settingsManager!,
            onCleanup: (fn) => cleanupTasks.push(fn),
        };

        // TODO: Register context cleanup on extension unload

        return context;
    }
};

// Initialize Managers
const pluginManager = new PluginManager();
const macroSystem = new MacroSystem();
const uiManager = new UIManager();
const commandManager = new CommandManager();
const settingsManager = new SettingsManager();
const frameworkLoader = new FrameworkLoader();
const dependencyManager = new DependencyManager();

globalRegistry.pluginManager = pluginManager;
globalRegistry.macroSystem = macroSystem;
globalRegistry.uiManager = uiManager;
globalRegistry.commandManager = commandManager;
globalRegistry.settingsManager = settingsManager;
globalRegistry.frameworkLoader = frameworkLoader;
globalRegistry.dependencyManager = dependencyManager;

// Mount UI automatically
uiManager.mount();

// Expose to window
(window as any).ExtensionExtension = globalRegistry;

export default globalRegistry;
