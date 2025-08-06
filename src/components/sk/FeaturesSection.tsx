import styles from '@/scss/FeaturesSection.module.scss';
import { FaRegClock, FaFileAlt, FaLock, FaCheckCircle } from 'react-icons/fa';

const features = [
  {
    icon: <FaFileAlt />,
    title: 'Okamžité PDF',
    description: 'Stiahnite si životopis v PDF ihneď po vyplnení.',
  },
  {
    icon: <FaRegClock />,
    title: 'Do 5 minút',
    description: 'Vytvorenie životopisu je rýchle a jednoduché.',
  },
  {
    icon: <FaLock />,
    title: 'Bez registrácie',
    description: 'Nemusíte si vytvárať účet. Stačí vyplniť a stiahnuť.',
  },
  {
    icon: <FaCheckCircle />,
    title: 'Moderné šablóny',
    description: 'Na výber máte z viacerých profesionálnych šablón.',
  },
];

export default function FeaturesSection() {
  return (
    <section className={styles.features}>
      <h2>Prečo práve táto online aplikácia?</h2>
      <div className={styles.grid}>
        {features.map((item, index) => (
          <div key={index} className={styles.tile}>
            <div className={styles.icon}>{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
