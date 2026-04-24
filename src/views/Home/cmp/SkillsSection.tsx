import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppDispatch, useAppSelector } from '../../../store';
import { getAllSkills } from '../../../db/skills/skillRepo';
import { setSkills, setSkillLoading } from '../../../db/skills/skillSlice';
import type { SkillCategory } from '../../../db/skills/Skill';
import { SKILL_CATEGORIES } from '../../../db/skills/Skill';
import styles from './SkillsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const categoryMeta: Record<SkillCategory, { icon: string; label: string; accent: string }> = {
  Frontend: { icon: 'web',       label: 'Frontend',  accent: 'cyan'   },
  Backend:  { icon: 'dns',       label: 'Backend',   accent: 'green'  },
  Tools:    { icon: 'build',     label: 'Tools',     accent: 'amber'  },
  AI:       { icon: 'smart_toy', label: 'AI & LLM',  accent: 'violet' },
};

export default function SkillsSection() {
  const dispatch = useAppDispatch();
  const { skills, loading } = useAppSelector((s) => s.skill);
  const sectionRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (skills.length > 0) return;
    dispatch(setSkillLoading(true));
    getAllSkills().then((data) => dispatch(setSkills(data)));
  }, [dispatch, skills.length]);

  useLayoutEffect(() => {
    if (skills.length === 0 || animated.current) return;
    animated.current = true;

    const ctx = gsap.context(() => {
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

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [skills.length]);

  return (
    <section ref={sectionRef} className={styles.section} id="skills">
      <div className="container">
        <div className={styles.header} data-skills-header>
          <p className={styles.sectionLabel}>Competenze</p>
          <h2 className={styles.sectionTitle}>Il mio stack</h2>
          <p className={styles.sectionSub}>
            Tecnologie che uso quotidianamente per costruire prodotti completi, dal frontend al deployment.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: 'var(--skills-spinner, #6c757d)' }} />
          </div>
        ) : (
          <div className={styles.grid}>
            {SKILL_CATEGORIES.map((cat) => {
              const meta = categoryMeta[cat];
              const catSkills = skills.filter((s) => s.category === cat);
              if (catSkills.length === 0) return null;
              return (
                <div
                  key={cat}
                  className={`${styles.card} ${styles[`card--${meta.accent}`]}`}
                  data-skills-category
                >
                  <div className={styles.cardHeader}>
                    <span className={`material-symbols-outlined ${styles.cardIcon}`}>{meta.icon}</span>
                    <span className={styles.cardLabel}>{meta.label}</span>
                    {cat === 'AI' && <span className={styles.newBadge}>✦ nuovo</span>}
                    <span className={styles.cardCount}>{catSkills.length}</span>
                  </div>

                  <div className={styles.chipGrid} data-skills-row>
                    {catSkills.map((skill) => (
                      <figure key={skill.id} className={styles.chip} data-skill-chip>
                        <div className={styles.chipImgWrap}>
                          <img
                            src={`/img/skills/${skill.icon}`}
                            alt={skill.name}
                            className={styles.chipImg}
                            loading="lazy"
                          />
                        </div>
                        <figcaption className={styles.chipName}>{skill.name}</figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
