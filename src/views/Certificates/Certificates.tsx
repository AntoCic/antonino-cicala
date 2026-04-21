import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Certificates.module.css';

gsap.registerPlugin(ScrollTrigger);

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  image: string;
  priority: number;
  description: string;
}

const certificates: Certificate[] = [
  {
    id: 'boolean',
    name: 'Boolean Bootcamp',
    issuer: 'Boolean',
    image: '/img/certificati/boolean.png',
    priority: 1,
    description: 'Certificato di completamento del bootcamp intensivo full stack — oltre 600 ore di formazione su HTML, CSS, JavaScript, PHP, Laravel, Vue e React.',
  },
  {
    id: 'react',
    name: 'React Certification',
    issuer: 'React',
    image: '/img/certificati/React.png',
    priority: 2,
    description: 'Certificazione sulle competenze avanzate di React: hooks, stato globale, ottimizzazione delle performance e architettura di componenti.',
  },
  {
    id: 'hackathon',
    name: 'Hackathon Codemotion',
    issuer: 'Codemotion',
    image: '/img/certificati/hackathon-codemotion.png',
    priority: 3,
    description: 'Partecipazione e riconoscimento all\'hackathon Codemotion — sviluppo di un MVP in 24 ore in team multidisciplinare.',
  },
  {
    id: 'canva',
    name: 'Canva Design',
    issuer: 'Canva',
    image: '/img/certificati/canva.jpg',
    priority: 4,
    description: 'Certificazione sulle competenze di design grafico e comunicazione visiva con Canva.',
  },
].sort((a, b) => a.priority - b.priority);

export default function Certificates() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.from('[data-cert-header]', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        delay: 0.15,
      });

      if (prefersReducedMotion) return;

      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.abs(getScrollAmount())}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <Link to="/" className={styles.backBtn} aria-label="Torna alla home">
            <span className="material-symbols-outlined">arrow_back</span>
            Home
          </Link>
          <span className={styles.navTitle}>Certificazioni</span>
        </div>
      </nav>

      <section ref={sectionRef} className={styles.section}>
        <div className={styles.header} data-cert-header>
          <div className="container">
            <p className={styles.sectionLabel}>Portfolio</p>
            <h1 className={styles.sectionTitle}>Certificazioni</h1>
            <p className={styles.sectionSub}>
              Attestati e riconoscimenti ottenuti nel percorso formativo e professionale.
            </p>
          </div>
        </div>

        <div className={styles.trackOuter}>
          <div ref={trackRef} className={styles.track}>
            {certificates.map((cert, i) => (
              <article key={cert.id} className={`${styles.card} ${i === 0 ? styles.cardFirst : ''}`}>
                {cert.priority === 1 && (
                  <span className={styles.badge}>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.8rem' }}>workspace_premium</span>
                    Principale
                  </span>
                )}
                <div className={styles.cardImgWrapper}>
                  <img
                    src={cert.image}
                    alt={cert.name}
                    className={styles.cardImg}
                    loading="lazy"
                  />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.issuerRow}>
                    <span className={styles.priority}>#{cert.priority}</span>
                    <span className={styles.issuer}>{cert.issuer}</span>
                  </div>
                  <h2 className={styles.cardTitle}>{cert.name}</h2>
                  <p className={styles.cardDesc}>{cert.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <p className={styles.footerText}>
            © {new Date().getFullYear()} Antonino Cicala
            <span className={styles.footerSep}>·</span>
            <Link to="/" className={styles.footerLink}>Torna alla home</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
