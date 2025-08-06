import styles from '@/scss/StatsSection.module.scss';

const stats = [
  {
    value: '380 000+',
    label: 'ľudí na Slovensku hľadá prácu každý mesiac',
  },
  {
    value: '2 hodiny',
    label: 'bežne trvá vytvoriť životopis',
  },
  {
    value: '5 minút',
    label: 'potrebujete s touto aplikáciou',
  },
  {
    value: '24h',
    label: 'máte možnosť upraviť životopis',
  },
];

export default function StatsSection() {
  return (
    <section className={styles.stats}>
      <h2>Čo by ste mali vedieť!</h2>
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
