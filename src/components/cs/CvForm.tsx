import React, { useState } from "react";
import styles from "@/scss/preview.module.scss";
import { FaTrash, FaEdit, FaCamera } from "react-icons/fa";
import { CvData } from "@/data/CvData";
/* import { useRouter } from "next/router"; */
import HelpTooltip from "@/components/HelpTooltip";
import ImageCropModal from "@/components/ImageCropModal";
import { ALL_CV_TEMPLATES } from "@/utils/cvTemplatesConfig";
import { trackGAEvent } from "@/utils/analytics";
import { PRICE_CV } from "@/config/site";

export type CvFormProps = {
  data: CvData;
  onChange: (newData: CvData) => void;
  selectedTemplate: string; 
  onCancel: () => void;
};


const steps = [
  "Kontakt",
  "Vzdělání",
  "Kurzy",
  "Jazyky", // --- PŘIDANÝ KROK "Jazyky" ---
  "Dovednosti",
  "Zkušenosti",
];

const recommendedSkills = [
  "MS Office (Excel, Word, PowerPoint)",
  "Obchodní korespondence",
  "Znalost CRM systémů (např. SAP, Helios)",
  "Fakturace",
  "Time management",
  "Prezentační dovednosti",
  "Komunikativnost",
  "Odolnost vůči stresu",
  "Samostatnost",
  "Ochota učit se novým věcem",
  "Zodpovědnost",
  "Flexibilita",
  "Týmová spolupráce",
  "Řidičský průkaz sk. B",
];

// --- NOVÉ: Definice jazykových úrovní jako pole stringů ---
const languageLevels: string[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
  "Rodilý mluvčí",
];

const CvForm: React.FC<CvFormProps> = ({ data, onChange, selectedTemplate, onCancel }) => {
  const [step, setStep] = useState(0);
  /* const router = useRouter(); */

  // ✅ Nové stavy pro krok 6 (souhlas a zpracování)
  const [agree, setAgree] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAgreeError, setShowAgreeError] = useState(false);

  // State pro Image Cropping Modal
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  // Najděte aktuální konfiguraci šablony pro nastavení fotky
  const currentTemplateConfig = ALL_CV_TEMPLATES.find(
    (template) => template.id === selectedTemplate
  );
  const photoConfig = currentTemplateConfig?.photoConfig;
  

  // Lokální form state pro přidávací/edit boxy jednotlivých sekcí
  const [eduForm, setEduForm] = useState({ level: "", field: "", school: "", year: "" });
  const [eduEditIdx, setEduEditIdx] = useState<number | null>(null);

  const [certForm, setCertForm] = useState({ name: "", place: "", year: "" });
  const [certEditIdx, setCertEditIdx] = useState<number | null>(null);

  const [skillForm, setSkillForm] = useState("");
  const [skillEditIdx, setSkillEditIdx] = useState<number | null>(null);

  // --- NOVÝ LOKÁLNÍ STAV pro jazyky ---
  const [languageForm, setLanguageForm] = useState({ name: "", level: "" });
  const [languageEditIdx, setLanguageEditIdx] = useState<number | null>(null);

  const [expForm, setExpForm] = useState({
    position: "",
    company: "",
    date_od: "",
    date_do: "",
    points: [""],
  });
  const [expEditIdx, setExpEditIdx] = useState<number | null>(null);

  // --- Vzdělání ---
  const resetEduForm = () => setEduForm({ level: "", field: "", school: "", year: "" });

  const handleSaveEdu = () => {
    if (!eduForm.level && !eduForm.field && !eduForm.school && !eduForm.year) return;

    if (eduEditIdx === null) {
      onChange({ ...data, education: [...data.education, eduForm] });
    } else {
      const arr = [...data.education];
      arr[eduEditIdx] = eduForm;
      onChange({ ...data, education: arr });
      setEduEditIdx(null);
    }
    resetEduForm();
  };
  const handleEditEdu = (idx: number) => {
    setEduForm(data.education[idx]);
    setEduEditIdx(idx);
  };
  const handleDeleteEdu = (idx: number) => {
    onChange({ ...data, education: data.education.filter((_, i) => i !== idx) });
    if (eduEditIdx === idx) {
      setEduEditIdx(null);
      resetEduForm();
    }
  };
  // --- kurzy ---
  const resetCertForm = () => setCertForm({ name: "", place: "", year: "" });
  const handleSaveCert = () => {
    if (!certForm.name && !certForm.place && !certForm.year) return;
    if (certEditIdx === null) {
      onChange({ ...data, certifications: [...data.certifications, certForm] });
    } else {
      const arr = [...data.certifications];
      arr[certEditIdx] = certForm;
      onChange({ ...data, certifications: arr });
      setCertEditIdx(null);
    }
    resetCertForm();
  };
  const handleEditCert = (idx: number) => {
    setCertForm(data.certifications[idx]);
    setCertEditIdx(idx);
  };
  const handleDeleteCert = (idx: number) => {
    onChange({ ...data, certifications: data.certifications.filter((_, i) => i !== idx) });
    if (certEditIdx === idx) {
      setCertEditIdx(null);
      resetCertForm();
    }
  };

  // --- Skills ---
  const resetSkillForm = () => setSkillForm("");
  const handleSaveSkill = () => {
    const skillToSave = skillForm.trim();
    if (!skillToSave) return;

    if (skillEditIdx === null) {
      onChange({ ...data, skills: [...data.skills, skillToSave] });
    } else {
      const arr = [...data.skills];
      arr[skillEditIdx] = skillToSave;
      onChange({ ...data, skills: arr });
      setSkillEditIdx(null);
    }
    resetSkillForm();
  };
  const handleEditSkill = (idx: number) => {
    setSkillForm(data.skills[idx]);
    setSkillEditIdx(idx);
  };
  const handleDeleteSkill = (idx: number) => {
    onChange({ ...data, skills: data.skills.filter((_, i) => i !== idx) });
    if (skillEditIdx === idx) {
      setSkillEditIdx(null);
      resetSkillForm();
    }
  };

  // --- NOVÉ: Jazyky (upraveno pro 'language' pole) ---
  const resetLanguageForm = () => setLanguageForm({ name: "", level: "" });

  const handleSaveLanguage = () => {
    // Jazyk nesmí být prázdný a úroveň musí být vybrána
    if (!languageForm.name.trim() || !languageForm.level) {
      alert("Prosím zadejte název jazyka a vyberte úroveň.");
      return;
    }

    const languageToSave = {
      name: languageForm.name.trim(),
      level: languageForm.level,
    };

    if (languageEditIdx === null) {
      onChange({ ...data, language: [...data.language, languageToSave] });
    } else {
      const arr = [...data.language];
      arr[languageEditIdx] = languageToSave;
      onChange({ ...data, language: arr });
      setLanguageEditIdx(null);
    }
    resetLanguageForm();
  };

  const handleEditLanguage = (idx: number) => {
    setLanguageForm(data.language[idx]);
    setLanguageEditIdx(idx);
  };

  const handleDeleteLanguage = (idx: number) => {
    onChange({ ...data, language: data.language.filter((_, i) => i !== idx) });
    if (languageEditIdx === idx) {
      setLanguageEditIdx(null);
      resetLanguageForm();
    }
  };

  // --- Experience ---
  const resetExpForm = () => setExpForm({
    position: "",
    company: "",
    date_od: "",
    date_do: "",
    points: [""],
  });

  const handleSaveExp = () => {
    const filteredPoints = expForm.points.filter(point => point.trim() !== '');

    const experienceToSave = {
      ...expForm,
      points: filteredPoints,
    };

    if (
      !experienceToSave.position &&
      !experienceToSave.company &&
      !experienceToSave.date_od &&
      !experienceToSave.date_do &&
      experienceToSave.points.length === 0
    ) {
      return;
    }

    if (expEditIdx === null) {
      onChange({ ...data, experience: [...data.experience, experienceToSave] });
    } else {
      const arr = [...data.experience];
      arr[expEditIdx] = experienceToSave;
      onChange({ ...data, experience: arr });
      setExpEditIdx(null);
    }
    resetExpForm();
  };

  const handleEditExp = (idx: number) => {
    setExpForm(data.experience[idx]);
    setExpEditIdx(idx);
  };
  const handleDeleteExp = (idx: number) => {
    onChange({ ...data, experience: data.experience.filter((_, i) => i !== idx) });
    if (expEditIdx === idx) {
      setExpEditIdx(null);
      resetExpForm();
    }
  };

  // Body k experience
  const handleExpPointChange = (i: number, val: string) => {
    setExpForm(f => ({
      ...f,
      points: f.points.map((p, idx) => idx === i ? val : p),
    }));
  };
  const handleAddExpPoint = () => {
    setExpForm(f => ({ ...f, points: [...f.points, ""] }));
  };
  const handleDeleteExpPoint = (i: number) => {
    setExpForm(f => {
      const newPoints = f.points.filter((_, idx) => idx !== i);
      if (newPoints.length === 0) {
        return { ...f, points: [""] };
      }
      return { ...f, points: newPoints };
    });
  };

  // Upravená funkce pro nahrání fotky
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        setImageToCrop(ev.target.result as string);
        setIsCropModalOpen(true); // Otevřít modal s ořezem
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCroppedImage = (croppedImageBase64: string) => {
    onChange({ ...data, photo: croppedImageBase64});
    setIsCropModalOpen(false); // Zavřít modal po uložení
    setImageToCrop(null);
  };
  
  // Funkce tlacitka generovat
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dots, setDots] = useState(".");

  React.useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setDots(prev => (prev.length < 3 ? prev + "." : "."));
      }, 400);
      return () => clearInterval(interval);
    } else {
      setDots(".");
    }
  }, [isGenerating]);
  // Generovat ve zkusenostech
  const [isExpGenerating, setIsExpGenerating] = useState(false);
  const [expError, setExpError] = useState<string | null>(null);
  const [expDots, setExpDots] = useState(".");

  React.useEffect(() => {
    if (isExpGenerating) {
      const interval = setInterval(() => {
        setExpDots(prev => (prev.length < 3 ? prev + "." : "."));
      }, 400);
      return () => clearInterval(interval);
    } else {
      setExpDots(".");
    }
  }, [isExpGenerating]);

  // --- STEPPER ---
  return (
    <div className={styles.formOuter}>
      {/* Image Crop Modal */}
      {isCropModalOpen && imageToCrop && photoConfig && (
        <ImageCropModal
          imageSrc={imageToCrop}
          photoConfig={photoConfig}
          onClose={() => setIsCropModalOpen(false)}
          onSave={handleSaveCroppedImage}
        />
      )}
      <div className={styles.stepper}>
        {steps.map((label, i) => (
          <div className={`${styles.stepCircleWrap} ${step === i ? styles.active : ""}`}
            key={i} onClick={() => setStep(i)} style={{ cursor: "pointer" }}>
            <span className={styles.circle}>{i + 1}</span>
            <span className={styles.label}>{label}</span>
          </div>
        ))}
      </div>

      {/* 1. Kontakty, O mně, Fotka */}
      {step === 0 && (
        <div className={styles.card}>
          <div className={styles.formTitle}>Kontaktní údaje</div>
          <div className={styles.rowGrid}>
            <div className={styles.inputGroup}>
              <label>Jméno <HelpTooltip text="Pokud máte titul před jménem, uveďte ho zde" /></label>
              <input className={styles.input} value={data.name} onChange={e => onChange({ ...data, name: e.target.value })} />
            </div>
            <div className={styles.inputGroup}>
              <label>Příjmení <HelpTooltip text="Pokud máte titul za příjmením, uveďte ho zde" /></label>
              <input className={styles.input} value={data.surname} onChange={e => onChange({ ...data, surname: e.target.value })} />
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label>Pracovní zaměření <HelpTooltip text="Uveďte čím se živíte např. Architekt" /></label>
                <label className={styles.switchWrap} style={{ cursor: "pointer" }}>
                  <input type="checkbox" style={{ display: "none" }} checked={!!data.showTitle} onChange={e => onChange({ ...data, showTitle: e.target.checked })} className={styles.switchInput} tabIndex={0} />
                  <span className={styles.switchTrack + (data.showTitle ? ` ${styles.switchOn}` : ` ${styles.switchOff}`)} />
                </label>
              </div>
              <input
                className={`${styles.input} ${!data.showTitle ? styles.disabled : ""}`}
                disabled={!data.showTitle}
                value={data.title}
                onChange={e => onChange({ ...data, title: e.target.value })}
                placeholder="Např. Frontend vývojář"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Telefon</label>
              <input className={styles.input} value={data.phone} onChange={e => onChange({ ...data, phone: e.target.value })} />
            </div>
            <div className={styles.inputGroup}>
              <label>E-mail</label>
              <input className={styles.input} value={data.email} onChange={e => onChange({ ...data, email: e.target.value })} />
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label>LinkedIn <HelpTooltip text="Napište své uživatelské jméno za in/" /></label>
                <label className={styles.switchWrap} style={{ cursor: "pointer" }}>
                  <input type="checkbox" style={{ display: "none" }} checked={!!data.showLinkedin} onChange={e => onChange({ ...data, showLinkedin: e.target.checked })} className={styles.switchInput} tabIndex={0} />
                  <span className={styles.switchTrack + (data.showLinkedin ? ` ${styles.switchOn}` : ` ${styles.switchOff}`)} />
                </label>
              </div>
              <input
                className={`${styles.input} ${!data.showLinkedin ? styles.disabled : ""}`}
                disabled={!data.showLinkedin}
                value={data.linkedin}
                onChange={e => onChange({ ...data, linkedin: e.target.value })}
                placeholder="in/ "
              />
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label>Rok narození <HelpTooltip text="Rok narození je volitelný" /></label>
                <label className={styles.switchWrap} style={{ cursor: "pointer" }}>
                  <input type="checkbox" style={{ display: "none" }} checked={!!data.showBirthyear} onChange={e => onChange({ ...data, showBirthyear: e.target.checked })} className={styles.switchInput} tabIndex={0} />
                  <span className={styles.switchTrack + (data.showBirthyear ? ` ${styles.switchOn}` : ` ${styles.switchOff}`)} />
                </label>
              </div>
              <input
                className={`${styles.input} ${!data.showBirthyear ? styles.disabled : ""}`}
                disabled={!data.showBirthyear}
                value={data.birthyear}
                onChange={e => onChange({ ...data, birthyear: e.target.value })}
                placeholder="Např. 1991"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Adresa <HelpTooltip text="Stačí napsat město ve kterém bydlíte" /></label>
              <input className={styles.input} value={data.location} onChange={e => onChange({ ...data, location: e.target.value })} />
            </div>
          </div>
          <div className={styles.sectionSwitch}>
            <label className={styles.labelRow}>
              <span>O mně <HelpTooltip text="Napište o sobě krátký text, který Vás vystihne" /></span>
              <span className={styles.switchWrap} style={{ cursor: "pointer" }}>
                <input type="checkbox" style={{ display: "none" }} checked={!!data.showSummary} onChange={e => onChange({ ...data, showSummary: e.target.checked })} />
                <span className={styles.switchTrack + (data.showSummary ? ` ${styles.switchOn}` : ` ${styles.switchOff}`)} />
              </span>
              <button
                type="button"
                disabled={!data.showSummary || isGenerating}
                className={`${styles.generate} ${!data.showSummary || isGenerating ? styles.disabled : ""}`}
                style={{
                  opacity: !data.showSummary || isGenerating ? 0.5 : 1,
                  pointerEvents: !data.showSummary || isGenerating ? "none" : "auto",
                  minWidth: 80
                }}
                onClick={async () => {
                  trackGAEvent('click', 'generate', 'generovani_chatgpt_o_mne');
                  setError(null);
                  if (!data.summary || data.summary.trim() === "") {
                    setError("Nejprve napište název pozice nebo krátký popis, co má AI rozvést. Například: Jsem programátor se zálibou v grafice.");
                    return;
                  }
                  setIsGenerating(true);
                  try {
                    const res = await fetch("/api/cs/generate-summary", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ summary: data.summary }),
                    });
                    const json = await res.json();
                    if (json.summary) {
                      onChange({ ...data, summary: json.summary });
                    } else {
                      setError("Generování se nezdařilo.");
                    }
                  } catch {
                    setError("Chyba při komunikaci se serverem.");
                  }
                  setIsGenerating(false);
                }}
                >
                {isGenerating ? <>Generuji{dots}</> : "Generovat"}
              </button>
            </label>
            {error && (
              <div className={styles.errorPopup}>
                {error}
                <button
                  type="button"
                  className={styles.errorClose}
                  onClick={() => setError(null)}
                  aria-label="Zavřít chybové okno"
                >×</button>
              </div>
            )}
            <textarea rows={7}
              className={`${styles.input} ${!data.showSummary ? styles.disabled : ""}`}
              disabled={!data.showSummary}
              value={data.summary}
              onChange={e => onChange({ ...data, summary: e.target.value })}
              placeholder="Napište o sobě, nebo se popište pár slovy a vygenerujte text pomocí AI..."
            />
          </div>
          <div className={styles.sectionSwitch}>
            <label className={styles.labelRow}>
              <span>Přidat fotku <HelpTooltip text="Fotka musí mít maximální rozměr 1024 x 1024px a velikost 2MB" /></span>
              <span className={styles.switchWrap} style={{ cursor: "pointer" }}>
                <input type="checkbox" style={{ display: "none" }} checked={!!data.showPhoto} onChange={e => onChange({ ...data, showPhoto: e.target.checked })} />
                <span className={styles.switchTrack + (data.showPhoto ? ` ${styles.switchOn}` : ` ${styles.switchOff}`)} />
              </span>
            </label>
            <label className={styles.photoUpload}>
              <span className={`${styles.photoBtn} ${!data.showPhoto ? styles.disabled : ''} ${!data.showPhoto ? styles.photoBtnOff : ''}`}>
                <FaCamera />
                <input type="file" accept="image/*" disabled={!data.showPhoto} onChange={handlePhotoUpload} style={{ display: "none" }} />
              </span>
              {data.photo && data.showPhoto && (
                <img
                  src={data.photo}
                  alt="náhled fotky"
                  className={styles.photoPreview}
                  width={150}
                  height={150}
                />
              )}
            </label>
          </div>
          <div className={styles.formButtons}>
            <button type="button" className={styles.cancel} onClick={onCancel}>
              Vybrat šablonu
            </button>
            <button type="button" className={styles.save} onClick={() => setStep(1)}>
              Pokračovat
            </button>
          </div>
        </div>
      )}

      {/* 2. Vzdělání */}
      {step === 1 && (
        <div className={styles.card}>
          <div className={styles.formTitle}>Vzdělání</div>
          <div className={styles.addBox3}>
            <div className={styles.addBoxCol}>
              <label className={styles.inlineLabel} htmlFor="degree-input">Dosažené vzdělání: <HelpTooltip text="Uvádějte od nejvyššího" /></label>
              <input
                id="degree-input"
                className={styles.input}
                placeholder="Dosažené vzdělání"
                value={eduForm.level}
                onChange={e => setEduForm(f => ({ ...f, level: e.target.value }))}
              />
            </div>
            <div className={styles.addBoxCol}>
              <label className={styles.inlineLabel} htmlFor="field-input">Vystudovaný obor: <HelpTooltip text="Jméno oboru" /></label>
              <input
                id="field-input"
                className={styles.input}
                placeholder="Vystudovaný obor"
                value={eduForm.field}
                onChange={e => setEduForm(f => ({ ...f, field: e.target.value }))}
              />
            </div>
            <div className={styles.addBoxCol}>
              <label className={styles.inlineLabel} htmlFor="school-input">Název školy: <HelpTooltip text="Název školy" /></label>
              <input
                id="school-input"
                className={styles.input}
                placeholder="Název školy"
                value={eduForm.school}
                onChange={e => setEduForm(f => ({ ...f, school: e.target.value }))}
              />
            </div>
            <div className={styles.addBoxCol}>
              <label className={styles.inlineLabel} htmlFor="year-input">Rok: <HelpTooltip text="Rok ukončení" /></label>
              <input
                id="year-input"
                className={styles.input}
                placeholder="Rok ukončení"
                value={eduForm.year}
                onChange={e => setEduForm(f => ({ ...f, year: e.target.value }))}
              />
            </div>
            <div className={styles.addBoxActions}>
              {eduEditIdx !== null && (
                <button type="button" className={styles.cancel} onClick={() => { setEduEditIdx(null); resetEduForm(); }}>
                  Zrušit
                </button>
              )}
              <button type="button" className={styles.save} onClick={handleSaveEdu}>
                {eduEditIdx === null ? "Přidat" : "Uložit"}
              </button>
            </div>
          </div>
          {data.education.map((e, i) => (
            <div className={styles.recordRow} key={i}>
              <span>
                <b>{e.level}</b> – {e.field}, {e.school}, {e.year}
              </span>
              <span>
                <button onClick={() => handleEditEdu(i)}><FaEdit /></button>
                <button onClick={() => handleDeleteEdu(i)}><FaTrash /></button>
              </span>
            </div>
          ))}
          <div className={styles.formButtons}>
            <button type="button" className={styles.cancel} onClick={() => setStep(0)}>
              Zpět
            </button>
            <button type="button" className={styles.save} onClick={() => setStep(2)}>
              Pokračovat
            </button>
          </div>
        </div>
      )}
      {/* 3. Kurzy */}
      {step === 2 && (
        <div className={styles.card}>
          <div className={styles.formTitle}>
            Kurzy & Certifikáty
            <label className={styles.switchWrap} style={{ cursor: "pointer", marginLeft: 16 }}>
              <input
                type="checkbox"
                style={{ display: "none" }}
                checked={!!data.showCertifications}
                onChange={e => onChange({ ...data, showCertifications: e.target.checked })}
                className={styles.switchInput}
                tabIndex={0}
              />
              <span className={styles.switchTrack + (data.showCertifications ? ` ${styles.switchOn}` : ` ${styles.switchOff}`)} />
            </label>
          </div>
          <div className={styles.addBox}>
            <div className={styles.addBoxCol}>
              <label className={styles.inlineLabel} htmlFor="cert-name">Název: <HelpTooltip text="Název kurzu" /></label>
              <input
                id="cert-name"
                className={`${styles.input} ${!data.showCertifications ? styles.disabled : ""}`}
                placeholder="Název kurzu/certifikátu"
                disabled={!data.showCertifications}
                value={certForm.name}
                onChange={e => setCertForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className={styles.addBoxCol}>
              <label className={styles.inlineLabel} htmlFor="cert-place">Instituce: <HelpTooltip text="Jméno organizace která kurz pořádala" /></label>
              <input
                id="cert-place"
                className={`${styles.input} ${!data.showCertifications ? styles.disabled : ""}`}
                placeholder="Pořadatel/organizace"
                disabled={!data.showCertifications}
                value={certForm.place}
                onChange={e => setCertForm(f => ({ ...f, place: e.target.value }))}
              />
            </div>
            <div className={styles.addBoxCol}>
              <label className={styles.inlineLabel} htmlFor="cert-year">Rok: <HelpTooltip text="Rok dokončení kurzu" /></label>
              <input
                id="cert-year"
                className={`${styles.input} ${!data.showCertifications ? styles.disabled : ""}`}
                placeholder="Rok ukončení"
                disabled={!data.showCertifications}
                value={certForm.year}
                onChange={e => setCertForm(f => ({ ...f, year: e.target.value }))}
              />
            </div>
            <div className={styles.addBoxActions}>
              {certEditIdx !== null && (
                <button type="button" className={styles.cancel} onClick={() => { setCertEditIdx(null); resetCertForm(); }}>
                  Zrušit
                </button>
              )}
              <button type="button" className={styles.save} onClick={handleSaveCert} disabled={!data.showCertifications}>
                {certEditIdx === null ? "Přidat" : "Uložit"}
              </button>
            </div>
          </div>
          {data.certifications.map((cert, i) => (
            <div className={styles.recordRow} key={i}>
              <span>
                <b>{cert.name}</b> – {cert.place}, {cert.year}
              </span>
              <span>
                <button onClick={() => handleEditCert(i)} disabled={!data.showCertifications}><FaEdit /></button>
                <button onClick={() => handleDeleteCert(i)} disabled={!data.showCertifications}><FaTrash /></button>
              </span>
            </div>
          ))}
          <div className={styles.formButtons}>
            <button type="button" className={styles.cancel} onClick={() => setStep(1)}>
              Zpět
            </button>
            <button type="button" className={styles.save} onClick={() => setStep(3)}> {/* Změna na krok 3 (Jazyky) */}
              Pokračovat
            </button>
          </div>
        </div>
      )}

      {/* --- NOVÝ KROK: 4. Jazyky --- */}
      {step === 3 && (
        <div className={styles.card}>
          <div className={styles.formTitle}>Jazyky</div>
            <div className={styles.CheckboxContainer}>
              <div className={styles.addBox4}>
                <input
                  className={styles.input}
                  placeholder="Zadejte jazyk (např. Anglický jazyk)"
                  value={languageForm.name}
                  onChange={e => setLanguageForm(f => ({ ...f, name: e.target.value }))}/>
                <div className={styles.addBoxActions}>
                  {languageEditIdx !== null && (
                    <button type="button" className={styles.cancel} onClick={() => { setLanguageEditIdx(null); resetLanguageForm(); }}>
                      Zrušit
                    </button>
                  )}
                  <button type="button" className={styles.save} onClick={handleSaveLanguage}>
                    {languageEditIdx === null ? "Přidat" : "Uložit"}
                  </button>
                </div>
              </div>
              <div className={styles.languageLevels}>
                {languageLevels.map(level => (
                  <label key={level} className={styles.checkboxLabel + (languageForm.level === level ? ' ' + styles.checked : '')}>
                    <input
                      type="checkbox"
                      checked={languageForm.level === level}
                      onChange={() =>
                        setLanguageForm(f => ({
                          ...f,
                          level: f.level === level ? "" : level,
                        }))
                      }
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
          {/* Seznam přidaných jazyků */}
          {data.language.map((lang, i) => (
            <div className={styles.recordRow} key={i}>
              <span>
                <b>{lang.name}</b> ({lang.level})
              </span>
              <span>
                <button onClick={() => handleEditLanguage(i)}><FaEdit /></button>
                <button onClick={() => handleDeleteLanguage(i)}><FaTrash /></button>
              </span>
            </div>
          ))}
          <div className={styles.formButtons}>
            <button type="button" className={styles.cancel} onClick={() => setStep(2)}> {/* Zpět na Kurzy */}
              Zpět
            </button>
            <button type="button" className={styles.save} onClick={() => setStep(4)}> {/* Pokračovat na Dovednosti */}
              Pokračovat
            </button>
          </div>
        </div>
      )}

      {/* 5. Dovednosti (index se mění z 3 na 4) */}
      {step === 4 && (
        <div className={styles.card}>
          <div className={styles.formTitle}>Dovednosti</div>
          <div className={styles.addBox2}>
            <input
              className={styles.input}
              placeholder="Zadejte dovednost"
              value={skillForm}
              onChange={e => setSkillForm(e.target.value)}
            />
            <div className={styles.addBoxActions}>
              {skillEditIdx !== null && (
                <button type="button" className={styles.cancel} onClick={() => { setSkillEditIdx(null); resetSkillForm(); }}>
                  Zrušit
                </button>
              )}
              <button type="button" className={styles.save} onClick={handleSaveSkill}>
                {skillEditIdx === null ? "Přidat" : "Uložit"}
              </button>
            </div>
          </div>

          {/* Doporučené dovednosti */}
          <div className={styles.suggestedSkills}>
            {recommendedSkills.map(skill => {
              const isSelected = data.skills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  className={`${styles.suggestedSkill} ${isSelected ? styles.selected : ""}`}
                  disabled={isSelected}
                  onClick={() => {
                    if (!isSelected) {
                      onChange({ ...data, skills: [...data.skills, skill] });
                    }
                  }}
                >
                  <input type="checkbox" checked={isSelected} readOnly />
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>

          {/* Seznam přidaných dovedností */}
          {data.skills.map((skill, i) => (
            <div className={styles.recordRow} key={i}>
              <span>{skill}</span>
              <span>
                <button onClick={() => handleEditSkill(i)}><FaEdit /></button>
                <button onClick={() => handleDeleteSkill(i)}><FaTrash /></button>
              </span>
            </div>
          ))}
          <div className={styles.formButtons}>
            <button type="button" className={styles.cancel} onClick={() => setStep(3)}> {/* Zpět na Jazyky */}
              Zpět
            </button>
            <button type="button" className={styles.save} onClick={() => setStep(5)}> {/* Pokračovat na Zkušenosti */}
              Pokračovat
            </button>
          </div>
        </div>
      )}


      {/* 6. Zkušenosti (index se mění z 4 na 5) */}
      {step === 5 && (
        <div className={styles.card}>
          <div className={styles.formTitle}>Pracovní zkušenosti</div>
          <div className={styles.addBox} style={{ flexDirection: "column", alignItems: "stretch" }}>
            <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
              <input className={styles.input} placeholder="Pozice" value={expForm.position} onChange={e => setExpForm(f => ({ ...f, position: e.target.value }))} />
              <input className={styles.input} placeholder="Společnost" value={expForm.company} onChange={e => setExpForm(f => ({ ...f, company: e.target.value }))} />
              <input className={styles.input} placeholder="Od" value={expForm.date_od} onChange={e => setExpForm(f => ({ ...f, date_od: e.target.value }))} />
              <input className={styles.input} placeholder="Do" value={expForm.date_do} onChange={e => setExpForm(f => ({ ...f, date_do: e.target.value }))} />
            </div>
            <div style={{ margin: "1rem 0 0.5rem 0" }}>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
              <strong>Body (popis pracovní pozice):</strong> <HelpTooltip text="Vypište co byla vaše náplň práce, nebo vygenerujte pomocí AI"/>
              <button
                type="button"
                disabled={isExpGenerating}
                className={`${styles.generate} ${isExpGenerating ? styles.disabled : ""}`}
                style={{
                  opacity: isExpGenerating ? 0.5 : 1,
                  pointerEvents: isExpGenerating ? "none" : "auto",
                  marginLeft: 0,
                  minWidth: 80
                }}
                onClick={async () => {
                trackGAEvent('click', 'generate', 'generovani_chatgpt_zkusenosti');
                setExpError(null);
                if (!expForm.position || expForm.position.trim() === "") {
                  setExpError("Nejdřív vyplňte název pracovní pozice.");
                  return;
                }
                setIsExpGenerating(true);
                try {
                  const res = await fetch("/api/cs/generate-exp-points", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ position: expForm.position }),
                  });
                  const json = await res.json();
                
                  // ZDE SI VYPÍŠEŠ CO PŘIŠLO Z API:
                  console.log("Odpověď z API /api/cs/generate-exp-points:", json);
                
                  if (json.points && Array.isArray(json.points)) {
                    setExpForm(f => ({
                      ...f,
                      points: json.points
                    }));
                  } else {
                    setExpError("Generování se nezdařilo.");
                  }
                } catch {
                  setExpError("Chyba při komunikaci se serverem.");
                }
                setIsExpGenerating(false);
              }}
              >
                {isExpGenerating ? <>Generuji{expDots}</> : "Generovat"}
              </button>
              
              {expError && (
                <div className={styles.errorPopup}>
                  {expError}
                  <button
                    type="button"
                    className={styles.errorClose}
                    onClick={() => setExpError(null)}
                    aria-label="Zavřít chybové okno"
                  >×</button>
                </div>
              )}
              </div>
              {expForm.points.map((p, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 5 }} >
                  <input
                    className={styles.input}
                    style={{ flex: 1, marginRight: 8 }}
                    placeholder="Např. Spolupráce s projektovým manažerem na odhadech časové náročnosti úkolů"
                    value={p}
                    onChange={e => handleExpPointChange(i, e.target.value)}
                  />
                  {expForm.points.length > 1 && (
                    <button type="button" className={styles.cancel} onClick={() => handleDeleteExpPoint(i)} style={{ padding: "0.45rem 1rem" }}>
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className={styles.save} onClick={handleAddExpPoint} style={{ marginTop: 6 }}>
                + Přidat bod
              </button>
            </div>
            <div className={styles.addBoxActions}>
              {expEditIdx !== null && (
                <button type="button" className={styles.cancel} onClick={() => { setExpEditIdx(null); resetExpForm(); }}>
                  Zrušit
                </button>
              )}
              <button type="button" className={styles.save} onClick={handleSaveExp}>
                {expEditIdx === null ? "Přidat zkušenost" : "Uložit"}
              </button>
            </div>
          </div>
          {data.experience.map((exp, i) => (
            <div className={styles.recordRow} key={i}>
              <span>
                <b>{exp.position}</b> – {exp.company}, {exp.date_od} - {exp.date_do}
                <ul style={{ margin: "8px 0 0 0", paddingLeft: 24 }}>
                  {exp.points.filter(p => p.trim() !== '').map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </span>
              <span>
                <button onClick={() => handleEditExp(i)}><FaEdit /></button>
                <button onClick={() => handleDeleteExp(i)}><FaTrash /></button>
              </span>
            </div>
          ))}
          <div className={styles.formButtons}>
            <button type="button" className={styles.cancel} onClick={() => setStep(4)}> {/* Zpět na Dovednosti (nový index 4) */}
              Zpět
            </button>
            {/* Pokud je to poslední krok, můžeš přidat tlačítko pro dokončení */}
            <button
              type="button"
              className={styles.save}
              onClick={async () => {
                setStep(6);
                setTimeout(() => {
                  const el = document.getElementById("pay");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 150); // malá prodleva pro jistotu renderu (100–200ms je bezpečné)
              }}>
              Dokončit
            </button>
          </div>
        </div>
      )}
       {/* 7. rekapitulace a placeni */}
      {step === 6 && (
  <div className={styles.card2}>
    <div className={styles.price_card_wrapp}>
      <div className={styles.price_card} id="pay">
        <div className={styles.price_section}>
          <h2>{PRICE_CV}</h2>
          <p>*Cena za vytvoření jednoho životopisu</p>
        </div>
        <div className={styles.price_bar}></div>
        <div className={styles.price_list}>
          <p>100% bez reklam</p>
          <p>Kompletně bez registrace</p>
          <p>Splňuje veškeré požadavky HR</p>
          <p>Životopis je dostupný 24h k editaci</p>
          <p>PDF připraveno ihned k tisku</p>
          <p>Snadné a rychlé vyplnění</p>
          <p>Žádné členství</p>
        </div>

        {/* Chybová hláška */}
        {showAgreeError && (
          <div className={styles.errorAgree}>
            Musíte nejdříve souhlasit s obchodními podmínkami.
          </div>
        )}

        <div className={styles.inputGroupAgree}>
          <label
            className={
              styles.inputAgree +
              (showAgreeError && !agree ? ' ' + styles.inputAgreeError : '')
            }
          >
            <input
              type="checkbox"
                checked={agree}
                onChange={e => {
                  setAgree(e.target.checked);
                  if (e.target.checked) setShowAgreeError(false); // schovej chybu při zaškrtnutí
                }}
            />
            Souhlasím s <a href="/cs/dokumenty/obchodni-podminky" target="_blank" rel="noopener noreferrer">obchodními podmínkami</a>
          </label>
        </div>
      </div>
      <button
          type="button"
          className={styles.button}
          disabled={isProcessing} // jen při zpracování
          onClick={async () => {
          trackGAEvent('click', 'payment', 'placeni_zivotopisu');
          if (!agree) { setShowAgreeError(true); return; }

          try {
            setIsProcessing(true);
            const r = await fetch("/api/cs/create-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                templateId: selectedTemplate,
                priceCZK: PRICE_CV, // tvoje stávající cena v Kč
              }),
            });
            const j = await r.json();
          
            if (j.redirectUrl && j.transId && j.refId && j.paymentToken) {
              // POZOR: cv_draft teď NEMAŽEME – smaže se až po úspěchu na /cs/po-platbe
              localStorage.setItem("cv_payment", JSON.stringify({
                data,
                templateId: selectedTemplate,
                transId: j.transId,
                refId: j.refId,
                paymentToken: j.paymentToken,
              }));
              window.location.href = j.redirectUrl; // přesměrování na Comgate
            } else {
              alert(j.error || "Něco se pokazilo při zakládání platby.");
            }
          } catch {
            alert("Došlo k chybě při zakládání platby.");
          } finally {
            setIsProcessing(false);
          }
        }}
      >
        {isProcessing ? "Zpracovávám..." : `Zaplatit (${PRICE_CV}Kč)`}
      </button>
    </div>
    <div className={styles.formButtons2}>
      <button type="button" className={styles.cancel2} onClick={() => setStep(5)}>
        Zpět
      </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default CvForm;