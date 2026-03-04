"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, ArrowRight, UserCircle } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de credenciais administrativas
    if (email === "admin@nanicosmetico.com" && password === "admin123") {
      // Aqui você poderia salvar um token ou estado de admin
      router.push("/darshboard"); 
    } else {
      setError("Acesso negado. Credenciais administrativas inválidas.");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo / Título */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#9C7C50]/10 rounded-3xl mb-4 border border-[#9C7C50]/20">
            <ShieldCheck size={40} className="text-[#9C7C50]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Painel de Controlo</h1>
          <p className="text-gray-500 text-xs font-bold tracking-[0.2em] mt-2 italic">NANI COSMÉTICO ADMIN</p>
        </div>

        {/* Card de Login */}
        <div className="bg-[#1A1A1A] p-10 rounded-[40px] border border-white/5 shadow-2xl">
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#9C7C50] uppercase ml-1 tracking-widest">Utilizador Admin</label>
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:ring-2 focus:ring-[#9C7C50]/50 outline-none transition-all"
                  placeholder="admin@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#9C7C50] uppercase ml-1 tracking-widest">Chave de Segurança</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:ring-2 focus:ring-[#9C7C50]/50 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                <p className="text-red-500 text-[10px] font-bold text-center uppercase">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-[#9C7C50] hover:bg-[#866a43] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-[#9C7C50]/10"
            >
              Autenticar Sistema
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <button 
            onClick={() => router.push("/products")}
            className="text-gray-600 hover:text-gray-400 text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            Voltar para o Terminal de Vendas
          </button>
        </div>
      </div>
    </div>
  );
}