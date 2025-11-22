import React, { useState } from 'react';
import { Code, Terminal, Activity, Settings as SettingsIcon, ExternalLink } from 'lucide-react';
import { globalRegistry } from '../../index';
import { useTranslation } from '../../i18n';

export const FrameworksView: React.FC = () => {
    const { t } = useTranslation();
    const [selectedFramework, setSelectedFramework] = useState<string | null>(null);

    const macros = globalRegistry.macroSystem?.getRegisteredMacros() || [];
    const commands = globalRegistry.commandManager?.getAllCommands() || [];
    const frameworks = globalRegistry.frameworkRegistry?.getAll() || [];

    return (
        <div className="ee-content">
            <div className="ee-dashboard">
                <div className="ee-dashboard-header">
                    <h2 className="ee-dashboard-title">{t('frameworks.title')}</h2>
                    <p className="ee-dashboard-subtitle">{t('frameworks.subtitle')}</p>
                </div>

                {/* Core API Status */}
                <div className="ee-section">
                    <h3 className="ee-section-title">{t('frameworks.coreApi')}</h3>

                    <div className="ee-item-list">
                        {/* Macros System */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                <div className="ee-stat-icon" style={{ background: 'oklch(0.6132 0.2294 291.7437 / 0.15)', width: '2.5rem', height: '2.5rem', marginBottom: 0 }}>
                                    <Code size={20} style={{ color: 'oklch(0.6132 0.2294 291.7437)' }} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--ee-foreground)' }}>
                                        {t('frameworks.macros')}
                                    </h4>
                                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8125rem', color: 'var(--ee-muted-foreground)' }}>
                                        {t('frameworks.macrosDesc')}
                                    </p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ee-foreground)' }}>
                                    {macros.length}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--ee-muted-foreground)' }}>
                                    {t('frameworks.registered')}
                                </div>
                            </div>
                        </div>

                        {/* Commands System */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                <div className="ee-stat-icon" style={{ background: 'oklch(0.7857 0.1153 246.6596 / 0.15)', width: '2.5rem', height: '2.5rem', marginBottom: 0 }}>
                                    <Terminal size={20} style={{ color: 'oklch(0.7857 0.1153 246.6596)' }} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--ee-foreground)' }}>
                                        {t('frameworks.commands')}
                                    </h4>
                                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8125rem', color: 'var(--ee-muted-foreground)' }}>
                                        {t('frameworks.commandsDesc')}
                                    </p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ee-foreground)' }}>
                                    {commands.length}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--ee-muted-foreground)' }}>
                                    {t('frameworks.registered')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registered Frameworks */}
                <div className="ee-section">
                    <h3 className="ee-section-title">{t('frameworks.registered Frameworks')}</h3>

                    {frameworks.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <Activity size={40} style={{ color: 'var(--ee-muted-foreground)', margin: '0 auto 1rem' }} />
                            <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--ee-muted-foreground)' }}>
                                {t('frameworks.noFrameworks')}
                            </p>
                        </div>
                    ) : (
                        <div className="ee-item-list">
                            {frameworks.map((fw) => (
                                <div key={fw.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--ee-foreground)' }}>
                                                    {fw.name}
                                                </h4>
                                                <span style={{
                                                    padding: '0.25rem 0.625rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 500,
                                                    background: fw.status === 'active' ? 'var(--ee-primary)' : 'var(--ee-muted)',
                                                    color: fw.status === 'active' ? 'var(--ee-primary-foreground)' : 'var(--ee-muted-foreground)',
                                                    borderRadius: 'var(--ee-radius-sm)',
                                                }}>
                                                    {fw.status === 'active' ? t('frameworks.active') : t('frameworks.inactive')}
                                                </span>
                                            </div>
                                            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: 'var(--ee-muted-foreground)' }}>
                                                {fw.description}
                                            </p>
                                            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8125rem', color: 'var(--ee-muted-foreground)' }}>
                                                {fw.macrosCount !== undefined && (
                                                    <div>
                                                        <strong>{t('frameworks.macros')}:</strong> {fw.macrosCount}
                                                    </div>
                                                )}
                                                {fw.commandsCount !== undefined && (
                                                    <div>
                                                        <strong>{t('frameworks.commands')}:</strong> {fw.commandsCount}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {fw.settingsPanel && (
                                            <button
                                                className="ee-button ee-button-primary"
                                                onClick={() => setSelectedFramework(fw.id)}
                                            >
                                                <SettingsIcon size={16} />
                                                {t('frameworks.openSettings')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="ee-section" style={{ background: 'var(--ee-muted)', borderColor: 'var(--ee-border)' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ee-muted-foreground)' }}>
                        {t('frameworks.infoText')}
                    </p>
                </div>

                {/* Framework Settings Modal (placeholder) */}
                {selectedFramework && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 1000000,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onClick={() => setSelectedFramework(null)}
                    >
                        <div
                            style={{
                                background: 'var(--ee-card)',
                                padding: '2rem',
                                borderRadius: 'var(--ee-radius-lg)',
                                maxWidth: '600px',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--ee-foreground)' }}>
                                Framework Settings: {selectedFramework}
                            </h3>
                            <p style={{ margin: 0, color: 'var(--ee-muted-foreground)' }}>
                                Custom settings panel will be rendered here.
                            </p>
                            <button
                                className="ee-button ee-button-secondary"
                                onClick={() => setSelectedFramework(null)}
                                style={{ marginTop: '1.5rem' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
