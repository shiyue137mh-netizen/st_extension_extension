import { ExtensionManifest, FrameworkAdapter } from '../types';
import { globalRegistry } from '../index';

export class PluginManager {
    private extensions: Map<string, ExtensionManifest> = new Map();

    constructor() {
        console.log('PluginManager initialized');
    }

    registerFramework(name: string, adapter: FrameworkAdapter) {
        console.log(`Registering framework: ${name} v${adapter.version}`);
        globalRegistry.frameworks.set(name, adapter);
    }

    getFramework(name: string): FrameworkAdapter | undefined {
        return globalRegistry.frameworks.get(name);
    }

    // TODO: Implement dependency check logic here
    checkDependencies(manifest: ExtensionManifest): boolean {
        if (!manifest.frameworkDependencies) return true;

        for (const [framework, version] of Object.entries(manifest.frameworkDependencies)) {
            if (!globalRegistry.frameworks.has(framework)) {
                console.error(`Missing dependency: ${framework}`);
                return false;
            }
            // TODO: Check version compatibility
        }
        return true;
    }
}
