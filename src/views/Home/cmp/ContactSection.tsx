import { useRef } from 'react';
import { toast } from '../../../components/toast/toast';
import { hubLog } from '../../../api/hubLog';
import styles from './ContactSection.module.css';

const contactLinks = [
  { href: 'mailto:anto.cic.127@gmail.com', icon: '/img/contact_ico/mail.svg', label: 'Email' },
  { href: 'https://linkedin.com/in/Antonino-Cicala', icon: '/img/contact_ico/linkedin.svg', label: 'LinkedIn' },
  { href: 'https://github.com/AntoCic', icon: '/img/contact_ico/github.svg', label: 'GitHub' },
  { href: 'tel:+393295436315', icon: '/img/contact_ico/call.svg', label: 'Telefono' },
];

export default function ContactSection() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = nameRef.current?.value.trim() ?? '';
    const email = emailRef.current?.value.trim() ?? '';
    const message = messageRef.current?.value.trim() ?? '';

    const toastId = 'contact-send';
    toast.loading('Invio in corso…', { id: toastId });
    try {
      await hubLog.info(`[Portfolio] Messaggio da ${name} (${email})`, {
        payload: { name, email, message },
        showPush: true,
      });
      toast.success('Messaggio inviato! Ti risponderò entro 24 ore.', { id: toastId });
      if (nameRef.current) nameRef.current.value = '';
      if (emailRef.current) emailRef.current.value = '';
      if (messageRef.current) messageRef.current.value = '';
    } catch {
      toast.error('Invio fallito', { subtitle: 'Riprova o contattami via email.', id: toastId });
    }
  };

  return (
    <section className={styles.section} id="contact">
      <div className="container">
        <div className={styles.inner} data-contact-content>
          <p className={styles.sectionLabel}>Contatti</p>
          <h2 className={styles.title}>Lavoriamo insieme</h2>
          <p className={styles.subtitle}>
            Hai un progetto in mente? Scrivimi — rispondo entro 24 ore.
          </p>

          <div className={styles.linkRow}>
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto') || link.href.startsWith('tel') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className={styles.iconLink}
                aria-label={link.label}
                data-contact-link
              >
                <img src={link.icon} alt={link.label} width={24} height={24} />
                <span className={styles.iconLinkLabel}>{link.label}</span>
              </a>
            ))}
          </div>

          <div className={styles.divider}>
            <span>oppure scrivimi direttamente</span>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <input
                  ref={nameRef}
                  type="text"
                  placeholder="Il tuo nome"
                  className={styles.input}
                  required
                  minLength={2}
                />
              </div>
              <div className="col-12 col-sm-6">
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="La tua email"
                  className={styles.input}
                  required
                />
              </div>
              <div className="col-12">
                <textarea
                  ref={messageRef}
                  placeholder="Descrivi il tuo progetto o scrivimi un messaggio…"
                  className={styles.textarea}
                  rows={4}
                  required
                  minLength={10}
                />
              </div>
              <div className="col-12">
                <button type="submit" className={styles.submitBtn}>
                  <span className="material-symbols-outlined">send</span>
                  Invia messaggio
                </button>
              </div>
            </div>
          </form>

          <div className={styles.exploreRow}>
            <p className={styles.exploreLabel}>Scopri di più</p>
            <div className={styles.exploreCards}>
              <a href="/certificazioni" className={styles.exploreCard}>
                <span className={`material-symbols-outlined ${styles.exploreIcon}`}>workspace_premium</span>
                <div>
                  <strong className={styles.exploreCardTitle}>Certificazioni</strong>
                  <p className={styles.exploreCardSub}>Attestati e riconoscimenti ottenuti</p>
                </div>
                <span className={`material-symbols-outlined ${styles.exploreArrow}`}>arrow_forward</span>
              </a>
              <a href="/experiences" className={styles.exploreCard}>
                <span className={`material-symbols-outlined ${styles.exploreIcon}`}>work_history</span>
                <div>
                  <strong className={styles.exploreCardTitle}>Esperienze</strong>
                  <p className={styles.exploreCardSub}>Il mio percorso lavorativo</p>
                </div>
                <span className={`material-symbols-outlined ${styles.exploreArrow}`}>arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
