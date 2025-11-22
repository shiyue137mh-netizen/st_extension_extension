import React from 'react';
import { Activity, Box, Download } from 'lucide-react';
import { globalRegistry } from '../../index';
import { useTranslation } from '../../i18n';

export const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const loadedFrameworks = globalRegistry.frameworkLoader?.getLoadedFrameworks() || [];
    const dependencies = globalRegistry.dependencyManager?.getAllDependencies() || [];
    const loadedDeps = dependencies.filter((d: any) => d.loaded).length;

    // Get extension count - use same method as ExtensionsView
    const st = (window as any).ExtensionExtension?.st;
    const extensionNames = st?.extensionNames || [];
    const extensionCount = Object.keys(extensionNames).length;

    const handleLoadVue = async () => {
        if (globalRegistry.frameworkLoader) {
            await globalRegistry.frameworkLoader.loadVue();
            window.location.reload(); // Force re-render
        }
    };

    const handleLoadReact = async () => {
        if (globalRegistry.frameworkLoader) {
            await globalRegistry.frameworkLoader.loadReact();
            window.location.reload();
        }
    };

    const handleLoadAllDeps = async () => {
        if (globalRegistry.dependencyManager) {
            const names = dependencies.map(d => d.name);
            await globalRegistry.dependencyManager.loadMultiple(names);
            window.location.reload();
        }
    };

    return (
        <div className="ee-content">
            <div className="ee-dashboard">
                <div className="ee-dashboard-header">
                    <h2 className="ee-dashboard-title">{t('dashboard.title')}</h2>
                    <p className="ee-dashboard-subtitle">{t('dashboard.subtitle')}</p>
                </div>

                {/* Stats Grid */}
                <div className="ee-stats-grid">
                    {/* Extensions Card */}
                    <div className="ee-stat-card">
                        <div className="ee-stat-icon" style={{ background: 'oklch(0.6132 0.2294 291.7437 / 0.15)' }}>
                            <Box size={24} style={{ color: 'oklch(0.6132 0.2294 291.7437)' }} />
                        </div>
                        <div className="ee-stat-value">{extensionCount}</div>
                        <div className="ee-stat-label">{t('dashboard.extensions')}</div>
                    </div>

                    {/* Frameworks Card */}
                    <div className="ee-stat-card">
                        <div className="ee-stat-icon" style={{ background: 'oklch(0.7857 0.1153 246.6596 / 0.15)' }}>
                            <Download size={24} style={{ color: 'oklch(0.7857 0.1153 246.6596)' }} />
                        </div>
                        <div className="ee-stat-value">{loadedFrameworks.length}</div>
                        <div className="ee-stat-label">{t('dashboard.frameworks')}</div>
                    </div>

                    {/* Dependencies Card */}
                    <div className="ee-stat-card">
                        <div className="ee-stat-icon" style={{ background: 'oklch(0.7106 0.1661 22.2162 / 0.15)' }}>
                            <Activity size={24} style={{ color: 'oklch(0.7106 0.1661 22.2162)' }} />
                        </div>
                        <div className="ee-stat-value">{loadedDeps}/{dependencies.length}</div>
                        <div className="ee-stat-label">{t('dashboard.dependencies')}</div>
                    </div>
                </div>

                {/* Framework Status */}
                <div className="ee-section">
                    <h3 className="ee-section-title">{t('dashboard.frameworkStatus')}</h3>
                    {loadedFrameworks.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {loadedFrameworks.map(fw => (
                                <div key={fw} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--ee-foreground)', textTransform: 'capitalize', fontSize: '0.9375rem' }}>
                                        {fw}
                                    </span>
                                    <span className="ee-status ee-status-success">
                                        ✓ Loaded
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="ee-status ee-status-muted">No frameworks loaded yet</p>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="ee-section">
                    <h3 className="ee-section-title">{t('dashboard.quickActions')}</h3>
                    <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
                        <button className="ee-button ee-button-primary" onClick={handleLoadVue}>
                            {t('dashboard.loadVue')}
                        </button>
                        <button className="ee-button ee-button-primary" onClick={handleLoadReact}>
                            {t('dashboard.loadReact')}
                        </button>
                        <button className="ee-button ee-button-secondary" onClick={handleLoadAllDeps}>
                            {t('dashboard.loadAllDeps')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
