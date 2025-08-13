//VERZE WEBU !!!
export const SITE_VERSION = "10.08.25";
// Základní nastavení webu
export const SITE_URL = "https://rychlyzivotopis.cz";
export const OG_IMAGE = `${SITE_URL}/img/og-cvgen.png?v=${SITE_VERSION}`;
export const SITE_NAME = "RychlýŽivotopis.cz";
export const SITE_MAIL = "info@rychlyzivotopis.cz";
// Základní nastavení webu SK Verze
export const SITE_URL_SK = "https://rychlyzivotopis.sk";
export const OG_IMAGE_SK = `${SITE_URL}/img/og-cvgen-sk.png?v=${SITE_VERSION}`;
export const SITE_NAME_SK = "RýchlyŽivotopis.sk";
export const SITE_MAIL_SK = "info@rychlyzivotopis.cz";
// Meta icony
export const FAVICON_URL_32 = `/img/favicon.png?v=${SITE_VERSION}`;
export const FAVICON_URL_192 = `/img/favicon-192.png?v=${SITE_VERSION}`;
export const APPLE_TOUCH_ICON_URL = `/img/apple-touch-icon.png?v=${SITE_VERSION}`;
// údaje pro faktury a kontakt
export const SELLER_COMPANY = "Tomáš Tippl";
export const SELLER_IC = "88520510";
export const SELLER_ADDRESS = "Strnady 137";
export const SELLER_ADDRESS_CITY = "252 02 Jíloviště";
export const SELLER_LEGAL_NOTE = "Fyzická osoba zapsána v živnostenském rejstříku.";
export const SELLER_LEGAL_NOTE_2 = "Nejsem plátce DPH.";
export const SELLER_LEGAL_NOTE_SK = "SZČO";
export const SELLER_LEGAL_NOTE_2_SK = "Nie som platiteľ DPH";
// cena jedné služby
export const PRICE_CV = 89; // Kč
export const PRICE_CV_SK = 4; //Euro
// Analytics & marketing tags
export const GA_MEASUREMENT_ID = "G-XXXXXXX";      // Google Analytics 4
export const FB_PIXEL_ID = "1234567890";           // Facebook Pixel
export const SKLIK_ID = "123456";                  // Sklik (Seznam.cz)
export const GOOGLE_ADS_ID = "AW-XXXXXXX";         // Google Ads Remarketing
export const GOOGLE_ADS = {
  ID: GOOGLE_ADS_ID,          // celé "AW-..." z Google Ads
  LABEL_CZ: "AbCdEfGhIjkLmNoP", // přesný Conversion Label z gTag
  LABEL_SK: "ZyXwVuTsRqPoNmL",  // přesný Conversion Label z gTag
};
export const PRICING = {
  CZ: { amount: PRICE_CV,  currency: "CZK" as const },
  SK: { amount: PRICE_CV_SK, currency: "EUR" as const },
};