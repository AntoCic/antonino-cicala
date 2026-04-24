import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppDispatch, useAppSelector } from '../../store';
import { getAllCertificates } from '../../db/certificates/certificateRepo';
import { setCertificates, setCertificateLoading } from '../../db/certificates/certificateSlice';
import styles from './Certificates.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Certificates() {
  const dispatch = useAppDispatch();
  const { certificates, loading } = useAppSelector((s) => s.certificate);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (certificates.length > 0) return;
    dispatch(setCertificateLoading(true));
    getAllCertificates().then((data) => dispatch(setCertificates(data)));
  }, [dispatch, certificates.length]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || certificates.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.from('[data-cert-header]', {
        y: 40, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.15,
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

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [certificates.length]);

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

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-secondary" />
          </div>
        ) : (
          <div className={styles.trackOuter}>
            <div ref={trackRef} className={styles.track}>
              {certificates.map((cert, i) => (
                <article key={cert.id} className={`${styles.card} ${i === 0 ? styles.cardFirst : ''}`}>
                  {cert.order === 0 && (
                    <span className={styles.badge}>
                      <span className="material-symbols-outlined" style={{ fontSize: '0.8rem' }}>workspace_premium</span>
                      Principale
                    </span>
                  )}
                  <div className={styles.cardImgWrapper}>
                    <img
                      src={`/img/certificati/${cert.image}`}
                      alt={cert.name}
                      className={styles.cardImg}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.issuerRow}>
                      <span className={styles.priority}>#{cert.order + 1}</span>
                      <span className={styles.issuer}>{cert.issuer}</span>
                    </div>
                    <h2 className={styles.cardTitle}>{cert.name}</h2>
                    <p className={styles.cardDesc}>{cert.description}</p>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.cardLink}
                        style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>open_in_new</span>
                        Vedi certificato
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
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
