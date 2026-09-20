import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

// Card content for the "What I Do" grid. `accent` drives the icon, the bullet
// dots, the top strip and the hover shadow, so each card's color lives in one
// place (see .accent-card in custom.css).
const WHAT_I_DO = [
  {
    title: 'Backend',
    icon: 'database',
    accent: 'var(--color-secondary)',
    items: ['Spring Boot', 'Node.js', 'Golang'],
  },
  {
    title: 'Frontend',
    icon: 'laptop_mac',
    accent: 'var(--color-accent)',
    items: ['Angular', 'Vue.js', 'React'],
  },
  {
    title: 'Mobile',
    icon: 'smartphone',
    accent: 'var(--color-ink)',
    items: ['React Native', 'Ionic'],
  },
  {
    title: 'DevOps',
    icon: 'cloud_done',
    accent: 'var(--color-secondary)',
    items: ['K8s & Docker', 'Gitlab/Github CI', 'Terraform & Azure', 'Helm & Ansible'],
  },
];

export default function Home(): React.ReactNode {
  const pdfUrl = useBaseUrl('/pdf/CV_Developer.pdf');
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout
      wrapperClassName="homepage-layout"
      title="LEI Jing | Fullstack Developer Portfolio"
      description="Fullstack Developer crafting scalable web & mobile solutions. Spring Boot, Angular, Vue, React, Golang, Kubernetes, DevOps.">

      <div className="homepage-layout bg-[var(--color-bg)] text-[var(--color-text)] selection:bg-[var(--color-tertiary)] min-h-screen">

        <main>
          {/* Hero Section */}
          <section className="snap-section min-h-screen pt-32 pb-20 flex items-center relative overflow-hidden px-5 md:px-12 bg-[var(--color-hero-bg)]">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
              <div className="z-10 order-2 lg:order-1">
                <h1 className="hero-fade hero-fade-1 text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--color-hero-text)] mb-6 tracking-tight leading-tight">
                  Hi, I'm LEI Jing.
                </h1>
                <p className="hero-fade hero-fade-2 text-xl sm:text-2xl font-bold text-[var(--color-hero-subtext)] mb-4">
                  Fullstack Developer crafting scalable web & mobile solutions.
                </p>
                <p className="hero-fade hero-fade-3 text-base sm:text-lg text-[var(--color-hero-muted)] mb-10 max-w-lg leading-relaxed">
                  I build ambitious, high-performance applications with modern technologies. From backend architecture to engaging user interfaces, I help transform ideas into reality.
                </p>
                <div className="hero-fade hero-fade-4 flex flex-wrap gap-4">
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-base px-8 py-4 rounded-lg hard-shadow hard-shadow-hover transition-all flex items-center gap-2 border-0 hover:cursor-pointer"
                  >
                    Contact Me{' '}
                    <span className="material-symbols-outlined text-xl">
                      arrow_forward
                    </span>
                  </button>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-transparent text-[var(--color-hero-text)] font-bold text-base px-8 py-4 rounded-lg border-2 border-[var(--color-hero-text)] hard-shadow-hover transition-all inline-flex items-center justify-center hover:no-underline hover:text-white"
                  >
                    View My CV
                  </a>
                </div>
              </div>

              {/* Hero Illustration */}
              <div className="hero-fade hero-fade-5 order-1 lg:order-2 flex justify-center items-center">
                <div className="w-full max-w-md lg:max-w-lg aspect-square rounded-3xl overflow-hidden flex items-center justify-center">
                  <img
                    src={useBaseUrl('/img/person.png')}
                    alt="LEI Jing illustration working at desk"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => scrollToSection('what-i-do')}
              aria-label="Scroll to next section"
              className="scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--color-hero-text)] bg-transparent border-0 hover:cursor-pointer flex flex-col items-center gap-1"
            >
              <span className="font-label text-xs tracking-widest opacity-80">SCROLL</span>
              <span className="material-symbols-outlined">keyboard_arrow_down</span>
            </button>
          </section>

          {/* What I Do Section */}
          <section
            id="what-i-do"
            className="snap-section section-decor decor-dots min-h-screen flex flex-col justify-center py-24 px-5 md:px-12 bg-[var(--color-bg)]">
            <div className="relative z-10 max-w-[1200px] mx-auto w-full">
              <div className="fade-in-up mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-heading)] flex items-center gap-4">
                  <span className="gradient-bar w-12 h-1.5 rounded-full inline-block"></span>
                  What I Do
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {WHAT_I_DO.map((card, i) => (
                  <div
                    key={card.title}
                    style={{ ['--card-accent' as string]: card.accent }}
                    className={`fade-in-up fade-delay-${i + 1} tilt-card accent-card bg-[var(--color-surface)] p-8 pt-9 rounded-2xl border-2 border-[var(--color-border)] hard-shadow`}>
                    <span
                      className="material-symbols-outlined text-4xl mb-4 block"
                      style={{ color: card.accent }}>
                      {card.icon}
                    </span>
                    <h3 className="text-2xl font-bold text-[var(--color-text-heading)] mb-4">
                      {card.title}
                    </h3>
                    <ul className="space-y-2 text-[var(--color-text-muted)] font-medium text-base list-none p-0 m-0">
                      {card.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: card.accent }}></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* My Experience Section */}
          <section
            id="experience"
            className="snap-section section-decor decor-grid min-h-screen flex flex-col justify-center py-24 px-5 md:px-12 bg-[var(--color-bg-alt)]">
            <div className="relative z-10 max-w-[1200px] mx-auto w-full">
              <div className="fade-in-up mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-heading)] flex items-center gap-4">
                  <span className="gradient-bar w-12 h-1.5 rounded-full inline-block"></span>
                  My Experience
                </h2>
              </div>

              <div className="timeline space-y-12">
                {/* Experience 1 */}
                <div
                  className="timeline-item fade-in-left flex flex-col md:flex-row gap-8 items-start"
                  style={{ ['--dot-color' as string]: 'var(--color-accent)' }}>
                  <div className="md:w-1/3">
                    <div className="date-pill font-label text-xs font-bold uppercase tracking-wider mb-3">
                      Apr 2025 - Present
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--color-text-heading)]">Project Engineer</h3>
                    <div className="text-base font-semibold text-[var(--color-text-muted)]">Actemium Paris Transport</div>
                    <div className="text-sm font-medium text-[var(--color-text-subtle)]">Paris, France</div>
                  </div>
                  <div className="md:w-2/3 bg-[var(--color-bg)] p-8 rounded-2xl border-2 border-[var(--color-border)] hard-shadow">
                    <div className="flex flex-wrap gap-2">
                      {['Spring Boot', 'Vue.js', 'Golang', 'Kubernetes', 'Gitlab CI', 'Terraform', 'Ansible'].map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Experience 2 */}
                <div
                  className="timeline-item fade-in-right flex flex-col md:flex-row gap-8 items-start"
                  style={{ ['--dot-color' as string]: 'var(--color-secondary)' }}>
                  <div className="md:w-1/3">
                    <div className="date-pill font-label text-xs font-bold uppercase tracking-wider mb-3">
                      Oct 2021 - Apr 2025
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--color-text-heading)]">Fullstack Developer</h3>
                    <div className="text-base font-semibold text-[var(--color-text-muted)]">Talan</div>
                    <div className="text-sm font-medium text-[var(--color-text-subtle)]">Toulouse, France</div>
                  </div>
                  <div className="md:w-2/3 bg-[var(--color-bg)] p-8 rounded-2xl border-2 border-[var(--color-border)] hard-shadow">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-base font-bold text-[var(--color-text-heading)] underline decoration-[var(--color-tertiary)] decoration-2 underline-offset-4 mb-3">
                          Air France
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {['Spring Boot', 'Angular', 'Ionic', 'Kubernetes', 'Azure'].map((tag) => (
                            <span
                              key={tag}
                              className="px-4 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] rounded-full text-sm font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[var(--color-text-heading)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-4 mb-3">
                          Pierre Fabre
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {['Java', 'Groovy', 'Pricefx'].map((tag) => (
                            <span
                              key={tag}
                              className="px-4 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] rounded-full text-sm font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tech Stack Section */}
          <section
            id="tech"
            className="snap-section section-decor decor-spotlight decor-dots min-h-screen flex flex-col justify-center py-24 px-5 md:px-12 bg-[var(--color-bg)]">
            <div className="relative z-10 max-w-[1200px] mx-auto w-full text-center">
              <div className="fade-in-up mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-heading)] mb-4">
                  Technologies I Use
                </h2>
                <p className="text-base text-[var(--color-text-muted)]">
                  A curated toolkit for building robust digital ecosystems.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                {['Java', 'Spring Boot', 'TypeScript', 'Angular', 'React', 'Node.js', 'Go'].map((tech, i) => (
                  <span
                    key={tech}
                    style={{ transitionDelay: `${i * 40}ms` }}
                    className="fade-in-up px-6 py-3 bg-[var(--color-ink-solid)] text-white rounded-full font-bold text-sm hard-shadow-hover cursor-default"
                  >
                    {tech}
                  </span>
                ))}
                {['Kubernetes', 'Docker', 'Terraform', 'Azure'].map((tech, i) => (
                  <span
                    key={tech}
                    style={{ transitionDelay: `${(i + 7) * 40}ms` }}
                    className="fade-in-up px-6 py-3 bg-[var(--color-secondary)] text-white rounded-full font-bold text-sm hard-shadow-hover cursor-default"
                  >
                    {tech}
                  </span>
                ))}
                {['PostgreSQL', 'MongoDB'].map((tech, i) => (
                  <span
                    key={tech}
                    style={{ transitionDelay: `${(i + 11) * 40}ms` }}
                    className="fade-in-up px-6 py-3 bg-[var(--color-tertiary)] text-[var(--color-ink)] rounded-full font-bold text-sm hard-shadow-hover cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="snap-section min-h-screen flex flex-col justify-center py-20 px-5 md:px-12">
            <div className="fade-in-up max-w-[1200px] mx-auto bg-[var(--color-hero-bg)] text-white p-10 md:p-16 rounded-3xl relative overflow-hidden hard-shadow">
              <div className="glow-blob absolute -bottom-20 -right-20 w-64 h-64 bg-[var(--color-highlight)] rounded-full opacity-20 blur-3xl"></div>
              <div className="glow-blob absolute -top-20 -left-20 w-64 h-64 bg-[var(--color-tertiary)] rounded-full opacity-10 blur-3xl" style={{ animationDelay: '2s' }}></div>

              <div className="relative z-10 max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                  Let's build something together.
                </h2>
                <p className="text-lg text-[var(--color-hero-muted)] mb-10 leading-relaxed">
                  Feel free to reach out for collaborations or just a friendly chat. I'm always open to new challenges.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href="mailto:leonleijing@gmail.com"
                    className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-white font-bold text-base px-8 py-4 rounded-lg hard-shadow hard-shadow-hover transition-all flex items-center justify-center gap-2 hover:no-underline hover:text-white"
                  >
                    <span className="material-symbols-outlined">mail</span> Email Me
                  </a>
                  <a
                    href="https://www.linkedin.com/in/jing-lei-15519a164/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[var(--color-offwhite)] text-[var(--color-ink)] font-bold text-base px-8 py-4 rounded-lg border-2 border-[var(--color-ink)] hard-shadow-hover transition-all flex items-center justify-center gap-2 hover:no-underline"
                  >
                    LinkedIn Profile
                  </a>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-transparent border-2 border-[var(--color-offwhite)] text-[var(--color-offwhite)] font-bold text-base px-8 py-4 rounded-lg hard-shadow-hover transition-all flex items-center justify-center gap-2 hover:no-underline hover:text-white"
                  >
                    Download CV
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[var(--color-surface)] w-full py-12 border-t border-[var(--color-border)]/10">
          <div className="max-w-[1200px] mx-auto px-5 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <a href="#" className="text-2xl font-bold text-[var(--color-text-heading)] tracking-tighter hover:no-underline">
                LEI JING
              </a>
              <p className="text-sm text-[var(--color-text-muted)] text-center md:text-left m-0">
                Fullstack Developer building for the modern web.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-4">
              <nav className="flex flex-wrap justify-center gap-6">
                <a
                  href="https://github.com/leonnelleijing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] transition-colors hover:no-underline"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/jing-lei-15519a164/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] transition-colors hover:no-underline"
                >
                  LinkedIn
                </a>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] transition-colors hover:no-underline"
                >
                  Resume
                </a>
                <Link
                  to="/docs/devops/linux"
                  className="text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] transition-colors hover:no-underline"
                >
                  Docs
                </Link>
              </nav>

              <div className="font-label flex items-center gap-2 text-[var(--color-text-heading)] font-bold text-xs uppercase tracking-widest">
                <span
                  className="material-symbols-outlined text-[var(--color-accent)]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
                <span>Crafted with Precision</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
