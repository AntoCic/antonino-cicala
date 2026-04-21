
import ParticleCanvas from './ParticleCanvas';
import styles from './HeroSection.module.css';
import { Btn } from '../../../components/Btn/Btn';

export default function HeroSection() {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.canvasWrapper}>
        <ParticleCanvas />
      </div>

      <div className={`container position-relative ${styles.content}`} style={{ zIndex: 1 }}>
        <div className="row align-items-center min-vh-100" style={{ minHeight: '100svh' }}>
          <div className="col-12 col-lg-7">
            <div className={styles.textBlock}>
              <img
                src="/img/foto_profilo_no_bg.png"
                alt="Antonino Cicala"
                className={styles.avatar}
                data-hero-reveal
              />
              <p className={styles.kicker} data-hero-reveal>
                Ciao, sono
              </p>
              <h1 className={styles.name} data-hero-reveal>
                Antonino Cicala
              </h1>
              <p className={styles.role} data-hero-reveal>
                Full Stack Developer
                {/* <span className={styles.roleDot}> · </span>
                Freelance */}
              </p>
              <p className={styles.tagline} data-hero-reveal>
                Trasformo idee in prodotti digitali — web app, gestionali e integrazioni su misura.
              </p>
              <div className={`d-flex gap-3 flex-wrap ${styles.ctas}`} data-hero-reveal>
                <a href="/Antonino.Cicala.pdf" target="_blank" rel="noopener noreferrer">
                  <Btn color="primary" version="solid">
                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', verticalAlign: 'middle', marginRight: '0.35rem' }}>download</span>
                    Scarica CV
                  </Btn>
                </a>
                <Btn color="light" version="outline" onClick={scrollToProjects}>
                  Vedi i progetti
                  <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', verticalAlign: 'middle', marginLeft: '0.35rem' }}>arrow_downward</span>
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint} data-hero-reveal>
        <span className="material-symbols-outlined">keyboard_arrow_down</span>
      </div>
    </section>
  );
}
