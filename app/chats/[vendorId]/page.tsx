'use client';

import { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';

type Message = {
  id: number;
  type: string;
  sender: string;
  vendor: string;
  status: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  total: number;
  time: string;
  text?: string;
};

export default function VendorChatPage({ params }: { params: Promise<{ vendorId: string }> }) {
  const unwrappedParams = use(params);
  const vendorId = unwrappedParams.vendorId;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'order',
      sender: 'user',
      vendor: 'Mama Nkechi Kitchen',
      status: 'Pending',
      items: [
        {
          name: 'Jollof Rice Platter',
          price: 3500,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=600'
        }
      ],
      total: 3500,
      time: '20:44'
    },
    {
      id: 2,
      type: 'order',
      sender: 'user',
      vendor: 'Mama Nkechi Kitchen',
      status: 'Pending',
      items: [
        {
          name: 'Jollof Rice Platter',
          price: 3500,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=600'
        }
      ],
      total: 3500,
      time: '20:45'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Format the mock vendor name based on URL slug
  const vendorName = vendorId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const vendorInitials = vendorId.charAt(0).toUpperCase();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages([...messages, {
      id: messages.length + 1,
      type: 'text',
      sender: 'user',
      vendor: vendorName,
      status: '',
      items: [],
      total: 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: newMessage
    }]);
    
    setNewMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[100dvh] bg-[#f8f9fa] md:bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 flex-shrink-0 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 sm:h-20 gap-4">
            <Link
              href="/chats"
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
            >
              <ArrowLeft size={20} />
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FA3728]/10 flex items-center justify-center text-[#FA3728] font-bold">
                {vendorInitials}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight truncate">
                  {vendorName}
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Vendor</p>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 rounded-full border border-blue-100">
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">✓</span>
                    </div>
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
        <div className="space-y-6">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'order' ? (
                /* Order Card Message */
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 w-full sm:max-w-md">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-[#FA3728]/10 text-[#FA3728] flex items-center justify-center text-[10px] font-bold">
                          {vendorInitials}
                       </div>
                       <span className="font-semibold text-gray-900 text-sm">{message.vendor}</span>
                    </div>
                    <span className="px-3 py-1 bg-[#FA3728]/10 text-[#FA3728] text-xs font-bold rounded-full">
                      {message.status}
                    </span>
                  </div>

                  <div className="mb-3 px-3 py-2 bg-amber-50 rounded-lg border border-amber-100 flex items-center justify-center">
                    <p className="text-xs font-semibold text-amber-800">Awaiting vendor confirmation</p>
                  </div>

                  <div className="space-y-3">
                    {message.items.map((item, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        {item.image ? (
                          <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0"></div>
                        )}
                        <div className="flex-1 min-w-0">
                           <h4 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h4>
                           <p className="text-gray-500 text-xs mt-0.5">₦{item.price.toLocaleString()} × {item.quantity}</p>
                        </div>
                        <div className="font-bold text-gray-900 text-sm">
                           ₦{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
                     <span className="text-sm text-gray-500 font-medium">Total</span>
                     <span className="font-bold text-[#FA3728]">₦{message.total.toLocaleString()}</span>
                  </div>

                  <div className="mt-4 flex gap-2 w-full">
                    <button className="flex-1 py-2.5 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-xl font-semibold text-sm transition-all shadow-sm">
                      Proceed to Payment
                    </button>
                    <button className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm transition-all border border-gray-200">
                      Cancel
                    </button>
                  </div>
                  
                  <div className="mt-2 text-right">
                     <span className="text-[10px] text-gray-400">{message.time}</span>
                  </div>
                </div>
              ) : (
                /* Regular Text Message */
                <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                  message.sender === 'user' 
                    ? 'bg-[#FA3728] text-white rounded-tr-sm' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${message.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                    {message.time}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-gray-100 p-3 sm:p-4 mt-auto shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-10 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden focus-within:border-[#FA3728] focus-within:ring-1 focus-within:ring-[#FA3728] transition-all">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Type a message..."
                className="w-full bg-transparent px-5 py-3.5 outline-none resize-none max-h-32 text-sm sm:text-base text-gray-800 placeholder-gray-400"
                rows={1}
                style={{ minHeight: '52px' }}
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="w-[52px] h-[52px] bg-[#FA3728] text-white rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E31B23] transition-colors"
            >
              <Send size={20} className="ml-1" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
