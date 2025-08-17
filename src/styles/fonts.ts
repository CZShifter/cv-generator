import { Poppins, Montserrat, Playfair_Display, Inter } from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  adjustFontFallback: true,
});

export const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
  adjustFontFallback: true,
});

export const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  adjustFontFallback: true,
});

export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800", "900"], // jen 500 a výš
  style: ["normal"],
  display: "swap",
  adjustFontFallback: true,
});