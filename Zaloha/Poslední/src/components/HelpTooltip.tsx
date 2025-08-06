import React, { useState } from "react";
import styles from "@/scss/HelpTooltip.module.scss";
import { FaQuestionCircle } from "react-icons/fa";

type Props = {
  text: string;    // nápověda
  position?: "top" | "right" | "bottom" | "left"; // kde se má tooltip zobrazit
};

const HelpTooltip: React.FC<Props> = ({ text, position = "top" }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={`${styles.tooltipWrap} ${styles[position]}`}
      tabIndex={0}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      onClick={() => setVisible(v => !v)}
      style={{ display: "inline-block", marginLeft: 6 }}
    >
      <FaQuestionCircle className={styles.icon} />
      {visible && (
        <span className={styles.tooltipBox}>
          {text}
        </span>
      )}
    </span>
  );
};

export default HelpTooltip;
