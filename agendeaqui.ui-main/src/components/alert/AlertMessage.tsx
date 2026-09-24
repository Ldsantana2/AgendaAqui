import React from 'react';
import { Alert } from 'antd';

export type AlertType = 'success' | 'info' | 'warning' | 'error';

export interface AlertMessageProps {
  type: AlertType;
  message: string;
  description?: string;
  showIcon?: boolean;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

/**
 * AlertMessage component for displaying feedback messages to the user
 * 
 * @param type - Type of alert: success (green), warning (yellow), error (red), or info (blue)
 * @param message - Main message to display
 * @param description - Optional detailed description
 * @param showIcon - Whether to show the status icon
 * @param closable - Whether the alert can be closed
 * @param onClose - Callback when alert is closed
 * @param className - Additional CSS class names
 */
const AlertMessage: React.FC<AlertMessageProps> = ({
  type,
  message,
  description,
  showIcon = true,
  closable = true,
  onClose,
  className,
}) => {
  return (
    <Alert
      type={type}
      message={message}
      description={description}
      showIcon={showIcon}
      closable={closable}
      onClose={onClose}
      className={`mb-4 ${className || ''}`}
    />
  );
};

export default AlertMessage;