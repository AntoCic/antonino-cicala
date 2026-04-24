import { useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppDispatch, useAppSelector } from '../../store';
import { getAllExperiences } from '../../db/experiences/experienceRepo';
import { setExperiences, setExperienceLoading } from '../../db/experiences/experienceSlice';
import styles from './Experiences.module.css';

gsap.registerPlugin(ScrollTrigger);

const typeLabel: Record<string, string> = {
  tech: 'Tech',
  hospitality: 'Hospitality',
  other: 'Altro',
};

const typeIcon: Record<string, string> = {
  tech: 'code',
  hospitality: 'local_bar',
  other: 'person',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('it-IT', { month: 'short', year: 'numeric' });
}

function formatRange(start: string, end?: string): string {
  return `${formatDate(start)} → ${end ? formatDate(end) : 'Oggi'}`;
}

export default function Experiences() {
  const dispatch = useAppDispatch();
  const { experiences, loading } = useAppSelector((s) => s.experience);
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (experiences.length > 0) return;
    dispatch(setExperienceLoading(true));
    getAllExperiences().then((data) => dispatch(setExperiences(data)));
  }, [dispatch, experiences.length]);

  useLayoutEffect(() => {
    if (experiences.length === 0) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-exp-header]', {
        y: 40, opacity: 0, duration: 0.7, ease: 'power2.out',
      });

      gsap.utils.toArray<HTMLElement>('[data-exp-item]').forEach((item, i) => {
        gsap.from(item, {
          x: i % 2 === 0 ? -50 : 50,
          opacity: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 85%', once: true },
        });
      });

      gsap.from('[data-timeline-line]', {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '[data-timeline-line]',
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.6,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [experiences.length]);

  const reversed = [...experiences].reverse();

  return (
    <div ref={rootRef} className={styles.root}>
      <nav className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            <span className="material-symbols-outlined">arrow_back</span>
            Torna al portfolio
          </button>
          <span className={styles.navTitle}>Esperienze</span>
        </div>
      </nav>

      <main className={styles.main}>
        <div className="container">
          <div className={styles.header} data-exp-header>
            <p className={styles.sectionLabel}>Percorso</p>
            <h1 className={styles.title}>Esperienza lavorativa</h1>
            <p className={styles.subtitle}>
              Dal mondo hospitality internazionale allo sviluppo full stack — un percorso fatto di curiosità e voglia di costruire.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-secondary" />
            </div>
          ) : (
            <div className={styles.timeline}>
              <div className={styles.timelineLine} data-timeline-line />

              {reversed.map((exp, i) => (
                <div
                  key={exp.id}
                  className={`${styles.item} ${i % 2 === 0 ? styles.itemLeft : styles.itemRight}`}
                  data-exp-item
                >
                  <div className={styles.dot}>
                    <span className="material-symbols-outlined">{typeIcon[exp.type ?? 'other']}</span>
                  </div>

                  <article className={`${styles.card} ${styles[`type_${exp.type ?? 'other'}`]}`}>
                    <header className={styles.cardHeader}>
                      <div className={styles.cardMeta}>
                        <span className={`${styles.typeBadge} ${styles[`badge_${exp.type ?? 'other'}`]}`}>
                          {typeLabel[exp.type ?? 'other']}
                        </span>
                        <span className={styles.dates}>
                          {formatRange(exp.startDate, exp.endDate)}
                        </span>
                      </div>
                      <h2 className={styles.company}>{exp.company}</h2>
                      <p className={styles.role}>{exp.role}</p>
                    </header>

                    <p className={styles.description}>{exp.description}</p>

                    <footer className={styles.cardFooter}>
                      <span className="material-symbols-outlined" style={{ fontSize: '0.95rem', opacity: 0.5 }}>
                        location_on
                      </span>
                      <span className={styles.location}>{exp.location}</span>
                    </footer>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <p>© {new Date().getFullYear()} Antonino Cicala</p>
        </div>
      </footer>
    </div>
  );
}
