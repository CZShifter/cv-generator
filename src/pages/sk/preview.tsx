import React, { useState, useRef, useLayoutEffect, useCallback, useMemo, useEffect } from "react";
import Head from "next/head";
import { ALL_CV_TEMPLATES as TEMPLATES } from "@/utils/cvTemplatesConfigSK";
import { SITE_URL, SITE_URL_SK, SITE_NAME_SK, PRICE_CV_SK, OG_IMAGE_SK, SITE_VERSION } from "@/config/site";
import CvForm from "@/components/sk/CvForm";
import { CvData } from "@/data/CvData";
import { FaRegArrowAltCircleLeft ,FaRegArrowAltCircleRight } from "react-icons/fa";
import stylesPreview from "@/scss/preview.module.scss";
import { SAMPLE_CV_DATA } from "@/data/sampleCvDataSK";
import { emptyData } from "@/data/emptyData";
import { CV_WIDTH, CV_HEIGHT } from "@/constants";
import { useDynamicTwoColumnPagination } from "@/hooks/useDynamicTwoColumnPagination";
import Loader from "@/components/Loader";
import { trackGAEvent } from "@/utils/analytics";
import { SectionWrapper } from '@/components/SectionWrapper';

// Import SCSS modulů pro všechny šablony
import stylesCv2 from "@/templates/CvTemplate2.module.scss";
import stylesCv3 from "@/templates/CvTemplate3.module.scss";
import stylesCv4 from "@/templates/CvTemplate4.module.scss";
import stylesCv1 from "@/templates/CvTemplate.module.scss";
// Import funkcí pro generování sekcí
import { getCvTemplate1Sections } from "@/components/sk/CvTemplate.sections";
import { getCvTemplate2Sections } from "@/components/sk/CvTemplate2.sections";
import { getCvTemplate3Sections } from "@/components/sk/CvTemplate3.sections";
import { getCvTemplate4Sections } from "@/components/sk/CvTemplate4.sections";

// Mapování sekcí podle šablony
const SECTION_GETTERS: Record<string, (data: CvData) => { left: React.ReactNode[]; right: React.ReactNode[] }> = {
  cvtemplate:   getCvTemplate1Sections,
  cvtemplate2:  getCvTemplate2Sections,
  cvtemplate3:  getCvTemplate3Sections,
  cvtemplate4:  getCvTemplate4Sections,
};
// Mapování SCSS podle šablony
const STYLES_MAP: Record<string, { [key: string]: string }> = {
  cvtemplate: stylesCv1,
  cvtemplate2: stylesCv2,
  cvtemplate3: stylesCv3,
  cvtemplate4: stylesCv4,
};

export default function Preview() {
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);
  //Ukladani do LocalStorage pro formualr
  const DRAFT_KEY = "cv_draft";
  //------------
  const [cvData, setCvData] = useState<CvData>(SAMPLE_CV_DATA[TEMPLATES[0].id]);
  const [started, setStarted] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const previewRef = useRef<HTMLDivElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const cvScaleRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const leftOuterRef = useRef<HTMLDivElement>(null);
  const rightOuterRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Výběr správných sekcí a stylů pro aktuální šablonu
  const getSections =
    SECTION_GETTERS[selectedTemplateId] || (() => ({ left: [], right: [] }));
  const styles = STYLES_MAP[selectedTemplateId] || stylesCv2;
  const { left, right } = useMemo(() => getSections(cvData), [ cvData, getSections]);

  // --- Paddingy (dynamicky měřené podle aktivní šablony)
  const [resumePadding, setResumePadding] = useState(0);
  const [leftPadding, setLeftPadding] = useState(0);
  const [rightPadding, setRightPadding] = useState(0);

  // --- Refy na jednotlivé sekce
  const leftRefs = useMemo(() => left.map(() => React.createRef<HTMLDivElement>()), [left]) as React.RefObject<HTMLDivElement>[];
  const rightRefs = useMemo(() => right.map(() => React.createRef<HTMLDivElement>()), [right]) as React.RefObject<HTMLDivElement>[];

  // --- Měření paddingů po renderu (off-screen wrapper)
  useLayoutEffect(() => {
    if (resumeRef.current) {
      const st = getComputedStyle(resumeRef.current);
      setResumePadding((parseFloat(st.paddingTop) || 0) + (parseFloat(st.paddingBottom) || 0));
    }
    if (leftOuterRef.current) {
      const stL = getComputedStyle(leftOuterRef.current);
      setLeftPadding((parseFloat(stL.paddingTop) || 0) + (parseFloat(stL.paddingBottom) || 0));
    }
    if (rightOuterRef.current) {
      const stR = getComputedStyle(rightOuterRef.current);
      setRightPadding((parseFloat(stR.paddingTop) || 0) + (parseFloat(stR.paddingBottom) || 0));
    }
  }, [selectedTemplateId, left, right]);

  // --- Vytvoření polí sekcí (jen nody, bez prázdných hodnot)
  const leftNodes = useMemo(() => left.filter(Boolean), [left]);
  const rightNodes = useMemo(() => right.filter(Boolean), [right]);

  // --- Stránkování pomocí přesného měření sekcí
  const { leftPages, rightPages, ready } = useDynamicTwoColumnPagination(
    leftRefs,
    rightRefs,
    leftNodes,
    rightNodes,
    CV_HEIGHT,
    resumePadding,
    leftPadding,
    rightPadding,
    pageIndex // nebo forceRemountKey, podle potřeby
  );

  const maxPage = Math.max(leftPages.length, rightPages.length) - 1;
  const currentLeftPage = ready && leftPages[pageIndex] ? leftPages[pageIndex] : [<div key="empty" />];
  const currentRightPage = ready && rightPages[pageIndex] ? rightPages[pageIndex] : [<div key="empty" />];

  // Preklad dynamických sekcí (pro správný margin ve wrapperu)
  function getSectionTypeFromNode(node: React.ReactNode): string {
    if (
      typeof node === "object" &&
      node !== null &&
      "key" in node &&
      node.key
    ) {
      return String(node.key).split("-")[0];
    }
    return "unknown";
  }
  //SPUSTÍ UKLÁDÁNÍ DO LOCALSTORAGE
  useEffect(() => {
  if (!started) return;
  const draft = localStorage.getItem(DRAFT_KEY);
  if (draft) {
    try {
      setCvData(JSON.parse(draft));
    } catch {
      localStorage.removeItem(DRAFT_KEY); // Pokud by byl draft poškozený
    }
  }
  }, [started]);
  //Zajistí vrácení na předchozí stránku když není
  useEffect(() => {
  if (!started) return;
  localStorage.setItem(DRAFT_KEY, JSON.stringify(cvData));
  }, [cvData, started]);
  //Konec pro ukládání do LocalStorage
  useEffect(() => {
    if (ready) {
      if (pageIndex > maxPage) {
        setPageIndex(maxPage < 0 ? 0 : maxPage);
      }
    }
  }, [pageIndex, maxPage, ready]);

  // Loader podle stavu 'ready'
  useEffect(() => {
    if (isGlobalLoading && ready) {
      const t = setTimeout(() => setIsGlobalLoading(false), 220);
      return () => clearTimeout(t);
    }
  }, [isGlobalLoading, ready]);

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
    const availH = winH - padT - padB - 65 - 60;
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
  // Chování při výběru šablon
  const handleSelectTemplate = (templateId: string) => {
    setIsGlobalLoading(true);
    setSelectedTemplateId(templateId);
    setCvData(SAMPLE_CV_DATA[templateId] || emptyData);
    setPageIndex(0);
    /* localStorage.removeItem(DRAFT_KEY); */ // smaže draft při výběru nové šablony!
  };
  // Chování po stisknutí tlačítka zpět na výběr šablon
  const handleBackToTemplateSelect = () => {
    setStarted(false);
    setCvData(SAMPLE_CV_DATA[selectedTemplateId] || emptyData);
    setPageIndex(0);
    /* localStorage.removeItem(DRAFT_KEY); */ // smaže draft při návratu na výběr šablony!
  };

  // --- Měřící (off-screen) wrapper pro přesné měření výšek sekcí!
  const templateConfig = TEMPLATES.find(t => t.id === selectedTemplateId);

  const measureWrapper = (
    <div style={{ position: 'fixed', left: -9999, top: '0', zIndex: -1, visibility: 'hidden', pointerEvents: 'none', width: '794px', height: '1123px' }}>
      <div className={styles.resume} ref={resumeRef}>
        <div className={styles.left} ref={leftOuterRef}>
          {(() => {
            const typeCounters: Record<string, number> = {};
            return left.filter(Boolean).map((section, i) => {
              const type = getSectionTypeFromNode(section);
              typeCounters[type] = (typeCounters[type] ?? 0) + 1;
              const isFirstOfType = typeCounters[type] === 1;
              const margin = isFirstOfType
                ? (templateConfig?.marginsFirst?.[type] ?? templateConfig?.margins?.[type] ?? 8)
                : (templateConfig?.margins?.[type] ?? 8);
              return (
                <SectionWrapper
                  key={i}
                  ref={leftRefs[i]}
                  className={styles.section}
                  marginTop={margin}
                >
                  {section}
                </SectionWrapper>
              );
            });
          })()}
        </div>
        <div className={styles.right} ref={rightOuterRef}>
          {(() => {
            const typeCounters: Record<string, number> = {};
            return right.filter(Boolean).map((section, i) => {
              const type = getSectionTypeFromNode(section);
              typeCounters[type] = (typeCounters[type] ?? 0) + 1;
              const isFirstOfType = typeCounters[type] === 1;
              const margin = isFirstOfType
                ? (templateConfig?.marginsFirst?.[type] ?? templateConfig?.margins?.[type] ?? 8)
                : (templateConfig?.margins?.[type] ?? 8);
              return (
                <SectionWrapper
                  key={i}
                  ref={rightRefs[i]}
                  className={styles.rightSection}
                  marginTop={margin}
                >
                  {section}
                </SectionWrapper>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>{`Vyplňte životopis online – Náhľad a úprava šablóny | ${SITE_NAME_SK}`}</title>
        <meta
          name="description"
          content="Vyberte si šablónu, vyplňte životopis online a okamžite si pozrite náhľad aj export hotového PDF. Rýchlo, prehľadne, bez registrácie."/>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        {/* OpenGraph */}
        <meta
          property="og:title"
          content={`Vyplňte životopis online – Náhľad a úprava šablóny | ${SITE_NAME_SK}`}/>
        <meta
          property="og:description"
          content="Vyplňte životopis online a hneď si pozrite náhľad aj exportujte PDF. Jednoduchý formulár a okamžitý výsledok."/>
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:image:alt" content="Ukážka online úpravy životopisu v aplikácii" />
        <meta property="og:url" content={`${SITE_URL_SK}/sk/preview/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Vyplňte životopis online – Náhľad a úprava šablóny | ${SITE_NAME_SK}`}/>
        <meta
          name="twitter:description"
          content="Vyplňte životopis online a hneď si pozrite náhľad aj exportujte PDF. Jednoduchý formulár a okamžitý výsledok."/>
        <meta name="twitter:image" content={OG_IMAGE_SK} />
        <meta name="twitter:image:alt" content="Ukážka online úpravy životopisu v aplikácii" />
        {/* Hreflang (absolútne URL, obojsmerne CZ ↔ SK) */}
        <link rel="alternate" href={`${SITE_URL}/cs/preview/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/preview/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/preview/`} hrefLang="x-default" />
        {/* Structured data - WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": SITE_NAME_SK,
              "url": `${SITE_URL_SK}/sk/preview/`,
              "applicationCategory": "ProductivityApplication",
              "description":
                "Vyplňte životopis online, vyberte šablónu, pozrite si náhľad a stiahnite hotový PDF súbor. Jednoduchý a efektívny generátor životopisov.",
              "inLanguage": "sk-SK",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": PRICE_CV_SK,
                "priceCurrency": "EUR"
              }
            })
          }}
        />
      </Head>
      {measureWrapper}
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
              <div className={styles.resume}>
                <div className={styles.left} ref={leftOuterRef}>
                  {(currentLeftPage && currentLeftPage.length > 0
                    ? currentLeftPage
                    : [<SectionWrapper key="empty-left" className={styles.section} style={{ minHeight: 120, background: "#f3f3f3" }}>Náhled prázdný</SectionWrapper>]
                  ).map((node, i) => (
                    <SectionWrapper key={i} className={styles.section}>{node}</SectionWrapper>
                  ))}
                </div>
                <div className={styles.right} ref={rightOuterRef}>
                  {(currentRightPage && currentRightPage.length > 0
                    ? currentRightPage
                    : [<SectionWrapper key="empty-right" className={styles.rightSection} style={{ minHeight: 120, background: "#f3f3f3" }}>Náhled prázdný</SectionWrapper>]
                  ).map((node, i) => (
                    <SectionWrapper key={i} className={styles.rightSection}>{node}</SectionWrapper>
                  ))}
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
                  <h3>Vyberte si šablónu životopisu:</h3>
                  <div className={stylesPreview.templateThumbnails}>
                    {TEMPLATES.map((template) => (
                      <div
                        key={template.id}
                        className={`${stylesPreview.thumbnailContainer} ${selectedTemplateId === template.id ? stylesPreview.selected : ""}`}
                        onClick={() => handleSelectTemplate(template.id)}
                      >
                        <picture className={stylesPreview.thumbnailPicture}>
                          {template.previewImageWebp && (
                            <source
                              srcSet={`${template.previewImageWebp}?v=${SITE_VERSION}`}
                              type="image/webp"
                            />
                          )}
                          <img
                            src={`${template.previewImage}?v=${SITE_VERSION}`}  // PNG/JPG fallback
                            alt={`Náhled ${template.name}`}
                            className={stylesPreview.thumbnail}
                            loading="lazy"
                            decoding="async"
                          />
                        </picture>
                        <p>{template.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className={stylesPreview.startButton}
                  onClick={() => {
                    trackGAEvent('click', 'zvolena_sablona', selectedTemplateId);
                    setCvData(emptyData);
                    setStarted(true);
                  }}>
                  Vybrať šablónu
                </button>
                <p>* Kým šablónu úplne nedokončíte, je možné ju dodatočne zmeniť.</p>
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
