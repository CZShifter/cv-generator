import React from "react";
import styles from "@/templates/CvTemplate4.module.scss";
import { CvData } from "@/data/CvData";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaRegCalendarAlt } from "react-icons/fa";

export function getCvTemplate4Sections(data: CvData) {
  const left: React.ReactNode[] = [];
  const right: React.ReactNode[] = [];

  // Fotka jen pokud showPhoto
  if (data.showPhoto && data.photo) {
    left.push(
      <div className={styles.photo} key="photo">
        <img src={data.photo} alt="Fotka" />
      </div>
    );
  }

  // Kontakt
  left.push(
    <div className={styles.rightSection} key="contact">
      <h3>KONTAKT</h3>
      <p><FaPhone /> {data.phone}</p>
      <p><FaEnvelope /> {data.email}</p>
      <p><FaMapMarkerAlt /> {data.location}</p>
      {data.showLinkedin && data.linkedin && (
        <p><FaLinkedin /> in/{data.linkedin}</p>
      )}
      {data.showBirthyear && data.birthyear && (
        <p><FaRegCalendarAlt /> Rok narození: {data.birthyear}</p>
      )}
    </div>
  );

  // Vzdělání
  if (data.education.length > 0) {
    left.push(
      <div className={styles.rightSection} key="education">
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
    );
  }

  // Kurzy & certifikáty – každý zvlášť, nadpis jen u prvního
  if (data.showCertifications && data.certifications.length > 0) {
    data.certifications.forEach((c, i) => {
      left.push(
        <div className={styles.rightSection} key={`cert-${i}`}>
          {i === 0 && <h3>KURZY & CERTIFIKÁTY</h3>}
          <div className={styles.educationEntry}>
            <strong>{c.name}</strong><br />
            {c.place}<br />
            {c.year}
          </div>
        </div>
      );
    });
  }

  // Jazyky – celá sekce jako jeden blok
  if (data.language.length > 0) {
    left.push(
      <div className={styles.rightSection} key="languages">
        <h3>JAZYKY</h3>
        {data.language.map((e, i) => (
          <p key={i}>
            <strong>{e.name}:</strong> {e.level}
          </p>
        ))}
      </div>
    );
  }

  // Dovednosti (celý blok)
  if (data.skills.length > 0) {
    left.push(
      <div className={styles.rightSection} key="skills">
        <h3>DOVEDNOSTI</h3>
        <ul className={styles.skillsList}>
          {data.skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>
    );
  }

  // --- PRAVÝ SLOUPEC ---

  // Jméno + pozice
  right.push(
    <div className={styles.nameSection} key="name">
      <div className={styles.name}>
        {data.name} <br /><strong>{data.surname}</strong>
      </div>
      <div
        className={
          styles["position-title"] +
          (!data.showTitle ? " " + styles.hiddenText : "")
        }
      >
        {data.title}
      </div>
    </div>
  );

  // O MNĚ (jen když je vyplněné)
  if (data.showSummary && data.summary) {
    right.push(
      <div className={styles.section} key="summary">
        <div className={`${styles["section-title"]} ${styles["section-title--noborder"]}`}>O MNĚ</div>
        <div className={styles.summary}>{data.summary}</div>
      </div>
    );
  }

  // Pracovní zkušenosti
  if (data.experience.length > 0) {
  data.experience.forEach((exp, i) => {
    right.push(
      <div className={styles.section} key={`exp-${i}`}>
        {i === 0 && (
          <div className={styles["section-title"]}>PRACOVNÍ ZKUŠENOSTI</div>
        )}
        <div className={styles["experience-entry"]}>
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
      </div>
    );
  });
}

  return { left, right };
}
