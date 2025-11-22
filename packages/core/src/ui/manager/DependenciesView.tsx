import React, { useState, useMemo } from 'react';
import { Package, Download, Plus, ExternalLink, CheckCircle2, XCircle, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { globalRegistry } from '../../index';
import { useTranslation } from '../../i18n';

export const DependenciesView: React.FC = () => {
    const { t } = useTranslation();
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [newName, setNewName] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [newGlobal, setNewGlobal] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [loading, setLoading] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    const dependencies = globalRegistry.dependencyManager?.getAllDependencies() || [];

    // Filter dependencies by search term
    const filteredDependencies = useMemo(() => {
        if (!searchTerm.trim()) return dependencies;

        const term = searchTerm.toLowerCase();
        return dependencies.filter(dep =>
            dep.name.toLowerCase().includes(term) ||
            dep.description?.toLowerCase().includes(term) ||
            dep.globalName.toLowerCase().includes(term)
        );
    }, [dependencies, searchTerm]);

    const handleLoad = async (name: string) => {
        if (!globalRegistry.dependencyManager) return;
        setLoading(prev => new Set(prev).add(name));
        try {
            await globalRegistry.dependencyManager.load(name);
            // Auto-enable autoload when manually loaded
            globalRegistry.dependencyManager.setAutoload(name, true);
        } finally {
            setLoading(prev => {
                const next = new Set(prev);
                next.delete(name);
                return next;
            });
        }
    };

    const handleToggleAutoload = (name: string, currentStatus: boolean) => {
        if (!globalRegistry.dependencyManager) return;
        globalRegistry.dependencyManager.setAutoload(name, !currentStatus);
        window.location.reload(); // Refresh to update UI
    };

    const handleLoadAll = async () => {
        if (!globalRegistry.dependencyManager) return;
        const names = filteredDependencies.map(d => d.name);
        for (const name of names) {
            if (!dependencies.find(d => d.name === name)?.loaded) {
                await handleLoad(name);
            }
        }
    };

    const handleAddCustom = () => {
        if (!globalRegistry.dependencyManager || !newName.trim() || !newUrl.trim()) return;
        globalRegistry.dependencyManager.register(newName.trim(), newUrl.trim(), newGlobal.trim() || '', newDescription.trim());
        setNewName('');
        setNewUrl('');
        setNewGlobal('');
        setNewDescription('');
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

                {/* Search Bar */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search
                            size={18}
                            style={{
                                position: 'absolute',
                                left: '0.875rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--ee-muted)',
                                opacity: 0.5
                            }}
                        />
                        <input
                            type="text"
                            className="ee-input"
                            placeholder="搜索依赖库..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.75rem' }}
                        />
                    </div>
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
                        <h3 className="ee-section-title">添加自定义依赖</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <input
                                type="text"
                                className="ee-input"
                                placeholder="名称 (e.g., moment)"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <input
                                type="text"
                                className="ee-input"
                                placeholder="CDN URL"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                            />
                            <input
                                type="text"
                                className="ee-input"
                                placeholder="全局变量名 (e.g., moment)"
                                value={newGlobal}
                                onChange={(e) => setNewGlobal(e.target.value)}
                            />
                            <input
                                type="text"
                                className="ee-input"
                                placeholder="描述 (可选)"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="ee-button ee-button-primary" onClick={handleAddCustom}>
                                    添加
                                </button>
                                <button className="ee-button ee-button-secondary" onClick={() => setShowAddDialog(false)}>
                                    取消
                                </button>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--ee-muted)', marginTop: '0.75rem' }}>
                            💡 共享依赖从 CDN 加载，全局 window 后可为所有扩展使用。这减少了重复加载，减小打包大小。
                        </p>
                    </div>
                )}

                {/* Dependencies List */}
                <div className="ee-section">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {filteredDependencies.map(dep => (
                            <div
                                key={dep.name}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    background: 'var(--ee-card)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--ee-border)'
                                }}
                            >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <Package size={16} style={{ color: 'var(--ee-foreground)' }} />
                                        <span style={{ fontWeight: 500, color: 'var(--ee-foreground)' }}>
                                            {dep.name}
                                        </span>
                                        {dep.loaded ? (
                                            <CheckCircle2 size={14} style={{ color: 'var(--ee-success)' }} />
                                        ) : (
                                            <XCircle size={14} style={{ color: 'var(--ee-muted)', opacity: 0.5 }} />
                                        )}
                                        {dep.url === 'bundled' && (
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '0.125rem 0.5rem',
                                                background: 'var(--ee-primary)',
                                                color: 'white',
                                                borderRadius: '4px',
                                                fontWeight: 500
                                            }}>
                                                内置
                                            </span>
                                        )}
                                        {dep.url === 'preloaded' && (
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '0.125rem 0.5rem',
                                                background: 'var(--ee-success)',
                                                color: 'white',
                                                borderRadius: '4px',
                                                fontWeight: 500
                                            }}>
                                                预加载
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--ee-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                                        {dep.url !== 'bundled' && dep.url !== 'preloaded' && (
                                            <>
                                                <ExternalLink size={12} style={{ color: 'var(--ee-foreground)' }} />
                                                <a
                                                    href={dep.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: 'var(--ee-foreground)', textDecoration: 'none' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                                                >
                                                    查看 CDN
                                                </a>
                                                <span>•</span>
                                            </>
                                        )}
                                        <code style={{ fontSize: '0.75rem', opacity: 0.8 }}>window.{dep.globalName}</code>
                                    </div>
                                    {dep.description && (
                                        <p style={{ fontSize: '0.875rem', color: 'var(--ee-foreground)', opacity: 0.7, margin: 0 }}>
                                            {dep.description}
                                        </p>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {/* Autoload Toggle */}
                                    {dep.url !== 'bundled' && dep.url !== 'preloaded' && (
                                        <button
                                            className="ee-button ee-button-sm"
                                            onClick={() => handleToggleAutoload(dep.name, !!dep.autoload)}
                                            title={dep.autoload ? '自动加载已启用' : '自动加载已禁用'}
                                            style={{
                                                padding: '0.375rem 0.625rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                background: dep.autoload ? 'var(--ee-success)' : 'var(--ee-muted)',
                                                color: 'white',
                                                opacity: dep.autoload ? 1 : 0.6
                                            }}
                                        >
                                            {dep.autoload ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                            <span style={{ fontSize: '0.75rem' }}>
                                                {dep.autoload ? '自动' : '手动'}
                                            </span>
                                        </button>
                                    )}
                                    {/* Load Button */}
                                    {!dep.loaded && dep.url !== 'bundled' && dep.url !== 'preloaded' && (
                                        <button
                                            className="ee-button ee-button-primary ee-button-sm"
                                            onClick={() => handleLoad(dep.name)}
                                            disabled={loading.has(dep.name)}
                                        >
                                            {loading.has(dep.name) ? '加载中...' : '加载'}
                                        </button>
                                    )}
                                    {dep.loaded && (
                                        <span
                                            style={{
                                                fontSize: '0.75rem',
                                                padding: '0.375rem 0.75rem',
                                                background: 'oklch(0.6522 0.1745 142.5 / 0.15)',
                                                color: 'var(--ee-success)',
                                                borderRadius: '6px',
                                                fontWeight: 500
                                            }}
                                        >
                                            已加载
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
