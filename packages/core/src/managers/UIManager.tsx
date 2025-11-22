import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../ui/App';

export class UIManager {
    private root: any;
    private mounted = false;

    constructor() {
        console.log('[UIManager] Initialized');
    }

    mount() {
        // Wait for jQuery to be ready (SillyTavern uses jQuery)
        const mountWhenReady = () => {
            // Check if extensions_settings exists
            const extensionsSettings = document.getElementById('extensions_settings');
            if (!extensionsSettings) {
                console.warn('[UIManager] #extensions_settings not found, retrying...');
                setTimeout(mountWhenReady, 100);
                return;
            }

            // Prevent double mounting
            if (this.mounted) {
                console.warn('[UIManager] Already mounted');
                return;
            }

            // Create container using vanilla JS (similar to jQuery's approach)
            const container = document.createElement('div');
            container.id = 'extension-extension-ui-root';
            extensionsSettings.appendChild(container);

            // Mount React
            this.root = createRoot(container);
            this.root.render(<App />);
            this.mounted = true;
            console.log('[UIManager] UI Mounted successfully to #extensions_settings');
        };

        // Start mounting process
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', mountWhenReady);
        } else {
            // DOM already loaded, but wait a bit for SillyTavern to initialize
            setTimeout(mountWhenReady, 100);
        }
    }

    unmount() {
        if (this.root) {
            this.root.unmount();
            document.getElementById('extension-extension-ui-root')?.remove();
            this.mounted = false;
            console.log('[UIManager] UI Unmounted');
        }
    }
}
