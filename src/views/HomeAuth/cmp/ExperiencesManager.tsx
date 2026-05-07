import { useState, useEffect } from 'react';
import { Modal } from '../../../components/Modal/Modal';
import { Btn } from '../../../components/Btn/Btn';
import { toast } from '../../../components/toast/toast';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  seedExperiences,
} from '../../../db/experiences/experienceRepo';
import {
  setExperiences,
  setExperienceLoading,
  updateExperienceInStore,
  removeExperienceFromStore,
} from '../../../db/experiences/experienceSlice';
import { getAllSkills } from '../../../db/skills/skillRepo';
import { setSkills } from '../../../db/skills/skillSlice';
import { SKILL_CATEGORIES } from '../../../db/skills/Skill';
import type { Experience } from '../../../db/experiences/Experience';
import styles from '../HomeAuth.module.css';


function formatPeriod(start: string, end?: string): string {
  if (!start) return '';
  const fmt = (d: string) => {
    const [y, m] = d.split('-');
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    return `${months[parseInt(m, 10) - 1]} ${y}`;
  };
  return `${fmt(start)} — ${end ? fmt(end) : 'Presente'}`;
}

export default function ExperiencesManager() {
  const dispatch = useAppDispatch();
  const { experiences, loading } = useAppSelector((s) => s.experience);
  const { skills } = useAppSelector((s) => s.skill);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [order, setOrder] = useState(0);
  const [isCurrent, setIsCurrent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    dispatch(setExperienceLoading(true));
    getAllExperiences()
      .then((data) => dispatch(setExperiences(data)))
      .catch(() => {
        toast.error('Errore nel caricamento delle esperienze');
        dispatch(setExperienceLoading(false));
      });
  }, [dispatch]);

  useEffect(() => {
    if (skills.length === 0) {
      getAllSkills().then((data) => dispatch(setSkills(data)));
    }
  }, [dispatch, skills.length]);

  const openAdd = () => {
    setEditing(null);
    setCompany('');
    setRole('');
    setStartDate('');
    setEndDate('');
    setIsCurrent(true);
    setDescription('');
    setSelectedTech([]);
    setLocation('');
    setOrder(experiences.length);
    setShowModal(true);
  };

  const openEdit = (exp: Experience) => {
    setEditing(exp);
    setCompany(exp.company);
    setRole(exp.role);
    setStartDate(exp.startDate);
    setEndDate(exp.endDate ?? '');
    setIsCurrent(!exp.endDate);
    setDescription(exp.description);
    setSelectedTech(exp.tech);
    setLocation(exp.location ?? '');
    setOrder(exp.order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const toggleTech = (name: string) => {
    setSelectedTech((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const buildPayload = () => ({
    company: company.trim(),
    role: role.trim(),
    startDate: startDate.trim(),
    endDate: isCurrent ? undefined : (endDate.trim() || undefined),
    description: description.trim(),
    tech: selectedTech,
    location: location || undefined,
    order,
  });

  const handleSave = async () => {
    if (!company.trim() || !role.trim() || !startDate.trim()) return;
    setSaving(true);
    try {
      const payload = buildPayload();
      if (editing) {
        await updateExperience(editing.id, payload);
        dispatch(updateExperienceInStore({ ...editing, ...payload }));
        toast.success('Esperienza aggiornata');
      } else {
        await createExperience(payload);
        const data = await getAllExperiences();
        dispatch(setExperiences(data));
        toast.success('Esperienza creata');
      }
      closeModal();
    } catch {
      toast.error('Errore durante il salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm(`Importare le esperienze dai file statici?${experiences.length > 0 ? ` Le ${experiences.length} esistenti verranno sostituite.` : ''}`)) return;
    setSeeding(true);
    try {
      await seedExperiences();
      const data = await getAllExperiences();
      dispatch(setExperiences(data));
      toast.success('Esperienze importate dai file statici');
    } catch {
      toast.error("Errore durante l'importazione");
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa esperienza?')) return;
    try {
      await deleteExperience(id);
      dispatch(removeExperienceFromStore(id));
      toast.success('Esperienza eliminata');
    } catch {
      toast.error("Errore durante l'eliminazione");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-semibold">
          Esperienze lavorative
          <span className="badge bg-secondary ms-2 fw-normal" style={{ fontSize: '0.75rem' }}>
            {experiences.length}
          </span>
        </h5>
        <div className="d-flex gap-2">
          <Btn color="secondary" version="outline" size="sm" loading={seeding} onClick={handleSeed}>
            <span className="material-symbols-outlined me-1" style={{ fontSize: 16, verticalAlign: 'middle' }}>download</span>
            Importa statici
          </Btn>
          <Btn color="primary" size="sm" onClick={openAdd}>
            <span className="material-symbols-outlined me-1" style={{ fontSize: 16, verticalAlign: 'middle' }}>add</span>
            Aggiungi
          </Btn>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center text-muted py-5">
          <span className="material-symbols-outlined d-block mb-2" style={{ fontSize: 48, opacity: 0.4 }}>
            work
          </span>
          <p className="mb-0">Nessuna esperienza presente</p>
        </div>
      ) : (
        <div className={styles.faqList}>
          {experiences.map((exp) => (
            <div key={exp.id} className={styles.faqItem}>
              <div className={styles.faqContent}>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{exp.role}</span>
                  <span className="text-muted">@</span>
                  <span className="fw-semibold text-primary" style={{ fontSize: '0.9rem' }}>{exp.company}</span>
                  {exp.location && (
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle' }}>location_on</span>
                      {exp.location}
                    </span>
                  )}
                </div>
                <p className="text-muted mb-1" style={{ fontSize: '0.82rem' }}>
                  {formatPeriod(exp.startDate, exp.endDate)}
                </p>
                {exp.description && (
                  <p className={styles.faqAnswer}>{exp.description}</p>
                )}
                {exp.tech.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {exp.tech.map((t) => (
                      <span key={t} className="badge bg-light text-dark border" style={{ fontSize: '0.7rem' }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.faqActions}>
                <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(exp)} title="Modifica">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(exp.id)} title="Elimina">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        show={showModal}
        onClose={closeModal}
        title={editing ? 'Modifica Esperienza' : 'Nuova Esperienza'}
        size="lg"
        footer={
          <>
            <Btn color="secondary" version="outline" onClick={closeModal}>Annulla</Btn>
            <Btn
              color="primary"
              loading={saving}
              onClick={handleSave}
              disabled={!company.trim() || !role.trim() || !startDate.trim()}
            >
              Salva
            </Btn>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Azienda <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="es. Acme Srl"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Ruolo <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="es. Frontend Developer"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Inizio <span className="text-danger">*</span></label>
            <input
              type="month"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Fine</label>
            <input
              type="month"
              className="form-control"
              value={isCurrent ? '' : endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isCurrent}
            />
            <div className="form-check mt-1">
              <input
                className="form-check-input"
                type="checkbox"
                id="expIsCurrent"
                checked={isCurrent}
                onChange={(e) => {
                  setIsCurrent(e.target.checked);
                  if (e.target.checked) setEndDate('');
                }}
              />
              <label className="form-check-label" htmlFor="expIsCurrent" style={{ fontSize: '0.85rem' }}>
                In corso (Presente)
              </label>
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Luogo</label>
            <input
              type="text"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="es. Milano / Remoto"
            />
          </div>
          <div className="col-12">
            <label className="form-label fw-semibold">Descrizione</label>
            <textarea
              className="form-control"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrivi brevemente le attività svolte…"
            />
          </div>
          <div className="col-md-8">
            <label className="form-label fw-semibold">Tecnologie</label>
            <div className="border rounded p-2" style={{ minHeight: 56 }}>
              {SKILL_CATEGORIES.map((cat) => {
                const catSkills = skills.filter((s) => s.category === cat);
                if (catSkills.length === 0) return null;
                return (
                  <div key={cat} className="mb-2">
                    <small
                      className="text-muted text-uppercase fw-semibold d-block mb-1"
                      style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}
                    >
                      {cat}
                    </small>
                    <div className="d-flex flex-wrap gap-1">
                      {catSkills.map((skill) => {
                        const active = selectedTech.includes(skill.name);
                        return (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => toggleTech(skill.name)}
                            className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline-secondary'}`}
                            style={{ fontSize: '0.75rem', padding: '2px 10px' }}
                          >
                            {skill.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {skills.length === 0 && (
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Caricamento skill…</span>
              )}
            </div>
            {selectedTech.length > 0 && (
              <div className="form-text">{selectedTech.length} selezionate</div>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Ordine</label>
            <input
              type="number"
              className="form-control"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              min={0}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
