/**
 * SSR-safe accessors for browser globals.
 * Avoids "no-undef" and SSR runtime errors by checking existence.
 */

// PUBLIC_INTERFACE
export const getWindow = (): any =>
  typeof (globalThis as any).window !== 'undefined' ? (globalThis as any).window : undefined;

// PUBLIC_INTERFACE
export const getDocument = (): any =>
  typeof (globalThis as any).document !== 'undefined' ? (globalThis as any).document : undefined;

// PUBLIC_INTERFACE
export const getLocalStorage = (): any => {
  const w = getWindow();
  try {
    return w?.localStorage;
  } catch {
    return undefined;
  }
};

// PUBLIC_INTERFACE
export const getConfirm = (): ((message?: string) => boolean) | undefined => {
  const w = getWindow();
  return w?.confirm?.bind(w);
};

// PUBLIC_INTERFACE
export const getSetTimeout = (): ((handler: any, timeout?: number) => number) | undefined => {
  const w = getWindow();
  return w?.setTimeout?.bind(w);
};
