import { useState, useEffect } from 'react';
import { Modal } from '../../../components/Modal/Modal';
import { Btn } from '../../../components/Btn/Btn';
import { toast } from '../../../components/toast/toast';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  getAllCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  seedCertificates,
} from '../../../db/certificates/certificateRepo';
import {
  setCertificates,
  setCertificateLoading,
  updateCertificateInStore,
  removeCertificateFromStore,
} from '../../../db/certificates/certificateSlice';
import type { Certificate } from '../../../db/certificates/Certificate';
import styles from '../HomeAuth.module.css';

export default function CertificatesManager() {
  const dispatch = useAppDispatch();
  const { certificates, loading } = useAppSelector((s) => s.certificate);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    dispatch(setCertificateLoading(true));
    getAllCertificates()
      .then((data) => dispatch(setCertificates(data)))
      .catch(() => {
        toast.error('Errore nel caricamento dei certificati');
        dispatch(setCertificateLoading(false));
      });
  }, [dispatch]);

  const openAdd = () => {
    setEditing(null);
    setName('');
    setIssuer('');
    setImage('');
    setDescription('');
    setUrl('');
    setOrder(certificates.length);
    setShowModal(true);
  };

  const openEdit = (cert: Certificate) => {
    setEditing(cert);
    setName(cert.name);
    setIssuer(cert.issuer);
    setImage(cert.image);
    setDescription(cert.description);
    setUrl(cert.url ?? '');
    setOrder(cert.order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!name.trim() || !image.trim()) return;
    setSaving(true);
    try {
      const payload: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim(),
        issuer: issuer.trim(),
        image: image.trim(),
        description: description.trim(),
        order,
      };
      if (url.trim()) payload.url = url.trim();

      if (editing) {
        await updateCertificate(editing.id, payload);
        dispatch(updateCertificateInStore({ ...editing, ...payload }));
        toast.success('Certificato aggiornato');
      } else {
        await createCertificate(payload);
        const data = await getAllCertificates();
        dispatch(setCertificates(data));
        toast.success('Certificato creato');
      }
      closeModal();
    } catch {
      toast.error('Errore durante il salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo certificato?')) return;
    try {
      await deleteCertificate(id);
      dispatch(removeCertificateFromStore(id));
      toast.success('Certificato eliminato');
    } catch {
      toast.error("Errore durante l'eliminazione");
    }
  };

  const handleSeed = async () => {
    if (!confirm(`Importare i certificati dai dati statici?${certificates.length > 0 ? ` I ${certificates.length} esistenti verranno sostituiti.` : ''}`)) return;
    setSeeding(true);
    try {
      await seedCertificates();
      const data = await getAllCertificates();
      dispatch(setCertificates(data));
      toast.success('Certificati importati dai dati statici');
    } catch {
      toast.error("Errore durante l'importazione");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-semibold">
          Certificati
          <span className="badge bg-secondary ms-2 fw-normal" style={{ fontSize: '0.75rem' }}>
            {certificates.length}
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
      ) : certificates.length === 0 ? (
        <div className="text-center text-muted py-5">
          <span className="material-symbols-outlined d-block mb-2" style={{ fontSize: 48, opacity: 0.4 }}>
            workspace_premium
          </span>
          <p className="mb-0">Nessun certificato presente</p>
        </div>
      ) : (
        <div className={styles.faqList}>
          {certificates.map((cert) => (
            <div key={cert.id} className={styles.faqItem}>
              <img
                src={`/img/certificati/${cert.image}`}
                alt={cert.name}
                style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 6, flexShrink: 0, background: '#f8f9fa' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className={styles.faqContent}>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="text-muted" style={{ fontSize: '0.75rem', minWidth: 20 }}>#{cert.order}</span>
                  <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{cert.name}</span>
                  <span className="text-muted" style={{ fontSize: '0.82rem' }}>— {cert.issuer}</span>
                </div>
                <p className={styles.faqAnswer}>{cert.description}</p>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <span className="text-muted" style={{ fontSize: '0.78rem' }}>{cert.image}</span>
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle' }}>open_in_new</span>
                    </a>
                  )}
                </div>
              </div>
              <div className={styles.faqActions}>
                <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(cert)} title="Modifica">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cert.id)} title="Elimina">
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
        title={editing ? 'Modifica Certificato' : 'Nuovo Certificato'}
        size="lg"
        footer={
          <>
            <Btn color="secondary" version="outline" onClick={closeModal}>Annulla</Btn>
            <Btn color="primary" loading={saving} onClick={handleSave} disabled={!name.trim() || !image.trim()}>
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
              placeholder="es. React Certification"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Ente</label>
            <input
              type="text"
              className="form-control"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="es. Udemy"
            />
          </div>
          <div className="col-md-8">
            <label className="form-label fw-semibold">File immagine <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="es. react.png"
            />
            <div className="form-text">Nome del file in <code>/public/img/certificati/</code></div>
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
          <div className="col-12">
            <label className="form-label fw-semibold">Descrizione</label>
            <textarea
              className="form-control"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrizione del certificato…"
            />
          </div>
          <div className="col-12">
            <label className="form-label fw-semibold">URL certificato</label>
            <input
              type="url"
              className="form-control"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
