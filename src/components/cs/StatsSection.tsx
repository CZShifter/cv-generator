import styles from '@/scss/StatsSection.module.scss';

const stats = [
  {
    value: '380 000+',
    label: 'lidí v ČR hledá práci každý měsíc',
  },
  {
    value: '2 hodiny',
    label: 'trvá běžně vytvoření životopisu',
  },
  {
    value: '5 minut',
    label: 'potřebujete s touto aplikací',
  },
  {
    value: '24h',
    label: 'máte možnost editovat životopis',
  },
];

export default function StatsSection() {
  return (
    <section className={styles.stats}>
      <h2>Co byste měli vědět!</h2>
      <div className={styles.grid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.stat}>
            <div className={styles.value}>{stat.value}</div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
