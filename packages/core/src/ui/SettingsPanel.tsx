import React from 'react';
import { Settings } from 'lucide-react';
import { globalRegistry } from '../index';
import { useTranslation } from '../i18n';

export const SettingsPanel = () => {
    const { t } = useTranslation();
    const [enabled, setEnabled] = React.useState(true);

    // Load enabled state
    React.useEffect(() => {
        if (globalRegistry.settingsManager) {
            setEnabled(globalRegistry.settingsManager.get('core', 'enabled', true));
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
            globalRegistry.uiManager.openManager();
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
                <button
                    onClick={handleOpenManager}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors font-medium"
                >
                    <Settings size={18} />
                    打开管理面板
                </button>

                {/* Info */}
                <div className="mt-4 p-3 bg-zinc-900 rounded-md border border-zinc-700">
                    <p className="text-xs text-zinc-400">
                        💡 点击上方按钮打开完整管理界面，查看框架、依赖和扩展详情。
                    </p>
                </div>
            </div>
        </div>
    );
};
