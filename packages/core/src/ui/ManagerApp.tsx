import React, { useState } from 'react';
import { ManagerModal } from './manager/ManagerModal';
import { Sidebar, SidebarView } from './manager/Sidebar';
import { Dashboard } from './manager/Dashboard';
import { FrameworksView } from './manager/FrameworksView';
import { DependenciesView } from './manager/DependenciesView';
import { ExtensionsView } from './manager/ExtensionsView';
import { SettingsView } from './manager/SettingsView';
import { Settings } from 'lucide-react';

export const ManagerApp: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeView, setActiveView] = useState<SidebarView>('dashboard');

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <Dashboard />;
            case 'frameworks':
                return <FrameworksView />;
            case 'dependencies':
                return <DependenciesView />;
            case 'extensions':
                return <ExtensionsView />;
            case 'settings':
                return <SettingsView />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <>
            {/* Trigger Button (will be in SettingsPanel later) */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
                <Settings className="w-4 h-4" />
                Open Manager
            </button>

            {/* Manager Modal */}
            <ManagerModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div style={{ display: 'flex', height: '100%' }}>
                    <Sidebar activeView={activeView} onViewChange={setActiveView} />
                    {renderContent()}
                </div>
            </ManagerModal>
        </>
    );
};
