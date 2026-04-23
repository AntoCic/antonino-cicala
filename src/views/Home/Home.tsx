import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from './cmp/HeroSection';
import AiChatSection from './cmp/AiChatSection';
import SkillsSection from './cmp/SkillsSection';
import ProjectsSection from './cmp/ProjectsSection';
import ContactSection from './cmp/ContactSection';
import { getAppSettings } from '../../db/appSettings/appSettingsRepo';
import { useAuth } from '../../db/auth/useAuth';
import styles from './Home.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [aiChatEnabled, setAiChatEnabled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    getAppSettings().then((s) => setAiChatEnabled(s?.aiChatEnabled ?? false));
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setNavOpen(false);
  };

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(overlayRef.current, { autoAlpha: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        '[data-intro-lens]',
        { scale: 0.2, opacity: 0.6 },
        { scale: 3.5, opacity: 0, duration: 1.1, ease: 'power2.out' },
        0,
      )
        .to(
          overlayRef.current,
          { autoAlpha: 0, duration: 0.65, ease: 'power2.inOut' },
          0.85,
        )
        .from(
          '[data-hero-reveal]',
          { y: 30, opacity: 0, duration: 0.6, stagger: 0.09, ease: 'power2.out' },
          1.1,
        );

      gsap.from('[data-skills-header]', {
        y: 40, opacity: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: '[data-skills-header]', start: 'top 82%', once: true },
      });

      gsap.utils.toArray<HTMLElement>('[data-skills-category]').forEach((el) => {
        gsap.from(el, {
          y: 30, opacity: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-skills-row]').forEach((row) => {
        gsap.from(row.querySelectorAll('[data-skill-chip]'), {
          scale: 0.82, opacity: 0, duration: 0.45,
          stagger: { each: 0.045, from: 'start' },
          ease: 'back.out(1.4)',
          scrollTrigger: { trigger: row, start: 'top 88%', once: true },
        });
      });

      gsap.from('[data-contact-content]', {
        y: 50, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '[data-contact-content]', start: 'top 80%', once: true },
      });

      gsap.from('[data-contact-link]', {
        scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: '[data-contact-link]', start: 'top 88%', once: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className={styles.root}>
      {/* Intro overlay */}
      <div ref={overlayRef} className={styles.overlay} aria-hidden="true">
        <div data-intro-lens className={styles.overlayLens} />
      </div>

      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <button
            className={styles.navBrand}
            onClick={() => scrollTo('hero')}
            aria-label="Torna su"
          >
            <span className={styles.navDot} />
            Antonino Cicala
          </button>

          <button
            className={styles.navToggle}
            onClick={() => setNavOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={navOpen}
          >
            <span className="material-symbols-outlined">
              {navOpen ? 'close' : 'menu'}
            </span>
          </button>

          <ul className={`${styles.navLinks} ${navOpen ? styles.navLinksOpen : ''}`}>
            <li><button onClick={() => scrollTo('skills')}>Skills</button></li>
            <li><button onClick={() => scrollTo('projects')}>Progetti</button></li>
            <li><button onClick={() => scrollTo('contact')}>Contatti</button></li>
            <li>
              <a
                href="/Antonino.Cicala.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.navCv}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>download</span>
                CV
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <HeroSection />
      {aiChatEnabled && <AiChatSection />}
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />

      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} Antonino Cicala — Full Stack Developer
          </p>
          <div className={styles.footerLinks}>
            <a href="mailto:anto.cic.127@gmail.com" aria-label="Email">
              <img src="/img/contact_ico/mail.svg" alt="Email" width={18} height={18} />
            </a>
            <a href="https://linkedin.com/in/Antonino-Cicala" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src="/img/contact_ico/linkedin.svg" alt="LinkedIn" width={18} height={18} />
            </a>
            <a href="https://github.com/AntoCic" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <img src="/img/contact_ico/github.svg" alt="GitHub" width={18} height={18} />
            </a>
            <Link to={user ? '/home' : '/login'} aria-label="Admin">
              <span className="material-symbols-outlined" style={{ fontSize: 18, display: 'block', color: '#fff' }}>lock</span>
            </Link>
            <Link to="/experiences" className={styles.footerExpDot} aria-label="Esperienze lavorative" title="Esperienze lavorative" />
          </div>
        </div>
      </footer>
    </div>
  );
}
