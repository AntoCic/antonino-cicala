import { skillCategories, skills, type SkillCategory } from './data/skills';
import styles from './SkillsSection.module.css';

const categoryMeta: Record<SkillCategory, { icon: string; label: string; accent: string }> = {
  Frontend: { icon: 'web',        label: 'Frontend',  accent: 'cyan'   },
  Backend:  { icon: 'dns',        label: 'Backend',   accent: 'green'  },
  Tools:    { icon: 'build',      label: 'Tools',     accent: 'amber'  },
  AI:       { icon: 'smart_toy',  label: 'AI & LLM',  accent: 'violet' },
};

export default function SkillsSection() {
  return (
    <section className={styles.section} id="skills">
      <div className="container">
        <div className={styles.header} data-skills-header>
          <p className={styles.sectionLabel}>Competenze</p>
          <h2 className={styles.sectionTitle}>Il mio stack</h2>
          <p className={styles.sectionSub}>
            Tecnologie che uso quotidianamente per costruire prodotti completi, dal frontend al deployment.
          </p>
        </div>

        <div className={styles.grid}>
          {skillCategories.map((cat) => {
            const meta = categoryMeta[cat];
            const catSkills = skills.filter((s) => s.category === cat);
            return (
              <div
                key={cat}
                className={`${styles.card} ${styles[`card--${meta.accent}`]}`}
                data-skills-category
              >
                <div className={styles.cardHeader}>
                  <span className={`material-symbols-outlined ${styles.cardIcon}`}>
                    {meta.icon}
                  </span>
                  <span className={styles.cardLabel}>{meta.label}</span>
                  {cat === 'AI' && <span className={styles.newBadge}>✦ nuovo</span>}
                  <span className={styles.cardCount}>{catSkills.length}</span>
                </div>

                <div className={styles.chipGrid} data-skills-row>
                  {catSkills.map((skill) => (
                    <figure key={skill.icon} className={styles.chip} data-skill-chip>
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
      </div>
    </section>
  );
}
