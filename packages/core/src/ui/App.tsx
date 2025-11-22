import React from 'react';
import { Button } from '@extension-extension/ui';

export const App = () => {
    return (
        <div className="fixed top-4 right-4 p-6 bg-zinc-900 text-white z-[9999] rounded-lg shadow-xl border border-zinc-800 w-80">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-bold">Extension Manager</h1>
                <span className="text-xs text-zinc-400">v2.0.0</span>
            </div>

            <div className="space-y-4">
                <div className="p-3 bg-zinc-800 rounded-md">
                    <p className="text-sm text-zinc-300 mb-2">Core Runtime Active</p>
                    <div className="flex gap-2">
                        <Button size="sm" variant="default">Settings</Button>
                        <Button size="sm" variant="outline">Reload</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
