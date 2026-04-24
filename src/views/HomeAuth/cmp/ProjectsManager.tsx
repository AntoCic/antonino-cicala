import { useState, useEffect } from 'react';
import { Modal } from '../../../components/Modal/Modal';
import { Btn } from '../../../components/Btn/Btn';
import { toast } from '../../../components/toast/toast';
import { useAppDispatch, useAppSelector } from '../../../store';
import { getAllProjects, createProject, updateProject, deleteProject, seedProjects } from '../../../db/projects/projectRepo';
import { setProjects, setProjectLoading, updateProjectInStore, removeProjectFromStore } from '../../../db/projects/projectSlice';
import type { Project } from '../../../db/projects/Project';
import { PROJECT_CATEGORIES } from '../../../db/projects/Project';
import styles from '../HomeAuth.module.css';

const CATEGORY_BADGE: Record<string, string> = {
  principale: 'primary',
  iniziali: 'secondary',
};

export default function ProjectsManager() {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((s) => s.project);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [techRaw, setTechRaw] = useState('');
  const [image, setImage] = useState('');
  const [date, setDate] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState<Project['category'] | ''>('');
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    dispatch(setProjectLoading(true));
    getAllProjects()
      .then((data) => dispatch(setProjects(data)))
      .catch(() => {
        toast.error('Errore nel caricamento dei progetti');
        dispatch(setProjectLoading(false));
      });
  }, [dispatch]);

  const openAdd = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setTechRaw('');
    setImage('');
    setDate('');
    setDemoUrl('');
    setGithubUrl('');
    setVideoUrl('');
    setCategory('');
    setOrder(projects.length);
    setShowModal(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setName(p.name);
    setDescription(p.description);
    setTechRaw(p.tech.join(', '));
    setImage(p.image);
    setDate(p.date);
    setDemoUrl(p.demoUrl ?? '');
    setGithubUrl(p.githubUrl ?? '');
    setVideoUrl(p.videoUrl ?? '');
    setCategory(p.category ?? '');
    setOrder(p.order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const buildPayload = (): Omit<Project, 'id' | 'createdAt' | 'updatedAt'> => ({
    name: name.trim(),
    description: description.trim(),
    tech: techRaw.split(',').map((t) => t.trim()).filter(Boolean),
    image: image.trim(),
    date: date.trim(),
    demoUrl: demoUrl.trim() || undefined,
    githubUrl: githubUrl.trim() || undefined,
    videoUrl: videoUrl.trim() || undefined,
    category: (category as Project['category']) || undefined,
    order,
  });

  const handleSave = async () => {
    if (!name.trim() || !date.trim()) return;
    setSaving(true);
    try {
      const payload = buildPayload();
      if (editing) {
        await updateProject(editing.id, payload);
        dispatch(updateProjectInStore({ ...editing, ...payload }));
        toast.success('Progetto aggiornato');
      } else {
        await createProject(payload);
        const data = await getAllProjects();
        dispatch(setProjects(data));
        toast.success('Progetto creato');
      }
      closeModal();
    } catch {
      toast.error('Errore durante il salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm(`Importare i progetti dai file statici?${projects.length > 0 ? ` I ${projects.length} esistenti verranno sostituiti.` : ''}`)) return;
    setSeeding(true);
    try {
      await seedProjects();
      const data = await getAllProjects();
      dispatch(setProjects(data));
      toast.success('Progetti importati dai file statici');
    } catch {
      toast.error("Errore durante l'importazione");
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo progetto?')) return;
    try {
      await deleteProject(id);
      dispatch(removeProjectFromStore(id));
      toast.success('Progetto eliminato');
    } catch {
      toast.error("Errore durante l'eliminazione");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-semibold">
          Progetti
          <span className="badge bg-secondary ms-2 fw-normal" style={{ fontSize: '0.75rem' }}>
            {projects.length}
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
      ) : projects.length === 0 ? (
        <div className="text-center text-muted py-5">
          <span className="material-symbols-outlined d-block mb-2" style={{ fontSize: 48, opacity: 0.4 }}>
            folder
          </span>
          <p className="mb-0">Nessun progetto presente</p>
        </div>
      ) : (
        <div className={styles.faqList}>
          {projects.map((p) => (
            <div key={p.id} className={styles.faqItem}>
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6, flexShrink: 0 }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <div className={styles.faqContent}>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{p.name}</span>
                  {p.category && (
                    <span
                      className={`badge bg-${CATEGORY_BADGE[p.category]}`}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {p.category}
                    </span>
                  )}
                  <span className="text-muted ms-auto" style={{ fontSize: '0.78rem' }}>{p.date}</span>
                </div>
                <p className={styles.faqAnswer}>{p.description}</p>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {p.tech.map((t) => (
                    <span key={t} className="badge bg-light text-dark border" style={{ fontSize: '0.7rem' }}>{t}</span>
                  ))}
                </div>
              </div>
              <div className={styles.faqActions}>
                <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(p)} title="Modifica">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)} title="Elimina">
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
        title={editing ? 'Modifica Progetto' : 'Nuovo Progetto'}
        size="lg"
        footer={
          <>
            <Btn color="secondary" version="outline" onClick={closeModal}>Annulla</Btn>
            <Btn color="primary" loading={saving} onClick={handleSave} disabled={!name.trim() || !date.trim()}>
              Salva
            </Btn>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label fw-semibold">Nome <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="es. cortexCic"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Data <span className="text-danger">*</span></label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label fw-semibold">Descrizione</label>
            <textarea
              className="form-control"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrizione del progetto…"
            />
          </div>
          <div className="col-md-8">
            <label className="form-label fw-semibold">Tecnologie</label>
            <input
              type="text"
              className="form-control"
              value={techRaw}
              onChange={(e) => setTechRaw(e.target.value)}
              placeholder="es. React, TypeScript, Firebase"
            />
            <div className="form-text">Separate da virgola</div>
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Categoria</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as Project['category'] | '')}
            >
              {PROJECT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label fw-semibold">Immagine</label>
            <input
              type="text"
              className="form-control"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="URL o percorso es. /img/site.png"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Demo URL</label>
            <input
              type="url"
              className="form-control"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">GitHub URL</label>
            <input
              type="url"
              className="form-control"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/…"
            />
          </div>
          <div className="col-md-8">
            <label className="form-label fw-semibold">Video URL</label>
            <input
              type="url"
              className="form-control"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://…"
            />
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
