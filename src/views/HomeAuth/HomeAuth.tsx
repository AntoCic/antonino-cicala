import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../db/auth/useAuth';
import { getUserProfile } from '../../db/users/userRepo';
import { setUserProfile } from '../../db/auth/authSlice';
import { useAppDispatch } from '../../store';
import { hubLog } from '../../api/hubLog';
import FaqManager from './cmp/FaqManager';
import SettingsManager from './cmp/SettingsManager';
import SkillsManager from './cmp/SkillsManager';
import ProjectsManager from './cmp/ProjectsManager';
import ExperiencesManager from './cmp/ExperiencesManager';
import CertificatesManager from './cmp/CertificatesManager';
import styles from './HomeAuth.module.css';

type Tab = 'faq' | 'skills' | 'projects' | 'experiences' | 'certificates' | 'settings';

const HomeAuth = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<Tab>('faq');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [checking, setChecking] = useState(true);
  const isAdmin = permissions.includes('ADMIN') || permissions.includes('SUPERADMIN');

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid)
      .then((profile) => {
        const perms = profile?.permissions ?? [];
        setPermissions(perms);
        if (profile) dispatch(setUserProfile(profile));
      })
      .catch((err) => {
        hubLog.error('Errore lettura profilo utente in HomeAuth', {
          payload: { uid: user.uid, error: String(err) },
        });
      })
      .finally(() => setChecking(false));
  }, [user, dispatch]);

  useEffect(() => {
    if (!checking && !isAdmin && user) {
      hubLog.warning('Accesso HomeAuth senza permessi admin', {
        payload: { uid: user.uid, email: user.email, permissions },
        showPush: true,
      });
    }
  }, [checking, isAdmin, user, permissions]);

  if (checking) {
    return (
      <div className={styles.root}>
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={styles.root}>
        <div className="container">
          <div className={styles.reservedBox}>
            <span className="material-symbols-outlined" style={{ fontSize: 56, opacity: 0.25 }}>
              lock
            </span>
            <h2 className={styles.reservedTitle}>Area Riservata</h2>
            <p className={styles.reservedText}>
              Questa area è riservata all'amministratore del sito.<br />
              Per qualsiasi richiesta puoi contattarmi tramite:
            </p>
            <div className={styles.reservedContacts}>
              <a href="tel:+393295436315" className={styles.reservedLink}>
                <span className="material-symbols-outlined">call</span>
                +39 329 543 6315
              </a>
              <a href="mailto:anto.cic.127@gmail.com" className={styles.reservedLink}>
                <span className="material-symbols-outlined">mail</span>
                anto.cic.127@gmail.com
              </a>
              <a href="/#contact" className={styles.reservedLink}>
                <span className="material-symbols-outlined">edit_note</span>
                Form di contatto
              </a>
              <Link to="/" className={styles.reservedLink}>
                <span className="material-symbols-outlined">arrow_back</span>
                Torna alla home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className="container">
        <div className={styles.header}>
          <span className="material-symbols-outlined" style={{ fontSize: 32 }}>admin_panel_settings</span>
          <h1 className={styles.title}>Pannello Admin</h1>
          <Link to="/" className={styles.homeLink}>
            <span className="material-symbols-outlined">arrow_back</span>
            Home pubblica
          </Link>
        </div>

        <ul className="nav nav-tabs mb-0">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              <span className="material-symbols-outlined me-1" style={{ fontSize: 18, verticalAlign: 'middle' }}>
                quiz
              </span>
              FAQ
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              <span className="material-symbols-outlined me-1" style={{ fontSize: 18, verticalAlign: 'middle' }}>
                code
              </span>
              Skill
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <span className="material-symbols-outlined me-1" style={{ fontSize: 18, verticalAlign: 'middle' }}>
                folder
              </span>
              Progetti
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'experiences' ? 'active' : ''}`}
              onClick={() => setActiveTab('experiences')}
            >
              <span className="material-symbols-outlined me-1" style={{ fontSize: 18, verticalAlign: 'middle' }}>
                work
              </span>
              Esperienze
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'certificates' ? 'active' : ''}`}
              onClick={() => setActiveTab('certificates')}
            >
              <span className="material-symbols-outlined me-1" style={{ fontSize: 18, verticalAlign: 'middle' }}>
                workspace_premium
              </span>
              Certificati
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="material-symbols-outlined me-1" style={{ fontSize: 18, verticalAlign: 'middle' }}>
                settings
              </span>
              Impostazioni
            </button>
          </li>
        </ul>

        <div className={styles.content}>
          {activeTab === 'faq' && <FaqManager />}
          {activeTab === 'skills' && <SkillsManager />}
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'experiences' && <ExperiencesManager />}
          {activeTab === 'certificates' && <CertificatesManager />}
          {activeTab === 'settings' && <SettingsManager />}
        </div>
      </div>
    </div>
  );
};

export default HomeAuth;
