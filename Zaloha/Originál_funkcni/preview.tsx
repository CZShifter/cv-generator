// pages/preview.tsx
import Head from "next/head";
import { SITE_URL, OG_IMAGE, SITE_NAME } from "../config/site";
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
// Importujeme centralizovanou konfiguraci šablon
import { ALL_CV_TEMPLATES as TEMPLATES } from '@/utils/cvTemplatesConfig';

// Ostatní importy zůstávají stejné
import CvForm from "@/components/cs/CvForm";
import { CvData } from "@/data/CvData";
import { SAMPLE_CV_DATA } from "@/data/sampleCvData";
import { emptyData } from "@/data/emptyData";
import styles from "@/scss/preview.module.scss";


const CV_WIDTH = 794;
const CV_HEIGHT = 1123;

export default function Preview() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);
  const [cvData, setCvData] = useState<CvData>(SAMPLE_CV_DATA[TEMPLATES[0].id]);
  const [started, setStarted] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const cvScaleRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [cvRenderedHeight, setCvRenderedHeight] = useState(CV_HEIGHT);
  const [cvRenderedWidth, setCvRenderedWidth] = useState(CV_WIDTH);

  // Toto je nyní odkazováno na Component z ALL_CV_TEMPLATES
  const SelectedCvTemplateComponent = TEMPLATES.find(
    (template) => template.id === selectedTemplateId
  )?.component;

  const handleBackToTemplateSelect = () => {
  setStarted(false);
  setCvData(emptyData);
  // případně setSelectedTemplateId(TEMPLATES[0].id);
  };

  const calculateCvDimensions = useCallback(() => {
    if (!previewRef.current || !formWrapperRef.current || !cvScaleRef.current) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const isColumnLayout = windowWidth <= 1440;

    const splitElement = previewRef.current.parentElement;
    const computedSplitStyle = getComputedStyle(splitElement!);
    const paddingLeft = parseFloat(computedSplitStyle.paddingLeft || '0');
    const paddingRight = parseFloat(computedSplitStyle.paddingRight || '0');
    const paddingTop = parseFloat(computedSplitStyle.paddingTop || '0');
    const paddingBottom = parseFloat(computedSplitStyle.paddingBottom || '0');

    const availableHeight = windowHeight - 60 - 48 - paddingTop - paddingBottom;
    const availableWidth = isColumnLayout
      ? windowWidth - paddingLeft - paddingRight
      : (windowWidth - paddingLeft - paddingRight - parseFloat(computedSplitStyle.gap || '0')) / 2;

    let finalScale = isColumnLayout
      ? Math.min(availableWidth / CV_WIDTH, availableHeight / CV_HEIGHT)
      : Math.min(availableHeight / CV_HEIGHT, availableWidth / CV_WIDTH);

    finalScale = Math.min(finalScale, 1);

    const newWidth = CV_WIDTH * finalScale;
    const newHeight = CV_HEIGHT * finalScale;

    setScale(finalScale);
    setCvRenderedHeight(newHeight);
    setCvRenderedWidth(newWidth);

    previewRef.current.style.width = `${newWidth}px`;
    previewRef.current.style.height = `${newHeight}px`;
    formWrapperRef.current.style.height = `${newHeight}px`;
  }, []);

  useLayoutEffect(() => {
    calculateCvDimensions();
    window.addEventListener("resize", calculateCvDimensions);
    return () => window.removeEventListener("resize", calculateCvDimensions);
  }, [calculateCvDimensions]);

  useEffect(() => {
    calculateCvDimensions();
  }, [cvData, selectedTemplateId, calculateCvDimensions]);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const templateData = SAMPLE_CV_DATA[templateId];
    setCvData(templateData || emptyData);
  };

  return (
     <>
      <Head>
        <title>{`Vyplňte životopis online – Náhled a úprava šablony | ${SITE_NAME}`}</title>
        <meta name="description" content="Vyberte šablonu, vyplňte životopis online a ihned si zobrazte náhled i exportujte hotový PDF životopis. Rychle, přehledně, bez registrace." />
        {/* OpenGraph */}
        <meta property="og:title" content={`Vyplňte životopis online – Náhled a úprava šablony | ${SITE_NAME}`} />
        <meta property="og:description" content="Vyplňte životopis online a ihned si zobrazte náhled i exportujte PDF. Jednoduchý formulář a okamžitý výsledek." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:url" content={`${SITE_URL}/preview`} />
        <meta property="og:type" content="website" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Vyplňte životopis online – Náhled a úprava šablony | ${SITE_NAME}`} />
        <meta name="twitter:description" content="Vyplňte životopis online a ihned si zobrazte náhled i exportujte PDF. Jednoduchý formulář a okamžitý výsledek." />
        <meta name="twitter:image" content={OG_IMAGE} />
        {/* Structured data - WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": SITE_NAME,
              "url": `${SITE_URL}/preview`,
              "applicationCategory": "ProductivityApplication",
              "description": "Vyplňte životopis online, vyberte šablonu, zobrazte náhled a stáhněte si hotový PDF soubor. Jednoduchý a efektivní generátor životopisů.",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "89",
                "priceCurrency": "CZK"
              }
            })
          }}
        />
      </Head>
    <div className={styles.split}>
      <div className={styles.preview} ref={previewRef}>
        <div
          className={styles.cvScale}
          ref={cvScaleRef}
          style={{
            width: CV_WIDTH,
            height: CV_HEIGHT,
            transform: `translate(-50%, -50%) scale(${scale})`,
            position: 'absolute',
            top: '50%',
            left: '50%',
          }}
        >
          {SelectedCvTemplateComponent && <SelectedCvTemplateComponent data={cvData} />}
        </div>
      </div>

      <div className={styles.formWrapper} ref={formWrapperRef}>
        {!started ? (
          <>
            <div className={styles.templateSelection}>
              <h3>Vyberte si šablonu životopisu:</h3>
              <div className={styles.templateThumbnails}>
                {TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className={`${styles.thumbnailContainer} ${
                      selectedTemplateId === template.id ? styles.selected : ""
                    }`}
                    onClick={() => handleSelectTemplate(template.id)}
                  >
                    <img src={template.previewImage} alt={`Náhled ${template.name}`} className={styles.thumbnail} />
                    <p>{template.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              className={styles.startButton}
              onClick={() => {
                setCvData(emptyData);
                setStarted(true);
              }}
            >
              Vyplnit vybranou šablonu
            </button>
            <p>* Po vyplnění formuláře není možné změnit šablonu bez nutnosti opětovného vyplnění.</p>
          </>
        ) : (
          SelectedCvTemplateComponent && (
            <CvForm
              data={cvData}
              onChange={setCvData}
              selectedTemplate={selectedTemplateId}
              onCancel={handleBackToTemplateSelect}
            />
          )
        )}
      </div>
    </div>
    </>
  );
}