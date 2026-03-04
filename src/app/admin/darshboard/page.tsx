"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Plus, Trash2, Edit, DollarSign, 
  PackageCheck, ArrowLeft, X, TrendingUp, 
  Users, ShoppingBag, ShoppingCart, 
  CheckCircle, Search, ExternalLink, MessageSquare, Send 
} from "lucide-react";
import Link from "next/link";
import { useProducts, Product } from "@/lib/ProductContext"; 

export default function AdminPage() {
  const { products, addProduct, deleteProduct, updateProduct } = useProducts(); 
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview"); 
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // ESTADOS PARA SUPORTE
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [adminReply, setAdminReply] = useState("");

  const [formData, setFormData] = useState({
    name: "", category: "skincare", price: 0, image: "", description: ""
  });

  // Carregar dados iniciais
  useEffect(() => {
    // 1. Carregar Pedidos
    const savedOrders = localStorage.getItem("nani_orders");
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    // 2. Carregar Tickets de Suporte
    const loadTickets = () => {
      const allKeys = Object.keys(localStorage);
      const supportKeys = allKeys.filter(key => key.startsWith("nani_support_"));
      const loadedTickets = supportKeys.map(key => JSON.parse(localStorage.getItem(key) || "{}"));
      // Ordenar por data mais recente
      setTickets(loadedTickets.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    loadTickets();
  }, [activeTab]);

  // Métricas do Dashboard
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalStockValue = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
  const uniqueCustomers = new Set(orders.map(o => o.email)).size;

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, { ...formData, price: Number(formData.price) });
    } else {
      addProduct({ ...formData, price: Number(formData.price), badge: "Novo" });
    }
    setShowModal(false);
    setFormData({ name: "", category: "skincare", price: 0, image: "", description: "" });
  };

  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReply.trim() || !selectedTicket) return;

    const newMessage = {
      role: "admin",
      text: adminReply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedTicket = {
      ...selectedTicket,
      lastMessage: adminReply,
      history: [...selectedTicket.history, newMessage]
    };

    // Salva para o cliente e para o admin
    localStorage.setItem(`nani_support_${selectedTicket.id}`, JSON.stringify(updatedTicket));
    
    // Atualiza a UI local
    setSelectedTicket(updatedTicket);
    setAdminReply("");
    
    // Atualiza a lista lateral de tickets
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-sans text-black">
      
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-72 bg-white border-r border-gray-100 p-8 hidden md:block sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white font-black text-xl">N</div>
          <h2 className="text-xl font-black tracking-tighter hidden lg:block uppercase text-gray-800">Nani Panel</h2>
        </div>
        
        <nav className="space-y-3">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab("overview")} icon={<LayoutDashboard size={20}/>} label="Dashboard" />
          <TabButton active={activeTab === 'inventory'} onClick={() => setActiveTab("inventory")} icon={<PackageCheck size={20}/>} label="Inventário" />
          <TabButton 
            active={activeTab === 'support'} 
            onClick={() => setActiveTab("support")} 
            icon={<MessageSquare size={20}/>} 
            label="Suporte" 
            badge={tickets.length > 0 ? tickets.length : undefined}
          />
          <Link href="/products" className="w-full flex items-center gap-4 p-4 rounded-2xl text-gray-400 hover:bg-gray-50 transition-all">
            <ExternalLink size={20} />
            <span className="font-bold text-[10px] uppercase tracking-widest hidden lg:block">Ver Loja</span>
          </Link>
        </nav>

        <button onClick={() => window.location.href = "/"} className="absolute bottom-8 left-8 right-8 flex items-center justify-center gap-3 bg-red-50 text-red-400 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all">
            Sair
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        
        {/* ABA: DASHBOARD */}
        {activeTab === "overview" && (
          <section className="animate-in fade-in duration-500">
            <header className="mb-10">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Visão Geral</h1>
              <p className="text-gray-400 font-medium mt-1">Status atual da Nani Cosmético.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard title="Receita Total" value={`AOA ${totalRevenue.toLocaleString()}`} icon={<DollarSign size={20}/>} color="gold" />
              <StatCard title="Vendas" value={orders.length.toString()} icon={<ShoppingBag size={20}/>} color="green" />
              <StatCard title="Clientes" value={uniqueCustomers.toString()} icon={<Users size={20}/>} color="blue" />
              <StatCard title="Suporte" value={tickets.length.toString()} icon={<MessageSquare size={20}/>} color="purple" />
            </div>

            <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
                <h3 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-8">Pedidos Recentes</h3>
                <div className="space-y-4">
                  {orders.length > 0 ? orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-3xl border border-transparent hover:border-[#9C7C50]/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-bold text-[#9C7C50]">#</div>
                        <div><p className="font-bold text-sm text-gray-900">{order.cliente}</p><p className="text-[10px] text-gray-400 font-bold uppercase">{order.data}</p></div>
                      </div>
                      <p className="font-black text-sm text-gray-900">AOA {order.total?.toLocaleString()}</p>
                    </div>
                  )) : <p className="text-center text-gray-400 py-10">Nenhum pedido efetuado.</p>}
                </div>
            </div>
          </section>
        )}

        {/* ABA: INVENTÁRIO */}
        {activeTab === "inventory" && (
          <section className="animate-in slide-in-from-bottom-4 duration-500">
            <header className="flex justify-between items-center mb-10">
              <div><h1 className="text-4xl font-black text-gray-900 tracking-tight">Inventário</h1><p className="text-gray-400 font-medium mt-1">{products.length} Produtos ativos.</p></div>
              <button onClick={() => { setEditingProduct(null); setShowModal(true); }} className="bg-[#9C7C50] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl hover:scale-105 transition-all">+ Adicionar Item</button>
            </header>

            <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
               <table className="w-full">
                  <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <tr><th className="p-8 text-left">Produto</th><th className="p-8 text-left">Preço</th><th className="p-8 text-center">Ações</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-all group">
                        <td className="p-8"><div className="flex items-center gap-5"><img src={p.image} className="w-14 h-14 rounded-2xl object-cover" alt="" /><div><p className="font-bold text-gray-900 text-sm">{p.name}</p></div></div></td>
                        <td className="p-8 font-black text-sm">AOA {p.price.toLocaleString()}</td>
                        <td className="p-8"><div className="flex justify-center gap-3">
                            <button onClick={() => { setEditingProduct(p); setFormData(p); setShowModal(true); }} className="p-3 text-gray-300 hover:text-[#9C7C50] transition-colors"><Edit size={18}/></button>
                            <button onClick={() => deleteProduct(p.id)} className="p-3 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </section>
        )}

        {/* ABA: SUPORTE (ATUALIZADA) */}
        {activeTab === "support" && (
          <section className="animate-in fade-in duration-500 h-full">
            <header className="mb-10">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Suporte</h1>
              <p className="text-gray-400 font-medium mt-1">Converse com suas clientes em tempo real.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
              {/* Lista de Tickets */}
              <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden flex flex-col shadow-sm">
                <div className="p-6 border-b border-gray-50 font-black text-[10px] uppercase tracking-widest text-gray-400">Conversas</div>
                <div className="flex-1 overflow-y-auto">
                  {tickets.map((t, idx) => (
                    <button key={idx} onClick={() => setSelectedTicket(t)} className={`w-full p-6 border-b border-gray-50 flex items-center gap-4 hover:bg-gray-50 transition-all ${selectedTicket?.id === t.id ? 'bg-[#9C7C50]/5 border-r-4 border-r-[#9C7C50]' : ''}`}>
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-[#9C7C50]">{t.userName?.charAt(0)}</div>
                      <div className="text-left flex-1"><p className="font-bold text-sm text-gray-900">{t.userName}</p><p className="text-[10px] text-gray-400 truncate w-32">{t.lastMessage}</p></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Aberto */}
              <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 flex flex-col shadow-sm overflow-hidden">
                {selectedTicket ? (
                  <>
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#9C7C50] text-white rounded-xl flex items-center justify-center font-black">{selectedTicket.userName.charAt(0)}</div>
                        <h4 className="font-black text-sm uppercase tracking-widest">{selectedTicket.userName}</h4>
                      </div>
                      <button onClick={() => { localStorage.removeItem(`nani_support_${selectedTicket.id}`); setSelectedTicket(null); setActiveTab("overview"); }} className="text-[9px] font-black text-red-400 uppercase tracking-widest">Encerrar Ticket</button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-[#FDFBF9]">
                      {selectedTicket.history.map((msg: any, i: number) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[70%] p-4 rounded-3xl text-xs font-medium shadow-sm ${msg.role === 'user' ? 'bg-white text-gray-800' : 'bg-[#9C7C50] text-white'}`}>
                            {msg.text}
                            <p className="text-[8px] mt-1 opacity-50">{msg.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendAdminReply} className="p-6 border-t border-gray-50 flex gap-4 bg-white">
                      <input type="text" value={adminReply} onChange={(e) => setAdminReply(e.target.value)} placeholder="Escreva a resposta..." className="flex-1 bg-gray-50 rounded-2xl px-6 py-4 text-xs outline-none focus:ring-2 focus:ring-[#9C7C50]/20 transition-all" />
                      <button type="submit" className="bg-black text-white p-4 rounded-2xl hover:bg-[#9C7C50] transition-all"><Send size={20} /></button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-4">
                    <MessageSquare size={48} strokeWidth={1} />
                    <p className="font-black text-[10px] uppercase tracking-[0.2em]">Selecione uma conversa</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* MODAL PRODUTO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-10 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{editingProduct ? "Editar Produto" : "Novo Produto"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400"><X /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nome</label><input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase ml-1">Preço (AOA)</label><input required type="number" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase ml-1">Categoria</label><select className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}><option value="skincare">Skincare</option><option value="makeup">Maquilhagem</option></select></div>
              </div>
              <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase ml-1">Imagem URL</label><input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} /></div>
              <button type="submit" className="w-full bg-[#9C7C50] text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.01] transition-all">{editingProduct ? "Salvar Alterações" : "Publicar Produto"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Componentes Auxiliares
function TabButton({ active, onClick, icon, label, badge }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${active ? 'bg-[#9C7C50] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>
      <div className="flex items-center gap-4">{icon}<span className="font-bold text-[10px] uppercase tracking-widest hidden lg:block">{label}</span></div>
      {badge && <span className="bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-full">{badge}</span>}
    </button>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colors: any = { gold: "text-[#9C7C50] bg-[#9C7C50]/10", green: "text-green-600 bg-green-50", blue: "text-blue-600 bg-blue-50", purple: "text-purple-600 bg-purple-50" };
  return (
    <div className="bg-white p-7 rounded-[40px] border border-gray-50 shadow-sm">
      <div className={`p-4 rounded-2xl w-fit mb-5 ${colors[color]}`}>{icon}</div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
    </div>
  );
}