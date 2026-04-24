import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppDispatch, useAppSelector } from '../../../store';
import { getAllProjects } from '../../../db/projects/projectRepo';
import { setProjects, setProjectLoading } from '../../../db/projects/projectSlice';
import styles from './ProjectsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((s) => s.project);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projects.length > 0) return;
    dispatch(setProjectLoading(true));
    getAllProjects().then((data) => dispatch(setProjects(data)));
  }, [dispatch, projects.length]);

  const featured = projects.filter((p) => p.category === 'principale').slice(0, 3);
  const totalCount = projects.length;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || featured.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.from('[data-projects-header]', {
        y: 40, opacity: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: '[data-projects-header]', start: 'top 82%', once: true },
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
          scrub: 1.2,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [featured.length]);

  return (
    <section ref={sectionRef} className={styles.section} id="projects">
      <div className={styles.header} data-projects-header>
        <div className="container">
          <p className={styles.sectionLabel}>Portfolio</p>
          <h2 className={styles.sectionTitle}>Progetti</h2>
          <p className={styles.sectionSub}>
            Da giochi e tool didattici ai prodotti completi — tutto quello che ho costruito.
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
            {featured.map((project) => (
              <article key={project.id} className={styles.card} data-project-card>
                <span className={styles.badgePrincipale}>
                  <span className="material-symbols-outlined" style={{ fontSize: '0.75rem' }}>star</span>
                  Featured
                </span>

                <div className={styles.cardImg}>
                  <img src={project.image} alt={project.name} loading="lazy" />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.techRow}>
                    {project.tech.map((t) => (
                      <span key={t} className={styles.techTag}>{t}</span>
                    ))}
                  </div>
                  <h3 className={styles.cardTitle}>{project.name}</h3>
                  <p className={styles.cardDesc}>{project.description}</p>
                </div>
                <div className={styles.cardFooter}>
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
                      <span className="material-symbols-outlined">open_in_new</span>
                      Demo
                    </a>
                  )}
                  {project.videoUrl && (
                    <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
                      <span className="material-symbols-outlined">play_circle</span>
                      Video
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
                      <img src="/img/contact_ico/github.svg" alt="GitHub" width={16} height={16} />
                      GitHub
                    </a>
                  )}
                </div>
              </article>
            ))}

            <Link to="/progetti" className={`${styles.card} ${styles.cardViewAll}`} aria-label="Vedi tutti i progetti">
              <div className={styles.viewAllInner}>
                <div className={styles.viewAllGlow} aria-hidden="true" />
                <span className={`material-symbols-outlined ${styles.viewAllIcon}`}>grid_view</span>
                <strong className={styles.viewAllTitle}>Tutti i progetti</strong>
                <p className={styles.viewAllSub}>
                  Scopri gli altri {totalCount > 3 ? totalCount - 3 : ''} progetti realizzati
                </p>
                <span className={`material-symbols-outlined ${styles.viewAllArrow}`}>arrow_forward</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
