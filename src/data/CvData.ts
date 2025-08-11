export type CvData = {
  name: string;
  surname: string;
  title: string;
  phone: string;
  email: string;
  location: string;
  linkedin: string;
  photo: string; // base64 nebo URL
  showPhoto: boolean;
  photoVersion: number;        // ← přidat!
  summary: string;
  showSummary: boolean;
  showTitle: boolean;
  showLinkedin: boolean;
  showBirthyear: boolean;
  showWeb: boolean;
  birthyear: string;
  web: string;
  education: { level: string; field: string; school: string; year: string }[];
  certifications: { name: string; place: string; year: string }[];
  language: { name: string; level: string }[];
  showCertifications: boolean;
  skills: string[];
  experience: {
    position: string;
    company: string;
    date_od: string;
    date_do: string;
    points: string[];
  }[];
};

