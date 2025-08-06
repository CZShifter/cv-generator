// src/utils/cvTemplatesConfig.ts
import React from 'react';
import type { CvData } from '@/data/CvData'; // Předpokládá se, že máte tento typ definovaný

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
}

// Pole všech dostupných šablon
export const ALL_CV_TEMPLATES: CvTemplateConfig[] = [
  {
    id: 'cvtemplate',
    component: CvTemplate,
    previewImage: '/img/cvtemplate-preview.png',
    name: 'Klasický',
    cssFileName: 'pdfTemplate.css',
    price: 89,
    description: 'Jednoduchý a elegantní design, který vynikne v každém výběrovém řízení.',
    photoConfig: { aspect: 1, shape: 'round', width: 250, height: 250 }, // Příklad pro kruhovou fotku
  },
  {
    id: 'cvtemplate2',
    component: CvTemplate2,
    previewImage: '/img/cvtemplate2-preview.png',
    name: 'Moderní',
    cssFileName: 'pdfTemplate2.css',
    price: 89,
    description: 'Moderní vzhled pro dynamické pracovní prostředí.',
    photoConfig: { aspect: 3 / 4, shape: 'rect', width: 120, height: 160 }, // Příklad pro obdélníkovou fotku
  },
  {
    id: 'cvtemplate3',
    component: CvTemplate3,
    previewImage: '/img/cvtemplate3-preview.png',
    name: 'Barevný',
    cssFileName: 'pdfTemplate3.css',
    price: 89,
    description: 'Pro ty, kteří ocení styl i přehlednost.',
    photoConfig: { aspect: 3 / 4, shape: 'rect', width: 120, height: 160 }, // Příklad pro obdélníkovou fotku
  },
  {
    id: 'cvtemplate4',
    component: CvTemplate4,
    previewImage: '/img/cvtemplate4-preview.png',
    name: 'Elegantní',
    cssFileName: 'pdfTemplate4.css',
    price: 89,
    description: 'Minimalistický design s maximálním důrazem na informace.',
    photoConfig: { aspect: 3 / 4, shape: 'rect', width: 120, height: 160 }, // Příklad pro obdélníkovou fotku
  },
];