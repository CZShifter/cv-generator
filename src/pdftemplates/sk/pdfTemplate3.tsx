import React from "react";
import { CvData } from "@/data/CvData";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaRegStar, FaRegCalendarAlt, FaLink } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdOutlineWorkOutline } from "react-icons/md";

type Props = {
  data: CvData;
};

const pdfTemplate3: React.FC<Props> = ({ data }) => {
  return (
      <>
      <div className="bar"></div>
      <div className="resume">
          {/* LEVÝ SLOUPEC - PRACOVNÍ ZKUŠENOSTI, DOVEDNOSTI */}
          <div className="left">
            <div className="border"></div>
            {/* Fotka jen pokud showPhoto */}
            {data.showPhoto && data.photo && (
              <div className="photo">
                <img src={data.photo} alt="Fotka" />
              </div>
            )}
            <div className="left_section">
              <div className="nameSection">
                <div className="name">
                  {data.name} <br></br><strong>{data.surname}</strong>
                </div>
                {/* Vždy vykresli, ale skryj když není showTitle */}
                {data.showTitle && data.title && (
                  <div className="position_title">{data.title}</div>
                )}
              </div>
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
                  <p><FaRegCalendarAlt /> Rok narodenia: {data.birthyear}</p>
                )}
                {data.showWeb && data.web && (
                  <p><FaLink /> {data.web}</p>
                )}
              </div>
              {data.education.length > 0 && (
              <div className="education" id="skola">
                <h3>VZDELANIE</h3>
                {data.education.map((e, i) => (
                  <div key={i} className="educationEntry">
                    <strong>{e.level}</strong><br />
                    <em>{e.field}</em><br />
                    {e.school}<br />
                    {e.year}
                  </div>
                ))}
              </div>
              )}
              {data.showCertifications && data.certifications.length > 0 && (
                <div className="certifikate" id="certifikaty">
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
                <div className="languages" id="jazyky">
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
          {/* PRAVÝ SLOUPEC - FOTKA, OSOBNÍ ÚDAJE, VZDĚLÁNÍ */}
          <div className="right">
            {/* O MNĚ pouze pokud showSummary */}
            {data.showSummary && data.summary && (
              <div className="summary_wrapper">
                <div className="section-title section-title--noborder"><CgProfile />O MNE</div>
                <div className="summary">{data.summary}</div>
              </div>
            )}
            {data.experience.length > 0 && (
            <div className="experience">
              <div className="section-title"><MdOutlineWorkOutline />PRACOVNÉ SKÚSENOSTI</div>
              {data.experience.map((exp, i) => (
              
              <div className="experience-entry" key={i}>
                <span className="company"> {exp.date_od} - {exp.date_do} </span>
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
            )}
            {data.skills.length > 0 && (
            <div className="skills" id="skill_container">
              <div className="section-title"><FaRegStar />ZRUČNOSTI</div>
              <ul className="skillsList">
                {data.skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div> 
            )}
          </div>
      </div>
    </>
  );
};

export default pdfTemplate3;
