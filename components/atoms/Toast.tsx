"use client";

import React from "react";
import { Toaster as SileoToaster, sileo } from "sileo";
import "sileo/styles.css";

// ============================================================================
// TYPES
// ============================================================================

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastProviderProps {
  position?: ToastPosition;
  offset?: number | string;
}

export interface ToastPromiseOptions<T = unknown> {
  loading: { title: string; description?: string };
  success: { title: string; description?: string } | ((data: T) => { title: string; description?: string });
  error: { title: string; description?: string } | ((err: unknown) => { title: string; description?: string });
}

// ============================================================================
// GLOBAL STYLE OVERRIDES — white background
// ============================================================================

const TOAST_FILL = "#FFFFFF";

// ============================================================================
// TOAST PROVIDER
// ============================================================================

function ToastProvider({ position = "bottom-right", offset }: ToastProviderProps) {
  return (
    <SileoToaster
      position={position}
      offset={offset}
      theme="dark"
      options={{ fill: TOAST_FILL }}
    />
  );
}

ToastProvider.displayName = "ToastProvider";

// ============================================================================
// TOAST API — convenience wrapper around sileo
// ============================================================================

const toast = {
  success: (title: string, description?: string) =>
    sileo.success({ title, description, fill: TOAST_FILL }),

  error: (title: string, description?: string) =>
    sileo.error({ title, description, fill: TOAST_FILL }),

  warning: (title: string, description?: string) =>
    sileo.warning({ title, description, fill: TOAST_FILL }),

  info: (title: string, description?: string) =>
    sileo.info({ title, description, fill: TOAST_FILL }),

  action: (
    title: string,
    options: { description?: string; buttonLabel: string; onClick: () => void }
  ) =>
    sileo.action({
      title,
      description: options.description,
      button: { title: options.buttonLabel, onClick: options.onClick },
      fill: TOAST_FILL,
    }),

  promise: <T,>(promise: Promise<T> | (() => Promise<T>), options: ToastPromiseOptions<T>) =>
    sileo.promise(promise, {
      loading: { ...options.loading, fill: TOAST_FILL },
      success:
        typeof options.success === "function"
          ? (data: T) => ({ ...(options.success as (d: T) => { title: string; description?: string })(data), fill: TOAST_FILL })
          : { ...options.success, fill: TOAST_FILL },
      error:
        typeof options.error === "function"
          ? (err: unknown) => ({ ...(options.error as (e: unknown) => { title: string; description?: string })(err), fill: TOAST_FILL })
          : { ...options.error, fill: TOAST_FILL },
    }),

  dismiss: (id: string) => sileo.dismiss(id),
  clear: () => sileo.clear(),
};

// ============================================================================
// EXPORTS
// ============================================================================

export { ToastProvider, toast };
