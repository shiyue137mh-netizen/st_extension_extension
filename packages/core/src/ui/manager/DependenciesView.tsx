import React, { useState } from 'react';
import { Package, Download, Plus, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';
import { globalRegistry } from '../../index';
import { useTranslation } from '../../i18n';

export const DependenciesView: React.FC = () => {
    const { t } = useTranslation();
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [newName, setNewName] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [newGlobal, setNewGlobal] = useState('');
    const [loading, setLoading] = useState<Set<string>>(new Set());

    const dependencies = globalRegistry.dependencyManager?.getAllDependencies() || [];

    const handleLoad = async (name: string) => {
        if (!globalRegistry.dependencyManager) return;
        setLoading(prev => new Set(prev).add(name));
        try {
            await globalRegistry.dependencyManager.load(name);
        } finally {
            setLoading(prev => {
                const next = new Set(prev);
                next.delete(name);
                return next;
            });
        }
    };

    const handleLoadAll = async () => {
        if (!globalRegistry.dependencyManager) return;
        const names = dependencies.map(d => d.name);
        for (const name of names) {
            await handleLoad(name);
        }
    };

    const handleAddCustom = () => {
        if (!globalRegistry.dependencyManager || !newName.trim() || !newUrl.trim()) return;
        globalRegistry.dependencyManager.register(newName.trim(), newUrl.trim(), newGlobal.trim() || undefined);
        setNewName('');
        setNewUrl('');
        setNewGlobal('');
        setShowAddDialog(false);
        window.location.reload(); // Refresh to show new dependency
    };

    const loadedCount = dependencies.filter(d => d.loaded).length;

    return (
        <div className="ee-content">
            <div className="ee-dashboard">
                <div className="ee-dashboard-header">
                    <h2 className="ee-dashboard-title">{t('dependencies.title')}</h2>
                    <p className="ee-dashboard-subtitle">
                        {t('dependencies.subtitle')} ({loadedCount}/{dependencies.length} {t('dependencies.loaded')})
                    </p>
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <button
                        className="ee-button ee-button-primary"
                        onClick={handleLoadAll}
                    >
                        <Download size={16} />
                        {t('dependencies.loadAll')}
                    </button>
                    <button
                        className="ee-button ee-button-secondary"
                        onClick={() => setShowAddDialog(true)}
                    >
                        <Plus size={16} />
                        {t('dependencies.addCustom')}
                    </button>
                </div>

                {/* Add Custom Dialog */}
                {showAddDialog && (
                    <div className="ee-section" style={{ marginBottom: '1.5rem' }}>
                        <h3 className="ee-section-title">{t('dependencies.addCustomTitle')}</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--ee-foreground)', marginBottom: '0.5rem' }}>
                                    {t('dependencies.packageName')}
                                </label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder={t('dependencies.packageNamePlaceholder')}
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem',
                                        background: 'var(--ee-input)',
                                        border: '1px solid var(--ee-border)',
                                        borderRadius: 'var(--ee-radius-md)',
                                        color: 'var(--ee-foreground)',
                                        fontSize: '0.9375rem',
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--ee-foreground)', marginBottom: '0.5rem' }}>
                                    {t('dependencies.cdnUrl')}
                                </label>
                                <input
                                    type="url"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    placeholder={t('dependencies.cdnUrlPlaceholder')}
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem',
                                        background: 'var(--ee-input)',
                                        border: '1px solid var(--ee-border)',
                                        borderRadius: 'var(--ee-radius-md)',
                                        color: 'var(--ee-foreground)',
                                        fontSize: '0.9375rem',
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--ee-foreground)', marginBottom: '0.5rem' }}>
                                    {t('dependencies.globalVar')}
                                </label>
                                <input
                                    type="text"
                                    value={newGlobal}
                                    onChange={(e) => setNewGlobal(e.target.value)}
                                    placeholder={t('dependencies.globalVarPlaceholder')}
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem',
                                        background: 'var(--ee-input)',
                                        border: '1px solid var(--ee-border)',
                                        borderRadius: 'var(--ee-radius-md)',
                                        color: 'var(--ee-foreground)',
                                        fontSize: '0.9375rem',
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button className="ee-button ee-button-secondary" onClick={() => setShowAddDialog(false)}>
                                    {t('dependencies.cancel')}
                                </button>
                                <button
                                    className="ee-button ee-button-primary"
                                    onClick={handleAddCustom}
                                    disabled={!newName.trim() || !newUrl.trim()}
                                >
                                    {t('dependencies.add')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dependencies List */}
                <div className="ee-item-list">
                    {dependencies.map((dep) => (
                        <div key={dep.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <Package size={20} style={{ color: 'var(--ee-primary)' }} />
                                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--ee-foreground)' }}>
                                        {dep.name}
                                    </h4>
                                    {dep.loaded ? (
                                        <CheckCircle2 size={16} style={{ color: 'oklch(0.7106 0.1661 142.5)' }} />
                                    ) : (
                                        <XCircle size={16} style={{ color: 'var(--ee-muted-foreground)' }} />
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <a
                                        href={dep.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: '0.8125rem', color: 'var(--ee-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                    >
                                        <ExternalLink size={14} />
                                        {t('dependencies.viewCdn')}
                                    </a>
                                    {dep.globalName && (
                                        <span style={{ fontSize: '0.8125rem', color: 'var(--ee-muted-foreground)' }}>
                                            • <code style={{
                                                padding: '0.125rem 0.375rem',
                                                background: 'var(--ee-muted)',
                                                borderRadius: '0.25rem',
                                                fontFamily: 'var(--ee-font-mono)',
                                            }}>window.{dep.globalName}</code>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                className="ee-button ee-button-primary"
                                onClick={() => handleLoad(dep.name)}
                                disabled={dep.loaded || loading.has(dep.name)}
                            >
                                {loading.has(dep.name) ? (
                                    <>{t('common.loading')}</>
                                ) : dep.loaded ? (
                                    <>{t('dependencies.loaded')}</>
                                ) : (
                                    <>
                                        <Download size={16} />
                                        {t('dependencies.load')}
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Info */}
                <div className="ee-section" style={{ background: 'var(--ee-muted)', borderColor: 'var(--ee-border)' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ee-muted-foreground)' }}>
                        {t('dependencies.infoText')}
                    </p>
                </div>
            </div>
        </div>
    );
};
