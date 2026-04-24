import { useState, useEffect } from 'react';
import { Modal } from '../../../components/Modal/Modal';
import { Btn } from '../../../components/Btn/Btn';
import { toast } from '../../../components/toast/toast';
import { useAppDispatch, useAppSelector } from '../../../store';
import { getAllSkills, createSkill, updateSkill, deleteSkill, seedSkills } from '../../../db/skills/skillRepo';
import { setSkills, setSkillLoading, updateSkillInStore, removeSkillFromStore } from '../../../db/skills/skillSlice';
import type { Skill } from '../../../db/skills/Skill';
import { SKILL_CATEGORIES } from '../../../db/skills/Skill';
import styles from '../HomeAuth.module.css';

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: 'primary',
  Backend: 'success',
  Tools: 'warning',
  AI: 'info',
};

export default function SkillsManager() {
  const dispatch = useAppDispatch();
  const { skills, loading } = useAppSelector((s) => s.skill);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [category, setCategory] = useState<Skill['category']>('Frontend');
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [filterCat, setFilterCat] = useState<string>('all');

  useEffect(() => {
    dispatch(setSkillLoading(true));
    getAllSkills()
      .then((data) => dispatch(setSkills(data)))
      .catch(() => {
        toast.error('Errore nel caricamento delle skill');
        dispatch(setSkillLoading(false));
      });
  }, [dispatch]);

  const openAdd = () => {
    setEditing(null);
    setName('');
    setIcon('');
    setCategory('Frontend');
    setOrder(skills.length);
    setShowModal(true);
  };

  const openEdit = (skill: Skill) => {
    setEditing(skill);
    setName(skill.name);
    setIcon(skill.icon);
    setCategory(skill.category);
    setOrder(skill.order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!name.trim() || !icon.trim()) return;
    setSaving(true);
    try {
      const payload = { name: name.trim(), icon: icon.trim(), category, order };
      if (editing) {
        await updateSkill(editing.id, payload);
        dispatch(updateSkillInStore({ ...editing, ...payload }));
        toast.success('Skill aggiornata');
      } else {
        await createSkill(payload);
        const data = await getAllSkills();
        dispatch(setSkills(data));
        toast.success('Skill creata');
      }
      closeModal();
    } catch {
      toast.error('Errore durante il salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa skill?')) return;
    try {
      await deleteSkill(id);
      dispatch(removeSkillFromStore(id));
      toast.success('Skill eliminata');
    } catch {
      toast.error("Errore durante l'eliminazione");
    }
  };

  const handleSeed = async () => {
    if (!confirm(`Importare le skill dai file statici?${skills.length > 0 ? ` Le ${skills.length} esistenti verranno sostituite.` : ''}`)) return;
    setSeeding(true);
    try {
      await seedSkills();
      const data = await getAllSkills();
      dispatch(setSkills(data));
      toast.success('Skill importate dai file statici');
    } catch {
      toast.error("Errore durante l'importazione");
    } finally {
      setSeeding(false);
    }
  };

  const filtered = filterCat === 'all' ? skills : skills.filter((s) => s.category === filterCat);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-semibold">
          Skill
          <span className="badge bg-secondary ms-2 fw-normal" style={{ fontSize: '0.75rem' }}>
            {skills.length}
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

      <div className="d-flex gap-2 mb-4 flex-wrap">
        <button
          className={`btn btn-sm ${filterCat === 'all' ? 'btn-dark' : 'btn-outline-secondary'}`}
          onClick={() => setFilterCat('all')}
        >
          Tutte
        </button>
        {SKILL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${filterCat === cat ? `btn-${CATEGORY_COLORS[cat]}` : `btn-outline-${CATEGORY_COLORS[cat]}`}`}
            onClick={() => setFilterCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted py-5">
          <span className="material-symbols-outlined d-block mb-2" style={{ fontSize: 48, opacity: 0.4 }}>
            code
          </span>
          <p className="mb-0">Nessuna skill presente</p>
        </div>
      ) : (
        <div className={styles.faqList}>
          {filtered.map((skill) => (
            <div key={skill.id} className={styles.faqItem}>
              <div className="d-flex align-items-center gap-2 flex-grow-1 min-w-0">
                <span className="text-muted" style={{ fontSize: '0.75rem', minWidth: 24 }}>#{skill.order}</span>
                <img
                  src={`/img/skills/${skill.icon}`}
                  alt={skill.name}
                  style={{ width: 28, height: 28, objectFit: 'contain' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{skill.name}</span>
                <span className={`badge bg-${CATEGORY_COLORS[skill.category]} ms-1`} style={{ fontSize: '0.7rem' }}>
                  {skill.category}
                </span>
                <span className="text-muted ms-2" style={{ fontSize: '0.78rem' }}>{skill.icon}</span>
              </div>
              <div className={styles.faqActions}>
                <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(skill)} title="Modifica">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(skill.id)} title="Elimina">
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
        title={editing ? 'Modifica Skill' : 'Nuova Skill'}
        size="lg"
        footer={
          <>
            <Btn color="secondary" version="outline" onClick={closeModal}>Annulla</Btn>
            <Btn color="primary" loading={saving} onClick={handleSave} disabled={!name.trim() || !icon.trim()}>
              Salva
            </Btn>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label fw-semibold">Nome</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="es. React"
            />
          </div>
          <div className="col-md-8">
            <label className="form-label fw-semibold">File icona</label>
            <input
              type="text"
              className="form-control"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="es. react.svg"
            />
            <div className="form-text">Nome del file in <code>/public/img/skills/</code></div>
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Categoria</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as Skill['category'])}
            >
              {SKILL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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
