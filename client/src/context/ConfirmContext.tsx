import React, { createContext, useContext, useState } from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve?: (value: boolean) => void;
  }>({
    isOpen: false,
    options: { title: '', message: '' }
  });

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setModalState({
        isOpen: true,
        options,
        resolve
      });
    });
  };

  const handleConfirm = () => {
    if (modalState.resolve) modalState.resolve(true);
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    if (modalState.resolve) modalState.resolve(false);
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {modalState.isOpen && (
        <div className="modal-backdrop" onClick={handleCancel}>
          <div
            className="modal-content"
            style={{ maxWidth: '440px', padding: '1.75rem' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: modalState.options.isDangerous ? 'var(--danger-bg)' : 'var(--primary-light)',
                  color: modalState.options.isDangerous ? 'var(--danger)' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {modalState.options.isDangerous ? <AlertCircle size={24} /> : <HelpCircle size={24} />}
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{modalState.options.title}</h3>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {modalState.options.message}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                style={{ padding: '0.6rem 1.1rem' }}
              >
                {modalState.options.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                className={`btn ${modalState.options.isDangerous ? 'btn-danger' : 'btn-primary'}`}
                onClick={handleConfirm}
                style={{ padding: '0.6rem 1.25rem' }}
              >
                {modalState.options.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ConfirmContextType => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};
