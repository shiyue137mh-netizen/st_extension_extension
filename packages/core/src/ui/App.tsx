import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@extension-extension/ui';
import { CommandPalette } from './CommandPalette';
import { globalRegistry } from '../index';
import { SettingsPanel } from './SettingsPanel';

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

            {/* Global Overlay UI (e.g. Status) */}
            <div className="fixed top-4 right-4 p-6 bg-zinc-900 text-white z-[9998] rounded-lg shadow-xl border border-zinc-800 w-80">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-lg font-bold">Extension Manager</h1>
                    <span className="text-xs text-zinc-400">v2.0.0</span>
                </div>

                <div className="space-y-4">
                    <div className="p-3 bg-zinc-800 rounded-md">
                        <p className="text-sm text-zinc-300 mb-2">Core Runtime Active</p>
                        <p className="text-xs text-zinc-500 mt-2">Press ⌘K to open commands</p>
                    </div>
                </div>
            </div>

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
