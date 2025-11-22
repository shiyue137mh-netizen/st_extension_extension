import React, { useState, useEffect, useMemo } from 'react';
import {
    Puzzle, Power, PowerOff, Info,
    Search, Tag, Download, Globe, Link as LinkIcon, Settings,
    Box, Users
} from 'lucide-react';

interface ExtensionMetadata {
    name?: string;
    version?: string;
    author?: string;
    description?: string;
    enabled?: boolean;
    registered?: boolean;
    tags?: string[];
    source?: string;
    requires?: string[];
    supportsSoftToggle?: boolean;
}

type TabType = 'all' | 'local' | 'third-party';
type ScopeFilterType = 'all' | 'global' | 'bound';

export const ExtensionsView: React.FC = () => {
    const [extensions, setExtensions] = useState<Record<string, ExtensionMetadata>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [scopeFilter, setScopeFilter] = useState<ScopeFilterType>('all');
    const [showBindingPopover, setShowBindingPopover] = useState<string | null>(null);

    useEffect(() => {
        loadExtensions();

        // Retry loading extensions after a short delay to ensure ST has loaded them
        const timer = setTimeout(loadExtensions, 1000);
        return () => clearTimeout(timer);
    }, []);

    const loadExtensions = () => {
        const st = (window as any).ExtensionExtension?.st;
        if (!st) {
            console.warn('ExtensionExtension.st not available');
            return;
        }

        // Step 1: Get list of ALL installed extensions from SillyTavern
        let extNames = st.extensionNames || [];

        // Fallback: Check extension_settings keys if extensionNames is empty
        if (extNames.length === 0 && st.extension_settings) {
            const settingsKeys = Object.keys(st.extension_settings).filter(k => k !== 'extensionExtension');
            if (settingsKeys.length > 0) {
                console.log('[ExtensionExtension] Using extension_settings keys as fallback:', settingsKeys);
                extNames = settingsKeys;
            }
        }

        // Step 2: Get registered metadata
        let registeredMetadata: Record<string, ExtensionMetadata> = {};
        if (st.extension_settings) {
            const extSettings = st.extension_settings.extensionExtension;
            if (extSettings && extSettings.extensionMetadata) {
                registeredMetadata = extSettings.extensionMetadata;
            }
        }

        // Step 3: Merge both sources
        const allExtensions: Record<string, ExtensionMetadata> = {};

        // Process ALL installed extensions
        extNames.forEach((id: string) => {
            const metadata = registeredMetadata[id] || {};

            // Generate display name if not registered
            const displayName = metadata.name || id
                .replace('third-party/', '')
                .replace(/-/g, ' ')
                .replace(/_/g, ' ')
                .split(' ')
                .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');

            // Check if extension is disabled in SillyTavern
            const isDisabled = st.extension_settings.disabledExtensions?.includes(id) || false;

            allExtensions[id] = {
                name: displayName,
                version: metadata.version || '未知',
                author: metadata.author,
                description: metadata.description || '该扩展未提供描述信息',
                enabled: !isDisabled, // Inverse of disabled
                registered: !!metadata.name,
                tags: metadata.tags || [],
                source: metadata.source,
                requires: metadata.requires || [],
                supportsSoftToggle: metadata.supportsSoftToggle,
                ...metadata
            };
        });

        setExtensions(allExtensions);
    };

    const handleToggle = (id: string) => {
        const st = (window as any).ExtensionExtension?.st;
        if (!st || !st.extension_settings) return;

        const currentlyDisabled = st.extension_settings.disabledExtensions?.includes(id);

        if (currentlyDisabled) {
            // Enable extension
            st.extension_settings.disabledExtensions = st.extension_settings.disabledExtensions.filter((x: string) => x !== id);
        } else {
            // Disable extension
            if (!st.extension_settings.disabledExtensions) {
                st.extension_settings.disabledExtensions = [];
            }
            st.extension_settings.disabledExtensions.push(id);
        }

        // Save settings
        if ((window as any).saveSettingsDebounced) {
            (window as any).saveSettingsDebounced();
        }

        // Update local state
        setExtensions(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                enabled: currentlyDisabled // Inverse
            }
        }));
    };

    const handleBind = (id: string) => {
        const st = (window as any).ExtensionExtension?.st;
        const currentCharName = st?.currentCharacterName;

        if (!currentCharName) {
            alert('请先选择一个角色');
            return;
        }

        const scopeManager = (window as any).ExtensionExtension.scopeManager;

        if (scopeManager) {
            scopeManager.bindToCharacter(id, currentCharName);
            loadExtensions();
            (window as any).ExtensionExtension.emit('characterChanged', currentCharName);
        }
    };

    const handleUnbind = (id: string, characterName?: string) => {
        const scopeManager = (window as any).ExtensionExtension.scopeManager;

        if (scopeManager) {
            if (characterName) {
                scopeManager.unbindFromCharacter(id, characterName);
            } else {
                const st = (window as any).ExtensionExtension?.st;
                const currentCharName = st?.currentCharacterName;
                if (currentCharName) {
                    scopeManager.unbindFromCharacter(id, currentCharName);
                }
            }
            loadExtensions();
            const st = (window as any).ExtensionExtension?.st;
            const currentCharName = st?.currentCharacterName;
            if (currentCharName) {
                (window as any).ExtensionExtension.emit('characterChanged', currentCharName);
            }
        }
    };

    const isBoundToCurrentChar = (id: string) => {
        const st = (window as any).ExtensionExtension?.st;
        const currentCharName = st?.currentCharacterName;
        if (!currentCharName) return false;

        const scopeManager = (window as any).ExtensionExtension.scopeManager;
        return scopeManager ? scopeManager.isBoundToCharacter(id, currentCharName) : false;
    };

    const hasAnyBindings = (id: string) => {
        const scopeManager = (window as any).ExtensionExtension.scopeManager;
        return scopeManager ? scopeManager.hasBindings(id) : false;
    };

    const getBoundCharacters = (id: string): string[] => {
        const scopeManager = (window as any).ExtensionExtension.scopeManager;
        if (!scopeManager) return [];

        const bindings = scopeManager.getAllBindings();
        return bindings[id]?.targets || [];
    };

    const getCharacterName = (characterName: string): string => {
        // characterName is already the name, just return it
        return characterName;
    };

    const st = (window as any).ExtensionExtension?.st;
    const currentCharName = st?.currentCharacterName;

    // Filter and Sort Logic
    const filteredExtensions = useMemo(() => {
        return Object.keys(extensions).filter(id => {
            const ext = extensions[id];
            const isThirdParty = id.startsWith('third-party/');

            // Tab Filter
            if (activeTab === 'local' && isThirdParty) return false;
            if (activeTab === 'third-party' && !isThirdParty) return false;

            // Scope Filter
            const isBound = isBoundToCurrentChar(id);
            const isRestricted = hasAnyBindings(id);

            if (scopeFilter === 'bound' && !isBound) return false;
            if (scopeFilter === 'global' && isRestricted) return false;

            // Search Filter
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const matchName = ext.name?.toLowerCase().includes(term);
                const matchId = id.toLowerCase().includes(term);
                const matchDesc = ext.description?.toLowerCase().includes(term);
                const matchTags = ext.tags?.some(tag => tag.toLowerCase().includes(term));

                if (!matchName && !matchId && !matchDesc && !matchTags) return false;
            }

            return true;
        });
    }, [extensions, searchTerm, activeTab, scopeFilter, currentCharName]);

    const enabledCount = Object.values(extensions).filter(e => e.enabled).length;

    return (
        <div className="ee-content">
            <div className="ee-dashboard">
                <div className="ee-dashboard-header">
                    <h2 className="ee-dashboard-title">扩展管理</h2>
                    <p className="ee-dashboard-subtitle">
                        管理已安装的扩展 ({enabledCount}/{Object.keys(extensions).length} 启用)
                        {currentCharName && (
                            <span style={{ marginLeft: '1rem', fontSize: '0.8rem', opacity: 0.8 }}>
                                当前角色: {currentCharName}
                            </span>
                        )}
                    </p>
                </div>

                {/* Controls Section */}
                <div className="ee-controls-section">
                    {/* Search Bar */}
                    <div className="ee-search-bar">
                        <Search size={18} className="ee-search-icon" />
                        <input
                            type="text"
                            className="ee-input"
                            placeholder="搜索扩展 (名称, ID, 标签...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Tabs & Filters */}
                    <div className="ee-filters-row">
                        <div className="ee-tabs">
                            <button
                                className={`ee-tab ${activeTab === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveTab('all')}
                            >
                                全部
                            </button>
                            <button
                                className={`ee-tab ${activeTab === 'local' ? 'active' : ''}`}
                                onClick={() => setActiveTab('local')}
                            >
                                <Box size={14} />
                                本地内置
                            </button>
                            <button
                                className={`ee-tab ${activeTab === 'third-party' ? 'active' : ''}`}
                                onClick={() => setActiveTab('third-party')}
                            >
                                <Download size={14} />
                                第三方
                            </button>
                        </div>

                        <div className="ee-scope-filter">
                            <select
                                className="ee-select"
                                value={scopeFilter}
                                onChange={(e) => setScopeFilter(e.target.value as ScopeFilterType)}
                            >
                                <option value="all">所有作用域</option>
                                <option value="global">全局生效</option>
                                <option value="bound">已绑定角色</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Extensions List */}
                {filteredExtensions.length === 0 ? (
                    <div className="ee-section" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                        <Puzzle size={48} style={{ color: 'var(--ee-muted-foreground)', margin: '0 auto 1.5rem' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--ee-foreground)', margin: '0 0 0.75rem 0' }}>
                            没有找到扩展
                        </h3>
                        <p style={{ fontSize: '0.9375rem', color: 'var(--ee-muted-foreground)', margin: 0 }}>
                            尝试调整搜索条件或筛选器
                        </p>
                        <button
                            className="ee-button ee-button-primary"
                            style={{ marginTop: '1.5rem' }}
                            onClick={loadExtensions}
                        >
                            刷新列表
                        </button>
                    </div>
                ) : (
                    <div className="ee-grid-list">
                        {filteredExtensions.map((id) => {
                            const ext = extensions[id];
                            const isBound = isBoundToCurrentChar(id);
                            const isRestricted = hasAnyBindings(id);
                            const isThirdParty = id.startsWith('third-party/');
                            const boundChars = getBoundCharacters(id);

                            let bindingDisplay = null;
                            if (boundChars.length > 0) {
                                const firstCharName = getCharacterName(boundChars[0]);
                                if (boundChars.length === 1) {
                                    bindingDisplay = firstCharName;
                                } else {
                                    bindingDisplay = `${firstCharName}...`;
                                }
                            }

                            return (
                                <div key={id} className="ee-extension-card">
                                    <div className="ee-card-header">
                                        <div className="ee-card-icon">
                                            <Puzzle size={24} />
                                        </div>
                                        <div className="ee-card-title-area">
                                            <h3 className="ee-card-title">{ext.name}</h3>
                                            <div className="ee-card-badges">
                                                {ext.version && <span className="ee-badge ee-badge-muted">v{ext.version}</span>}
                                                {isThirdParty ? (
                                                    <span className="ee-badge ee-badge-blue">第三方</span>
                                                ) : (
                                                    <span className="ee-badge ee-badge-gray">内置</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="ee-card-actions-top">
                                            <button
                                                className={`ee-icon-button ${ext.enabled ? 'active' : ''}`}
                                                onClick={() => handleToggle(id)}
                                                title={ext.enabled ? '禁用扩展' : '启用扩展'}
                                            >
                                                {ext.enabled ? <Power size={18} /> : <PowerOff size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="ee-card-body">
                                        <p className="ee-card-desc">{ext.description}</p>

                                        {ext.tags && ext.tags.length > 0 && (
                                            <div className="ee-card-tags">
                                                {ext.tags.map(tag => (
                                                    <span key={tag} className="ee-tag">
                                                        <Tag size={10} /> {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="ee-card-meta">
                                            <div className="ee-meta-item">
                                                <span className="ee-label">ID:</span>
                                                <code className="ee-code">{id}</code>
                                            </div>
                                            {ext.author && (
                                                <div className="ee-meta-item">
                                                    <span className="ee-label">作者:</span>
                                                    <span>{ext.author}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="ee-card-footer">
                                        {/* Binding Status */}
                                        <div className="ee-scope-status" style={{ position: 'relative' }}>
                                            {isBound ? (
                                                <span className="ee-status-text ee-text-primary">
                                                    <LinkIcon size={14} /> 已绑定当前角色
                                                </span>
                                            ) : isRestricted ? (
                                                <>
                                                    <button
                                                        className="ee-button-text ee-text-muted"
                                                        onClick={() => setShowBindingPopover(showBindingPopover === id ? null : id)}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                                                    >
                                                        <Users size={14} /> {bindingDisplay}
                                                    </button>
                                                    {showBindingPopover === id && (
                                                        <div className="ee-popover">
                                                            <div className="ee-popover-header">
                                                                <strong>已绑定角色</strong>
                                                                <button
                                                                    className="ee-popover-close"
                                                                    onClick={() => setShowBindingPopover(null)}
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                            <div className="ee-popover-list">
                                                                {boundChars.map(charId => (
                                                                    <div key={charId} className="ee-popover-item">
                                                                        <span>{getCharacterName(charId)}</span>
                                                                        <button
                                                                            className="ee-button ee-button-sm ee-button-ghost"
                                                                            onClick={() => {
                                                                                handleUnbind(id, charId);
                                                                                if (boundChars.length === 1) setShowBindingPopover(null);
                                                                            }}
                                                                        >
                                                                            解绑
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="ee-status-text ee-text-success">
                                                    <Globe size={14} /> 全局生效
                                                </span>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="ee-footer-actions">
                                            {currentCharName && (
                                                isBound ? (
                                                    <button
                                                        className="ee-button ee-button-sm ee-button-primary"
                                                        onClick={() => handleUnbind(id)}
                                                        title="解除与当前角色的绑定"
                                                    >
                                                        解绑
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="ee-button ee-button-sm ee-button-primary"
                                                        onClick={() => handleBind(id)}
                                                        title="绑定到当前角色"
                                                    >
                                                        绑定当前
                                                    </button>
                                                )
                                            )}
                                            <button className="ee-button ee-button-sm ee-button-ghost" title="配置">
                                                <Settings size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Info */}
                <div className="ee-section" style={{ background: 'var(--ee-muted)', borderColor: 'var(--ee-border)', marginTop: '2rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Info size={20} style={{ color: 'var(--ee-foreground)', flexShrink: 0 }} />
                        <div style={{ fontSize: '0.875rem', color: 'var(--ee-muted-foreground)' }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 500, color: 'var(--ee-foreground)' }}>
                                关于扩展绑定
                            </p>
                            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                                <li><strong>全局生效</strong>: 扩展在所有角色下生效</li>
                                <li><strong>角色绑定</strong>: 扩展仅在特定角色下生效，切换到其他角色时自动关闭</li>
                                <li>点击角色名可查看所有绑定的角色并管理绑定</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
