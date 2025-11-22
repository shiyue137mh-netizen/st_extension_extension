export interface ExtensionManifest {
    name: string;
    version: string;
    description?: string;
    frameworkDependencies?: Record<string, string>;
    // Add other ST manifest fields if needed
}

export interface FrameworkAdapter {
    name: string;
    version: string;
    instance: any; // The actual framework instance (e.g., Vue, React)
}

export interface ExtensionContext {
    registerFramework(name: string, adapter: FrameworkAdapter): void;
    getFramework(name: string): FrameworkAdapter | undefined;
}
