import React from 'react';
import { LayoutDashboard, Puzzle, Boxes, Package, Settings } from 'lucide-react';
import { useTranslation } from '../../i18n';

export type SidebarView = 'dashboard' | 'extensions' | 'frameworks' | 'dependencies' | 'settings';

interface SidebarProps {
    activeView: SidebarView;
    onViewChange: (view: SidebarView) => void;
}

// Navigation items with translation keys
const navItems = [
    { id: 'dashboard' as const, icon: LayoutDashboard, labelKey: 'sidebar.dashboard' },
    { id: 'extensions' as const, icon: Puzzle, labelKey: 'sidebar.extensions' },
    { id: 'frameworks' as const, icon: Boxes, labelKey: 'sidebar.frameworks' },
    { id: 'dependencies' as const, icon: Package, labelKey: 'sidebar.dependencies' },
    { id: 'settings' as const, icon: Settings, labelKey: 'sidebar.settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
    const { t } = useTranslation();
    return (
        <div className="ee-sidebar">
            <nav className="ee-sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`ee-sidebar-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={20} />
                            <span>{t(item.labelKey)}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="ee-sidebar-footer">
                v2.0.0
            </div>
        </div>
    );
};
