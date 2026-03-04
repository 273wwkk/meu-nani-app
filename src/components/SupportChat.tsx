"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";

export function SupportChat() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, text: string, time: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. SINCRONIZAÇÃO EM TEMPO REAL
  useEffect(() => {
    // Tenta extrair o ID de qualquer propriedade possível
    const userId = (user as any)?.id || (user as any)?.uid || (user as any)?._id;
    
    if (!userId) {
      console.log("Aguardando ID do utilizador...");
      return;
    }

    const syncMessages = () => {
      const storageKey = `nani_support_${userId}`;
      const savedData = localStorage.getItem(storageKey);
      
      if (savedData) {
        try {
          const ticket = JSON.parse(savedData);
          // Só atualiza se o histórico mudou de tamanho ou conteúdo
          if (ticket.history && JSON.stringify(ticket.history) !== JSON.stringify(chatHistory)) {
            setChatHistory(ticket.history);
          }
        } catch (e) {
          console.error("Erro ao ler JSON do localStorage", e);
        }
      }
    };

    const interval = setInterval(syncMessages, 1000);
    return () => clearInterval(interval);
  }, [user, chatHistory]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // 2. FUNÇÃO DE ENVIO
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug: ver o que temos no clique
    const userId = (user as any)?.id || (user as any)?.uid || (user as any)?._id;
    
    if (!userId) {
      alert("Erro: Utilizador não identificado. Verifique se fez login.");
      return;
    }

    if (!message.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const storageKey = `nani_support_${userId}`;
    
    const newMessage = {
      role: "user",
      text: message.trim(),
      time: timestamp
    };

    // Pegar dados atuais ou criar novo ticket
    const savedData = localStorage.getItem(storageKey);
    let ticketData;

    try {
      if (savedData) {
        ticketData = JSON.parse(savedData);
      } else {
        ticketData = {
          id: userId,
          userName: user?.name || "Cliente",
          email: user?.email || "Sem email",
          history: [],
          date: new Date().toISOString()
        };
      }

      // Adicionar mensagem e salvar
      ticketData.history = [...(ticketData.history || []), newMessage];
      ticketData.lastMessage = newMessage.text;
      ticketData.date = new Date().toISOString();

      localStorage.setItem(storageKey, JSON.stringify(ticketData));
      
      // Atualizar interface
      setChatHistory(ticketData.history);
      setMessage("");
      console.log("Mensagem salva no localStorage sob a chave:", storageKey);

    } catch (error) {
      console.error("Erro crítico ao enviar mensagem:", error);
    }
  };

  if (!user) return (
    <div className="w-80 bg-white p-8 text-center rounded-[32px] shadow-2xl border border-gray-100">
      <p className="text-[10px] font-black uppercase text-gray-400">Inicie sessão para suporte</p>
    </div>
  );

  return (
    <div className="w-80 md:w-96 bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[450px]">
      <div className="bg-black p-5 text-white flex items-center gap-3">
        <div className="w-8 h-8 bg-[#9C7C50] rounded-full flex items-center justify-center font-black">N</div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest">Suporte Nani</p>
          <p className="text-[8px] text-green-400 font-bold uppercase">Online</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FDFBF9]">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-[11px] font-medium shadow-sm ${
              msg.role === 'user' ? 'bg-[#9C7C50] text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-50 flex gap-2">
        <input 
          className="flex-1 bg-gray-50 rounded-xl px-4 py-2 text-[11px] outline-none border border-transparent focus:border-[#9C7C50]/20"
          placeholder="Mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="bg-black text-white p-2 rounded-xl hover:bg-[#9C7C50]">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}