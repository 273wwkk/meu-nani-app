"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Plus, Trash2, Home, Briefcase } from "lucide-react";

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "Casa", street: "", city: "Luanda", phone: "" });

  useEffect(() => {
    const saved = localStorage.getItem("nani_addresses");
    if (saved) setAddresses(JSON.parse(saved));
  }, []);

  const saveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...addresses, { ...newAddr, id: Date.now() }];
    setAddresses(updated);
    localStorage.setItem("nani_addresses", JSON.stringify(updated));
    setShowAdd(false);
    setNewAddr({ label: "Casa", street: "", city: "Luanda", phone: "" });
  };

  const deleteAddress = (id: number) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem("nani_addresses", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 mb-8 text-gray-400 hover:text-black transition-all">
          <ArrowLeft size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">Voltar</span>
        </button>

        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Endereços</h1>
            <p className="text-gray-400 text-sm">Onde devemos entregar as suas encomendas?</p>
          </div>
          <button 
            onClick={() => setShowAdd(true)}
            className="p-4 bg-black text-white rounded-2xl hover:bg-[#9C7C50] transition-all"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="grid gap-4">
          {addresses.length > 0 ? addresses.map((addr) => (
            <div key={addr.id} className="bg-white p-6 rounded-[30px] border border-gray-100 flex items-center justify-between group shadow-sm">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-gray-50 rounded-2xl text-[#9C7C50]">
                  {addr.label === "Casa" ? <Home size={20} /> : <Briefcase size={20} />}
                </div>
                <div>
                  <p className="font-black text-sm text-gray-900">{addr.label}</p>
                  <p className="text-xs text-gray-400 font-medium">{addr.street}, {addr.city}</p>
                  <p className="text-[10px] text-gray-300 font-bold mt-1 uppercase">{addr.phone}</p>
                </div>
              </div>
              <button onClick={() => deleteAddress(addr.id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <Trash2 size={18} />
              </button>
            </div>
          )) : (
            <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
               <MapPin size={40} className="mx-auto text-gray-200 mb-4" />
               <p className="text-gray-400 font-medium italic">Nenhum endereço salvo.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Simples para Adicionar */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={saveAddress} className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-xl font-black mb-6">Novo Endereço</h2>
            <div className="space-y-4">
              <input required placeholder="Nome (Ex: Casa, Trabalho)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={newAddr.label} onChange={e => setNewAddr({...newAddr, label: e.target.value})} />
              <input required placeholder="Rua e Número da Casa" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} />
              <input required placeholder="Telefone de Contacto" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={newAddr.phone} onChange={e => setNewAddr({...newAddr, phone: e.target.value})} />
              <button className="w-full py-4 bg-[#9C7C50] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Salvar Localização</button>
              <button type="button" onClick={() => setShowAdd(false)} className="w-full py-4 text-gray-400 font-bold text-[10px] uppercase">Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}