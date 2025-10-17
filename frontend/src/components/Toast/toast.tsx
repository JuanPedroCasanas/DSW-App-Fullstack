import React, { useEffect } from "react";
import "./Toast.css";

export interface ToastProps {
  type: "success" | "error";
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  duration = 8000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`hi-toast hi-toast--${type}`}>
      {message}
    </div>
  );
};