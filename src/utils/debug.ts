export const isDebug = import.meta.env.DEV;

export function debugLog(...args: unknown[]): void {
  if (isDebug) {
    // eslint-disable-next-line no-console -- debug logs
    console.log(...args);
  }
}
