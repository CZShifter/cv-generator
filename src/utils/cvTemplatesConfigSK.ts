// src/utils/cvTemplatesConfig.ts
import React from 'react';
import type { CvData } from '@/data/CvData'; // Předpokládá se, že máte tento typ definovaný
import { PRICE_CV_SK } from "@/config/site";

// Importujte všechny vaše komponenty
import CvTemplate from '@/components/CvTemplate';
import CvTemplate2 from '@/components/CvTemplate2';
import CvTemplate3 from '@/components/CvTemplate3';
import CvTemplate4 from '@/components/CvTemplate4';

// Definujte props, které všechny vaše CV šablony přijímají
export interface CommonCvTemplateProps {
  data: CvData;
}

// Rozšíření pro konfiguraci fotky
export interface PhotoConfig {
  aspect: number; // Poměr stran (např. 1 for square, 16/9 for widescreen)
  shape: 'rect' | 'round'; // Tvar ořezu: 'rect' pro obdélník, 'round' pro kruh
  width: number; // Ideální šířka v px pro zobrazení
  height: number; // Ideální výška v px pro zobrazení
}

// Definujte typ pro jednu položku šablony
export interface CvTemplateConfig {
  id: string;
  component: React.ComponentType<CommonCvTemplateProps>;
  previewImage: string; // Pro frontend náhledy
  name: string; // Pro název šablony na frontendu
  cssFileName: string; // Název CSS souboru pro backend rendering (např. "CvTemplate.css")
  price: number;           // <--- přidané pole
  description: string;
  photoConfig?: PhotoConfig; // Volitelná konfigurace pro fotku
  margins?: Record<string, number>;
  marginsFirst?: Record<string, number>;
}

// Pole všech dostupných šablon
export const ALL_CV_TEMPLATES: CvTemplateConfig[] = [
  {
    id: 'cvtemplate',
    component: CvTemplate,
    previewImage: '/img/cvtemplate5-preview.png',
    name: 'Klasický',
    cssFileName: 'pdfTemplate.css',
    price: PRICE_CV_SK,
    description: 'Jednoduchý a elegantní design, který vynikne v každém výběrovém řízení.',
    photoConfig: { aspect: 1, shape: 'round', width: 250, height: 250 }, // Příklad pro kruhovou fotku
    margins: {
      photo: 0,
      contact: 24,
      education: 32,
      cert: 8,  // použije se opakovaně
      languages: 16,
      skills: 16,
      name: 0,
      Title: 8,
      summary: 8,
      exp: 16  // použije se pro každou zkušenost zvlášť
    },
    marginsFirst: {    // ← přidej nové pole
      cert: 16,        // první certifikát bude mít větší mezeru
      exp: 16,         // první zkušenost větší mezeru
      education: 32,
      languages: 16    // případně další typy...
    }
  },
  {
    id: 'cvtemplate2',
    component: CvTemplate2,
    previewImage: '/img/cvtemplate6-preview.png',
    name: 'Moderní',
    cssFileName: 'pdfTemplate2.css',
    price: PRICE_CV_SK,
    description: 'Moderní vzhled pro dynamické pracovní prostředí.',
    photoConfig: { aspect: 3 / 4, shape: 'rect', width: 215, height: 250 }, // Příklad pro obdélníkovou fotku
    margins: {
      photo: 0,
      contact: 0,
      education: 0,
      cert: 0,  // použije se opakovaně
      languages: 0,
      skills: 0,
      name: 0,
      Title: 0,
      summary: 0,
      exp: 0  // použije se pro každou zkušenost zvlášť
    },
    marginsFirst: {    // ← přidej nové pole
      cert: 0,        // první certifikát bude mít větší mezeru
      exp: 0,         // první zkušenost větší mezeru
      education: 0,
      languages: 0    // případně další typy...
    }
  },
  {
    id: 'cvtemplate3',
    component: CvTemplate3,
    previewImage: '/img/cvtemplate7-preview.png',
    name: 'Barevný',
    cssFileName: 'pdfTemplate3.css',
    price: PRICE_CV_SK,
    description: 'Pro ty, kteří ocení styl i přehlednost.',
    photoConfig: { aspect: 3 / 4, shape: 'rect', width: 250, height: 300 }, // Příklad pro obdélníkovou fotku
    margins: {
      photo: 0,
      contact: 16,
      education: 16,
      cert: 8,  // použije se opakovaně
      languages: 0,
      skills: 0,
      name: 16,
      Title: 0,
      summary: 0,
      experience: 0  // použije se pro každou zkušenost zvlášť
    },
    marginsFirst: {    // ← přidej nové pole
      cert: 16,
      skills: 0,        // první certifikát bude mít větší mezeru
      experience: 0,         // první zkušenost větší mezeru
      education: 16,
      languages: 16    // případně další typy...
    }
  },
  {
    id: 'cvtemplate4',
    component: CvTemplate4,
    previewImage: '/img/cvtemplate8-preview.png',
    name: 'Elegantní',
    cssFileName: 'pdfTemplate4.css',
    price: PRICE_CV_SK,
    description: 'Minimalistický design s maximálním důrazem na informace.',
    photoConfig: { aspect: 3 / 4, shape: 'rect', width: 215, height: 250 }, // Příklad pro obdélníkovou fotku
    margins: {
      photo: 0,
      contact: 0,
      education: 16,
      cert: 8,  // použije se opakovaně
      languages: 0,
      skills: 16,
      name: 0,
      Title: 0,
      summary: 0,
      exp: 0  // použije se pro každou zkušenost zvlášť
    },
    marginsFirst: {    // ← přidej nové pole
      cert: 16,        // první certifikát bude mít větší mezeru
      exp: 0,         // první zkušenost větší mezeru
      education: 16,
      languages: 16    // případně další typy...
    }
  },
];