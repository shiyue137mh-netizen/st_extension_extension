import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const SettingsView: React.FC = () => {
    const { t, language, setLanguage } = useTranslation();

    return (
        <div className="ee-content">
            <div className="ee-dashboard">
                <div className="ee-dashboard-header">
                    <h2 className="ee-dashboard-title">{t('settings.title')}</h2>
                    <p className="ee-dashboard-subtitle">{t('settings.subtitle')}</p>
                </div>

                {/* Language Settings */}
                <div className="ee-section">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Globe size={20} style={{ color: 'var(--ee-primary)' }} />
                        <h3 className="ee-section-title" style={{ marginBottom: 0 }}>
                            {t('settings.language')}
                        </h3>
                    </div>
                    <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.875rem', color: 'var(--ee-muted-foreground)' }}>
                        {t('settings.languageDesc')}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                        <button
                            className={`ee-button ${language === 'zh-CN' ? 'ee-button-primary' : 'ee-button-secondary'}`}
                            onClick={() => setLanguage('zh-CN')}
                            style={{
                                justifyContent: 'center',
                                padding: '0.875rem 1.25rem',
                            }}
                        >
                            🇨🇳 简体中文
                        </button>
                        <button
                            className={`ee-button ${language === 'en-US' ? 'ee-button-primary' : 'ee-button-secondary'}`}
                            onClick={() => setLanguage('en-US')}
                            style={{
                                justifyContent: 'center',
                                padding: '0.875rem 1.25rem',
                            }}
                        >
                            🇺🇸 English
                        </button>
                    </div>
                </div>

                {/* Theme Settings (Placeholder) */}
                <div className="ee-section" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                    <h3 className="ee-section-title">{t('settings.theme')}</h3>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ee-muted-foreground)' }}>
                        {t('settings.themeDesc')}
                    </p>
                </div>

                {/* Info */}
                <div className="ee-section" style={{ background: 'var(--ee-muted)', borderColor: 'var(--ee-border)' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ee-muted-foreground)' }}>
                        v2.0.0 - Extension Extension
                    </p>
                </div>
            </div>
        </div>
    );
};
