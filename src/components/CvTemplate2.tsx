import React from "react";
import styles from "@/templates/CvTemplate2.module.scss";
import { CvData } from "@/data/CvData";
import { montserrat } from "@/styles/fonts";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaRegCalendarAlt, FaLink } from "react-icons/fa";

type Props = {
  data: CvData;
};

const CvTemplate2: React.FC<Props> = ({ data }) => {
  return (
    <div id="cv-container">
      <div className={`${styles.resume} ${montserrat.className}`}>
        {/* LEVÝ SLOUPEC - PRACOVNÍ ZKUŠENOSTI, DOVEDNOSTI */}
        <div className={styles.left}>
          <div className={styles.nameSection}>
            <div className={styles.name}>
              {data.name} <br></br><strong>{data.surname}</strong>
            </div>
            {/* Vždy vykresli, ale skryj když není showTitle */}
            <div
              className={
                styles["position-title"] +
                (!data.showTitle ? " " + styles.hiddenText : "")
              }
            >
              {data.title}
            </div>
          </div>

          {/* O MNĚ pouze pokud showSummary */}
          {data.showSummary && data.summary && (
            <div className={styles.section}>
              <div className={`${styles["section-title"]} ${styles["section-title--noborder"]}`}>O MNĚ</div>
              <div className={styles.summary}>{data.summary}</div>
            </div>
          )}

          <div className={styles.section}>
            <div className={styles["section-title"]}>PRACOVNÍ ZKUŠENOSTI</div>
            {data.experience.map((exp, i) => (
              <div className={styles["experience-entry"]} key={i}>
                <strong>{exp.position}</strong>
                <span className={styles.company}>
                  {exp.company} | {exp.date_od} - {exp.date_do}
                </span>
                <ul>
                  {exp.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className={styles.section}>
            <div className={styles["section-title"]}>DOVEDNOSTI</div>
            <ul className={styles.skillsList}>
              {data.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* PRAVÝ SLOUPEC - FOTKA, OSOBNÍ ÚDAJE, VZDĚLÁNÍ */}
        <div className={styles.right}>
          {/* Fotka jen pokud showPhoto */}
          {data.showPhoto && data.photo && (
            <div className={styles.photo}>
              <img src={data.photo} alt="Fotka" />
            </div>
          )}
          
          <div className={styles.rightSection}>
            <h3>KONTAKT</h3>
            <p><FaPhone /> {data.phone}</p>
            <p><FaEnvelope /> {data.email}</p>
            <p><FaMapMarkerAlt /> {data.location}</p>
            {/* LinkedIn pouze pokud showLinkedin */}
            {data.showLinkedin && data.linkedin && (
              <p><FaLinkedin /> in/{data.linkedin}</p>
            )}
            {/* Narozeniny pouze pokud showBirthyear */}
            {data.showBirthyear && data.birthyear && (
              <p><FaRegCalendarAlt />Rok narození: {data.birthyear}</p>
            )}
            {data.showWeb && data.web && (
              <p><FaLink /> {data.web}</p>
            )}
          </div>

          <div className={styles.rightSection}>
            <h3>VZDĚLÁNÍ</h3>
            {data.education.map((e, i) => (
              <div key={i} className={styles.educationEntry}>
                <strong>{e.level}</strong><br />
                <em>{e.field}</em><br />
                {e.school}<br />
                {e.year}
              </div>
            ))}
          </div>

          {data.showCertifications && data.certifications.length > 0 && (
            <div className={styles.rightSection}>
                <h3>KURZY & CERTIFIKÁTY</h3>
                {data.certifications.map((c, i) => (
                  <div key={`cert-${i}`} className={styles.educationEntry}>
                    <strong>{c.name}</strong><br />
                    {c.place}<br />
                    {c.year}
                  </div>
                ))}
            </div>
          )}

          {data.language.length > 0 && (
            <div className={styles.rightSection}>
              <h3>JAZYKY</h3>
              {data.language.map((e, i) => (
                <p key={i}>
                  <strong>{e.name}:</strong> {e.level}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CvTemplate2;