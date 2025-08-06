import React from "react";
import { CvData } from "@/data/CvData";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaRegStar, FaRegCalendarAlt } from "react-icons/fa";
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
                <div
                  className={
                    "position-title" +
                    (!data.showTitle ? " hiddenText" : "")
                  }
                >
                  {data.title}
                </div>
              </div>
              <div className="rightSection">
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
                  <p><FaRegCalendarAlt /> Rok narození: {data.birthyear}</p>
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
            </div>
          </div>
          {/* PRAVÝ SLOUPEC - FOTKA, OSOBNÍ ÚDAJE, VZDĚLÁNÍ */}
          <div className="right">
            {/* O MNĚ pouze pokud showSummary */}
            {data.showSummary && data.summary && (
              <div className="section">
                <div className="section-title section-title--noborder"><CgProfile />O MNĚ</div>
                <div className="summary">{data.summary}</div>
              </div>
            )}
            <div className="section">
              <div className="section-title"><MdOutlineWorkOutline />PRACOVNÍ ZKUŠENOSTI</div>
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
              <div className="section" id="skill_container">
              <div className="section-title"><FaRegStar />DOVEDNOSTI</div>
              <ul className="skillsList">
                {data.skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div> 
          </div>
      </div>
    </>
  );
};

export default pdfTemplate3;
