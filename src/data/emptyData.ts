// src/types/emptyData.ts
import { CvData } from "@/data/CvData";

export const emptyData: CvData = {
  name: "",
  surname: "",
  title: "",
  phone: "",
  email: "",
  location: "",
  linkedin: "",
  photo: "",
  birthyear: "",
  web: "",
  education: [],
  certifications: [],
  language: [],
  skills: [],
  summary: "",
  experience: [],
  showTitle: false,
  showLinkedin: false,
  showPhoto: false,
  photoVersion: 0,
  showSummary: false,
  showCertifications: false,
  showBirthyear: false,
  showWeb: false,
};

// Pokud by tam bylo něco jako "export default emptyData;", pak by byl váš původní import správný,
// ale pokud je to jen "export const emptyData", pak je potřeba pojmenovaný import.