import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home(): React.ReactNode {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
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
      
      <div className="homepage-layout bg-[#F3EFE2] text-[#1c1c14] selection:bg-[#A8CDD2] min-h-screen">
        
        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[60] bg-[#F3EFE2] flex flex-col items-center justify-center p-8 space-y-8 animate-fadeIn md:hidden">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 bg-transparent border-0 text-[#10113e] focus:outline-none hover:cursor-pointer"
            >
              <span className="material-symbols-outlined text-4xl">close</span>
            </button>
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#9f4200] font-bold text-2xl border-b-2 border-[#9f4200] pb-1 hover:no-underline"
            >
              Home
            </a>
            <button
              onClick={() => scrollToSection('what-i-do')}
              className="text-[#46464f] font-semibold text-2xl hover:text-[#10113e] bg-transparent border-0 hover:cursor-pointer"
            >
              What I Do
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className="text-[#46464f] font-semibold text-2xl hover:text-[#10113e] bg-transparent border-0 hover:cursor-pointer"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection('tech')}
              className="text-[#46464f] font-semibold text-2xl hover:text-[#10113e] bg-transparent border-0 hover:cursor-pointer"
            >
              Tech Stack
            </button>
            <Link
              to="/docs/devops/linux"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#46464f] font-semibold text-2xl hover:text-[#10113e] hover:no-underline"
            >
              Learning Notes
            </Link>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-[#10113e] text-white px-8 py-3 rounded-lg font-bold text-base hard-shadow hover:cursor-pointer"
            >
              Get In Touch
            </button>
          </div>
        )}

        <main>
          {/* Hero Section */}
          <section className="min-h-[700px] pt-32 pb-20 flex items-center relative overflow-hidden px-5 md:px-12 bg-[#252753]">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
              <div className="z-10 order-2 lg:order-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#fdf9ec] mb-6 tracking-tight leading-tight">
                  Hi, I'm LEI Jing.
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-[#A8CDD2] mb-4">
                  Fullstack Developer crafting scalable web & mobile solutions.
                </p>
                <p className="text-base sm:text-lg text-[#8d8fc1] mb-10 max-w-lg leading-relaxed">
                  I build ambitious, high-performance applications with modern technologies. From backend architecture to engaging user interfaces, I help transform ideas into reality.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="bg-[#FB452A] text-white font-bold text-base px-8 py-4 rounded-lg hard-shadow hard-shadow-hover transition-all flex items-center gap-2 border-0 hover:cursor-pointer"
                  >
                    Contact Me{' '}
                    <span className="material-symbols-outlined text-xl">
                      arrow_forward
                    </span>
                  </button>
                  <a
                    href="/pdf/CV_Developer.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-transparent text-[#fdf9ec] font-bold text-base px-8 py-4 rounded-lg border-2 border-[#fdf9ec] hard-shadow-hover transition-all inline-flex items-center justify-center hover:no-underline hover:text-white"
                  >
                    View My CV
                  </a>
                </div>
              </div>

              {/* Hero Illustration */}
              <div className="order-1 lg:order-2 flex justify-center items-center">
                <div className="w-full max-w-md lg:max-w-lg aspect-square rounded-3xl overflow-hidden flex items-center justify-center">
                  <img
                    src="img/person.png"
                    alt="LEI Jing illustration working at desk"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* What I Do Section */}
          <section id="what-i-do" className="py-24 px-5 md:px-12 bg-[#F3EFE2]">
            <div className="max-w-[1200px] mx-auto">
              <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#10113e] flex items-center gap-4">
                  <span className="w-12 h-1.5 bg-[#FB452A] rounded-full inline-block"></span>
                  What I Do
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Backend */}
                <div className="bg-[#f2eee1] p-8 rounded-2xl border-2 border-[#10113e] hard-shadow transition-transform hover:-translate-y-1">
                  <span className="material-symbols-outlined text-[#9f4200] text-4xl mb-4 block">
                    database
                  </span>
                  <h3 className="text-2xl font-bold text-[#10113e] mb-4">Backend</h3>
                  <ul className="space-y-2 text-[#46464f] font-medium text-base list-none p-0 m-0">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9f4200]"></span>
                      Spring Boot
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9f4200]"></span>
                      Node.js
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9f4200]"></span>
                      Golang
                    </li>
                  </ul>
                </div>

                {/* Frontend */}
                <div className="bg-[#f2eee1] p-8 rounded-2xl border-2 border-[#10113e] hard-shadow transition-transform hover:-translate-y-1">
                  <span className="material-symbols-outlined text-[#FB452A] text-4xl mb-4 block">
                    laptop_mac
                  </span>
                  <h3 className="text-2xl font-bold text-[#10113e] mb-4">Frontend</h3>
                  <ul className="space-y-2 text-[#46464f] font-medium text-base list-none p-0 m-0">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FB452A]"></span>
                      Angular
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FB452A]"></span>
                      Vue.js
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FB452A]"></span>
                      React
                    </li>
                  </ul>
                </div>

                {/* Mobile */}
                <div className="bg-[#f2eee1] p-8 rounded-2xl border-2 border-[#10113e] hard-shadow transition-transform hover:-translate-y-1">
                  <span className="material-symbols-outlined text-[#252753] text-4xl mb-4 block">
                    smartphone
                  </span>
                  <h3 className="text-2xl font-bold text-[#10113e] mb-4">Mobile</h3>
                  <ul className="space-y-2 text-[#46464f] font-medium text-base list-none p-0 m-0">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#252753]"></span>
                      React Native
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#252753]"></span>
                      Ionic
                    </li>
                  </ul>
                </div>

                {/* DevOps */}
                <div className="bg-[#f2eee1] p-8 rounded-2xl border-2 border-[#10113e] hard-shadow transition-transform hover:-translate-y-1">
                  <span className="material-symbols-outlined text-[#9f4200] text-4xl mb-4 block">
                    cloud_done
                  </span>
                  <h3 className="text-2xl font-bold text-[#10113e] mb-4">DevOps</h3>
                  <ul className="space-y-2 text-[#46464f] font-medium text-base list-none p-0 m-0">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9f4200]"></span>
                      K8s & Docker
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9f4200]"></span>
                      Gitlab/Github CI
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9f4200]"></span>
                      Terraform & Azure
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9f4200]"></span>
                      Helm & Ansible
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* My Experience Section */}
          <section id="experience" className="py-24 px-5 md:px-12 bg-[#f8f3e6]">
            <div className="max-w-[1200px] mx-auto">
              <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#10113e] flex items-center gap-4">
                  <span className="w-12 h-1.5 bg-[#9f4200] rounded-full inline-block"></span>
                  My Experience
                </h2>
              </div>

              <div className="space-y-12">
                {/* Experience 1 */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="md:w-1/3">
                    <div className="text-xs font-bold text-[#9f4200] uppercase tracking-wider mb-2">
                      Apr 2025 - Present
                    </div>
                    <h3 className="text-2xl font-bold text-[#10113e]">Project Engineer</h3>
                    <div className="text-base font-semibold text-[#46464f]">Actemium Paris Transport</div>
                    <div className="text-sm font-medium text-[#777680]">Paris, France</div>
                  </div>
                  <div className="md:w-2/3 bg-[#F3EFE2] p-8 rounded-2xl border-2 border-[#10113e] hard-shadow">
                    <p className="text-base text-[#46464f] leading-relaxed m-0">
                      Development of video streaming applications with Spring Boot, Vue, and Golang. Management of pipelines with Gitlab CI. Deployment of Helm charts on Kubernetes. Infrastructure management with Terraform and Ansible.
                    </p>
                  </div>
                </div>

                {/* Experience 2 */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="md:w-1/3">
                    <div className="text-xs font-bold text-[#9f4200] uppercase tracking-wider mb-2">
                      Oct 2021 - Apr 2025
                    </div>
                    <h3 className="text-2xl font-bold text-[#10113e]">Fullstack Developer</h3>
                    <div className="text-base font-semibold text-[#46464f]">Talan</div>
                    <div className="text-sm font-medium text-[#777680]">Toulouse, France</div>
                  </div>
                  <div className="md:w-2/3 bg-[#F3EFE2] p-8 rounded-2xl border-2 border-[#10113e] hard-shadow">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-base font-bold text-[#10113e] underline decoration-[#A8CDD2] decoration-2 underline-offset-4 mb-2">
                          Air France
                        </h4>
                        <p className="text-base text-[#46464f] leading-relaxed m-0">
                          Development of security applications with Spring Boot/Angular. Hybrid mobile support with Ionic. Migration of Ionic projects. Creation of internal Frontend toolkits. CI/CD management with Bamboo, GitHub, Kubernetes, and Azure.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#10113e] underline decoration-[#FB452A] decoration-2 underline-offset-4 mb-2">
                          Pierre Fabre
                        </h4>
                        <p className="text-base text-[#46464f] leading-relaxed m-0">
                          Integration of Pricefx software. Data modeling and integration (Data Mart). Development of Java/Groovy functions (dashboards, pricelists), client support.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tech Stack Section */}
          <section id="tech" className="py-24 px-5 md:px-12 bg-[#F3EFE2]">
            <div className="max-w-[1200px] mx-auto text-center">
              <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#10113e] mb-4">
                  Technologies I Use
                </h2>
                <p className="text-base text-[#46464f]">
                  A curated toolkit for building robust digital ecosystems.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                <span className="px-6 py-3 bg-[#10113e] text-white rounded-full font-bold text-sm hard-shadow-hover cursor-default">
                  Java
                </span>
                <span className="px-6 py-3 bg-[#10113e] text-white rounded-full font-bold text-sm hard-shadow-hover cursor-default">
                  Spring Boot
                </span>
                <span className="px-6 py-3 bg-[#10113e] text-white rounded-full font-bold text-sm hard-shadow-hover cursor-default">
                  TypeScript
                </span>
                <span className="px-6 py-3 bg-[#10113e] text-white rounded-full font-bold text-sm hard-shadow-hover cursor-default">
                  Angular
                </span>
                <span className="px-6 py-3 bg-[#10113e] text-white rounded-full font-bold text-sm hard-shadow-hover cursor-default">
                  React
                </span>
                <span className="px-6 py-3 bg-[#10113e] text-white rounded-full font-bold text-sm hard-shadow-hover cursor-default">
                  Node.js
                </span>
                <span className="px-6 py-3 bg-[#10113e] text-white rounded-full font-bold text-sm hard-shadow-hover cursor-default">
                  Go
                </span>
                <span className="px-6 py-3 bg-[#9f4200] text-white rounded-full font-bold text-sm hard-shadow-hover cursor-default">
                  Kubernetes
                </span>
                <span className="px-6 py-3 bg-[#9f4200] text-white rounded-full font-bold text-sm hard-shadow-hover cursor-default">
                  Docker
                </span>
                <span className="px-6 py-3 bg-[#9f4200] text-white rounded-full font-bold text-sm hard-shadow-hover cursor-default">
                  Terraform
                </span>
                <span className="px-6 py-3 bg-[#9f4200] text-white rounded-full font-bold text-sm hard-shadow-hover cursor-default">
                  Azure
                </span>
                <span className="px-6 py-3 bg-[#A8CDD2] text-[#10113e] rounded-full font-bold text-sm hard-shadow-hover cursor-default">
                  PostgreSQL
                </span>
                <span className="px-6 py-3 bg-[#A8CDD2] text-[#10113e] rounded-full font-bold text-sm hard-shadow-hover cursor-default">
                  MongoDB
                </span>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-20 px-5 md:px-12 mb-12">
            <div className="max-w-[1200px] mx-auto bg-[#252753] text-white p-10 md:p-16 rounded-3xl relative overflow-hidden hard-shadow">
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#fe7110] rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#A8CDD2] rounded-full opacity-10 blur-3xl"></div>

              <div className="relative z-10 max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                  Let's build something together.
                </h2>
                <p className="text-lg text-[#8d8fc1] mb-10 leading-relaxed">
                  Feel free to reach out for collaborations or just a friendly chat. I'm always open to new challenges.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href="mailto:leonleijing@gmail.com"
                    className="bg-[#9f4200] hover:bg-[#853700] text-white font-bold text-base px-8 py-4 rounded-lg hard-shadow hard-shadow-hover transition-all flex items-center justify-center gap-2 hover:no-underline hover:text-white"
                  >
                    <span className="material-symbols-outlined">mail</span> Email Me
                  </a>
                  <a
                    href="https://www.linkedin.com/in/jing-lei-15519a164/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#fdf9ec] text-[#10113e] font-bold text-base px-8 py-4 rounded-lg border-2 border-[#10113e] hard-shadow-hover transition-all flex items-center justify-center gap-2 hover:no-underline"
                  >
                    LinkedIn Profile
                  </a>
                  <a
                    href="/pdf/CV_Developer.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-transparent border-2 border-[#fdf9ec] text-[#fdf9ec] font-bold text-base px-8 py-4 rounded-lg hard-shadow-hover transition-all flex items-center justify-center gap-2 hover:no-underline hover:text-white"
                  >
                    Download CV
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#f2eee1] w-full py-12 border-t border-[#10113e]/10">
          <div className="max-w-[1200px] mx-auto px-5 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <a href="#" className="text-2xl font-bold text-[#10113e] tracking-tighter hover:no-underline">
                LEI JING
              </a>
              <p className="text-sm text-[#46464f] text-center md:text-left m-0">
                Fullstack Developer building for the modern web.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-4">
              <nav className="flex flex-wrap justify-center gap-6">
                <a
                  href="https://github.com/leonnelleijing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#46464f] hover:text-[#9f4200] transition-colors hover:no-underline"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/jing-lei-15519a164/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#46464f] hover:text-[#9f4200] transition-colors hover:no-underline"
                >
                  LinkedIn
                </a>
                <a
                  href="/pdf/CV_Developer.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#46464f] hover:text-[#9f4200] transition-colors hover:no-underline"
                >
                  Resume
                </a>
                <Link
                  to="/docs/devops/linux"
                  className="text-sm font-semibold text-[#46464f] hover:text-[#9f4200] transition-colors hover:no-underline"
                >
                  Docs
                </Link>
              </nav>

              <div className="flex items-center gap-2 text-[#10113e] font-bold text-xs uppercase tracking-widest">
                <span
                  className="material-symbols-outlined text-[#FB452A]"
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

