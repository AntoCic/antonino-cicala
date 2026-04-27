import { useState, useEffect } from 'react';
import { Btn } from '../../../components/Btn/Btn';
import { toast } from '../../../components/toast/toast';
import { useAppDispatch, useAppSelector } from '../../../store';
import { getAppSettings, updateAppSettings } from '../../../db/appSettings/appSettingsRepo';
import { setAppSettings } from '../../../db/appSettings/appSettingsSlice';

export default function SettingsManager() {
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((s) => s.appSettings);

  const [description, setDescription] = useState('');
  const [aiChatEnabled, setAiChatEnabled] = useState(false);
  const [chatNotifications, setChatNotifications] = useState(true);
  const [behavioralRules, setBehavioralRules] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAppSettings().then((data) => {
      dispatch(setAppSettings(data));
      setDescription(data?.description ?? '');
      setAiChatEnabled(data?.aiChatEnabled ?? false);
      setChatNotifications(data?.chatNotifications ?? true);
      setBehavioralRules(data?.behavioralRules ?? '');
      setLoaded(true);
    });
  }, [dispatch]);

  useEffect(() => {
    if (settings && loaded) {
      setDescription(settings.description ?? '');
      setAiChatEnabled(settings.aiChatEnabled ?? false);
      setChatNotifications(settings.chatNotifications ?? true);
      setBehavioralRules(settings.behavioralRules ?? '');
    }
  }, [settings, loaded]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAppSettings({ description, aiChatEnabled, chatNotifications, behavioralRules });
      dispatch(setAppSettings({ description, aiChatEnabled, chatNotifications, behavioralRules }));
      toast.success('Impostazioni salvate');
    } catch {
      toast.error('Errore durante il salvataggio');
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <label className="form-label fw-semibold">Descrizione per AI</label>
        <textarea
          className="form-control"
          rows={8}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Scrivi una descrizione accurata che sarà usata dall'AI come contesto per rispondere alle domande su di te…"
        />
        <div className="form-text">
          Questo testo verrà usato come sistema prompt dall'AI per rispondere in modo contestuale.
        </div>
      </div>

      <div className="mb-4">
        <p className="form-label fw-semibold mb-3">Feature flags</p>
        <div className="card border-0 bg-light rounded-3 p-3 d-flex flex-column gap-3">
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="aiChatEnabled"
              checked={aiChatEnabled}
              onChange={(e) => setAiChatEnabled(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="aiChatEnabled">
              <span className="fw-semibold">Chat AI</span>
              <span className="text-muted ms-2" style={{ fontSize: '0.85em' }}>
                — se attiva, la sezione chat AI è visibile e utilizzabile nel sito pubblico
              </span>
            </label>
          </div>
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="chatNotifications"
              checked={chatNotifications}
              onChange={(e) => setChatNotifications(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="chatNotifications">
              <span className="fw-semibold">Notifiche chat</span>
              <span className="text-muted ms-2" style={{ fontSize: '0.85em' }}>
                — se attiva, ricevi una push notification per ogni messaggio inviato nella chat AI
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label fw-semibold">Regole di comportamento AI</label>
        <textarea
          className="form-control"
          rows={6}
          value={behavioralRules}
          onChange={(e) => setBehavioralRules(e.target.value)}
          placeholder="Definisci le regole di comportamento dell'AI: tono, limiti, argomenti da evitare, formato delle risposte…"
        />
        <div className="form-text">
          Istruzioni comportamentali per l'AI: cosa può/non può fare, come rispondere, stile comunicativo.
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <Btn color="primary" loading={saving} onClick={handleSave}>
          <span className="material-symbols-outlined me-1" style={{ fontSize: 16, verticalAlign: 'middle' }}>
            save
          </span>
          Salva impostazioni
        </Btn>
      </div>
    </div>
  );
}
