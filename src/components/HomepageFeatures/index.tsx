import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <Heading as="h1" className={styles.heroTitle}>
          Hi, I'm <span className={styles.highlight}>LEI Jing</span>.
        </Heading>
        <p className={styles.heroSubtitle}>
          Fullstack Developer crafting scalable web & mobile solutions
        </p>
        <p className={styles.heroDescription}>
          I build ambitious, high-performance applications with modern technologies. 
          From backend architecture to engaging user interfaces, I help transform ideas into reality.
        </p>
        <div className={styles.heroCTA}>
          <a href="#contact" className={styles.primaryCTA}>Get in touch</a>
        </div>
      </div>
    </section>
  );
}

function SkillsGrid() {
  const skillGroups = [
    {
      title: 'Backend',
      skills: ['Spring Boot', 'Node.js', 'Golang']
    },
    {
      title: 'Frontend',
      skills: ['Angular', 'Vue.js', 'React']
    },
    {
      title: 'Mobile',
      skills: ['React Native', 'Ionic']
    },
    {
      title: 'DevOps',
      skills: ['Github actions','Gitlab CI/CD','Kubernetes', 'Helm', 'Docker', 'Azure',  'Terraform']
    }
  ];

  return (
    <section className={styles.skillsSection}>
      <Heading as="h2" className={styles.sectionHeading}>
        What I Do
      </Heading>
      <div className={styles.skillsGrid}>
        {skillGroups.map((group, idx) => (
          <div key={idx} className={styles.skillBox}>
            <Heading as="h3" className={styles.skillTitle}>{group.title}</Heading>
            <ul className={styles.skillsList}>
              {group.skills.map((skill, skillIdx) => (
                <li key={skillIdx}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <div className={styles.container}>
      <HeroSection />
      <SkillsGrid />
    </div>
  );
}
