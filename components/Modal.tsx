import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    }
  }, [isOpen]);
  
  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsMounted(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex justify-center items-center`}
      aria-modal="true"
      role="dialog"
    >
      {/* New overlay div. It fades in/out. */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'bg-opacity-30' : 'bg-opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Modal content. It scales in/out. Has backdrop-blur. */}
      <div 
        className={`bg-white/30 dark:bg-slate-900/50 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-lg shadow-2xl w-full max-w-2xl mx-4 p-6 relative transition-all duration-300 ease-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={handleAnimationEnd}
      >
        <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 text-shadow-strong">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:text-slate-100"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};