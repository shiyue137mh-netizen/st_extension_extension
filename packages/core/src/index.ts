import './index.css';
import './ui/manager/theme.css';
import './ui/manager/dividers.css';
import { MacroSystem } from './managers/MacroSystem';
import { UIManager } from './managers/UIManager';
import { CommandManager } from './managers/CommandManager';
import { SettingsManager } from './managers/SettingsManager';
import { DependencyManager } from './managers/DependencyManager';
import { ScopeManager } from './managers/ScopeManager';
import { FrameworkRegistry } from './managers/FrameworkRegistry';

// Import SillyTavern internals
// Paths are relative to deployed location: extension-extension/dist/index.js
// @ts-ignore - External dependency resolved at runtime
import { saveSettingsDebounced, eventSource } from '../../../../script.js';
// @ts-ignore - External dependency resolved at runtime
import { extension_settings, extensionNames } from '../../../extensions.js';

console.log('Extension Extension Core Loading...');
console.log('ST Internals Loaded:', { extensionNames, hasSettings: !!extension_settings });

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
    frameworks: new Map(), // TODO: Migrate to frameworkRegistry completely
    macros: new Map(),
    macroSystem: null as MacroSystem | null,
    uiManager: null as UIManager | null,
    commandManager: null as CommandManager | null,
    settingsManager: null as SettingsManager | null,
    dependencyManager: null as DependencyManager | null,
    scopeManager: null as ScopeManager | null,
    frameworkRegistry: null as FrameworkRegistry | null,

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
const macroSystem = new MacroSystem();
const uiManager = new UIManager();
const commandManager = new CommandManager();
const settingsManager = new SettingsManager();
const dependencyManager = new DependencyManager();
const scopeManager = new ScopeManager();
const frameworkRegistry = new FrameworkRegistry();

globalRegistry.macroSystem = macroSystem;
globalRegistry.uiManager = uiManager;
globalRegistry.commandManager = commandManager;
globalRegistry.settingsManager = settingsManager;
globalRegistry.dependencyManager = dependencyManager;
globalRegistry.scopeManager = scopeManager;
globalRegistry.frameworkRegistry = frameworkRegistry;

// Register common dependencies
dependencyManager.register('axios', 'https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js', 'axios');
dependencyManager.register('lodash', 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js', '_');
dependencyManager.register('dayjs', 'https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js', 'dayjs');
// Register frameworks as dependencies
dependencyManager.register('vue', 'https://cdn.jsdelivr.net/npm/vue@3.4.21/dist/vue.global.prod.js', 'Vue');
dependencyManager.register('react', 'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js', 'React');
dependencyManager.register('react-dom', 'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js', 'ReactDOM');

// Mount UI automatically
uiManager.mount();

// Setup Event Listeners
const setupEventListeners = () => {
    const eventSource = (window as any).eventSource;
    if (eventSource && eventSource.on) {
        // Listen for character changes
        eventSource.on('characterSelected', (_charId: string) => {
            const ctx = (window as any).SillyTavern?.getContext?.();
            const charName = ctx?.name2;

            console.log('[ExtensionExtension] Character changed to:', charName);

            // Emit internal event with character name
            if (charName) {
                (window as any).ExtensionExtension.events.emit('characterChanged', charName);
            }
        });

        console.log('[ExtensionExtension] Event listeners set up');
    } else {
        console.warn('[ExtensionExtension] eventSource not found, character binding may not work');
    }
};

// Wait for SillyTavern to be ready (simplistic approach)
setTimeout(setupEventListeners, 1000);

// Expose to window
// Expose to window
(window as any).ExtensionExtension = {
    ...globalRegistry,

    // Expose ST internals for UI components
    st: {
        get extension_settings() { return extension_settings; },
        get extensionNames() { return extensionNames; },
        get eventSource() { return eventSource; },
        get saveSettingsDebounced() { return saveSettingsDebounced; },
        // Use SillyTavern.getContext() for current character
        getContext() {
            return (window as any).SillyTavern?.getContext?.() || {};
        },
        get currentCharacterName() {
            const ctx = (window as any).SillyTavern?.getContext?.();
            return ctx?.name2; // name2 is the character card name
        }
    },

    // Legacy API compatibility
    bindToCharacter: (extId: string, charId: string) => scopeManager.bindToCharacter(extId, charId),
    unbindPlugin: (extId: string, charId: string) => scopeManager.unbindFromCharacter(extId, charId), // Legacy name was unbindPlugin?
    unbindFromCharacter: (extId: string, charId: string) => scopeManager.unbindFromCharacter(extId, charId),
    getAllBindings: () => scopeManager.getAllBindings(),
    isPluginActive: (extId: string, charId: string) => scopeManager.isActiveForCharacter(extId, charId),

    // Event emitter wrapper
    on: (event: string, handler: any) => {
        if (eventSource) eventSource.on(event, handler);
    },
    emit: (event: string, ...args: any[]) => {
        if (eventSource) eventSource.emit(event, ...args);
    }
};


export default globalRegistry;
