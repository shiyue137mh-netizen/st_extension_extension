import React from 'react';
import { Settings } from 'lucide-react';
import { globalRegistry } from '../index';

export const SettingsPanel = () => {
    const [enabled, setEnabled] = React.useState(true);

    // Load enabled state
    React.useEffect(() => {
        if (globalRegistry.settingsManager) {
            const isEnabled = globalRegistry.settingsManager.get('core', 'enabled', true);
            setEnabled(isEnabled === true);
        }
    }, []);

    const handleToggleEnabled = (checked: boolean) => {
        setEnabled(checked);
        if (globalRegistry.settingsManager) {
            globalRegistry.settingsManager.set('core', 'enabled', checked);
        }
    };

    const handleOpenManager = () => {
        if (globalRegistry.uiManager) {
            globalRegistry.uiManager.open();
        }
    };

    return (
        <div className="inline-drawer">
            <div className="inline-drawer-toggle inline-drawer-header">
                <b>Extension Extension V2</b>
                <div className="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div className="inline-drawer-content">
                <p className="text-sm text-zinc-400 mb-4">
                    为其他扩展提供现代前端框架和依赖管理支持。
                </p>

                {/* Enable Toggle */}
                <div className="flex items-center justify-between mb-4 p-3 bg-zinc-800 rounded-md">
                    <div className="flex-1">
                        <div className="text-sm font-medium">启用扩展</div>
                        <div className="text-xs text-zinc-500 mt-1">
                            启用后，其他扩展可以使用提供的框架和依赖
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => handleToggleEnabled(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                {/* Open Manager Button */}
                <div style={{ marginBottom: '1rem' }}>
                    <button
                        onClick={handleOpenManager}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors font-medium"
                        style={{
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        <Settings size={18} />
                        🧩 打开管理面板
                    </button>
                </div>

                {/* Info */}
                <div className="mt-4 p-3 bg-zinc-900 rounded-md border border-zinc-700">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>💡</span>
                        <p className="text-xs font-medium" style={{ margin: 0, color: '#e4e4e7' }}>
                            提示
                        </p>
                    </div>
                    <p className="text-xs text-zinc-400" style={{ margin: 0, lineHeight: '1.5' }}>
                        点击上方按钮打开完整管理界面，查看框架、依赖和扩展详情。
                    </p>
                </div>

                {/* Version and GitHub */}
                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'rgba(24, 24, 27, 0.8)',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid rgba(63, 63, 70, 0.5)'
                }}>
                    <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                        v2.0.0
                    </span>
                    <a
                        href="https://github.com/shiyue137mh-netizen/st_extension_extension.git"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            color: '#e4e4e7',
                            textDecoration: 'none',
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.625rem',
                            background: 'rgba(63, 63, 70, 0.5)',
                            borderRadius: '4px',
                            border: '1px solid rgba(82, 82, 91, 0.5)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(37, 99, 235, 1)';
                            e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(63, 63, 70, 0.5)';
                            e.currentTarget.style.borderColor = 'rgba(82, 82, 91, 0.5)';
                        }}
                    >
                        <svg
                            viewBox="0 0 16 16"
                            width="14"
                            height="14"
                            fill="currentColor"
                        >
                            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                        </svg>
                        GitHub
                    </a>
                </div>
            </div>
        </div>
    );
};
