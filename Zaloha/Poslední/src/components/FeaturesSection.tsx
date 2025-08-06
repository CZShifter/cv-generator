import styles from '@/scss/FeaturesSection.module.scss';
import { FaRegClock, FaFileAlt, FaLock, FaCheckCircle } from 'react-icons/fa';

const features = [
  {
    icon: <FaFileAlt />,
    title: 'Okamžité PDF',
    description: 'Stáhněte si životopis v PDF ihned po vyplnění.',
  },
  {
    icon: <FaRegClock />,
    title: 'Do 5 minut',
    description: 'Vytvoření životopisu je rychlé a snadné.',
  },
  {
    icon: <FaLock />,
    title: 'Bez registrace',
    description: 'Nemusíte vytvářet účet. Stačí vyplnit a stáhnout.',
  },
  {
    icon: <FaCheckCircle />,
    title: 'Moderní šablony',
    description: 'Na výběr máte z několika profesionálních šablon.',
  },
];

export default function FeaturesSection() {
  return (
    <section className={styles.features}>
      <h2>Proč právě tato online aplikace?</h2>
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
