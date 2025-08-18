import styles from '@/scss/StatsSection.module.scss';

const stats = [
  {
    value: '380 000+',
    label: 'ľudí na Slovensku hľadá prácu každý mesiac',
  },
  {
    value: '2 hodiny',
    label: 'trvá bežne vytvorenie životopisu',
  },
  {
    value: '5 minut',
    label: 'čas, za ktorý to zvládnete s našou aplikáciou',
  },
  {
    value: '24 hodin',
    label: 'máte možnosť editovať svoj životopis',
  },
];

export default function StatsSection() {
  return (
    <section className={styles.stats}>
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
