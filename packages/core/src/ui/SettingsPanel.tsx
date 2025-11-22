import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@extension-extension/ui';
import { globalRegistry } from '../index';

export const SettingsPanel = () => {
    // General settings state
    const [enabled, setEnabled] = useState(true);
    const [autoLoadVue, setAutoLoadVue] = useState(false);
    const [autoLoadReact, setAutoLoadReact] = useState(false);
    const [enableScopeBinding, setEnableScopeBinding] = useState(true);
    const [enableDependencySharing, setEnableDependencySharing] = useState(true);
    const [debugMode, setDebugMode] = useState(false);

    // Load settings on mount
    useEffect(() => {
        if (globalRegistry.settingsManager) {
            setEnabled(globalRegistry.settingsManager.get('core', 'enabled', true));
            setAutoLoadVue(globalRegistry.settingsManager.get('core', 'autoLoadVue', false));
            setAutoLoadReact(globalRegistry.settingsManager.get('core', 'autoLoadReact', false));
            setEnableScopeBinding(globalRegistry.settingsManager.get('core', 'enableScopeBinding', true));
            setEnableDependencySharing(globalRegistry.settingsManager.get('core', 'enableDependencySharing', true));
            setDebugMode(globalRegistry.settingsManager.get('core', 'debugMode', false));
        }
    }, []);

    // Save setting helper
    const saveSetting = (key: string, value: any) => {
        if (globalRegistry.settingsManager) {
            globalRegistry.settingsManager.set('core', key, value);
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
                    为其他扩展提供 Vue、React 等现代前端框架支持，包含智能依赖管理和作用域绑定功能。
                </p>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="general">常规</TabsTrigger>
                        <TabsTrigger value="extensions">扩展</TabsTrigger>
                        <TabsTrigger value="dependencies">依赖</TabsTrigger>
                        <TabsTrigger value="frameworks">框架</TabsTrigger>
                    </TabsList>

                    {/* General Settings Tab */}
                    <TabsContent value="general" className="space-y-4">
                        <div className="space-y-3">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={enabled}
                                    onChange={(e) => {
                                        setEnabled(e.target.checked);
                                        saveSetting('enabled', e.target.checked);
                                    }}
                                    className="form-checkbox"
                                />
                                <span className="text-sm">启用扩展的扩展</span>
                            </label>
                            <p className="text-xs text-zinc-500 ml-6">启用后，其他扩展可以使用框架提供的功能</p>
                        </div>

                        <hr className="border-zinc-700" />

                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold">配置选项</h4>

                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={autoLoadVue}
                                    onChange={(e) => {
                                        setAutoLoadVue(e.target.checked);
                                        saveSetting('autoLoadVue', e.target.checked);
                                    }}
                                    className="form-checkbox"
                                />
                                <span className="text-sm">自动加载 Vue 3</span>
                            </label>

                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={autoLoadReact}
                                    onChange={(e) => {
                                        setAutoLoadReact(e.target.checked);
                                        saveSetting('autoLoadReact', e.target.checked);
                                    }}
                                    className="form-checkbox"
                                />
                                <span className="text-sm">自动加载 React 18</span>
                            </label>

                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={enableScopeBinding}
                                    onChange={(e) => {
                                        setEnableScopeBinding(e.target.checked);
                                        saveSetting('enableScopeBinding', e.target.checked);
                                    }}
                                    className="form-checkbox"
                                />
                                <span className="text-sm">启用作用域绑定</span>
                            </label>

                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={enableDependencySharing}
                                    onChange={(e) => {
                                        setEnableDependencySharing(e.target.checked);
                                        saveSetting('enableDependencySharing', e.target.checked);
                                    }}
                                    className="form-checkbox"
                                />
                                <span className="text-sm">启用依赖共享</span>
                            </label>

                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={debugMode}
                                    onChange={(e) => {
                                        setDebugMode(e.target.checked);
                                        saveSetting('debugMode', e.target.checked);
                                    }}
                                    className="form-checkbox"
                                />
                                <span className="text-sm">调试模式</span>
                            </label>
                        </div>
                    </TabsContent>

                    {/* Extensions Tab */}
                    <TabsContent value="extensions" className="space-y-4">
                        <div className="text-center py-8 text-zinc-500">
                            <p className="text-sm">扩展管理功能开发中...</p>
                            <p className="text-xs mt-2">将显示所有加载的扩展及其状态</p>
                        </div>
                    </TabsContent>

                    {/* Dependencies Tab */}
                    <TabsContent value="dependencies" className="space-y-4">
                        <div className="text-center py-8 text-zinc-500">
                            <p className="text-sm">依赖管理功能开发中...</p>
                            <p className="text-xs mt-2">将显示所有已注册的共享依赖</p>
                        </div>
                    </TabsContent>

                    {/* Frameworks Tab */}
                    <TabsContent value="frameworks" className="space-y-4">
                        <div className="text-center py-8 text-zinc-500">
                            <p className="text-sm">框架管理功能开发中...</p>
                            <p className="text-xs mt-2">将显示 Vue 和 React 的加载状态</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
