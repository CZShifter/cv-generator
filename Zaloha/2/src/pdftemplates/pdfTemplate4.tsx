import React from "react";
import { CvData } from "@/data/CvData";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaRegCalendarAlt } from "react-icons/fa";

type Props = {
  data: CvData;
};

const CvTemplate4Flat: React.FC<Props> = ({ data }) => {
  return (
    <>
      <div className="bar"></div>
      <div className="resume">
          {/* LEVÝ SLOUPEC - PRACOVNÍ ZKUŠENOSTI, DOVEDNOSTI */}
          <div className="left">
              {/* Fotka jen pokud showPhoto */}
              {data.showPhoto && data.photo && (
                <div className="photo">
                  <img src={data.photo} alt="Fotka" />
                </div>
              )}
              <div className="rightSection">
                <h3>KONTAKT</h3>
                <p> {data.phone}<FaPhone /></p>
                <p> {data.email}<FaEnvelope /></p>
                <p> {data.location}<FaMapMarkerAlt /></p>
                {/* LinkedIn pouze pokud showLinkedin */}
                {data.showLinkedin && data.linkedin && (
                  <p> in/{data.linkedin}<FaLinkedin /></p>
                )}
                {data.showBirthyear && data.birthyear && (
                  <p>Rok narození: {data.birthyear}<FaRegCalendarAlt /></p>
                )}
              </div>
              <div className="rightSection" id="skola">
                <h3>VZDĚLÁNÍ</h3>
                {data.education.map((e, i) => (
                  <div key={i} className="educationEntry">
                    <strong>{e.level}</strong><br />
                    <em>{e.field}</em><br />
                    {e.school}<br />
                    {e.year}
                  </div>
                ))}
              </div>
              {data.showCertifications && data.certifications.length > 0 && (
                <div className="rightSection" id="certifikaty">
                  <h3>KURZY & CERTIFIKÁTY</h3>
                  {data.certifications.map((c, i) => (
                    <div key={`cert-${i}`} className="educationEntry">
                      <strong>{c.name}</strong><br />
                      {c.place}<br />
                      {c.year}
                    </div>
                  ))}
                </div>
              )}
              {data.language.length > 0 && (
                <div className="rightSection" id="jazyky">
                  <h3>JAZYKY</h3>
                  {data.language.map((e, i) => (
                    <p key={i}>
                      <strong>{e.name}:</strong> {e.level}
                    </p>
                  ))}
                </div>
              )}
              <div className="rightSection" id="skill_container">
                <h3>DOVEDNOSTI</h3>
                <ul className="skillsList">
                  {data.skills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
          </div>
          {/* PRAVÝ SLOUPEC - FOTKA, OSOBNÍ ÚDAJE, VZDĚLÁNÍ */}
          <div className="right">
            <div className="nameSection">
              <div className="name">
                {data.name} <br /><strong>{data.surname}</strong>
              </div>
              <div
                className={
                  "position-title" +
                  (!data.showTitle ? " hiddenText" : "")
                }
              >
                {data.title}
              </div>
            </div>
            {data.showSummary && data.summary && (
              <div className="section">
                <div className="section-title section-title--noborder">O MNĚ</div>
                <div className="summary">{data.summary}</div>
              </div>
            )}
            <div className="section">
              <div className="section-title">PRACOVNÍ ZKUŠENOSTI</div>
              {data.experience.map((exp, i) => (
                <div className="experience-entry" key={i}>
                  <span className="company">{exp.date_od} - {exp.date_do}</span>
                  <div className="expirience_columns">
                    <strong>{exp.position}</strong>
                    <span className="company"> {exp.company}</span>
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
    </> 
  );
};

export default CvTemplate4Flat;
