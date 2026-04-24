import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppDispatch, useAppSelector } from '../../store';
import { getAllProjects } from '../../db/projects/projectRepo';
import { setProjects, setProjectLoading } from '../../db/projects/projectSlice';
import type { ProjectCategory } from '../../db/projects/Project';
import styles from './Projects.module.css';

gsap.registerPlugin(ScrollTrigger);

type Filter = 'all' | ProjectCategory;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Tutti' },
  { value: 'principale', label: 'Featured' },
  { value: 'iniziali', label: 'Early work' },
];

export default function Projects() {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((s) => s.project);
  const rootRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    if (projects.length > 0) return;
    dispatch(setProjectLoading(true));
    getAllProjects().then((data) => dispatch(setProjects(data)));
  }, [dispatch, projects.length]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-page-header]', {
        y: 36, opacity: 0, duration: 0.65, ease: 'power2.out', delay: 0.1,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const visible = projects.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'principale') return p.category === 'principale';
    if (filter === 'iniziali') return p.category === 'iniziali';
    return !p.category;
  });

  return (
    <div ref={rootRef} className={styles.root}>
      <nav className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <Link to="/" className={styles.backBtn} aria-label="Torna alla home">
            <span className="material-symbols-outlined">arrow_back</span>
            Home
          </Link>
          <span className={styles.navTitle}>Progetti</span>
        </div>
      </nav>

      <div className={`container ${styles.content}`}>
        <div className={styles.pageHeader} data-page-header>
          <p className={styles.sectionLabel}>Portfolio</p>
          <h1 className={styles.sectionTitle}>Tutti i progetti</h1>
          <p className={styles.sectionSub}>
            {projects.length} progetti realizzati — da semplici esperimenti a prodotti completi.
          </p>

          <div className={styles.filters}>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={`${styles.filterBtn} ${filter === f.value ? styles.filterActive : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-secondary" />
          </div>
        ) : (
          <div className="row g-4">
            {visible.map((project) => (
              <div key={project.id} className="col-12 col-md-6 col-lg-4">
                <article
                  className={`${styles.card} ${project.category === 'principale' ? styles.cardPrincipale : ''} ${project.category === 'iniziali' ? styles.cardIniziali : ''}`}
                >
                  {project.category === 'principale' && (
                    <span className={styles.badgePrincipale}>
                      <span className="material-symbols-outlined" style={{ fontSize: '0.75rem' }}>star</span>
                      Featured
                    </span>
                  )}

                  <div className={styles.cardImg}>
                    <img src={project.image} alt={project.name} loading="lazy" />
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.techRow}>
                      {project.tech.map((t) => (
                        <span key={t} className={styles.techTag}>{t}</span>
                      ))}
                    </div>
                    <h2 className={styles.cardTitle}>{project.name}</h2>
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
              </div>
            ))}
          </div>
        )}
      </div>

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
