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

function ExperienceSection() {
  const experiences = [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      date: 'Jan 2020 - Present',
      description: 'Led the development of a high-traffic e-commerce platform using Spring Boot and Angular. Implemented a microservices architecture and CI/CD pipelines.'
    },
    {
      title: 'Software Engineer',
      company: 'Innovatech',
      date: 'Jun 2017 - Dec 2019',
      description: 'Developed and maintained a suite of internal tools using Node.js and React. Worked in an Agile environment to deliver new features and bug fixes.'
    }
  ];

  return (
    <section className={styles.experienceSection}>
      <Heading as="h2" className={styles.sectionHeading}>
        My Experience
      </Heading>
      <div className={styles.experienceGrid}>
        {experiences.map((exp, idx) => (
          <div key={idx} className={styles.experienceCard}>
            <Heading as="h3" className={styles.jobTitle}>{exp.title}</Heading>
            <p className={styles.company}>{exp.company}</p>
            <p className={styles.date}>{exp.date}</p>
            <p className={styles.description}>{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TechnologiesSection() {
  const technologies = [
    'Java', 'Spring Boot', 'TypeScript', 'Angular', 'React', 'Node.js', 'Go',
    'Kubernetes', 'Docker', 'Terraform', 'Azure', 'PostgreSQL', 'MongoDB'
  ];

  return (
    <section className={styles.technologiesSection}>
      <Heading as="h2" className={styles.sectionHeading}>
        Technologies I Use
      </Heading>
      <div className={styles.techCloud}>
        {technologies.map((tech, idx) => (
          <div key={idx} className={styles.techItem}>{tech}</div>
        ))}
      </div>
    </section>
  );
}

function CompetenceSection() {
  const competences = [
    { name: 'Backend Development', tag: 'backend' },
    { name: 'Frontend Development', tag: 'frontend' },
    { name: 'Mobile App Development', tag: 'mobile' },
    { name: 'DevOps & Cloud', tag: 'devops' },
  ];

  return (
    <section className={styles.competenceSection}>
      <Heading as="h2" className={styles.sectionHeading}>
        Core Competencies
      </Heading>
      <div className={styles.competenceTags}>
        {competences.map((comp, idx) => (
          <div key={idx} className={`${styles.competenceTag} ${styles[`tag_${comp.tag}`]}`}>{comp.name}</div>
        ))}
      </div>
    </section>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <div className={styles.container}>
      <div className={styles.scrollSnapSection}>
        <HeroSection />
      </div>
      <div className={styles.scrollSnapSection}>
        <SkillsGrid />
      </div>
      <div className={styles.scrollSnapSection}>
        <ExperienceSection />
      </div>
      <div className={styles.scrollSnapSection}>
        <TechnologiesSection />
      </div>
      <div className={styles.scrollSnapSection}>
        <CompetenceSection />
      </div>
    </div>
  );
}
