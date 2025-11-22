export interface ScopeBinding {
    targets: string[];
}

export class ScopeManager {
    constructor() {
        console.log('[ScopeManager] Initialized');
    }

    /**
     * Get all bindings from settings
     */
    getAllBindings(): Record<string, ScopeBinding> {
        if (typeof window === 'undefined') {
            return {};
        }

        const ctx = (window as any).SillyTavern?.getContext?.();
        const extensionSettings = ctx?.extensionSettings;

        if (!extensionSettings || !extensionSettings.extensionExtension) {
            return {};
        }

        const settings = extensionSettings.extensionExtension;
        if (!settings.scopeBindings) {
            settings.scopeBindings = {};
        }
        return settings.scopeBindings;
    }

    /**
     * Save bindings to settings
     */
    private saveBindings(bindings: Record<string, ScopeBinding>) {
        if (typeof window === 'undefined') return;

        const ctx = (window as any).SillyTavern?.getContext?.();
        const extensionSettings = ctx?.extensionSettings;

        if (!extensionSettings || !extensionSettings.extensionExtension) {
            console.error('[ScopeManager] Cannot save bindings: extensionSettings not available');
            return;
        }

        const settings = extensionSettings.extensionExtension;
        settings.scopeBindings = bindings;

        // Save using SillyTavern's save function
        if (ctx?.saveSettingsDebounced) {
            ctx.saveSettingsDebounced();
            console.log('[ScopeManager] Settings saved');
        } else {
            console.warn('[ScopeManager] saveSettingsDebounced not available');
        }
    }

    /**
     * Bind extension to a character
     */
    bindToCharacter(extensionId: string, characterId: string) {
        const bindings = this.getAllBindings();

        if (!bindings[extensionId]) {
            bindings[extensionId] = { targets: [] };
        }

        if (!bindings[extensionId].targets.includes(characterId)) {
            bindings[extensionId].targets.push(characterId);
            this.saveBindings(bindings);
            console.log(`[ScopeManager] Bound ${extensionId} to character ${characterId}`);
        }
    }

    /**
     * Unbind extension from a character
     */
    unbindFromCharacter(extensionId: string, characterId: string) {
        const bindings = this.getAllBindings();

        if (bindings[extensionId] && bindings[extensionId].targets) {
            bindings[extensionId].targets = bindings[extensionId].targets.filter(id => id !== characterId);

            // Clean up empty bindings
            if (bindings[extensionId].targets.length === 0) {
                delete bindings[extensionId];
            }

            this.saveBindings(bindings);
            console.log(`[ScopeManager] Unbound ${extensionId} from character ${characterId}`);
        }
    }

    /**
     * Check if extension is bound to a specific character
     */
    isBoundToCharacter(extensionId: string, characterId: string): boolean {
        const bindings = this.getAllBindings();
        return bindings[extensionId]?.targets?.includes(characterId) || false;
    }

    /**
     * Check if extension has ANY bindings (if so, it's restricted)
     */
    hasBindings(extensionId: string): boolean {
        const bindings = this.getAllBindings();
        return bindings[extensionId]?.targets?.length > 0;
    }

    /**
     * Check if extension should be active for the given character
     * Logic:
     * 1. If extension has NO bindings -> Active (Global)
     * 2. If extension HAS bindings -> Only Active if bound to current character
     */
    isActiveForCharacter(extensionId: string, characterId?: string): boolean {
        // If no bindings exist for this extension, it's global
        if (!this.hasBindings(extensionId)) {
            return true;
        }

        // If bindings exist, it must be bound to the current character
        if (!characterId) return false;
        return this.isBoundToCharacter(extensionId, characterId);
    }
}

