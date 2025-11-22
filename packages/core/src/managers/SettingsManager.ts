export class SettingsManager {
    private storageKey = 'extension-extension-settings';

    constructor() {
        console.log('SettingsManager initialized');
    }

    /**
     * Get setting value for a specific extension
     */
    get<T = any>(extensionId: string, key: string, defaultValue?: T): T {
        const allSettings = this.loadAll();
        const extensionSettings = allSettings[extensionId] || {};
        return extensionSettings[key] !== undefined ? extensionSettings[key] : defaultValue;
    }

    /**
     * Set setting value for a specific extension
     */
    set(extensionId: string, key: string, value: any): void {
        const allSettings = this.loadAll();
        if (!allSettings[extensionId]) {
            allSettings[extensionId] = {};
        }
        allSettings[extensionId][key] = value;
        this.saveAll(allSettings);
    }

    /**
     * Get all settings for a specific extension
     */
    getAll(extensionId: string): Record<string, any> {
        const allSettings = this.loadAll();
        return allSettings[extensionId] || {};
    }

    /**
     * Set all settings for a specific extension
     */
    setAll(extensionId: string, settings: Record<string, any>): void {
        const allSettings = this.loadAll();
        allSettings[extensionId] = settings;
        this.saveAll(allSettings);
    }

    /**
     * Delete a setting key for a specific extension
     */
    delete(extensionId: string, key: string): void {
        const allSettings = this.loadAll();
        if (allSettings[extensionId]) {
            delete allSettings[extensionId][key];
            this.saveAll(allSettings);
        }
    }

    /**
     * Clear all settings for a specific extension
     */
    clear(extensionId: string): void {
        const allSettings = this.loadAll();
        delete allSettings[extensionId];
        this.saveAll(allSettings);
    }

    private loadAll(): Record<string, Record<string, any>> {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Failed to load settings:', e);
            return {};
        }
    }

    private saveAll(settings: Record<string, Record<string, any>>): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }
}
