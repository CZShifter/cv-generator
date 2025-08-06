// /pages/edit/[id].tsx
import { GetServerSideProps } from "next";
import Head from "next/head";
import { SITE_NAME, SITE_URL, OG_IMAGE } from "@/config/site";
import { ALL_CV_TEMPLATES } from "@/utils/cvTemplatesConfig";
import { createClient } from "@supabase/supabase-js";
import React, { useState, useEffect, useRef, useCallback } from "react";
import CvForm_edit from "@/components/cs/CvForm_edit";
import { CvData } from "@/data/CvData";
import styles from "@/scss/preview.module.scss";

const CV_WIDTH = 794;
const CV_HEIGHT = 1123;

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

export default function EditPage({ dataFromDb, templateId, id }: Props) {
  const [cvData, setCvData] = useState<CvData>(dataFromDb);
  const [scale, setScale] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const cvScaleRef = useRef<HTMLDivElement>(null);

  const templateConfig = ALL_CV_TEMPLATES.find((t) => t.id === templateId);
  const SelectedCvTemplateComponent = templateConfig?.component;

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
    previewRef.current.style.width = `${newWidth}px`;
    previewRef.current.style.height = `${newHeight}px`;
    formWrapperRef.current.style.height = `${newHeight}px`;
  }, []);

  useEffect(() => {
    calculateCvDimensions();
    window.addEventListener("resize", calculateCvDimensions);
    return () => window.removeEventListener("resize", calculateCvDimensions);
  }, [calculateCvDimensions]);

  return (
    <>
      <Head>
        <title>{`Úprava životopisu | ${SITE_NAME}`}</title>
        <meta name="description" content="Upravte si svůj životopis online a přegenerujte PDF během 24h." />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
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
            {SelectedCvTemplateComponent && (
              <SelectedCvTemplateComponent data={cvData} />
            )}
          </div>
        </div>

        <div className={styles.formWrapper} ref={formWrapperRef}>
          <CvForm_edit
            data={cvData}
            onChange={setCvData}
            selectedTemplate={templateId}
            isEditMode={true} // můžeš využít tento prop k úpravám logiky
            id={id} // kvůli API /api/edit-cv
          />
        </div>
      </div>
    </>
  );
}
