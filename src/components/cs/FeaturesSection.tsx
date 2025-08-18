import styles from '@/scss/FeaturesSection.module.scss';
import { FaRegClock, FaRegFilePdf, FaRegFileAlt } from 'react-icons/fa';
import { FiLock } from "react-icons/fi";

const features = [
  {
    icon: <FaRegFilePdf />,
    title: 'Formát PDF',
    description: 'Stáhněte si životopis v PDF ihned po vyplnění',
  },
  {
    icon: <FaRegClock />,
    title: 'Do 5 minut',
    description: 'Vytvoření životopisu je rychlé a snadné',
  },
  {
    icon: <FiLock />,
    title: 'Bez registrace',
    description: 'Nemusíte si vytvářet účet. Stačí vyplnit a stáhnout',
  },
  {
    icon: <FaRegFileAlt />,
    title: 'Moderní šablony',
    description: 'Na výběr máte z několika profesionálních šablon',
  },
];

export default function FeaturesSection() {
  return (
    <section className={styles.features}>
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
