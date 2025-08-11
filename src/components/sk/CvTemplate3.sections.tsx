import React from "react";
import styles from "@/templates/CvTemplate3.module.scss";
import { CvData } from "@/data/CvData";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaRegStar, FaRegCalendarAlt, FaLink } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdOutlineWorkOutline } from "react-icons/md";
import ReloadableImage from "@/components/ReloadableImage";

export function getCvTemplate3Sections(data: CvData & { photoVersion?: number }) {
  const left: React.ReactNode[] = [];
  const right: React.ReactNode[] = [];

  // vytáhneme verzi (pokud není, bude 0)
  const version = data.photoVersion ?? 0;
  const photoSrc = data.photo.startsWith("data:")
    ? data.photo
    : `${data.photo}?v=${version}`;

  // Fotka
  if (data.showPhoto && data.photo) {
    left.push(
      <div className={styles.photo} key={`photo-${version}`}>
        <ReloadableImage
          key={`img-${version}`}
          src={photoSrc}
          alt="Fotka"
        />
      </div>
    );
  }

  // Jméno + pozice
  left.push(
    <div className={styles.nameSection} key="name">
      <div className={styles.name}>
        {data.name} <br /><strong>{data.surname}</strong>
      </div>
      {data.showTitle && data.title && (
          <div className={styles.position_title}>{data.title}</div>
      )}
    </div>
  );

  // Kontakt
  left.push(
    <div className={styles.contact} key="contact">
      <h3>KONTAKT</h3>
      <p><FaPhone /> {data.phone}</p>
      <p><FaEnvelope /> {data.email}</p>
      <p><FaMapMarkerAlt /> {data.location}</p>
      {data.showLinkedin && data.linkedin && (
        <p><FaLinkedin /> in/{data.linkedin}</p>
      )}
      {data.showBirthyear && data.birthyear && (
        <p><FaRegCalendarAlt /> Rok narodenia: {data.birthyear}</p>
      )}
      {data.showWeb && data.web && (
        <p><FaLink /> {data.web}</p>
      )}
    </div>
  );

  // Vzdělání
  if (data.education.length > 0) {
    left.push(
      <div className={styles.education} key="education">
        <h3>VZDELANIE</h3>
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
        <div className={styles.certifikate} key={`cert-${i}`}>
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
      <div className={styles.languages} key="languages">
        <h3>JAZYKY</h3>
        {data.language.map((e, i) => (
          <p key={i}>
            <strong>{e.name}:</strong> {e.level}
          </p>
        ))}
      </div>
    );
  }

  // --- PRAVÝ SLOUPEC ZŮSTÁVÁ ---
  if (data.showSummary && data.summary) {
    right.push(
      <div className={styles.summary_wrapper} key="summary">
        <div className={`${styles["section-title"]} ${styles["section-title--noborder"]}`}><CgProfile />O MNE</div>
        <div className={styles.summary}>{data.summary}</div>
      </div>
    );
  }

  if (data.experience?.length) {
  data.experience.forEach((exp, i) => {
    right.push(
      <div className={styles.experience} key={`experience-${i}`}>
        {/* Nadpis pouze u prvního záznamu */}
        {i === 0 && (
          <div className={styles["section-title"]}>
            <MdOutlineWorkOutline />
            PRACOVNÉ SKÚSENOSTI
          </div>
        )}
        <div className={styles["experience-entry"]}>
          <span className={styles.company}>
            {exp.date_od} - {exp.date_do}
          </span>
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

  if (data.skills.length > 0) {
    right.push(
      <div className={styles.skills} key="skills">
        <div className={styles["section-title"]}><FaRegStar />ZRUČNOSTI</div>
        <ul className={styles.skillsList}>
          {data.skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>
    );
  }

  return { left, right };
}
