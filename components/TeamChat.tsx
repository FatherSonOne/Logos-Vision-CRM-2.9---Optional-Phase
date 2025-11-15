import React, { useState, useEffect, useRef } from 'react';
import type { ChatRoom, ChatMessage, TeamMember } from '../types';
import { PlusIcon, SendIcon } from './icons';

interface TeamChatProps {
  rooms: ChatRoom[];
  messages: ChatMessage[];
  teamMembers: TeamMember[];
  currentUserId: string;
  onSendMessage: (roomId: string, text: string) => void;
  onCreateRoom: () => void;
}

export const TeamChat: React.FC<TeamChatProps> = ({ rooms, messages, teamMembers, currentUserId, onSendMessage, onCreateRoom }) => {
  const [activeRoomId, setActiveRoomId] = useState<string>(rooms[0]?.id || '');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeRoom = rooms.find(r => r.id === activeRoomId);
  const filteredMessages = messages.filter(m => m.roomId === activeRoomId).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const getSender = (senderId: string) => teamMembers.find(m => m.id === senderId);

  useEffect(() => {
    if (!activeRoomId && rooms.length > 0) {
      setActiveRoomId(rooms[0].id);
    }
  }, [rooms, activeRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && activeRoomId) {
      onSendMessage(activeRoomId, newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-full -m-6 sm:-m-8">
      {/* Sidebar with channels */}
      <aside className="w-1/4 bg-white/20 dark:bg-slate-900/40 backdrop-blur-sm p-4 flex flex-col border-r border-white/20 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Channels</h2>
          <button 
            onClick={onCreateRoom}
            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-white/50 rounded-md dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-black/20"
            title="Create new channel"
          >
            <PlusIcon />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {rooms.map(room => (
              <li key={room.id}>
                <button
                  onClick={() => setActiveRoomId(room.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeRoomId === room.id
                      ? 'bg-teal-100 text-teal-700 font-semibold dark:bg-teal-900/50 dark:text-teal-300'
                      : 'text-slate-600 hover:bg-white/50 dark:text-slate-400 dark:hover:bg-black/20'
                  }`}
                >
                  {room.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col bg-white/5 dark:bg-slate-900/20">
        {!activeRoom ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400">Select or create a channel to start chatting.</p>
          </div>
        ) : (
          <>
            <header className="p-4 border-b border-white/20 bg-white/20 dark:bg-slate-900/40 backdrop-blur-sm dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{activeRoom.name}</h3>
            </header>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {filteredMessages.map(message => {
                const sender = getSender(message.senderId);
                const isCurrentUser = message.senderId === currentUserId;
                return (
                  <div key={message.id} className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center font-bold text-sm text-slate-600 flex-shrink-0 dark:bg-black/20 dark:text-slate-300">
                      {sender?.name.charAt(0)}
                    </div>
                    <div className={`p-3 rounded-lg max-w-lg ${isCurrentUser ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white' : 'bg-white/30 dark:bg-slate-800/30 text-slate-800 dark:text-slate-200'}`}>
                      {!isCurrentUser && (
                          <p className="text-sm font-bold text-teal-600 mb-1 dark:text-teal-400">{sender?.name}</p>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 opacity-70 ${isCurrentUser ? 'text-teal-200' : 'text-slate-500 dark:text-slate-400'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/20 bg-white/20 dark:bg-slate-900/40 backdrop-blur-sm dark:border-slate-700">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${activeRoom.name}`}
                  className="flex-1 p-2 bg-white/50 border border-white/30 rounded-md focus:ring-teal-500 focus:border-teal-500 text-slate-900 placeholder-slate-400 dark:bg-black/30 dark:border-white/20 dark:text-white dark:placeholder-slate-400"
                />
                <button type="submit" className="p-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-md hover:from-teal-700 hover:to-cyan-700 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-600 dark:disabled:to-slate-600" disabled={!newMessage.trim()}>
                  <SendIcon />
                </button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
