export interface Dependency {
    name: string;
    url: string;
    globalName: string;
    loaded: boolean;
}

export class DependencyManager {
    private dependencies: Map<string, Dependency> = new Map();
    private loadingPromises: Map<string, Promise<any>> = new Map();

    constructor() {
        console.log('[DependencyManager] Initialized');

        // Register common dependencies
        this.register('axios', 'https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js', 'axios');
        this.register('lodash', 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js', '_');
        this.register('dayjs', 'https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js', 'dayjs');
    }

    /**
     * Register a dependency
     */
    register(name: string, url: string, globalName: string): void {
        if (!this.dependencies.has(name)) {
            this.dependencies.set(name, {
                name,
                url,
                globalName,
                loaded: !!(window as any)[globalName], // Check if already loaded
            });
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
