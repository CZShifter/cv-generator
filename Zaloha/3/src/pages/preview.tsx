import React, { useState, useRef, useLayoutEffect, useCallback, useMemo, useEffect } from "react";
import Head from "next/head";
import { ALL_CV_TEMPLATES as TEMPLATES } from "@/utils/cvTemplatesConfig";
import { SITE_URL, OG_IMAGE, SITE_NAME } from "../config/site";
import CvForm from "@/components/cs/CvForm";
import { CvData } from "@/data/CvData";
import { FaRegArrowAltCircleLeft ,FaRegArrowAltCircleRight } from "react-icons/fa";
import stylesPreview from "@/scss/preview.module.scss";
import { SAMPLE_CV_DATA } from "@/data/sampleCvData";
import { emptyData } from "@/data/emptyData";
import { CV_WIDTH, CV_HEIGHT } from "@/constants";
import { useDynamicTwoColumnPagination } from "@/hooks/useDynamicTwoColumnPagination";
import Loader from "@/components/Loader";
// Import SCSS modulů pro všechny šablony
import stylesCv2 from "@/templates/CvTemplate2.module.scss";
import stylesCv3 from "@/templates/CvTemplate3.module.scss";
import stylesCv4 from "@/templates/CvTemplate4.module.scss";
import stylesCv1 from "@/templates/CvTemplate.module.scss";
// Import funkcí pro generování sekcí
import { getCvTemplate1Sections } from "@/components/cs/CvTemplate.sections";
import { getCvTemplate2Sections } from "@/components/cs/CvTemplate2.sections";
import { getCvTemplate3Sections } from "@/components/cs/CvTemplate3.sections";
import { getCvTemplate4Sections } from "@/components/cs/CvTemplate4.sections";
// Mapování sekcí podle šablony
const SECTION_GETTERS: Record<
  string,
  (data: CvData) => { left: React.ReactNode[]; right: React.ReactNode[] }
  > = {
  cvtemplate:   getCvTemplate1Sections,
  cvtemplate2:  getCvTemplate2Sections,
  cvtemplate3:  getCvTemplate3Sections,
  cvtemplate4:  getCvTemplate4Sections,
};
// Mapování SCSS podle šablony
const STYLES_MAP: Record<string, any> = {
  cvtemplate: stylesCv1,
  cvtemplate2: stylesCv2,
  cvtemplate3: stylesCv3,
  cvtemplate4: stylesCv4,
};
export default function Preview() {

  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);
  const [cvData, setCvData] = useState<CvData>(SAMPLE_CV_DATA[TEMPLATES[0].id]);
  const [started, setStarted] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const previewRef = useRef<HTMLDivElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const cvScaleRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Výběr správných sekcí a stylů pro aktuální šablonu
  const getSections =
    SECTION_GETTERS[selectedTemplateId] || ((data: CvData) => ({ left: [], right: [] }));
  const styles = STYLES_MAP[selectedTemplateId] || stylesCv2;
  const { left, right } = useMemo(() => getSections(cvData), [selectedTemplateId, cvData]);
  // Stránkování
  const { leftPages, rightPages, leftRefs, rightRefs, ready } = useDynamicTwoColumnPagination(
      left, // Změněno z leftSections na LEFT
      right, // Změněno z rightSections na RIGHT
      CV_HEIGHT, // vaše pageHeight konstanta
      resumeRef,
      11, // leftColumnSafetyOffset - Nahraďte tímto číslem ideální offset pro levý sloupec
      70, // rightColumnSafetyOffset - Nahraďte tímto číslem ideální offset pro pravý sloupec
    );
  const maxPage = Math.max(leftPages.length, rightPages.length) - 1;

  //Zajistí vrácení na předchozí stránku když není
   useEffect(() => {
       if (ready) { 
         if (pageIndex > maxPage) {
           setPageIndex(maxPage < 0 ? 0 : maxPage);
         }
       }
     }, [pageIndex, maxPage, ready]);

  // Loader podle stavu 'ready' (a volitelně debounce/anti-flicker delay)
  const handleSelectTemplate = (templateId: string) => {
    setIsGlobalLoading(true);
    setSelectedTemplateId(templateId);
    setCvData(SAMPLE_CV_DATA[templateId] || emptyData);
    setPageIndex(0);
  };

  useEffect(() => {
    if (isGlobalLoading && ready) {
      const t = setTimeout(() => setIsGlobalLoading(false), 220);
      return () => clearTimeout(t);
    }
  }, [isGlobalLoading, ready]);
  // Po skrytí loaderu vynutí resize (pro galerie/slidery)
  useEffect(() => {
    if (!isGlobalLoading) {
      window.dispatchEvent(new Event('resize'));
    }
  }, [isGlobalLoading]);
  // Škálování podle okna
  const calculateCvDimensions = useCallback(() => {
    if (!previewRef.current || !formWrapperRef.current || !cvScaleRef.current) return;
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const splitEl = previewRef.current.parentElement!;
    const style = getComputedStyle(splitEl);
    const padL = parseFloat(style.paddingLeft || "0");
    const padR = parseFloat(style.paddingRight || "0");
    const padT = parseFloat(style.paddingTop || "0");
    const padB = parseFloat(style.paddingBottom || "0");
    const availW = (winW - padL - padR) / 1;
    const availH = winH - padT - padB - 60 - 60;
    const s = Math.min(availW / CV_WIDTH, availH / CV_HEIGHT, 1);
    setScale(s);
    previewRef.current.style.width = `${CV_WIDTH * s}px`;
    previewRef.current.style.height = `${CV_HEIGHT * s}px`;
    formWrapperRef.current.style.height = `${CV_HEIGHT * s}px`;
  }, []);

  useLayoutEffect(() => {
    calculateCvDimensions();
    window.addEventListener("resize", calculateCvDimensions);
    return () => window.removeEventListener("resize", calculateCvDimensions);
  }, [calculateCvDimensions]);
  useEffect(() => { calculateCvDimensions(); }, [cvData, selectedTemplateId, calculateCvDimensions]);
  // Chování po stisknutí tlačítka zpět na výběr šablon
  const handleBackToTemplateSelect = () => {
    setStarted(false);
    setCvData(SAMPLE_CV_DATA[selectedTemplateId] || emptyData);
    setPageIndex(0);
  };
  const currentLeftPage = ready ? leftPages[pageIndex] : left;
  const currentRightPage = ready ? rightPages[pageIndex] : right;
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
      {isGlobalLoading && <Loader />}
      {!isGlobalLoading && (
        <div className={stylesPreview.split}>
          <div className={stylesPreview.preview} ref={previewRef}>
            {maxPage > 0 && (
              <button
                className={stylesPreview.navButtonLeft}
                onClick={() => setPageIndex(i => Math.max(0, i - 1))}
                disabled={pageIndex === 0}>
                <FaRegArrowAltCircleLeft />
              </button>
            )}
             {/* Zobrazit "Stránka x / y" pouze pokud je víc stránek */}
            {maxPage > 0 && (
              <div className={stylesPreview.pageNumber}>
                Stránka {pageIndex + 1} / {maxPage + 1}
              </div>
            )}
            <div
              className={stylesPreview.cvScale}
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
              <div className={styles.resume} ref={resumeRef}>
                <div className={styles.left}>
                  {!ready
                    ? left.map((node, i) => {
                        if (React.isValidElement(node) && typeof node.type === "string") {
                          // Bezpečně načti className
                          const el = node as React.ReactElement<any>;
                          return React.cloneElement(el, {
                            ref: (el: HTMLDivElement) => { leftRefs.current[i] = el; },
                            key: i,
                            className: (el.props as any).className, // TS workaround
                          });
                        }
                        // fallback s ref a třídou
                        return (
                          <div
                            key={i}
                            ref={el => { leftRefs.current[i] = el; }}
                            className={styles.section}>
                            {node}
                          </div>
                        );
                      })
                    : (currentLeftPage || []).map((node, i) => node)
                  }
                </div>
                <div className={styles.right}>
                  {!ready
                    ? right.map((node, i) => {
                        if (React.isValidElement(node) && typeof node.type === "string") {
                          const el = node as React.ReactElement<any>;
                          return React.cloneElement(el, {
                            ref: (el: HTMLDivElement) => { rightRefs.current[i] = el; },
                            key: i,
                            className: (el.props as any).className,
                          });
                        }
                        return (
                          <div
                            key={i}
                            ref={el => { rightRefs.current[i] = el; }}
                            className={styles.rightSection}
                          >
                            {node}
                          </div>
                        );
                      })
                    : (currentRightPage || []).map((node, i) => node)
                  }
                </div>
              </div>
            </div>
            {maxPage > 0 && (
              <button
                className={stylesPreview.navButtonRight}
                onClick={() => setPageIndex(i => Math.min(maxPage, i + 1))}
                disabled={pageIndex === maxPage}>
                <FaRegArrowAltCircleRight />
              </button>
            )}
          </div>
          <div className={stylesPreview.formWrapper} ref={formWrapperRef}>
            {!started ? (
              <>
                <div className={stylesPreview.templateSelection}>
                  <h3>Vyberte si šablonu životopisu:</h3>
                  <div className={stylesPreview.templateThumbnails}>
                    {TEMPLATES.map((template) => (
                      <div
                        key={template.id}
                        className={`${stylesPreview.thumbnailContainer} ${selectedTemplateId === template.id ? stylesPreview.selected : ""}`}
                        onClick={() => handleSelectTemplate(template.id)}
                      >
                        <img src={template.previewImage} alt={`Náhled ${template.name}`} className={stylesPreview.thumbnail} />
                        <p>{template.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className={stylesPreview.startButton}
                  onClick={() => {
                    setCvData(emptyData);
                    setStarted(true);
                  }}>
                  Vybrat šablonu
                </button>
                <p>* Po vyplnění formuláře není možné změnit šablonu bez nutnosti opětovného vyplnění.</p>
              </>
            ) : (
              <CvForm
                data={cvData}
                onChange={setCvData}
                selectedTemplate={selectedTemplateId}
                onCancel={handleBackToTemplateSelect}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
