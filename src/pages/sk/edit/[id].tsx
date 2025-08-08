import { GetServerSideProps } from "next";
import Head from "next/head";
import { SITE_NAME_SK, FAVICON_URL_32, FAVICON_URL_192, APPLE_TOUCH_ICON_URL } from "@/config/site";
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import { ALL_CV_TEMPLATES} from "@/utils/cvTemplatesConfig";
import { createClient } from "@supabase/supabase-js";
import React, { useState, useRef, useCallback, useMemo } from "react";
import CvForm_edit from "@/components/sk/CvForm_edit";
import { CvData } from "@/data/CvData";
import stylesPreview from "@/scss/preview.module.scss";
import { CV_WIDTH, CV_HEIGHT } from "@/constants";
import Loader from "@/components/Loader";
import { useDynamicTwoColumnPagination } from "@/hooks/useDynamicTwoColumnPagination";
import { SectionWrapper } from '@/components/SectionWrapper';

// Import SCSS modulů pro všechny šablony
import stylesCv2 from "@/templates/CvTemplate2.module.scss";
import stylesCv3 from "@/templates/CvTemplate3.module.scss";
import stylesCv4 from "@/templates/CvTemplate4.module.scss";
import stylesCv1 from "@/templates/CvTemplate.module.scss";

// Import funkcí pro generování sekcí
import { getCvTemplate2Sections } from "@/components/sk/CvTemplate2.sections";
import { getCvTemplate3Sections } from "@/components/sk/CvTemplate3.sections";
import { getCvTemplate4Sections } from "@/components/sk/CvTemplate4.sections";
import { getCvTemplate1Sections } from "@/components/sk/CvTemplate.sections";

type Props = {
  dataFromDb: CvData;
  templateId: string;
  id: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const id = context.params?.id as string;

  const { data, error } = await supabase
    .from("cv_entries")
    .select("cv_json, template_id")
    .eq("id", id)
    .single();

  if (error || !data) return { notFound: true };

  return {
    props: {
      dataFromDb: data.cv_json,
      templateId: data.template_id,
      id,
    },
  };
};

const SECTION_GETTERS: Record<string, (data: CvData) => { left: React.ReactNode[]; right: React.ReactNode[] }> = {
  cvtemplate: getCvTemplate1Sections,
  cvtemplate2: getCvTemplate2Sections,
  cvtemplate3: getCvTemplate3Sections,
  cvtemplate4: getCvTemplate4Sections,
};
const STYLES_MAP: Record<string, { [key: string]: string }> = {
  cvtemplate: stylesCv1,
  cvtemplate2: stylesCv2,
  cvtemplate3: stylesCv3,
  cvtemplate4: stylesCv4,
};

export default function EditPage({ dataFromDb, templateId, id }: Props) {
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [forceRemountKey, setForceRemountKey] = useState(0);
  const [cvData, setCvData] = useState<CvData>(dataFromDb);
  const [pageIndex, setPageIndex] = useState(0);
  const [scale, setScale] = useState(1);

  const previewRef = useRef<HTMLDivElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const cvScaleRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  // --- Výběr šablony
  const selectedTemplateId = templateId as keyof typeof SECTION_GETTERS;
  const getSections = SECTION_GETTERS[selectedTemplateId] || (() => ({ left: [], right: [] }));
  const styles = STYLES_MAP[selectedTemplateId] || stylesCv2;
  const { left, right } = useMemo(() => getSections(cvData), [cvData, getSections]);

  // --- Paddingy (změříme jen jednou na začátku, pro zjednodušení, případně lze změnit)
  const [resumePadding, setResumePadding] = useState(0);
  const [leftPadding, setLeftPadding] = useState(0);
  const [rightPadding, setRightPadding] = useState(0);

  // Vytvoř pole refů na každou sekci (permanentně, nikdy neměnit pořadí!)
  const leftRefs = useMemo(() => left.map(() => React.createRef<HTMLDivElement>()), [left]) as React.RefObject<HTMLDivElement>[];
  const rightRefs = useMemo(() =>right.map(() => React.createRef<HTMLDivElement>()), [right]) as React.RefObject<HTMLDivElement>[];
  const leftOuterRef = useRef<HTMLDivElement>(null);
  const rightOuterRef = useRef<HTMLDivElement>(null);


  // Změř paddingy hned po načtení
  React.useLayoutEffect(() => {
    if (resumeRef.current) {
      const st = getComputedStyle(resumeRef.current);
      setResumePadding((parseFloat(st.paddingTop) || 0) + (parseFloat(st.paddingBottom) || 0));
      // left
      const leftEl = resumeRef.current.querySelector(".left") as HTMLDivElement | null;
      if (leftEl) {
        const stL = getComputedStyle(leftEl);
        setLeftPadding((parseFloat(stL.paddingTop) || 0) + (parseFloat(stL.paddingBottom) || 0));
      }
      // right
      const rightEl = resumeRef.current.querySelector(".right") as HTMLDivElement | null;
      if (rightEl) {
        const stR = getComputedStyle(rightEl);
        setRightPadding((parseFloat(stR.paddingTop) || 0) + (parseFloat(stR.paddingBottom) || 0));
      }
      if (leftOuterRef.current) {
      const stL = getComputedStyle(leftOuterRef.current);
      setLeftPadding((parseFloat(stL.paddingTop) || 0) + (parseFloat(stL.paddingBottom) || 0));
      }
      if (rightOuterRef.current) {
        const stR = getComputedStyle(rightOuterRef.current);
        setRightPadding((parseFloat(stR.paddingTop) || 0) + (parseFloat(stR.paddingBottom) || 0));
      }
    }
  }, [resumeRef, leftOuterRef, rightOuterRef, forceRemountKey]);

  // --- Stránkování na základě měřených výšek sekcí (off-screen wrapper!)
  const leftNodes = useMemo(() => left.filter(Boolean), [left]);
  const rightNodes = useMemo(() => right.filter(Boolean), [right]);
  const { leftPages, rightPages, ready } = useDynamicTwoColumnPagination(
    leftRefs,
    rightRefs,
    leftNodes,
    rightNodes,
    CV_HEIGHT,
    resumePadding,
    leftPadding,
    rightPadding,
    forceRemountKey
  );

  const maxPage = Math.max(leftPages.length, rightPages.length) - 1;
  const currentLeftPage = ready && leftPages[pageIndex] ? leftPages[pageIndex] : [<div key="empty" />];
  const currentRightPage = ready && rightPages[pageIndex] ? rightPages[pageIndex] : [<div key="empty" />];
  //preklad dynamických sekci
  function getSectionTypeFromNode(node: React.ReactNode): string {
  if (
    typeof node === "object" &&
    node !== null &&
    "key" in node &&
    node.key
  ) {
    return String(node.key).split("-")[0]; // ← vezme jen část před "-"
  }
  return "unknown";
}

  // --- Reset indexu pokud počet stránek klesne
  React.useEffect(() => {
    if (ready && pageIndex > maxPage) {
      setPageIndex(maxPage < 0 ? 0 : maxPage);
    }
  }, [pageIndex, maxPage, ready]);

  // --- Škálování podle okna
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

  // --- Loader
React.useEffect(() => {
  if (isGlobalLoading && ready) {
    const t = setTimeout(() => setIsGlobalLoading(false), 50);
    return () => clearTimeout(t);
  }
}, [isGlobalLoading, ready]);

// --- Po načtení nebo stránkování
React.useEffect(() => {
  if (!isGlobalLoading && ready) {
    calculateCvDimensions();
    setTimeout(() => {
      calculateCvDimensions();
    }, 50);
  }
}, [isGlobalLoading, ready, calculateCvDimensions]);

// --- Resize okna (dynamicky při změně rozměrů okna)
React.useEffect(() => {
  function handleResize() {
    calculateCvDimensions();
  }
  window.addEventListener("resize", handleResize);
  handleResize();
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, [calculateCvDimensions]);

  // --- Trigger na forceRemount při první změně/načtení
  React.useEffect(() => {
    const t = setTimeout(() => setForceRemountKey(k => k + 1), 350);
    return () => clearTimeout(t);
  }, []);
  const templateConfig = ALL_CV_TEMPLATES.find(t => t.id === selectedTemplateId);
console.log('Paddingy do hooku:', {resumePadding, leftPadding, rightPadding});
  // --- Měřící (off-screen) wrapper pro přesné měření výšek sekcí!
  // Tady renderujeme všechny sekce s refy a stejnými styly jako budou v náhledu,
  // ALE je to mimo hlavní layout a invisible!
  const measureWrapper = (
    <div style={{ position: 'fixed', left: -999, top: '0', zIndex: -10, visibility: 'hidden', pointerEvents: 'none', width: '794px', height: '1123px' }}>
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
        <title>{`Úprava životopisu | ${SITE_NAME_SK}`}</title>
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32"/>
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180"/>
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        <meta name="description" content="Upravte si svůj životopis online a přegenerujte PDF během 24h." />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Head>
      {measureWrapper}
      {isGlobalLoading && <Loader />}
      {!isGlobalLoading && (
        <div className={stylesPreview.split}>
          {/* LEVÁ STRANA – náhled */}
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
                <div className={styles.left}>
                  {(currentLeftPage && currentLeftPage.length > 0
                    ? currentLeftPage
                    : [<div key="empty-left" className={styles.section} style={{ minHeight: 120, background: "#f3f3f3" }}>Náhled prázdný</div>]
                  ).map((node, i) => (
                    <div key={i} className={styles.section}>{node}</div>
                  ))}
                </div>
                <div className={styles.right}>
                  {(currentRightPage && currentRightPage.length > 0
                  ? currentRightPage
                  : [<div key="empty-right" className={styles.rightSection} style={{ minHeight: 120, background: "#f3f3f3" }}>Náhled prázdný</div>]
                ).map((node, i) => (
                  <div key={i} className={styles.rightSection}>{node}</div>
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
          {/* PRAVÁ STRANA – editace formuláře */}
          <div className={stylesPreview.formWrapper} ref={formWrapperRef}>
            <CvForm_edit
              data={cvData}
              onChange={setCvData}
              selectedTemplate={templateId}
              isEditMode={true}
              id={id}
            />
          </div>
        </div>
      )}
    </>
  );
}
