"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, MapPin, Settings, LogOut, ArrowLeft, Heart, Check, X, Camera } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { MenuButton } from "@/components/ui/profile-menu-button";
import { FloatingSupport } from "@/components/FloatingSupport"; // O novo botão de suporte

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // Sincroniza o formulário com os dados do usuário ao carregar
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    try {
      if (updateUser) {
        await updateUser(formData);
        setIsEditing(false);
      } else {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem("nani_user", JSON.stringify(updatedUser));
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans text-black">
      {/* Header Fixo */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">Painel do Cliente</h1>
          <button 
            onClick={() => { logout(); router.push("/"); }} 
            className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-10 pb-32">
        {/* Card de Identidade */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-50 flex flex-col md:flex-row items-center gap-8 mb-10 transition-all">
          
          <div className="relative">
            <div className="w-28 h-28 bg-[#9C7C50] rounded-full flex items-center justify-center text-white text-4xl font-black shadow-xl ring-4 ring-[#9C7C50]/10">
              {formData.name.charAt(0).toUpperCase()}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full border-2 border-white cursor-pointer hover:bg-[#9C7C50] transition-colors">
                <Camera size={14} />
                <input type="file" className="hidden" accept="image/*" />
              </label>
            )}
          </div>

          <div className="text-center md:text-left flex-1 space-y-2">
            {isEditing ? (
              <div className="space-y-3">
                <input 
                  type="text" 
                  className="w-full md:w-80 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 font-bold outline-none focus:ring-2 focus:ring-[#9C7C50]/20 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Seu nome"
                />
                <input 
                  type="email" 
                  className="w-full md:w-80 block bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#9C7C50]/20 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Seu email"
                />
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{user.name}</h2>
                <p className="text-gray-400 font-medium tracking-wide italic">{user.email}</p>
              </>
            )}
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-4 bg-gray-100 text-gray-400 rounded-2xl hover:bg-gray-200 transition-all"
                >
                  <X size={20} />
                </button>
                <button 
                  onClick={handleSave}
                  className="bg-[#9C7C50] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#9C7C50]/20 flex items-center gap-3 active:scale-95 transition-all"
                >
                  <Check size={16} /> Gravar Alterações
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#9C7C50] transition-all shadow-xl shadow-black/10"
              >
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Menu e Fidelidade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4 mb-6">Explorar</h3>
            <MenuButton 
              icon={<Package size={18} />} 
              label="Histórico de Pedidos" 
              onClick={() => router.push("/profile/orders")} 
            />
            <MenuButton 
              icon={<Heart size={18} />} 
              label="Meus Favoritos" 
              onClick={() => router.push("/profile/wishlist")} 
            />
            <MenuButton 
              icon={<MapPin size={18} />} 
              label="Moradas de Entrega" 
              onClick={() => router.push("/profile/addresses")} 
            />
            <MenuButton 
              icon={<Settings size={18} />} 
              label="Segurança e Acesso" 
              onClick={() => router.push("/profile/settings")} 
            />
          </div>
          
          <div className="bg-[#9C7C50] rounded-32px p-8 text-white shadow-2xl shadow-[#9C7C50]/20 relative overflow-hidden group h-full">
            <div className="relative z-10 h-full flex flex-col">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Nani Club</h3>
              <p className="text-2xl font-black mb-4">450 Pontos Disponíveis</p>
              <p className="text-xs text-white/80 leading-relaxed mb-auto pb-8">
                A sua próxima fragrância pode sair grátis. Continue a colecionar momentos Nani.
              </p>
              <button className="w-fit bg-white text-[#9C7C50] px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                Trocar por Ofertas
              </button>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Package size={160} />
            </div>
          </div>
        </div>
      </main>

      {/* Botão de Suporte Interno Flutuante */}
      <FloatingSupport />
    </div>
  );
}