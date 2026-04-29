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

      tl
        // Lens burst — rotates while expanding for a portal feel
        .fromTo(
          '[data-intro-lens]',
          { scale: 0.1, opacity: 1, rotate: -20 },
          { scale: 6, opacity: 0, rotate: 20, duration: 1.1, ease: 'power2.inOut' },
          0,
        )
        // Overlay fade
        .to(overlayRef.current, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, 0.85)
        // Avatar — 3D Y-axis reveal with blur and spring
        .from(
          '[data-hero-avatar]',
          {
            scale: 0.3,
            opacity: 0,
            rotateY: -25,
            filter: 'blur(14px)',
            transformPerspective: 700,
            duration: 0.78,
            ease: 'back.out(1.6)',
          },
          1.0,
        )
        // Text elements — 3D fold-down (like a door opening toward the viewer)
        .from(
          '[data-hero-reveal]',
          {
            transformPerspective: 1000,
            rotateX: -80,
            transformOrigin: '50% 0%',
            opacity: 0,
            duration: 0.62,
            stagger: 0.1,
            ease: 'power3.out',
          },
          1.12,
        );

      // Gentle float on the avatar after entrance
      tl.eventCallback('onComplete', () => {
        gsap.to('[data-hero-avatar]', {
          y: -10,
          duration: 2.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
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
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#fff' }}>lock</span>
            </Link>
            <Link to="/experiences" className={styles.footerExpDot} aria-label="Esperienze lavorative" title="Esperienze lavorative" />
          </div>
        </div>
      </footer>
    </div>
  );
}
