import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@extension-extension/ui';
import { CommandPalette } from './CommandPalette';
import { globalRegistry } from '../index';
import { SettingsPanel } from './SettingsPanel';
import { ManagerApp } from './ManagerApp';

export const App = () => {
    const [settingsContainer, setSettingsContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // Register commands
        if (globalRegistry.commandManager) {
            globalRegistry.commandManager.registerCommand({
                id: 'core.reload',
                title: 'Reload Extension',
                group: 'System',
                shortcut: '⌘R',
                action: () => window.location.reload(),
            });

            globalRegistry.commandManager.registerCommand({
                id: 'core.settings',
                title: 'Open Settings',
                group: 'System',
                shortcut: '⌘,',
                action: () => {
                    // TODO: Open ST settings modal if possible
                    alert('Settings clicked');
                },
            });
        }

        // Check for #extensions_settings
        const checkSettings = () => {
            const el = document.getElementById('extensions_settings');
            if (el) {
                setSettingsContainer(el);
            }
        };

        // Initial check
        checkSettings();

        // Observer for when settings are opened
        const observer = new MutationObserver(checkSettings);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);

    return (
        <div id="extension-extension-root">
            <CommandPalette />
            <ManagerApp />

            {/* Inject Settings Panel into ST Settings */}
            {settingsContainer && createPortal(
                <div id="extension-extension-settings-root" className="mt-4">
                    <SettingsPanel />
                </div>,
                settingsContainer
            )}
        </div>
    );
};
