'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function ChatsListPage() {
  const chats = [
    {
      id: "mama-nkechi-kitchen",
      vendor: "Mama Nkechi Kitchen",
      avatarBg: "bg-[#FA3728]/10",
      avatarText: "text-[#FA3728]",
      initials: "M",
      lastMessage: "Order — pending",
      time: "20:51"
    },
    {
      id: "gadget-hub",
      vendor: "Gadget Hub",
      avatarBg: "bg-blue-100",
      avatarText: "text-blue-600",
      initials: "G",
      lastMessage: "Order — pending",
      time: "20:51"
    }
  ];

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-4">
            <Link
              href="/explore"
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full">
        <div className="md:my-6 md:bg-white md:rounded-2xl md:shadow-sm overflow-hidden divide-y divide-gray-100">
          {chats.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/chats/${chat.id}`}
                className="flex items-center gap-4 p-4 sm:p-5 hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${chat.avatarBg} ${chat.avatarText}`}>
                  {chat.initials}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#FA3728] transition-colors truncate">
                      {chat.vendor}
                    </h3>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {chat.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
          
          {chats.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No conversations yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
