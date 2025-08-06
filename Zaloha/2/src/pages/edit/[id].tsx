import { GetServerSideProps } from "next";
import Head from "next/head";
import { SITE_NAME } from "@/config/site";
import { FaRegArrowAltCircleLeft ,FaRegArrowAltCircleRight } from "react-icons/fa";
import { ALL_CV_TEMPLATES as TEMPLATES } from "@/utils/cvTemplatesConfig";
import { createClient } from "@supabase/supabase-js";
import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from "react";
import CvForm_edit from "@/components/cs/CvForm_edit";
import { CvData } from "@/data/CvData";
import stylesPreview from "@/scss/preview.module.scss";
import { CV_WIDTH, CV_HEIGHT } from "@/constants";
import Loader from "@/components/Loader";
import { useDynamicTwoColumnPagination } from "@/hooks/useDynamicTwoColumnPagination";

// Import SCSS modulů pro všechny šablony
import stylesCv2 from "@/templates/CvTemplate2.module.scss";
import stylesCv3 from "@/templates/CvTemplate3.module.scss";
import stylesCv4 from "@/templates/CvTemplate4.module.scss";
import stylesCv1 from "@/templates/CvTemplate.module.scss";

// Import funkcí pro generování sekcí
import { getCvTemplate2Sections } from "@/components/cs/CvTemplate2.sections";
import { getCvTemplate3Sections } from "@/components/cs/CvTemplate3.sections";
import { getCvTemplate4Sections } from "@/components/cs/CvTemplate4.sections";
import { getCvTemplate1Sections } from "@/components/cs/CvTemplate.sections";

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

// Mapování sekcí a stylů podle šablony
const SECTION_GETTERS: Record<
  string,
  (data: CvData) => { left: React.ReactNode[]; right: React.ReactNode[] }
> = {
  cvtemplate:   getCvTemplate1Sections,
  cvtemplate2:  getCvTemplate2Sections,
  cvtemplate3:  getCvTemplate3Sections,
  cvtemplate4:  getCvTemplate4Sections,
};
const STYLES_MAP: Record<string, any> = {
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

  // Vždy použij správný templateId z props/databáze
  const selectedTemplateId = templateId as keyof typeof SECTION_GETTERS;

  const getSections = SECTION_GETTERS[selectedTemplateId] || (() => ({ left: [], right: [] }));
  const styles = STYLES_MAP[selectedTemplateId] || stylesCv2;
  const { left, right } = useMemo(() => getSections(cvData), [selectedTemplateId, cvData]);

  // Stránkování sekcí
  const { leftPages, rightPages, leftRefs, rightRefs, ready } = useDynamicTwoColumnPagination(
    left, // Změněno z leftSections na LEFT
    right, // Změněno z rightSections na RIGHT
    CV_HEIGHT, // vaše pageHeight konstanta
    resumeRef,
    32, // leftColumnSafetyOffset - Nahraďte tímto číslem ideální offset pro levý sloupec
    61, // rightColumnSafetyOffset - Nahraďte tímto číslem ideální offset pro pravý sloupec
    forceRemountKey //templateId
  );
  const maxPage = Math.max(leftPages.length, rightPages.length) - 1;
  const currentLeftPage = ready ? leftPages[pageIndex] : left;
  const currentRightPage = ready ? rightPages[pageIndex] : right;

  //Zajistí vrácení na předchozí stránku když není
  useEffect(() => {
    if (ready) { 
      if (pageIndex > maxPage) {
        setPageIndex(maxPage < 0 ? 0 : maxPage);
      }
    }
  }, [pageIndex, maxPage, ready]);

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

  //LOADER
  useEffect(() => {
    if (isGlobalLoading && ready) {
      const t = setTimeout(() => setIsGlobalLoading(false), 50);
      return () => clearTimeout(t);
    }
  }, [isGlobalLoading, ready]);

  // Spustí resize po skrytí loaderu a stránkování ready
  useEffect(() => {
    if (ready && !isGlobalLoading) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }
  }, [ready, isGlobalLoading]);

  useEffect(() => {
  const t = setTimeout(() => setForceRemountKey(k => k + 1), 350);
  return () => clearTimeout(t);
  }, []);

  // Po skrytí loaderu vynutí resize (pro galerie/slidery)
 useLayoutEffect(() => {
    calculateCvDimensions();
    window.addEventListener("resize", calculateCvDimensions);
    return () => window.removeEventListener("resize", calculateCvDimensions);
  }, [calculateCvDimensions]);

  useEffect(() => { calculateCvDimensions(); }, [cvData, templateId, calculateCvDimensions]);
  return (
    <>
      <Head>
        <title>{`Úprava životopisu | ${SITE_NAME}`}</title>
        <meta name="description" content="Upravte si svůj životopis online a přegenerujte PDF během 24h." />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Head>
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
    <div className={styles.resume} ref={resumeRef}>
      <div className={styles.left}>
        {!ready
          ? left.map((node, i) => {
              if (React.isValidElement(node) && typeof node.type === "string") {
                const el = node as React.ReactElement<any>;
                return React.cloneElement(el, {
                  ref: (el: HTMLDivElement) => { leftRefs.current[i] = el; },
                  key: i,
                  className: (el.props as any).className,
                });
              }
              return (
                <div
                  key={i}
                  ref={el => { leftRefs.current[i] = el; }}
                  className={styles.section}
                >
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
        {/* PRAVÁ STRANA – editace formuláře */}
        <div className={stylesPreview.formWrapper} ref={formWrapperRef}>
          <CvForm_edit
            data={cvData}
            onChange={setCvData}
            selectedTemplate={templateId}
            isEditMode={true} // můžeš využít tento prop k úpravám logiky
            id={id} // kvůli API /api/edit-cv
          />
        </div>
      </div>
       )}
    </>
  );
}
