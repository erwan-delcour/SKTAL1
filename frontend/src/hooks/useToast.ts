"use client"

import { toast } from "sonner"

interface ToastOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 4000,
      action: options?.action,
    })
  }

  const showError = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration || 4000,
      action: options?.action,
    })
  }

  const showInfo = (message: string, options?: ToastOptions) => {
    toast.info(message, {
      duration: options?.duration || 4000,
      action: options?.action,
    })
  }

  const showWarning = (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      duration: options?.duration || 4000,
      action: options?.action,
    })
  }

  const showToast = (message: string, options?: ToastOptions) => {
    toast(message, {
      duration: options?.duration || 4000,
      action: options?.action,
    })
  }

  const showPromise = <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    toast.promise(promise, messages)
  }

  return {
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning,
    toast: showToast,
    promise: showPromise,
  }
}
