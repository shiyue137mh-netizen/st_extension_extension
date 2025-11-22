export class SettingsManager {
    constructor() {
        console.log('[SettingsManager] Initialized');
    }

    private getPluginSettings(extensionId: string): Record<string, any> {
        if (typeof window === 'undefined' || !(window as any).extension_settings) return {};

        const extSettings = (window as any).extension_settings.extensionExtension;
        if (!extSettings.pluginSettings) {
            extSettings.pluginSettings = {};
        }

        if (!extSettings.pluginSettings[extensionId]) {
            extSettings.pluginSettings[extensionId] = {};
        }

        return extSettings.pluginSettings[extensionId];
    }

    private savePluginSettings(extensionId: string, settings: Record<string, any>) {
        if (typeof window === 'undefined' || !(window as any).extension_settings) return;

        const extSettings = (window as any).extension_settings.extensionExtension;
        if (!extSettings.pluginSettings) {
            extSettings.pluginSettings = {};
        }

        extSettings.pluginSettings[extensionId] = settings;

        if ((window as any).saveSettingsDebounced) {
            (window as any).saveSettingsDebounced();
        }
    }

    /**
     * Get setting value for a specific extension
     */
    get<T = any>(extensionId: string, key: string, defaultValue?: T): T | undefined {
        const settings = this.getPluginSettings(extensionId);
        return settings[key] !== undefined ? settings[key] : defaultValue;
    }

    /**
     * Set setting value for a specific extension
     */
    set(extensionId: string, key: string, value: any): void {
        const settings = this.getPluginSettings(extensionId);
        settings[key] = value;
        this.savePluginSettings(extensionId, settings);
    }

    /**
     * Get all settings for a specific extension
     */
    getAll(extensionId: string): Record<string, any> {
        return { ...this.getPluginSettings(extensionId) };
    }

    /**
     * Set all settings for a specific extension
     */
    setAll(extensionId: string, settings: Record<string, any>): void {
        this.savePluginSettings(extensionId, settings);
    }

    /**
     * Delete a setting key for a specific extension
     */
    delete(extensionId: string, key: string): void {
        const settings = this.getPluginSettings(extensionId);
        delete settings[key];
        this.savePluginSettings(extensionId, settings);
    }

    /**
     * Clear all settings for a specific extension
     */
    clear(extensionId: string): void {
        this.savePluginSettings(extensionId, {});
    }
}

