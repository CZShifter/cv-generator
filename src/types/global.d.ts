// types/global.d.ts
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

  // Minimální superset pro parametry eventů (bez any)
  type GtagEventParams = Record<string, unknown>;

  interface Window {
    // ——— VAŠE stávající pole (ponecháno) ———
    gtag?: {
      (command: "js", date: Date): void;
      (command: "config", targetId: string, params?: GtagConfig): void;
      (command: "event", eventName: string, params?: GtagEventParams): void;
      // Rozšíření o Consent Mode (bezpečně volitelné)
      (command: "consent", action: GtagConsentAction, params: GtagConsentParams): void;
    };
    dataLayer?: unknown[];

    gtagInitialized?: boolean;
    gadsInitialized?: boolean;
    sklikInitialized?: boolean;

    skw?: (...args: unknown[]) => void;
  }
}
