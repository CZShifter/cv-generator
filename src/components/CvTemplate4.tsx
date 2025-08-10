import React from "react";
import styles from "@/templates/CvTemplate4.module.scss";
import { CvData } from "@/data/CvData";
import { playfair } from "@/styles/fonts";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaRegCalendarAlt } from "react-icons/fa";

type Props = {
  data: CvData;
};

const CvTemplate4: React.FC<Props> = ({ data }) => {
  return (
    <div id="cv-container">
      <div className={styles.resume}>
        <div className={`${styles.resume} ${playfair.className}`}>
          {/* LEVÝ SLOUPEC - PRACOVNÍ ZKUŠENOSTI, DOVEDNOSTI */}
          <div className={styles.left}>
            {/* Fotka jen pokud showPhoto */}
            {data.showPhoto && data.photo && (
              <div className={styles.photo}>
                <img src={data.photo} alt="Fotka" />
              </div>
            )}
            <div className={styles.left_section}>
              <div className={styles.rightSection}>
                <h3>KONTAKT</h3>
                <p> {data.phone}<FaPhone /></p>
                <p> {data.email}<FaEnvelope /></p>
                <p> {data.location}<FaMapMarkerAlt /></p>
                {/* LinkedIn pouze pokud showLinkedin */}
                {data.showLinkedin && data.linkedin && (
                  <p> in/{data.linkedin}<FaLinkedin /></p>
                )}
                {/* LinkedIn pouze pokud showLinkedin */}
                {data.showBirthyear && data.birthyear && (
                  <p>Rok narození: {data.birthyear}<FaRegCalendarAlt /></p>
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
              <div className={styles.rightSection}>
                <h3>DOVEDNOSTI</h3>
                <ul className={styles.skillsList}>
                  {data.skills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div> 
            </div>
          </div>
          {/* PRAVÝ SLOUPEC - FOTKA, OSOBNÍ ÚDAJE, VZDĚLÁNÍ */}
          <div className={styles.right}>
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
                  <span className={styles.company}>{exp.date_od} - {exp.date_do}</span>
                  <div className={styles.expirience_columns}>
                    <strong>{exp.position}</strong>
                    <span className={styles.company}> {exp.company}</span>
                    <ul>
                      {exp.points.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                ))}
              </div>
           </div>
          </div>
      </div>
    </div>
  );
};

export default CvTemplate4;