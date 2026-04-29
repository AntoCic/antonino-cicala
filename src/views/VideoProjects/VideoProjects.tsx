import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAppDispatch, useAppSelector } from '../../store';
import { getAllProjects } from '../../db/projects/projectRepo';
import { setProjects, setProjectLoading } from '../../db/projects/projectSlice';
import type { Project } from '../../db/projects/Project';
import styles from './VideoProjects.module.css';

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/\s]+)/);
  return m?.[1] ?? null;
}

function buildEmbedUrl(url: string): string {
  const ytId = getYouTubeId(url);
  if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&rel=0&modestbranding=1`;
  return url;
}

export default function VideoProjects() {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((s) => s.project);
  const rootRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    if (projects.length > 0) return;
    dispatch(setProjectLoading(true));
    getAllProjects().then((data) => dispatch(setProjects(data)));
  }, [dispatch, projects.length]);

  const videoProjects = projects.filter((p) => !!p.videoUrl);

  // Auto-select first video
  useEffect(() => {
    if (videoProjects.length > 0 && !selected) {
      setSelected(videoProjects[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoProjects.length]);

  // Nav entrance
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-nav]', { y: -22, opacity: 0, duration: 0.55, ease: 'power2.out' });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Content entrance (after data loads)
  useEffect(() => {
    if (loading || !videoProjects.length || animatedRef.current) return;
    animatedRef.current = true;
    requestAnimationFrame(() => {
      if (!rootRef.current) return;
      gsap.context(() => {
        gsap.from('[data-player]', { y: 48, opacity: 0, duration: 0.68, ease: 'power2.out', delay: 0.05 });
        gsap.from('[data-list-item]', {
          x: 28, opacity: 0, duration: 0.42, ease: 'power2.out', delay: 0.2, stagger: 0.07,
        });
      }, rootRef.current);
    });
  }, [loading, videoProjects.length]);

  return (
    <div ref={rootRef} className={styles.root}>
      <nav className={styles.nav} data-nav>
        <div className={`container ${styles.navInner}`}>
          <Link to="/progetti" className={styles.backBtn} aria-label="Torna ai progetti">
            <span className="material-symbols-outlined">arrow_back</span>
            Progetti
          </Link>
          <span className={styles.navTitle}>
            <span className="material-symbols-outlined">play_circle</span>
            Video
          </span>
        </div>
      </nav>

      <div className={`container ${styles.content}`}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: 'var(--cyan)' }} />
          </div>
        ) : videoProjects.length === 0 ? (
          <div className={styles.empty}>
            <span className="material-symbols-outlined">videocam_off</span>
            <p>Nessun progetto ha un video al momento.</p>
            <Link to="/progetti" className={styles.emptyLink}>Vedi tutti i progetti</Link>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* ── Main player ── */}
            <div className={styles.playerCol} data-player>
              {selected && (
                <>
                  <div className={styles.playerWrap}>
                    {getYouTubeId(selected.videoUrl!) ? (
                      <iframe
                        key={selected.id}
                        className={styles.playerFrame}
                        src={buildEmbedUrl(selected.videoUrl!)}
                        title={selected.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        key={selected.id}
                        className={styles.playerVideo}
                        src={selected.videoUrl}
                        autoPlay
                        muted
                        controls
                        playsInline
                      />
                    )}
                  </div>

                  <div className={styles.playerInfo}>
                    <div className={styles.techRow}>
                      {selected.tech.map((t) => (
                        <span key={t} className={styles.techTag}>{t}</span>
                      ))}
                    </div>
                    <h2 className={styles.playerTitle}>{selected.name}</h2>
                    <p className={styles.playerDesc}>{selected.description}</p>
                    <div className={styles.playerLinks}>
                      {selected.demoUrl && (
                        <a href={selected.demoUrl} target="_blank" rel="noopener noreferrer" className={styles.playerLink}>
                          <span className="material-symbols-outlined">open_in_new</span>
                          Demo live
                        </a>
                      )}
                      {selected.videoUrl && (
                        <a href={selected.videoUrl} target="_blank" rel="noopener noreferrer" className={styles.playerLink}>
                          <span className="material-symbols-outlined">smart_display</span>
                          Apri video
                        </a>
                      )}
                      {selected.githubUrl && (
                        <a href={selected.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.playerLink}>
                          <img src="/img/contact_ico/github.svg" alt="GitHub" width={16} height={16} />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ── Video list ── */}
            <div className={styles.listCol}>
              <p className={styles.listLabel}>
                {videoProjects.length} video disponibili
              </p>
              <div className={styles.list}>
                {videoProjects.map((p) => (
                  <button
                    key={p.id}
                    className={`${styles.listItem} ${selected?.id === p.id ? styles.listItemActive : ''}`}
                    onClick={() => setSelected(p)}
                    data-list-item
                  >
                    <div className={styles.listThumb}>
                      <img src={p.image} alt={p.name} loading="lazy" />
                      <div className={styles.listOverlay}>
                        <span className="material-symbols-outlined">
                          {selected?.id === p.id ? 'pause_circle' : 'play_circle'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.listInfo}>
                      <span className={styles.listName}>{p.name}</span>
                      {selected?.id === p.id ? (
                        <span className={styles.nowPlaying}>
                          <span className={styles.eqBar} />
                          <span className={styles.eqBar} />
                          <span className={styles.eqBar} />
                          In riproduzione
                        </span>
                      ) : (
                        <span className={styles.listDate}>{p.date}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
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
