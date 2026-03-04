"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Bell, Eye, EyeOff, Smartphone } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-[#FDFBF9] p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 mb-8 text-gray-400 hover:text-black transition-all">
          <ArrowLeft size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">Voltar</span>
        </button>

        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-10">Configurações</h1>

        <div className="space-y-6">
          {/* Segurança */}
          <section className="bg-white rounded-[35px] p-8 shadow-sm border border-gray-50">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Shield size={20} /></div>
              <h3 className="font-black text-sm uppercase tracking-widest">Segurança da Conta</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800 text-sm">Palavra-passe</p>
                  <p className="text-xs text-gray-400">Alterada há 3 meses</p>
                </div>
                <button className="text-[10px] font-black uppercase text-[#9C7C50] hover:underline">Alterar</button>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div>
                  <p className="font-bold text-gray-800 text-sm">Autenticação em Dois Passos</p>
                  <p className="text-xs text-gray-400">Proteja a sua conta com SMS</p>
                </div>
                <div className="w-12 h-6 bg-gray-100 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Notificações */}
          <section className="bg-white rounded-[35px] p-8 shadow-sm border border-gray-50">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><Bell size={20} /></div>
              <h3 className="font-black text-sm uppercase tracking-widest">Notificações</h3>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800 text-sm">Alertas de Promoções</p>
                <p className="text-xs text-gray-400">Receba novidades e descontos exclusivos</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full relative transition-all ${notifications ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </section>

          {/* Perigo */}
          <div className="pt-10 text-center">
            <button className="text-[10px] font-black uppercase text-red-300 hover:text-red-500 transition-colors tracking-[0.2em]">
              Eliminar Permanentemente a minha conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}