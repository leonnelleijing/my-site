import React, { type ReactNode, useEffect, useRef } from 'react';
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
      title: 'Project Engineer',
      company: 'Actemium Paris Transport, Paris, France',
      date: 'Apr 2025 - Present',
      description: 'Development of video streaming applications with Spring Boot, Vue, and Golang. Management of pipelines with Gitlab CI. Deployment of Helm charts on Kubernetes. Infrastructure management with Terraform and Ansible.'
    },
    {
      title: 'Fullstack Developer',
      company: 'Talan, Toulouse, France',
      date: 'Oct 2021 - Apr 2025',
      description: 'Air France - Development of security applications with Spring Boot/Angular. Hybrid mobile support with Ionic. Migration of Ionic projects. Creation of internal Frontend toolkits. CI/CD management with Bamboo, GitHub, Kubernetes, and Azure. Pierre Fabre - Integration of Pricefx software. Data modeling and integration (Data Mart). Development of Java/Groovy functions (dashboards, pricelists), client support.'
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

function ContactSection() {
  return (
    <section id="contact" className={styles.contactSection}>
      <Heading as="h2" className={styles.sectionHeading}>
        Contact Me
      </Heading>
      <p>
        Feel free to reach out for collaborations or just a friendly chat.
      </p>
      <a href="/pdf/CV_Developer.pdf" className={styles.primaryCTA} target="_blank" rel="noopener noreferrer">
        View My CV
      </a>
    </section>
  );
}

export default function HomepageFeatures(): ReactNode {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = sectionsRef.current;
    sections.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.scrollSnapSection}>
        <HeroSection />
      </div>
      <div
        className={`${styles.scrollSnapSection} fade-in-up`}
        ref={(el) => (sectionsRef.current[0] = el)}
      >
        <SkillsGrid />
      </div>
      <div
        className={`${styles.scrollSnapSection} fade-in-up`}
        ref={(el) => (sectionsRef.current[1] = el)}
      >
        <ExperienceSection />
      </div>
      <div
        className={`${styles.scrollSnapSection} fade-in-up`}
        ref={(el) => (sectionsRef.current[2] = el)}
      >
        <TechnologiesSection />
      </div>
      <div
        className={`${styles.scrollSnapSection} fade-in-up`}
        ref={(el) => (sectionsRef.current[3] = el)}
      >
        <CompetenceSection />
      </div>
      <div
        className={`${styles.scrollSnapSection} fade-in-up`}
        ref={(el) => (sectionsRef.current[4] = el)}
      >
        <ContactSection />
      </div>
    </div>
  );
}
