import { useEffect, useRef, useState } from 'react';
import { askAiStream, type ChatHistoryMessage } from '../../../api/aiChat';
import { useAppDispatch, useAppSelector } from '../../../store';
import { getAllProjects } from '../../../db/projects/projectRepo';
import { setProjects } from '../../../db/projects/projectSlice';
import type { Project } from '../../../db/projects/Project';
import styles from './AiChatSection.module.css';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function applyInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

function renderBotMarkdown(text: string): string {
  const lines = escapeHtml(text).split('\n');
  const out: string[] = [];
  let inList = false;

  for (const line of lines) {
    const listMatch = line.match(/^[-*]\s+(.+)/);
    if (listMatch) {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${applyInline(listMatch[1])}</li>`);
    } else {
      if (inList) { out.push('</ul>'); inList = false; }
      if (line.trim() === '') {
        out.push('<br>');
      } else {
        out.push(`<p>${applyInline(line)}</p>`);
      }
    }
  }
  if (inList) out.push('</ul>');
  return out.join('');
}

const SUGGESTED = [
  'Che tecnologie conosci?',
  'Saresti in grado di creare il mio sito?',
  'Sapresti implementare chat AI?',
];

type Message = { from: 'user' | 'bot'; text: string; projectIds?: string[] };

function MiniProjectCard({ project }: { project: Project }) {
  return (
    <div className={styles.miniCard}>
      {project.image ? (
        <img src={project.image} alt={project.name} className={styles.miniCardImg} />
      ) : (
        <span className={`material-symbols-outlined ${styles.miniCardImgPlaceholder}`}>folder</span>
      )}
      <div className={styles.miniCardBody}>
        <p className={styles.miniCardName}>{project.name}</p>
        <div className={styles.miniCardTech}>
          {project.tech.slice(0, 3).map((t) => (
            <span key={t} className={styles.miniCardTag}>{t}</span>
          ))}
        </div>
        {(project.demoUrl || project.githubUrl) && (
          <div className={styles.miniCardLinks}>
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={styles.miniCardLink}>
                <span className="material-symbols-outlined">open_in_new</span>
                Demo
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.miniCardLink}>
                GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AiChatSection() {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((s) => s.project);

  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'bot',
      text: "Ciao! Sono l'assistente AI di Antonino, addestrato sulle sue FAQ, competenze ed esperienze. Prova a farmi una domanda!",
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projects.length > 0) return;
    getAllProjects().then((data) => dispatch(setProjects(data)));
  }, [dispatch, projects.length]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  const buildHistory = (currentMessages: Message[]): ChatHistoryMessage[] => {
    const MAX_TURNS = 3;
    return currentMessages
      .slice(1) // salta il greeting iniziale
      .filter((m) => m.text.trim())
      .slice(-MAX_TURNS * 2)
      .map((m) => ({
        role: m.from === 'user' ? ('user' as const) : ('model' as const),
        text: m.text.replace(/\[SHOW_PROJECTS:[^\]]*\]/g, '').trim(),
      }));
  };

  const send = async (text: string) => {
    if (!text.trim() || thinking) return;

    const history = buildHistory(messages);

    setMessages((m) => [...m, { from: 'user', text: text.trim() }]);
    setInput('');
    setThinking(true);
    scrollToBottom();

    setMessages((m) => [...m, { from: 'bot', text: '' }]);

    let receivedProjectIds: string[] | undefined;

    try {
      await askAiStream(
        text.trim(),
        (chunk) => {
          setMessages((m) => {
            const updated = [...m];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              text: updated[updated.length - 1].text + chunk,
            };
            return updated;
          });
          scrollToBottom();
        },
        (ids) => {
          receivedProjectIds = ids;
        },
        history,
      );
    } catch {
      setMessages((m) => {
        const updated = [...m];
        updated[updated.length - 1] = {
          from: 'bot',
          text: 'Si è verificato un errore. Riprova tra qualche istante.',
        };
        return updated;
      });
      return;
    } finally {
      setThinking(false);
      scrollToBottom();
    }

    if (receivedProjectIds?.length) {
      setMessages((m) => {
        const updated = [...m];
        const last = updated[updated.length - 1];
        updated[updated.length - 1] = {
          ...last,
          text: last.text.replace(/\[SHOW_PROJECTS:[^\]]*\]/g, '').trim(),
          projectIds: receivedProjectIds,
        };
        return updated;
      });
    }
  };

  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <span className={styles.badge}>
            <span className="material-symbols-outlined">smart_toy</span>
            AI Assistant — beta
          </span>
          <h2 className={styles.title}>Hai domande sulle mie competenze?</h2>
        </div>

        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <span className={`material-symbols-outlined ${styles.chatHeaderIcon}`}>smart_toy</span>
            <div>
              <p className={styles.chatHeaderName}>Anto AI</p>
              <span className={styles.chatHeaderStatus}>
                <span className={styles.statusDot} />
                online
              </span>
            </div>
          </div>

          <div ref={messagesRef} className={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} className={`${styles.msgWrapper} ${m.from === 'user' ? styles.msgWrapperUser : styles.msgWrapperBot}`}>
                <div className={`${styles.msg} ${m.from === 'user' ? styles.msgUser : styles.msgBot}`}>
                  {m.from === 'bot' && m.text === '' && thinking && i === messages.length - 1 ? (
                    <span className={styles.typing}>
                      <span />
                      <span />
                      <span />
                    </span>
                  ) : m.from === 'bot' ? (
                    <div
                      className={styles.msgText}
                      dangerouslySetInnerHTML={{ __html: renderBotMarkdown(m.text) }}
                    />
                  ) : (
                    <span className={styles.msgText}>{m.text}</span>
                  )}
                </div>
                {m.projectIds && m.projectIds.length > 0 && (
                  <div className={styles.projectCards}>
                    {m.projectIds.map((id) => {
                      const project = projects.find((p) => p.id === id);
                      if (!project) return null;
                      return <MiniProjectCard key={id} project={project} />;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!messages.some((m) => m.from === 'user') && (
            <div className={styles.suggested}>
              {SUGGESTED.map((s) => (
                <button key={s} className={styles.chip} onClick={() => send(s)} disabled={thinking}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            className={styles.inputRow}
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Scrivi una domanda…"
              className={styles.input}
              disabled={thinking}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!input.trim() || thinking}
              aria-label="Invia"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
