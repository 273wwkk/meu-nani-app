"use client";

import React, { useState } from "react";
import { MessageSquare, X, Headset, Send } from "lucide-react";
import { SupportChat } from "./SupportChat"; // Importa o chat interno que criamos

export function FloatingSupport() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4">
      
      {/* O Chat Interno que abre ao clicar */}
      {showChat && (
        <div className="animate-in slide-in-from-bottom-10 fade-in duration-300">
           <SupportChat />
           {/* Botão para fechar o chat por cima dele, se necessário */}
           <button 
             onClick={() => setShowChat(false)}
             className="absolute -top-2 -right-2 bg-black text-white p-1 rounded-full border-2 border-white shadow-lg"
           >
             <X size={14} />
           </button>
        </div>
      )}

      {/* Botão Flutuante Estilizado */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="group relative flex items-center justify-center w-16 h-16 bg-black text-white rounded-[24px] shadow-2xl hover:bg-[#9C7C50] transition-all duration-500 hover:scale-110 active:scale-95"
        >
          {/* Badge de Notificação Simbolizando que o Suporte está Ativo */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#FDFBF9] rounded-full animate-pulse"></div>
          
          <div className="relative">
            <Headset size={28} className="group-hover:rotate-12 transition-transform duration-300" />
          </div>

          {/* Tooltip Lateral que aparece no Hover */}
          <span className="absolute right-20 bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
            Falar com a Nani
          </span>
        </button>
      )}
    </div>
  );
}