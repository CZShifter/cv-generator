export {};

declare global {
  // ——— Přesné (sjednocené) typy pro gtag ———
  type GtagConsentAction = "default" | "update";
  type GtagConsentFlag = "granted" | "denied";

  interface GtagConsentParams {
    ad_storage?: GtagConsentFlag;
    analytics_storage?: GtagConsentFlag;
    ad_user_data?: GtagConsentFlag;
    ad_personalization?: GtagConsentFlag;
  }

  interface GtagLinkerConfig {
    domains: string[];
  }

  interface GtagConfig {
    // GA4
    send_page_view?: boolean;
    linker?: GtagLinkerConfig;
    // běžné parametry page_view
    page_title?: string;
    page_location?: string;
    page_path?: string;
    // cokoliv dalšího (Google průběžně přidává klíče)
    [key: string]: unknown;
  }

  // Minimální superset pro parametry eventů
  type GtagEventParams = Record<string, unknown>;

  interface Window {
    gtag?: {
      (command: "js", date: Date): void;
      (command: "config", targetId: string, params?: Record<string, unknown>): void;
      (command: "event", eventName: string, params?: Record<string, unknown>): void;
      (command: "consent", action: GtagConsentAction, params: GtagConsentParams): void;
      // undocumented, ale používané pro zjištění připravenosti klienta
      (command: "get", targetId: string, fieldName: string, callback: (value: unknown) => void): void;
    };

    dataLayer?: unknown[];

    gtagInitialized?: boolean;
    gadsInitialized?: boolean;
    sklikInitialized?: boolean;

    skw?: (...args: unknown[]) => void;
  }
}
