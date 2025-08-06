import React from "react";
import styles from "@/templates/CvTemplate.module.scss";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaRegCalendarAlt } from "react-icons/fa";
import { CvData } from "@/data/CvData";
import ReloadableImage from "@/components/ReloadableImage";

export function getCvTemplate1Sections(data: CvData & { photoVersion?: number }) {
  // --- LEVÁ STRANA ---
  const left: React.ReactNode[] = [];
  const right: React.ReactNode[] = [];

  // vytáhneme verzi (pokud není, bude 0)
  const version = data.photoVersion ?? 0;
  const photoSrc = data.photo.startsWith("data:")
    ? data.photo
    : `${data.photo}?v=${version}`;

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
        <p><FaRegCalendarAlt /> Rok narození: {data.birthyear}</p>
      )}
    </div>
  );

  if (data.education?.length) {
    left.push(
      <div className={styles.education} key="education">
        <h3>VZDĚLÁNÍ</h3>
        {data.education.map((e, i) => (
          <p key={i}>
            <em><strong>{e.level}</strong></em><br />
            <em><strong>{e.field}</strong></em><br />
            {e.school}<br />
            {e.year}
          </p>
        ))}
      </div>
    );
  }

  if (data.showCertifications && data.certifications.length > 0) {
    data.certifications.forEach((c, i) => {
      left.push(
        <div className={styles.certificate} key={`cert-${i}`}>
          {i === 0 && <h3>KURZY & CERTIFIKÁTY</h3>}
          <p>
            <em><strong>{c.name}</strong></em><br />
            {c.place}<br />
            {c.year}
          </p>
        </div>
      );
    });
  }

  if (data.language.length > 0) {
    left.push(
      <div className={styles.language} key="languages">
        <h3>JAZYKY</h3>
        {data.language.map((e, i) => (
          <p key={i}>
            <em><strong>{e.name}:</strong> {e.level}</em>
          </p>
        ))}
      </div>
    );
  }

  if (data.skills.length > 0) {
    left.push(
      <div className={styles.expertise} key="skills">
        <h3>DOVEDNOSTI</h3>
        <ul>
          {data.skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>
    );
  }

  // --- PRAVÁ STRANA ---
  right.push(
    <div className={styles.nameSection} key="name">
      <div className={styles.name}>
        {data.name} <br /><strong>{data.surname}</strong>
      </div>
    </div>
  );
  if (data.showTitle && data.title) {
    right.push(
      <div key="Title">
        <div className={styles.Title}>{data.title}</div>
      </div>
    );
  }

  if (data.showSummary && data.summary) {
    right.push(
      <div className={styles["summary_wrapper"]} key="summary">
        <div className={styles["position-title"]}></div>
        <div className={styles["section-title"]}><strong>O MNĚ</strong></div>
        <div className={styles.summary}>{data.summary}</div>
      </div>
    );
  }

  if (data.experience.length > 0) {
    data.experience.forEach((exp, i) => {
      right.push(
        <div key={`exp-${i}`}>
          {i === 0 && (
            <div className={styles["section-title"]}>
              <strong>PRACOVNÍ ZKUŠENOSTI</strong>
            </div>
          )}
          <div className={styles["experience-entry"]}>
            <strong>{exp.position}</strong><br />
            {exp.company} | {exp.date_od} - {exp.date_do}
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

  return { left, right };
}
