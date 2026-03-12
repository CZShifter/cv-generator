import React, { useLayoutEffect, useRef, useState } from "react";
import { CvData } from "@/data/CvData";
import { CV_WIDTH, CV_HEIGHT } from "@/constants";
import ProfessionCvPreview from "@/components/ProfessionCvPreview";
import styles from "@/scss/Profession.module.scss";

type Props = {
  locale: "cs" | "sk";
  data: CvData;
  templateId?: "cvtemplate" | "cvtemplate2";
};

export default function ProfessionPreviewFrame({ locale, data, templateId }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [frameHeight, setFrameHeight] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const update = () => {
      const width = el.clientWidth;
      if (!width) return;
      const nextScale = width / CV_WIDTH;
      setScale(nextScale);
      setFrameHeight(Math.round(CV_HEIGHT * nextScale));
      setReady(true);
    };

    update();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (ro) ro.observe(el);
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
      if (ro) ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className={styles.previewFrame}
      style={{
        height: ready && frameHeight ? `${frameHeight}px` : "0px",
        opacity: ready ? 1 : 0,
        transition: "opacity 120ms ease",
      }}
    >
      <div
        className={styles.previewScale}
        style={{
          width: CV_WIDTH,
          height: CV_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <ProfessionCvPreview locale={locale} data={data} templateId={templateId} />
      </div>
    </div>
  );
}
