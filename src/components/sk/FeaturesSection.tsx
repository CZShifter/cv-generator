import styles from '@/scss/FeaturesSection.module.scss';
import { FaRegClock, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import { FiLock } from "react-icons/fi";

const features = [
  {
    icon: <FaFileAlt />,
    title: 'Formát PDF',
    description: 'Stiahnite si životopis v PDF ihneď po vyplnení',
  },
  {
    icon: <FaRegClock />,
    title: 'Do 5 minút',
    description: 'Vytvorenie životopisu je rýchle a jednoduché',
  },
  {
    icon: <FiLock />,
    title: 'Bez registrácie',
    description: 'Nemusíte si vytvárať účet. Stačí vyplniť a stiahnuť',
  },
  {
    icon: <FaCheckCircle />,
    title: 'Moderné šablóny',
    description: 'Na výber máte z niekoľkých profesionálnych šablón',
  },
];

export default function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className={styles.grid}>
        {features.map((item, index) => (
          <div key={index} className={styles.tile}>
            <div className={styles.icon}>{item.icon}</div>
            <h2 className={styles.featureTitle}>{item.title}</h2>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
