import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../ui/App';

export class UIManager {
    private root: any;

    constructor() {
        console.log('UIManager initialized');
    }

    mount() {
        const container = document.createElement('div');
        container.id = 'extension-extension-root';
        document.body.appendChild(container);

        this.root = createRoot(container);
        this.root.render(<App />);
        console.log('UI Mounted');
    }

    unmount() {
        if (this.root) {
            this.root.unmount();
            document.getElementById('extension-extension-root')?.remove();
        }
    }
}
