import React, { createContext, useContext, useState, ReactNode } from 'react';
import AlertMessage, { AlertType } from '../components/alert/AlertMessage';

interface AlertContextProps {
  showAlert: (type: AlertType, message: string, description?: string) => void;
  hideAlert: () => void;
  alertState: AlertState;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

interface AlertState {
  visible: boolean;
  type: AlertType;
  message: string;
  description?: string;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    type: 'info',
    message: '',
  });

  const showAlert = (type: AlertType, message: string, description?: string) => {
    setAlert({
      visible: true,
      type,
      message,
      description,
    });

    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
      setTimeout(() => {
        hideAlert();
      }, 5000);
    }
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, alertState: alert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextProps => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
