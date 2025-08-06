import React, { useState, useRef, useEffect } from "react";
import styles from "@/scss/HelpTooltip.module.scss";
import { FaQuestionCircle } from "react-icons/fa";

type Props = {
  text: string;
  position?: "top" | "right" | "bottom" | "left";
};

const HelpTooltip: React.FC<Props> = ({ text, position = "top" }) => {
  const [visible, setVisible] = useState(false);
  const [align, setAlign] = useState<"center" | "left" | "right">("center");
  const [sideOffset, setSideOffset] = useState<number | null>(null); // distance od okraje
  const boxRef = useRef<HTMLSpanElement>(null);

  // Reset align a offset na center při každém otevření
  useEffect(() => {
    if (visible) {
      setAlign("center");
      setSideOffset(null);
    }
  }, [visible, text, position]);

  // Přepočítej align a offset až po renderu tooltipu
  useEffect(() => {
    if (visible && align === "center" && boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      const margin = 12; // 1rem = 16px, uprav dle font-size

      if (rect.left < margin) {
        setAlign("left");
        setSideOffset(margin - rect.left);
      } else if (rect.right > window.innerWidth - margin) {
        setAlign("right");
        setSideOffset(rect.right - (window.innerWidth - margin));
      } else {
        setAlign("center");
        setSideOffset(null);
      }
    }
  }, [visible, align, text, position]);

  // Inline styl s offsetem pro left/right align
  const offsetStyle =
    align === "left"
      ? { left: `${sideOffset ?? 0}px`, right: "auto", transform: "none" }
      : align === "right"
      ? { right: `${sideOffset ?? 0}px`, left: "auto", transform: "none" }
      : {};

  return (
    <span
      className={`${styles.tooltipWrap} ${styles[position]}`}
      tabIndex={0}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      onClick={() => setVisible(v => !v)}
      style={{ display: "inline-block", marginLeft: 8 }}
    >
      <FaQuestionCircle className={styles.icon} />
      {visible && (
        <span
          className={`${styles.tooltipBox} ${styles[align]}`}
          ref={boxRef}
          style={offsetStyle}
        >
          {text}
        </span>
      )}
    </span>
  );
};

export default HelpTooltip;
