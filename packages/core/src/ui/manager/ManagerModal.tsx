import React from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useTranslation } from '../../i18n';

interface ManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const ManagerModal: React.FC<ManagerModalProps> = ({ isOpen, onClose, children }) => {
    const { t } = useTranslation();
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="ee-manager-modal">
            {/* Backdrop */}
            <div className="ee-backdrop" onClick={onClose} />

            {/* Modal Container */}
            <div className="ee-modal-container" onClick={onClose}>
                <div className="ee-modal-content" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="ee-modal-header">
                        <h1 className="ee-modal-title">{t('manager.title')}</h1>
                        <button className="ee-modal-close" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
