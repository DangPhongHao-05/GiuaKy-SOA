import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    title,
    onClose,
    children,
    maxWidth = 'md',
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const widthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    }[maxWidth];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Modal Box */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={`relative w-full ${widthClasses} bg-white p-5 border-2 border-gray-800 shadow-lg text-left`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-300">
                        <h3 className="text-sm font-bold text-gray-900 tracking-tight font-mono">
                            {title}
                        </h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-2 py-0.5 border border-gray-300 hover:border-gray-500 bg-gray-50 text-gray-700 text-xs font-mono cursor-pointer"
                        >
                            [Đóng]
                        </button>
                    </div>

                    <div>{children}</div>
                </div>
            </div>
        </div>
    );
};
