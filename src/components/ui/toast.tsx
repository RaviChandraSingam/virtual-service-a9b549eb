import * as React from 'react';

export function Toast({ children, ...props }: any) { return null; }
export function ToastProvider({ children }: { children?: React.ReactNode }) { return <>{children}</>; }
export function ToastViewport() { return null; }
export function ToastTitle({ children }: { children?: React.ReactNode }) { return null; }
export function ToastDescription({ children }: { children?: React.ReactNode }) { return null; }
export function ToastClose() { return null; }
export function ToastAction({ children, altText, onClick }: any) { return null; }
