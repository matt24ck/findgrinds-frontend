'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ai, type AITutor, type AIResource } from '@/lib/api';
import { TutorResultCard } from './TutorResultCard';
import { ResourceResultCard } from './ResourceResultCard';

type ChatTurn =
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: string; tutors: AITutor[]; resources: AIResource[] };

const EXAMPLE_PROMPTS = [
  'Find me an LC Maths tutor in Dublin under €40',
  'Any resources for Junior Cert Science?',
  'How does booking a grind work?',
];

const markdownComponents = {
  p: (props: any) => <p className="mb-2 last:mb-0" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-4 mb-2 space-y-0.5" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-4 mb-2 space-y-0.5" {...props} />,
  strong: (props: any) => <strong className="font-semibold text-[#2C3E50]" {...props} />,
  a: (props: any) => (
    <a className="text-[#2D9B6E] underline hover:text-[#25A876]" target="_blank" rel="noopener noreferrer" {...props} />
  ),
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, loading, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatTurn[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const payload = nextMessages.map((m) => ({ role: m.role, content: m.content }));
      const data = await ai.chat(payload);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply, tutors: data.tutors || [], resources: data.resources || [] },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry — I couldn't reach the assistant just now (${err?.message || 'network error'}). Please try again.`,
          tutors: [],
          resources: [],
        },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  return (
    <>
      {/* Panel */}
      {open && (
        <div
          className="fixed z-50 inset-0 sm:inset-auto sm:bottom-24 sm:right-5 w-full sm:w-[400px] h-[100dvh] sm:h-[600px] sm:max-h-[80vh] bg-white sm:rounded-2xl shadow-2xl border border-[#ECF0F1] flex flex-col overflow-hidden"
          role="dialog"
          aria-label="FindGrinds AI assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#2D9B6E] text-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <div className="leading-tight">
                <p className="font-bold text-sm">FindGrinds Assistant</p>
                <p className="text-[11px] text-white/80">Find tutors, resources & answers</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="p-1 rounded-lg hover:bg-white/15 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={bodyRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-[#F8F9FA]">
            {/* Greeting (UI only — not part of the conversation sent to the model) */}
            <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-[#2C3E50] shadow-sm max-w-[90%]">
              Hi! 👋 I&apos;m the FindGrinds assistant. Tell me what subject and level you need help with, your
              area and budget, and I&apos;ll find the right grind for you — or ask me anything about how FindGrinds works.
            </div>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="text-xs text-[#2D9B6E] bg-white border border-[#2D9B6E]/30 hover:bg-[#F0F7F4] px-2.5 py-1.5 rounded-full transition-colors text-left"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) =>
              m.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="bg-[#2D9B6E] text-white rounded-2xl rounded-tr-sm px-3 py-2 text-sm max-w-[85%] whitespace-pre-wrap">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="space-y-2">
                  <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-[#2C3E50] shadow-sm max-w-[90%]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                  {m.tutors.map((t) => (
                    <TutorResultCard key={t.id} tutor={t} onNavigate={() => setOpen(false)} />
                  ))}
                  {m.resources.map((r) => (
                    <ResourceResultCard key={r.id} resource={r} onNavigate={() => setOpen(false)} />
                  ))}
                </div>
              )
            )}

            {loading && (
              <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2.5 shadow-sm w-16">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[#95A5A6] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-[#95A5A6] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-[#95A5A6] rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex-shrink-0 border-t border-[#ECF0F1] bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 px-3 py-2.5"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about tutors, resources…"
                className="flex-1 text-sm px-3 py-2 rounded-full border border-[#D5DBDB] focus:outline-none focus:border-[#2D9B6E] focus:ring-1 focus:ring-[#2D9B6E] text-[#2C3E50]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex-shrink-0 w-9 h-9 rounded-full bg-[#2D9B6E] text-white flex items-center justify-center hover:bg-[#25A876] disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            {/* Sonraí AI attribution */}
            <p className="text-center text-[10px] text-[#95A5A6] pb-2">
              AI Integration powered by{' '}
              <a
                href="https://sonrai-ai.ie"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-[#2D9B6E] transition-colors"
              >
                Sonraí AI
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close assistant' : 'Open AI assistant'}
        className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#2D9B6E] text-white shadow-lg hover:bg-[#25A876] hover:scale-105 active:scale-95 items-center justify-center transition-all ${
          open ? 'hidden sm:flex' : 'flex'
        }`}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
}
