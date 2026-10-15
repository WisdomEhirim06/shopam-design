'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { authService, messagesService } from '@/lib/api';
import type { Message } from '@/lib/api';

interface Thread {
  otherId: string;
  last: Message;
}

export default function VendorMessagesPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  const me = authService.getCurrentUser()?.id;

  useEffect(() => {
    messagesService
      .getMessages()
      .then((all) => {
        const map = new Map<string, Message>();
        for (const m of all) {
          const other = m.recipient === me ? m.sender : m.recipient;
          if (!map.has(other)) map.set(other, m);
        }
        setThreads([...map.entries()].map(([otherId, last]) => ({ otherId, last })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [me]);

  const openThread = async (otherId: string) => {
    setActive(otherId);
    try {
      setMessages(await messagesService.getThread(otherId));
    } catch {
      setMessages([]);
    }
  };

  const send = async () => {
    if (!input.trim() || !active) return;
    const content = input.trim();
    setInput('');
    try {
      await messagesService.sendMessage({ recipient: active, content });
      setMessages(await messagesService.getThread(active));
    } catch {
      /* keep as-is */
    }
  };

  const activeLabel = active ? `Buyer #${active.substring(0, 6).toUpperCase()}` : '';

  return (
    <div>
      {active ? (
        <div className="flex h-[calc(100dvh-8rem)] flex-col rounded-2xl border border-slate-200/80 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
            <button onClick={() => setActive(null)} className="rounded-full p-1 text-slate-600 hover:bg-slate-100">
              <ArrowLeft size={20} />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
              {activeLabel.charAt(0)}
            </div>
            <span className="text-sm font-bold text-ink">{activeLabel}</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && <p className="text-center text-sm text-slate-400">No messages yet.</p>}
            {messages.map((m) => {
              const mine = m.sender === me;
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${mine ? 'bg-ink text-white' : 'border border-slate-200/80 bg-white text-slate-700'}`}>
                    {m.content}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 border-t border-slate-100 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type a message…"
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-ink outline-none focus:border-ink"
            />
            <button onClick={send} disabled={!input.trim()} className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-[#FA3728] disabled:opacity-40">
              <Send size={17} />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-black tracking-tight text-ink">Messages</h2>
          <p className="mt-1 text-sm text-slate-500">Chat with buyers.</p>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#FA3728]" size={26} /></div>
            ) : threads.length === 0 ? (
              <p className="px-4 py-12 text-center text-sm text-slate-400">No conversations yet.</p>
            ) : (
              threads.map((t) => (
                <button
                  key={t.otherId}
                  onClick={() => openThread(t.otherId)}
                  className="flex w-full items-center gap-3 border-b border-slate-50 px-4 py-3 text-left last:border-0 hover:bg-slate-50/60"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                    B
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-ink">Buyer #{t.otherId.substring(0, 6).toUpperCase()}</p>
                    <p className="truncate text-xs text-slate-400">{t.last.content}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
