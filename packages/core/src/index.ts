import mitt from 'mitt';
import { PluginManager } from './managers/PluginManager';
import { MacroSystem } from './managers/MacroSystem';
import { UIManager } from './managers/UIManager';

console.log('Extension Extension Core Loading...');

// Global Registry
export const globalRegistry = {
    frameworks: new Map(),
    macros: new Map(),
    events: mitt(),
    pluginManager: null as PluginManager | null,
    macroSystem: null as MacroSystem | null,
    uiManager: null as UIManager | null,
};

// Initialize Managers
const pluginManager = new PluginManager();
const macroSystem = new MacroSystem();
const uiManager = new UIManager();

globalRegistry.pluginManager = pluginManager;
globalRegistry.macroSystem = macroSystem;
globalRegistry.uiManager = uiManager;

// Mount UI
// setTimeout(() => uiManager.mount(), 1000); // Delay mount for safety

// Expose to window
(window as any).ExtensionExtension = globalRegistry;

export default globalRegistry;
