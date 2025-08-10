import React from "react";
import styles from "@/templates/CvTemplate.module.scss";
import { playfair } from "@/styles/fonts";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaRegCalendarAlt } from "react-icons/fa";
import { CvData } from "@/data/CvData";

type Props = {
  data: CvData;
};

const CvTemplate: React.FC<Props> = ({ data }) => {
  return (
    <div id="cv-container">
      <div className={`${styles.resume} ${playfair.className}`}>
        <div className={styles.left}>
          {/* Fotka jen pokud showPhoto */}
          {data.showPhoto && data.photo && (
            <div className={styles.photo}>
              <img src={data.photo} alt="Fotka" />
            </div>
          )}
          <div className={styles.contact}>
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
          </div>
          <div className={styles.education}>
            <h3>VZDĚLÁNÍ</h3>
            {data.education.map((e, i) => (
              <p key={i}>
                <em><strong>{e.level}</strong></em><br />
                <em><strong>{e.field}</strong></em><br />
                {e.school}<br />
                {e.year}
              </p>
            ))}
            {data.showCertifications && (
              <>
                <h3>KURZY & CERTIFIKÁTY</h3>
                {data.certifications.map((c, i) => (
                  <p key={`cert-${i}`}>
                    <em><strong>{c.name}</strong></em><br />
                    {c.place}<br />
                    {c.year}
                  </p>
                ))}
              </>
            )}
          </div>
          <div className={styles.education}>
            <h3>JAZYKY</h3>
            {data.language.map((e, i) => (
              <p key={i}>
                <em><strong>{e.name}:</strong> {e.level}</em>
              </p>
            ))}
          </div>
          <div className={styles.expertise}>
            <h3>DOVEDNOSTI</h3>
            <ul>
              {data.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.name}>
            {data.name} <br /><strong>{data.surname}</strong>
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
          {/* O MNĚ pouze pokud showSummary */}
          {data.showSummary && data.summary && (
            <>
              <div className={styles["section-title"]}><strong>O MNĚ</strong></div>
              <div className={styles.summary}>{data.summary}</div>
            </>
          )}
          <div className={styles["section-title"]}><strong>PRACOVNÍ ZKUŠENOSTI</strong></div>
          {data.experience.map((exp, i) => (
            <div className={styles["experience-entry"]} key={i}>
              <strong>{exp.position}</strong><br />
              {exp.company} | {exp.date_od} - {exp.date_do}
              <ul>
                {exp.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CvTemplate;
