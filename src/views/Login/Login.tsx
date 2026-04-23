import { BtnGoogleLogin } from '../../components/BtnGoogleLogin/BtnGoogleLogin';
import styles from './Login.module.css';

const Login: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <BtnGoogleLogin />

      <div className={styles.notice}>
        <span className={`material-symbols-outlined ${styles.noticeIcon}`}>admin_panel_settings</span>
        <p className={styles.noticeTitle}>Area riservata agli amministratori</p>
        <p className={styles.noticeText}>
          Questo accesso è esclusivamente per gli amministratori del sito.<br />
          Registrarsi non garantisce alcun permesso.
        </p>
      </div>
    </div>
  );
};

export default Login;
