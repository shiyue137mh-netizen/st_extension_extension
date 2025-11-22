import React from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useTranslation } from '../../i18n';
import { AnimatePresence, motion } from 'framer-motion';

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

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="ee-manager-modal">
                    {/* Backdrop */}
                    <motion.div
                        className="ee-backdrop"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Modal Container */}
                    <div className="ee-modal-container" onClick={onClose}>
                        <motion.div
                            className="ee-modal-content"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            {/* Header */}
                            <div className="ee-modal-header">
                                <h1 className="ee-modal-title">{t('manager.title')}</h1>
                                <button className="ee-modal-close" onClick={onClose}>
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            {children}
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};
