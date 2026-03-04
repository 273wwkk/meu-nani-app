"use client";

import { LockIcon, Package2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const route = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] font-sans text-gray-800">
      <nav className="fixed top-0 w-full z-50 bg-[#9C7C50]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <h1 
          className="text-2xl sm:text-3xl font-serif font-bold tracking-tighter italic text-white"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          Nani Cosmético
        </h1>
        
        <button
          onClick={() => route.push("/auth/login")}
          className="group flex items-center gap-2 bg-white/10 hover:bg-white text-white hover:text-[#9C7C50] px-5 py-2 rounded-full border border-white/20 transition-all duration-300 font-bold text-sm uppercase tracking-widest"
        >
          <LockIcon size={16} />
          Login
        </button>
      </nav>

      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-[#9C7C50]/20 z-10" />
          
          {/* NOTA: Remova o ponto (.) do caminho da imagem: /assets e não ./assets */}
          <div 
            className="absolute inset-0 bg-cover bg-center animate-soft-zoom" 
            style={{ backgroundImage: "url('ola.png')" }} 
          />
        </div>

        {/* CORREÇÃO 1: Mudei z-20 para z-30 para ficar ACIMA do degradê */}
        <div className="relative z-30 container mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <Sparkles size={14} className="text-[#C5A267]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Premium Skincare</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-serif leading-[1.1] mb-8" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            <span className="block italic opacity-90">Beleza não é sorte,</span>
            <span className="block text-[#C5A267]">é cuidado.</span>
          </h1>

          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-lg md:text-2xl font-light tracking-wide text-gray-200">
              O seu novo rosto começa aqui.
            </p>
            <p className="mt-4 text-sm md:text-base font-medium text-gray-400 italic">
              "Você não é feia(o), só falta de cuidado"
            </p>
          </div>

          {/* O Link agora funcionará porque o container é z-30 */}
          <Link 
            href="/products" 
            className="inline-flex items-center gap-3 bg-[#9C7C50] text-white px-10 py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-[#866a43] transition-all cursor-pointer relative z-50"
          >
            <Package2 size={20} />
            Ver Produtos
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* CORREÇÃO 2: Adicionei pointer-events-none para o degradê não bloquear cliques */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[#FDFCFB] to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  );
}