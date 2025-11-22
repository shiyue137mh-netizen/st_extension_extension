import React, { useState, useEffect } from 'react';
import { Puzzle, Power, PowerOff, Info } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface ExtensionMetadata {
    name?: string;
    version?: string;
    author?: string;
    description?: string;
    enabled?: boolean;
}

export const ExtensionsView: React.FC = () => {
    const { t } = useTranslation();
    const [extensions, setExtensions] = useState<Record<string, ExtensionMetadata>>({});

    useEffect(() => {
        loadExtensions();
    }, []);

    const loadExtensions = () => {
        // Access SillyTavern's extension_settings directly
        if (typeof window !== 'undefined' && (window as any).extension_settings) {
            const extSettings = (window as any).extension_settings.extensionExtension;
            if (extSettings && extSettings.extensionMetadata) {
                setExtensions(extSettings.extensionMetadata);
            }
        }
    };

    const handleToggle = (id: string) => {
        // Access SillyTavern's extension_settings directly
        if (typeof window !== 'undefined' && (window as any).extension_settings) {
            const extSettings = (window as any).extension_settings.extensionExtension;

            if (!extSettings.extensionMetadata) {
                extSettings.extensionMetadata = {};
            }

            const newEnabled = !extSettings.extensionMetadata[id]?.enabled;
            extSettings.extensionMetadata[id] = {
                ...extSettings.extensionMetadata[id],
                enabled: newEnabled,
            };

            // Save settings using SillyTavern's saveSettingsDebounced
            if ((window as any).saveSettingsDebounced) {
                (window as any).saveSettingsDebounced();
            }

            loadExtensions();
        }
    };

    const extensionIds = Object.keys(extensions);
    const enabledCount = extensionIds.filter(id => extensions[id]?.enabled).length;

    return (
        <div className="ee-content">
            <div className="ee-dashboard">
                <div className="ee-dashboard-header">
                    <h2 className="ee-dashboard-title">{t('extensions.title')}</h2>
                    <p className="ee-dashboard-subtitle">
                        {t('extensions.subtitle')} ({enabledCount}/{extensionIds.length} {t('extensions.activeCount')})
                    </p>
                </div>

                {/* Extensions List */}
                {extensionIds.length === 0 ? (
                    <div className="ee-section" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                        <Puzzle size={48} style={{ color: 'var(--ee-muted-foreground)', margin: '0 auto 1.5rem' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--ee-foreground)', margin: '0 0 0.75rem 0' }}>
                            {t('extensions.noExtensions')}
                        </h3>
                        <p style={{ fontSize: '0.9375rem', color: 'var(--ee-muted-foreground)', margin: 0 }}>
                            {t('extensions.noExtensionsDesc')}
                        </p>
                    </div>
                ) : (
                    <div className="ee-item-list">
                        {extensionIds.map((id) => {
                            const ext = extensions[id];
                            const extName = ext?.name || id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

                            return (
                                <div key={id}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--ee-foreground)' }}>
                                                    {extName}
                                                </h3>
                                                {ext?.enabled && (
                                                    <span className="ee-status ee-status-success">
                                                        {t('extensions.statusActive')}
                                                    </span>
                                                )}
                                                {ext?.version && (
                                                    <span style={{
                                                        padding: '0.25rem 0.625rem',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 500,
                                                        background: 'var(--ee-muted)',
                                                        color: 'var(--ee-muted-foreground)',
                                                        borderRadius: 'var(--ee-radius-sm)',
                                                    }}>
                                                        v{ext.version}
                                                    </span>
                                                )}
                                            </div>
                                            {ext?.description && (
                                                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: 'var(--ee-muted-foreground)' }}>
                                                    {ext.description}
                                                </p>
                                            )}
                                            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8125rem', color: 'var(--ee-muted-foreground)' }}>
                                                <div>
                                                    <strong>ID:</strong> <code style={{
                                                        padding: '0.125rem 0.375rem',
                                                        background: 'var(--ee-muted)',
                                                        borderRadius: '0.25rem',
                                                        fontFamily: 'var(--ee-font-mono)',
                                                        fontSize: '0.75rem',
                                                    }}>{id}</code>
                                                </div>
                                                {ext?.author && (
                                                    <div>
                                                        <strong>{t('common.author')}:</strong> {ext.author}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            className="ee-button ee-button-secondary"
                                            onClick={() => handleToggle(id)}
                                        >
                                            {ext?.enabled ? (
                                                <>
                                                    <PowerOff size={16} />
                                                    {t('extensions.disable')}
                                                </>
                                            ) : (
                                                <>
                                                    <Power size={16} />
                                                    {t('extensions.enable')}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Info */}
                <div className="ee-section" style={{ background: 'var(--ee-muted)', borderColor: 'var(--ee-border)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Info size={20} style={{ color: 'var(--ee-primary)', flexShrink: 0 }} />
                        <div style={{ fontSize: '0.875rem', color: 'var(--ee-muted-foreground)' }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 500, color: 'var(--ee-foreground)' }}>
                                {t('extensions.infoTitle')}
                            </p>
                            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                                <li>{t('extensions.info1')}</li>
                                <li><strong>{t('extensions.info2')}</strong></li>
                                <li><strong>{t('extensions.info3')}</strong></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
