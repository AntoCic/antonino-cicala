import { useState, useEffect } from 'react';
import { Modal } from '../../../components/Modal/Modal';
import { Btn } from '../../../components/Btn/Btn';
import { toast } from '../../../components/toast/toast';
import { useAppDispatch, useAppSelector } from '../../../store';
import { getAllFaqs, createFaq, updateFaq, deleteFaq, seedFaqs } from '../../../db/faq/faqRepo';
import { getAllProjects } from '../../../db/projects/projectRepo';
import { setFaqs, setFaqLoading, updateFaqInStore, removeFaqFromStore } from '../../../db/faq/faqSlice';
import type { Faq } from '../../../db/faq/Faq';
import type { Project } from '../../../db/projects/Project';
import styles from '../HomeAuth.module.css';

export default function FaqManager() {
  const dispatch = useAppDispatch();
  const { faqs, loading } = useAppSelector((s) => s.faq);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [relatedProjectIds, setRelatedProjectIds] = useState<string[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    dispatch(setFaqLoading(true));
    getAllFaqs()
      .then((data) => dispatch(setFaqs(data)))
      .catch(() => {
        toast.error('Errore nel caricamento delle FAQ');
        dispatch(setFaqLoading(false));
      });
  }, [dispatch]);

  const loadProjects = async () => {
    if (allProjects.length > 0) return;
    setLoadingProjects(true);
    try {
      const data = await getAllProjects();
      setAllProjects(data);
    } finally {
      setLoadingProjects(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setQuestion('');
    setAnswer('');
    setRelatedProjectIds([]);
    setShowModal(true);
    loadProjects();
  };

  const openEdit = (faq: Faq) => {
    setEditing(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setRelatedProjectIds(faq.projectIds ?? []);
    setShowModal(true);
    loadProjects();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const toggleProject = (id: string) => {
    setRelatedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) return;
    setSaving(true);
    try {
      const faqData = {
        question: question.trim(),
        answer: answer.trim(),
        projectIds: relatedProjectIds,
      };
      if (editing) {
        await updateFaq(editing.id, faqData);
        dispatch(updateFaqInStore({ ...editing, ...faqData }));
        toast.success('FAQ aggiornata');
      } else {
        await createFaq(faqData);
        const data = await getAllFaqs();
        dispatch(setFaqs(data));
        toast.success('FAQ creata');
      }
      closeModal();
    } catch {
      toast.error('Errore durante il salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm(`Importare le FAQ dai file statici?${faqs.length > 0 ? ` Le ${faqs.length} esistenti verranno sostituite.` : ''}`)) return;
    setSeeding(true);
    try {
      await seedFaqs();
      const data = await getAllFaqs();
      dispatch(setFaqs(data));
      toast.success('FAQ importate dai file statici');
    } catch {
      toast.error("Errore durante l'importazione");
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa FAQ?')) return;
    try {
      await deleteFaq(id);
      dispatch(removeFaqFromStore(id));
      toast.success('FAQ eliminata');
    } catch {
      toast.error("Errore durante l'eliminazione");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-semibold">
          FAQ
          <span className="badge bg-secondary ms-2 fw-normal" style={{ fontSize: '0.75rem' }}>
            {faqs.length}
          </span>
        </h5>
        <div className="d-flex gap-2">
          <Btn color="secondary" version="outline" size="sm" loading={seeding} onClick={handleSeed}>
            <span className="material-symbols-outlined me-1" style={{ fontSize: 16, verticalAlign: 'middle' }}>download</span>
            Importa statici
          </Btn>
          <Btn color="primary" size="sm" onClick={openAdd}>
            <span className="material-symbols-outlined me-1" style={{ fontSize: 16, verticalAlign: 'middle' }}>
              add
            </span>
            Aggiungi
          </Btn>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center text-muted py-5">
          <span className="material-symbols-outlined d-block mb-2" style={{ fontSize: 48, opacity: 0.4 }}>
            quiz
          </span>
          <p className="mb-0">Nessuna FAQ presente</p>
          <small>Aggiungi la prima FAQ</small>
        </div>
      ) : (
        <div className={styles.faqList}>
          {faqs.map((faq, i) => (
            <div key={faq.id} className={styles.faqItem}>
              <div className={styles.faqIndex}>{i + 1}</div>
              <div className={styles.faqContent}>
                <p className={styles.faqQuestion}>{faq.question}</p>
                <p className={styles.faqAnswer}>{faq.answer}</p>
                {faq.projectIds && faq.projectIds.length > 0 && (
                  <p className="mb-0 mt-1" style={{ fontSize: '0.72rem', color: 'var(--bs-secondary)' }}>
                    <span className="material-symbols-outlined me-1" style={{ fontSize: 13, verticalAlign: 'middle' }}>folder</span>
                    {faq.projectIds.length} {faq.projectIds.length === 1 ? 'progetto' : 'progetti'} collegati
                  </p>
                )}
              </div>
              <div className={styles.faqActions}>
                <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(faq)} title="Modifica">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(faq.id)} title="Elimina">
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
        title={editing ? 'Modifica FAQ' : 'Nuova FAQ'}
        size="lg"
        footer={
          <>
            <Btn color="secondary" version="outline" onClick={closeModal}>
              Annulla
            </Btn>
            <Btn color="primary" loading={saving} onClick={handleSave} disabled={!question.trim() || !answer.trim()}>
              Salva
            </Btn>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label fw-semibold">Domanda</label>
          <input
            type="text"
            className="form-control"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Inserisci la domanda…"
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Risposta</label>
          <textarea
            className="form-control"
            rows={6}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Inserisci la risposta…"
          />
        </div>
        <div>
          <label className="form-label fw-semibold">
            Progetti correlati
            <span className="text-muted fw-normal ms-1" style={{ fontSize: '0.82rem' }}>
              — l'AI li mostrerà come card nella chat quando pertinente
            </span>
          </label>
          {loadingProjects ? (
            <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.85rem' }}>
              <div className="spinner-border spinner-border-sm" />
              Caricamento progetti…
            </div>
          ) : allProjects.length === 0 ? (
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Nessun progetto disponibile</p>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              {allProjects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProject(p.id)}
                  className={`btn btn-sm ${relatedProjectIds.includes(p.id) ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                  {relatedProjectIds.includes(p.id) && (
                    <span className="material-symbols-outlined me-1" style={{ fontSize: 13, verticalAlign: 'middle' }}>check</span>
                  )}
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
