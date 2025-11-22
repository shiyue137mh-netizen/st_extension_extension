export interface FrameworkMetadata {
    id: string;
    name: string;
    version: string;
    description: string;
    author?: string;
    status: 'active' | 'inactive';
    macrosCount?: number;
    commandsCount?: number;
    settingsPanel?: React.ComponentType<any>;
}

export class FrameworkRegistry {
    private frameworks: Map<string, FrameworkMetadata> = new Map();

    constructor() {
        console.log('[FrameworkRegistry] Initialized');
    }

    /**
     * Register a framework
     */
    register(metadata: FrameworkMetadata) {
        this.frameworks.set(metadata.id, metadata);
        console.log(`[FrameworkRegistry] Registered framework: ${metadata.id}`);
    }

    /**
     * Unregister a framework
     */
    unregister(id: string) {
        this.frameworks.delete(id);
        console.log(`[FrameworkRegistry] Unregistered framework: ${id}`);
    }

    /**
     * Get framework metadata
     */
    get(id: string): FrameworkMetadata | undefined {
        return this.frameworks.get(id);
    }

    /**
     * Get all registered frameworks
     */
    getAll(): FrameworkMetadata[] {
        return Array.from(this.frameworks.values());
    }

    /**
     * Update framework status
     */
    updateStatus(id: string, status: 'active' | 'inactive') {
        const framework = this.frameworks.get(id);
        if (framework) {
            framework.status = status;
        }
    }

    /**
     * Update framework stats
     */
    updateStats(id: string, stats: { macrosCount?: number; commandsCount?: number }) {
        const framework = this.frameworks.get(id);
        if (framework) {
            if (stats.macrosCount !== undefined) framework.macrosCount = stats.macrosCount;
            if (stats.commandsCount !== undefined) framework.commandsCount = stats.commandsCount;
        }
    }
}
