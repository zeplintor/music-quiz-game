
import { useEffect, useRef } from 'react';

export function usePopupClose(
  isOpen: boolean,
  onClose: () => void,
  closeOnOutsideClick: boolean = true,
  closeOnEscape: boolean = true
) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        closeOnOutsideClick &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (closeOnEscape) {
      document.addEventListener('keydown', handleEscape);
    }
    
    if (closeOnOutsideClick) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      if (closeOnEscape) {
        document.removeEventListener('keydown', handleEscape);
      }
      if (closeOnOutsideClick) {
        document.removeEventListener('mousedown', handleOutsideClick);
      }
    };
  }, [isOpen, onClose, closeOnEscape, closeOnOutsideClick]);

  return popupRef;
}
