import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalTheme = 'parchment' | 'dark' | 'urgent' | 'royal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: ModalSize;
  theme?: ModalTheme;
  showClose?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  image?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  theme = 'parchment',
  showClose = true,
  children,
  footer,
  image
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Size classes
  const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw] max-h-[90vh]'
  };

  // Theme classes
  const themeClasses: Record<ModalTheme, { container: string; header: string; body: string }> = {
    parchment: {
      container: 'bg-[#f4efe4] border-[#8b7355]',
      header: 'bg-[#d4c4a8] text-[#2c241b] border-[#8b7355]',
      body: 'text-[#2c241b]'
    },
    dark: {
      container: 'bg-[#1a1a1a] border-[#3a3a3a]',
      header: 'bg-[#2a2a2a] text-[#f4efe4] border-[#3a3a3a]',
      body: 'text-[#e0e0e0]'
    },
    urgent: {
      container: 'bg-[#2c1810] border-[#b91c1c]',
      header: 'bg-[#7f1d1d] text-[#fef2f2] border-[#b91c1c]',
      body: 'text-[#fecaca]'
    },
    royal: {
      container: 'bg-[#1e1b4b] border-[#6366f1]',
      header: 'bg-[#312e81] text-[#e0e7ff] border-[#6366f1]',
      body: 'text-[#c7d2fe]'
    }
  };

  const currentTheme = themeClasses[theme];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`
          relative w-full ${sizeClasses[size]}
          ${currentTheme.container}
          border-2 rounded-lg shadow-2xl
          transform transition-all duration-300
          animate-in fade-in zoom-in-95
          font-serif overflow-hidden
        `}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className={`
            flex items-center justify-between px-6 py-4
            ${currentTheme.header} border-b
          `}>
            <div>
              {title && (
                <h2 className="text-xl font-bold tracking-wide">{title}</h2>
              )}
              {subtitle && (
                <p className="text-sm opacity-70 mt-1">{subtitle}</p>
              )}
            </div>
            {showClose && (
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-black/10 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Image (optional hero image) */}
        {image && (
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        {/* Body */}
        <div className={`
          px-6 py-4 ${currentTheme.body}
          max-h-[60vh] overflow-y-auto
          scrollbar-thin scrollbar-thumb-[#8b7355] scrollbar-track-transparent
        `}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`
            px-6 py-4 border-t ${currentTheme.header}
            flex items-center justify-end gap-3
          `}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Button components for modal actions
export const ModalButton: React.FC<{
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  disabled?: boolean;
}> = ({ onClick, variant = 'primary', children, disabled }) => {
  const variants = {
    primary: 'bg-[#b45309] hover:bg-[#92400e] text-white',
    secondary: 'bg-[#6b7280] hover:bg-[#4b5563] text-white',
    danger: 'bg-[#dc2626] hover:bg-[#b91c1c] text-white'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded font-medium transition-colors
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {children}
    </button>
  );
};

export default Modal;
