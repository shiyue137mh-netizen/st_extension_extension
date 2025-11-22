export interface ScopeBinding {
    extensionId: string;
    characterId?: string;
    chatId?: string;
    enabled: boolean;
}

export class ScopeManager {
    private bindings: Map<string, ScopeBinding[]> = new Map();
    private globallyEnabled: Set<string> = new Set();

    constructor() {
        console.log('[ScopeManager] Initialized');
        this.loadBindings();
    }

    /**
     * Load bindings from localStorage
     */
    private loadBindings() {
        try {
            const stored = localStorage.getItem('ee_scope_bindings');
            if (stored) {
                const data = JSON.parse(stored);
                this.bindings = new Map(Object.entries(data.bindings || {}));
                this.globallyEnabled = new Set(data.globallyEnabled || []);
            }
        } catch (error) {
            console.error('[ScopeManager] Failed to load bindings:', error);
        }
    }

    /**
     * Save bindings to localStorage
     */
    private saveBindings() {
        try {
            const data = {
                bindings: Object.fromEntries(this.bindings),
                globallyEnabled: Array.from(this.globallyEnabled),
            };
            localStorage.setItem('ee_scope_bindings', JSON.stringify(data));
        } catch (error) {
            console.error('[ScopeManager] Failed to save bindings:', error);
        }
    }

    /**
     * Enable extension globally (no scope restrictions)
     */
    enableGlobally(extensionId: string) {
        this.globallyEnabled.add(extensionId);
        this.saveBindings();
    }

    /**
     * Disable extension globally
     */
    disableGlobally(extensionId: string) {
        this.globallyEnabled.delete(extensionId);
        this.saveBindings();
    }

    /**
     * Check if extension is globally enabled
     */
    isGloballyEnabled(extensionId: string): boolean {
        return this.globallyEnabled.has(extensionId);
    }

    /**
     * Bind extension to specific character/chat
     */
    addBinding(extensionId: string, characterId?: string, chatId?: string) {
        if (!this.bindings.has(extensionId)) {
            this.bindings.set(extensionId, []);
        }

        const bindings = this.bindings.get(extensionId)!;
        bindings.push({
            extensionId,
            characterId,
            chatId,
            enabled: true,
        });

        this.saveBindings();
    }

    /**
     * Remove binding
     */
    removeBinding(extensionId: string, characterId?: string, chatId?: string) {
        const bindings = this.bindings.get(extensionId);
        if (!bindings) return;

        const filtered = bindings.filter(b => {
            if (characterId && b.characterId !== characterId) return true;
            if (chatId && b.chatId !== chatId) return true;
            return false;
        });

        this.bindings.set(extensionId, filtered);
        this.saveBindings();
    }

    /**
     * Get all bindings for an extension
     */
    getBindings(extensionId: string): ScopeBinding[] {
        return this.bindings.get(extensionId) || [];
    }

    /**
     * Check if extension should be active in current context
     */
    isActiveInContext(extensionId: string, characterId?: string, chatId?: string): boolean {
        // If globally enabled, always active
        if (this.isGloballyEnabled(extensionId)) {
            return true;
        }

        // Check scope bindings
        const bindings = this.getBindings(extensionId);
        if (bindings.length === 0) {
            return false; // Not enabled if no bindings and not global
        }

        return bindings.some(b => {
            if (b.characterId && b.characterId === characterId) return b.enabled;
            if (b.chatId && b.chatId === chatId) return b.enabled;
            return false;
        });
    }

    /**
     * Get all registered extensions
     */
    getAllExtensions(): string[] {
        const allExtensions = new Set<string>();
        this.globallyEnabled.forEach(id => allExtensions.add(id));
        this.bindings.forEach((_, id) => allExtensions.add(id));
        return Array.from(allExtensions);
    }
}
