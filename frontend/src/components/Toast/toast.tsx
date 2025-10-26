/*
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
*/

import React, { useEffect, useState } from "react";
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
  const [visibleMessage, setVisibleMessage] = useState(message);
  const [key, setKey] = useState(Date.now()); // clave interna para forzar remount

  useEffect(() => {
    // Si llega un nuevo mensaje (aunque sea idéntico), reiniciamos todo
    setVisibleMessage(message);
    setKey(Date.now());
  }, [message]);

  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [key, duration, onClose]); // el timer depende del key interno

  return (
    <div key={key} className={`hi-toast hi-toast--${type}`}>
      {visibleMessage}
    </div>
  );
};
