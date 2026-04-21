import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to zFourCollections. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // System instructions for a luxury girls' clothing boutique
      const systemPrompt = `You are the AI Customer Assistant for "zFourCollections", a premium luxury boutique specializing in Girls' Clothing. 
      Your tone is sophisticated, helpful, and high-end. 
      Keep replies concise (under 3 sentences unless asked for details).
      You know about:
      - Latest trends in girls' ethnic and modern wear.
      - Boutique quality and craftsmanship.
      - Shipping within 3-5 days.
      - Customer satisfaction is top priority.
      If asked something unrelated to the store or fashion, politely redirect back to your boutique services.`;

      // Get entire chat history for context
      const chatHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...chatHistory,
          { role: 'user', parts: [{ text: userText }] }
        ],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      const botText = response.text || "I'm sorry, I couldn't process that. How else can I help?";

      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having a slight technical issue, but I'm here for you! Please ask again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mb-4 w-[90vw] sm:w-[350px] h-[450px] bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-pink-100"
          >
            {/* Header */}
            <div className="rose-gradient p-6 text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-white shadow-md">
                  <span className="text-primary font-serif italic font-black text-xl">Z</span>
                  <span className="text-accent font-serif italic font-black text-xl -ml-1">F</span>
                </div>
                <div>
                  <h3 className="font-serif font-black tracking-tight text-white leading-none">zFour ChatBot</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Always Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-all text-white flex items-center justify-center group"
                title="Minimize"
              >
                <Minus size={22} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-gray-50/30">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.sender === 'user' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "px-4 py-3 rounded-[1.5rem] text-sm leading-relaxed",
                    msg.sender === 'user' 
                      ? "bg-primary text-white rounded-br-none shadow-md shadow-primary/20" 
                      : "bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight mx-2">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-gray-400"
                >
                  <div className="bg-white p-3 rounded-[1.5rem] rounded-bl-none shadow-sm border border-gray-100 flex gap-1">
                    <motion.span 
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                      className="w-1.5 h-1.5 bg-accent rounded-full"
                    />
                    <motion.span 
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-1.5 h-1.5 bg-accent rounded-full"
                    />
                    <motion.span 
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-1.5 h-1.5 bg-accent rounded-full"
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form 
                onSubmit={handleSendMessage}
                className="relative flex items-center"
              >
                <input 
                  type="text" 
                  autoFocus
                  placeholder={isTyping ? "Gemini is thinking..." : "Ask about girls' clothing..."}
                  disabled={isTyping}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-accent/30 rounded-2xl py-4 pl-6 pr-14 text-sm font-medium transition-all outline-none disabled:opacity-50"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 p-2.5 bg-accent text-white rounded-xl hover:bg-primary transition-all flex items-center justify-center shadow-lg"
                >
                  {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
              <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-3">
                Powered by Gemini AI • zFour Boutique
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 relative",
          isOpen ? "bg-white text-primary" : "rose-gradient text-white"
        )}
      >
        <MessageCircle size={28} strokeWidth={2.5} className={cn("transition-transform duration-500", isOpen && "rotate-12 scale-110")} />
        
        {/* Notification Badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
            1
          </span>
        )}
      </motion.button>
    </div>
  );
}
