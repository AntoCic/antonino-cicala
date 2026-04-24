import { useRef, useState } from 'react';
import { askAi } from '../../../api/aiChat';
import styles from './AiChatSection.module.css';

const SUGGESTED = [
  'Che tecnologie conosci?',
  'Saresti in grado di creare il mio sito?',
  'Sapresti implementare chat AI?',
];

type Message = { from: 'user' | 'bot'; text: string };

export default function AiChatSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'bot',
      text: "Ciao! Sono l'assistente AI di Antonino, addestrato sulle sue FAQ, competenze ed esperienze. Prova a farmi una domanda!",
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  const send = async (text: string) => {
    if (!text.trim() || thinking) return;
    setMessages((m) => [...m, { from: 'user', text: text.trim() }]);
    setInput('');
    setThinking(true);
    scrollToBottom();

    try {
      const answer = await askAi(text.trim());
      setMessages((m) => [...m, { from: 'bot', text: answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        { from: 'bot', text: 'Si è verificato un errore. Riprova tra qualche istante.' },
      ]);
    } finally {
      setThinking(false);
      scrollToBottom();
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
              <div
                key={i}
                className={`${styles.msg} ${m.from === 'user' ? styles.msgUser : styles.msgBot}`}
              >
                <span className={styles.msgText}>{m.text}</span>
              </div>
            ))}
            {thinking && (
              <div className={`${styles.msg} ${styles.msgBot}`}>
                <span className={styles.typing}>
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            )}
          </div>

          <div className={styles.suggested}>
            {SUGGESTED.map((s) => (
              <button key={s} className={styles.chip} onClick={() => send(s)} disabled={thinking}>
                {s}
              </button>
            ))}
          </div>

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
