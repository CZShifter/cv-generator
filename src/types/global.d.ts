// types/global.d.ts
export {};
declare global {
  interface Window {
    gtag?: {
      (command: "js", date: Date): void;
      (command: "config", targetId: string, params?: Record<string, unknown>): void;
      (command: "event", eventName: string, params?: Record<string, unknown>): void;
    };
    dataLayer?: unknown[];
    gtagInitialized?: boolean;
    gadsInitialized?: boolean;
    sklikInitialized?: boolean;
    skw?: (...args: unknown[]) => void;
  }
}
