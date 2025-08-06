import React from "react";
import type { CvData } from "../data/CvData";
import styles from "@/templates/CvTemplate2.module.scss";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaRegCalendarAlt } from "react-icons/fa";
import ReloadableImage from "@/components/ReloadableImage";

export function getCvTemplate2Sections(data: CvData & { photoVersion?: number }) {
  const left: React.ReactNode[] = [];
  const right: React.ReactNode[] = [];

  // vytáhneme verzi (pokud není, bude 0)
  const version = data.photoVersion ?? 0;
  const photoSrc = data.photo.startsWith("data:")
    ? data.photo
    : `${data.photo}?v=${version}`;

  // --- LEVÝ SLOUPEC ---
  left.push(
    <div className={styles.nameSection} key="name">
      <div className={styles.name}>
        {data.name} <br /><strong>{data.surname}</strong>
      </div>
    </div>
  );
  
  if (data.showTitle && data.title) {
    left.push(
      <div key="Title">
        <div className={styles.position_title}>{data.title}</div>
      </div>
    );
  }
  if (data.showSummary && data.summary) {
    left.push(
      <div className={styles.section} key="summary">
        <div className={`${styles["section-title"]} ${styles["section-title--noborder"]}`}>O MNĚ</div>
        <div className={styles.summary}>{data.summary}</div>
      </div>
    );
  }

  // --- PRACOVNÍ ZKUŠENOSTI – každý záznam samostatně, nadpis jen u prvního na stránce ---
  if (data.experience?.length) {
    data.experience.forEach((exp, i) => {
      left.push(
        <div className={styles.section} key={`exp-${i}`}>
          {/* Nadpis jen u prvního */}
          {i === 0 && <div className={styles["section-title2"]}>PRACOVNÍ ZKUŠENOSTI</div>}
          <div className={styles["experience-entry"]}>
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
        </div>
      );
    });
  }

  if (data.skills?.length) {
    left.push(
      <div className={styles.section} key="skills">
        <div className={styles["section-title"]}>DOVEDNOSTI</div>
        <ul className={styles.skillsList}>
          {data.skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>
    );
  }

  // --- PRAVÁ STRANA ---
  if (data.showPhoto && data.photo) {
    right.push(
      <div className={styles.photo} key={`photo-${version}`}>
        <ReloadableImage
          key={`img-${version}`}
          src={photoSrc}
          alt="Fotka"
        />
      </div>
    );
  }

  right.push(
    <div className={styles.contact} key="contact">
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

  if (data.education?.length) {
    right.push(
      <div key="education">
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

  // --- KURZY & CERTIFIKÁTY – každý certifikát samostatně, nadpis jen u prvního ---
  if (data.showCertifications && data.certifications.length > 0) {
    data.certifications.forEach((c, i) => {
      right.push(
        <div key={`cert-${i}`}>
          {/* Nadpis jen u prvního */}
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

  if (data.language.length > 0) {
    right.push(
      <div key="languages">
        <h3>JAZYKY</h3>
        <div className={styles.languages}>
        {data.language.map((e, i) => (
          <p key={i}>
            <strong>{e.name}:</strong> {e.level}
          </p>
        ))}
        </div>
      </div>
    );
  }
  return { left, right };
}
