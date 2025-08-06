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

// Definujte typ pro jednu položku šablony
export interface CvTemplateConfig {
  id: string;
  component: React.ComponentType<CommonCvTemplateProps>;
  previewImage: string; // Pro frontend náhledy
  name: string; // Pro název šablony na frontendu
  cssFileName: string; // Název CSS souboru pro backend rendering (např. "CvTemplate.css")
  price: number;           // <--- přidané pole
  description: string;
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
  },
  {
    id: 'cvtemplate2',
    component: CvTemplate2,
    previewImage: '/img/cvtemplate2-preview.png',
    name: 'Moderní',
    cssFileName: 'pdfTemplate2.css',
    price: 89,
    description: 'Moderní vzhled pro dynamické pracovní prostředí.',
  },
  {
    id: 'cvtemplate3',
    component: CvTemplate3,
    previewImage: '/img/cvtemplate3-preview.png',
    name: 'Barevný',
    cssFileName: 'pdfTemplate3.css',
    price: 89,
    description: 'Pro ty, kteří ocení styl i přehlednost.',
  },
  {
    id: 'cvtemplate4',
    component: CvTemplate4,
    previewImage: '/img/cvtemplate4-preview.png',
    name: 'Elegantní',
    cssFileName: 'pdfTemplate4.css',
    price: 89,
    description: 'Minimalistický design s maximálním důrazem na informace.',
  },
];