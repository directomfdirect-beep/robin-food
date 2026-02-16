import React, { useEffect, useRef } from 'react';

/**
 * DS v3 Bottom Sheet
 * Drag handle 36x4px, radius.l top, 40% black overlay, max 90% height
 */
export const BottomSheet = ({
  children,
  isOpen = false,
  onClose,
  title,
  className = '',
}) => {
  const sheetRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9000] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`
          relative w-full max-h-[90vh] bg-base-card-elevated
          rounded-t-ds-l overflow-hidden
          animate-sheet-up
          ${className}
        `}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 rounded-full bg-base-divider" />
        </div>

        {/* Title */}
        {title && (
          <div className="px-ds-l pb-ds-m">
            <h3 className="ds-heading-l text-base-text-primary">{title}</h3>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto px-ds-l pb-ds-l">
          {children}
        </div>
      </div>
    </div>
  );
};
