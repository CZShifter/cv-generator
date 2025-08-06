import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaRegCalendarAlt } from "react-icons/fa";
import { CvData } from "@/data/CvData";

type Props = {
  data: CvData;
};

const CvTemplate: React.FC<Props> = ({ data }) => {
  return (
    <div className="resume">
      <div className="left">
        <div className="border"></div>
        {/* Fotka jen pokud showPhoto */}
        {data.showPhoto && data.photo && (
        <div className="photo">
          <img src={data.photo} alt="Fotka" />
        </div>
        )}
        <div className="contact">
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
            <p><FaRegCalendarAlt />Rok narodenia: {data.birthyear}</p>
          )}
        </div>
        <div className="education">
          <h3>VZDELANIE</h3>
          {data.education.map((e, i) => (
            <p key={i}>
              <em><strong>{e.level}</strong></em><br />
              <em><strong>{e.field}</strong></em><br />
              {e.school}<br />
              {e.year}
            </p>
          ))}
          {data.showCertifications && (
            <div className="certificate">
              <h3>KURZY & CERTIFIKÁTY</h3>
              {data.certifications.map((c, i) => (
                <p key={`cert-${i}`}>
                  <em><strong>{c.name}</strong></em><br />
                  {c.place}<br />
                  {c.year}
                </p>
              ))}
            </div>
          )}
        </div>
        <div className="language">
          <h3>JAZYKY</h3>
          {data.language.map((e, i) => (
            <p key={i}>
              <em><strong>{e.name}:</strong></em> {e.level}
            </p>
          ))}
        </div>
        <div className="expertise">
          <h3>ZRUČNOSTI</h3>
          <ul>
            {data.skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="right">
        <div className="name">
          {data.name} <br /><strong>{data.surname}</strong>
        </div>
        {data.showTitle && data.title && (
        <div className={"Title"}>{data.title}</div>
         )}
        {/* O MNĚ pouze pokud showSummary */}
        {data.showSummary && data.summary && (
        <div className="summary_wrapper">
          <div className="position-title"></div>
          <div className="section-title"><strong>O MNE</strong></div>
          <div className="summary">{data.summary}</div>
        </div>
        )}
        <div className="section_title2"><strong>PRACOVNÉ SKÚSENOSTI</strong></div>
        {data.experience.map((exp, i) => (
        <div className="experience-entry" key={i}>
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
  );
};

export default CvTemplate;
