'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Loader2, ArrowLeft } from 'lucide-react';
import { messagesService, authService } from '@/lib/api';
import type { Message } from '@/lib/api';

interface Conversation {
  userId: string;
  lastMessage: Message;
  allMessages: Message[];
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [thread, setThread] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fetchUser = async () => {
      try {
       const currentUser  = await authService.getCurrentUser();
        
        // Using optional chaining (?.) is a safe way to check if user exists
        if (currentUser) {
          setCurrentUser(currentUser);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const loadConversations = async () => {
    try {
      const msgs = await messagesService.getMessages();
      const grouped: Record<string, Message[]> = {};
      msgs.forEach((msg) => {
        const otherId = msg.sender === currentUser?.id ? msg.recipient : msg.sender;
        if (!grouped[otherId]) grouped[otherId] = [];
        grouped[otherId].push(msg);
      });
      const convs: Conversation[] = Object.entries(grouped).map(([userId, messages]) => {
        const sorted = [...messages].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        return {
          userId,
          allMessages: sorted,
          lastMessage: sorted[sorted.length - 1],
        };
      });
      setConversations(
        convs.sort(
          (a, b) =>
            new Date(b.lastMessage.created_at).getTime() -
            new Date(a.lastMessage.created_at).getTime()
        )
      );
    } catch {
      setError('Failed to load messages.');
    } finally {
      setIsLoading(false);
    }
  };

  const openThread = async (userId: string) => {
    setSelectedUserId(userId);
    setError('');
    try {
      const msgs = await messagesService.getThread(userId);
      setThread(
        [...msgs].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      );
    } catch {
      setError('Failed to load conversation.');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedUserId) return;
    setIsSending(true);
    setError('');
    try {
      const msg = await messagesService.sendMessage({
        recipient: selectedUserId,
        content: input.trim(),
      });
      setThread((prev) => [...prev, msg]);
      setInput('');
      loadConversations();
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-gray-400">Communicate with customers and support</p>
      </motion.div>

      {error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-3 font-bold text-red-400 hover:text-red-300">×</button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="glass border-white/10 rounded-xl overflow-hidden"
        style={{ minHeight: '500px' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 size={32} className="text-crimson animate-spin" />
          </div>
        ) : (
          <div className="flex h-[600px]">

            {/* Conversation list */}
            <div
              className={`w-full md:w-72 border-r border-white/10 flex-shrink-0 flex flex-col ${
                selectedUserId ? 'hidden md:flex' : 'flex'
              }`}
            >
              <div className="p-4 border-b border-white/10">
                <h2 className="font-semibold text-white text-sm">Conversations</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6 py-10">
                    <div className="inline-flex p-4 bg-crimson/20 rounded-2xl">
                      <MessageSquare size={28} className="text-crimson" />
                    </div>
                    <p className="text-gray-400 text-sm">No messages yet.</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => openThread(conv.userId)}
                      className={`w-full flex items-start gap-3 p-4 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${
                        selectedUserId === conv.userId ? 'bg-white/10' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-crimson/20 flex items-center justify-center text-crimson font-bold flex-shrink-0 text-sm">
                        {conv.userId.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">
                          Customer #{conv.userId.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {conv.lastMessage.content}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {new Date(conv.lastMessage.created_at).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Thread view */}
            <div className={`flex-1 flex flex-col ${!selectedUserId ? 'hidden md:flex' : 'flex'}`}>
              {!selectedUserId ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
                  <div className="inline-flex p-4 bg-crimson/20 rounded-2xl">
                    <MessageSquare size={28} className="text-crimson" />
                  </div>
                  <p className="text-gray-400 text-sm">Select a conversation to view messages.</p>
                </div>
              ) : (
                <>
                  {/* Thread header */}
                  <div className="flex items-center gap-3 p-4 border-b border-white/10 flex-shrink-0">
                    <button
                      onClick={() => setSelectedUserId(null)}
                      className="md:hidden p-1 text-gray-400 hover:text-white"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <div className="w-9 h-9 rounded-full bg-crimson/20 flex items-center justify-center text-crimson font-bold text-sm flex-shrink-0">
                      {selectedUserId.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="font-semibold text-white text-sm">
                      Customer #{selectedUserId.slice(0, 8).toUpperCase()}
                    </p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                    {thread.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-sm">No messages in this thread yet.</p>
                      </div>
                    ) : (
                      thread.map((msg) => {
                        const isSelf = msg.sender === currentUser?.id;
                        return (
                          <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                isSelf
                                  ? 'bg-crimson text-white rounded-br-sm'
                                  : 'bg-white/10 text-white rounded-bl-sm'
                              }`}
                            >
                              <p className="leading-relaxed">{msg.content}</p>
                              <p className={`text-[10px] mt-1 text-right ${isSelf ? 'text-white/60' : 'text-gray-500'}`}>
                                {new Date(msg.created_at).toLocaleTimeString('en-NG', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form
                    onSubmit={handleSend}
                    className="flex items-center gap-2 p-4 border-t border-white/10 flex-shrink-0"
                  >
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl overflow-hidden focus-within:border-crimson/50 transition-all">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-transparent px-5 py-3 text-sm text-white placeholder-gray-500 outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!input.trim() || isSending}
                      className="w-10 h-10 bg-crimson text-white rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50 hover:bg-crimson/80 transition-all active:scale-90"
                    >
                      {isSending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} className="translate-x-[1px]" />
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

          </div>
        )}
      </motion.div>
    </div>
  );
}
