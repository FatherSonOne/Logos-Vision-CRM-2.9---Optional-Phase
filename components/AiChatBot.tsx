

import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { chatWithBot } from '../services/geminiService';

export const AiChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'init', roomId: 'ai-chat', senderId: 'AI', text: 'Hello! How can I help you today?', timestamp: new Date().toISOString() }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            roomId: 'ai-chat',
            senderId: 'USER',
            text: userInput.trim(),
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        const responseText = await chatWithBot(messages, userMessage.text);

        const aiMessage: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            roomId: 'ai-chat',
            senderId: 'AI',
            text: responseText,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-40">
            {isOpen ? (
                <div className="w-80 h-[28rem] bg-white rounded-lg shadow-2xl flex flex-col border border-slate-300">
                    <header className="p-3 bg-indigo-600 text-white rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold text-sm">AI Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="text-indigo-200 hover:text-white">&times;</button>
                    </header>
                    <div className="flex-1 p-3 overflow-y-auto bg-slate-50">
                        <div className="space-y-3">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex items-start gap-2 ${msg.senderId === 'USER' ? 'justify-end' : ''}`}>
                                    {msg.senderId === 'AI' && <div className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">AI</div>}
                                    <div className={`p-2 rounded-lg max-w-xs text-sm ${msg.senderId === 'USER' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-2">
                                     <div className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">AI</div>
                                     <div className="p-2 rounded-lg bg-slate-200">
                                        <div className="flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                                        </div>
                                     </div>
                                </div>
                            )}
                        </div>
                         <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-2 border-t border-slate-200">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask something..."
                            className="w-full text-sm p-2 bg-white border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </form>
                </div>
            ) : (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full shadow-lg flex items-center justify-center text-white hover:from-indigo-700 hover:to-violet-700 transition-transform hover:scale-110"
                    aria-label="Open AI Assistant"
                >
                    <SparklesIcon />
                </button>
            )}
        </div>
    );
};

const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L13 12l-1.293 1.293a1 1 0 01-1.414 0L8 10.414a1 1 0 010-1.414L10.293 7l-2.293-2.293a1 1 0 011.414 0L12 6.414l1.293-1.293a1 1 0 011.414 0zM17 12l-2.293 2.293a1 1 0 01-1.414 0L12 13l-1.293 1.293a1 1 0 01-1.414 0L8 13.414a1 1 0 010-1.414L10.293 10l-2.293-2.293a1 1 0 011.414 0L12 9.414l1.293-1.293a1 1 0 011.414 0L17 10.414a1 1 0 010 1.414L14.707 13l2.293 2.293a1 1 0 010 1.414L15 18l1.293-1.293a1 1 0 011.414 0L20 18.414a1 1 0 010-1.414L17.707 15l2.293-2.293a1 1 0 010-1.414L18 10l-1.293 1.293a1 1 0 01-1.414 0L14 10.414a1 1 0 010-1.414l2.293-2.293a1 1 0 011.414 0L20 9.414a1 1 0 010 1.414L17.707 12z" /></svg>;