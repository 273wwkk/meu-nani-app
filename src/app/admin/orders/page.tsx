"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, ShoppingBag, CheckCircle2, Clock, 
  Truck, Search, Eye, Trash2 
} from "lucide-react";
import Link from "next/link";

// Definição da Interface do Pedido (conforme salvamos no Checkout)
interface Order {
  id: string;
  cliente: string;
  email: string;
  telefone: string;
  localidade: string;
  total: number;
  status: string;
  data: string;
  metodo: string;
  itens: any[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // BUSCAR PEDIDOS REAIS DO LOCALSTORAGE
  useEffect(() => {
    const loadOrders = () => {
      const savedOrders = localStorage.getItem("nani_orders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    };

    loadOrders();
    // Opcional: Escutar mudanças no storage (caso mude noutra aba)
    window.addEventListener('storage', loadOrders);
    return () => window.removeEventListener('storage', loadOrders);
  }, []);

  // FILTRAGEM DINÂMICA
  const filteredOrders = orders.filter(order => 
    order.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ESTATÍSTICAS REAIS
  const stats = {
    pendentes: orders.filter(o => o.status === "Pendente").length,
    concluidos: orders.filter(o => o.status === "Concluído" || o.status === "entregue").length,
    totalVendas: orders.reduce((acc, curr) => acc + curr.total, 0)
  };

  const deleteOrder = (id: string) => {
    if(confirm("Deseja eliminar este registo de pedido?")) {
      const updated = orders.filter(o => o.id !== id);
      setOrders(updated);
      localStorage.setItem("nani_orders", JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-sans text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 p-6 hidden md:block">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-[#9C7C50] rounded-lg rotate-3"></div>
          <h2 className="text-xl font-black italic text-gray-800">Nani Panel</h2>
        </div>
        <nav className="space-y-4">
          <Link href="/darshboard" className="flex items-center gap-3 text-gray-400 p-3 rounded-2xl hover:bg-gray-50 transition-all">
            <span className="font-bold text-sm uppercase tracking-wider">Geral</span>
          </Link>
          <div className="flex items-center gap-3 bg-[#9C7C50]/10 text-[#9C7C50] p-3 rounded-2xl">
            <ShoppingBag size={20} />
            <span className="font-bold text-sm uppercase tracking-wider">Pedidos</span>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestão de Pedidos</h1>
            <p className="text-gray-400 text-sm font-medium">Você tem {stats.pendentes} pedidos aguardando atenção.</p>
          </div>
          <Link href="/darshboard" className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-2xl font-bold text-xs uppercase hover:bg-gray-50 transition-all shadow-sm">
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </header>

        {/* Estatísticas Dinâmicas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-4xl border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Clock size={24}/></div>
            <div>
              <p className="text-2xl font-black">{stats.pendentes}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase">Pendentes</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-4xl border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-[#9C7C50]/10 text-[#9C7C50] rounded-2xl"><ShoppingBag size={24}/></div>
            <div>
              <p className="text-2xl font-black">AOA {stats.totalVendas.toLocaleString()}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase">Volume Total</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-4xl border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><CheckCircle2 size={24}/></div>
            <div>
              <p className="text-2xl font-black">{stats.concluidos}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase">Concluídos</p>
            </div>
          </div>
        </div>

        {/* Tabela de Pedidos Dinâmica */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Procurar por ID ou Nome do Cliente..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#9C7C50]/20 transition-all" 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pedido</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente / Contacto</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Localização</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-6">
                        <span className="font-bold text-sm text-[#9C7C50]">{order.id}</span>
                        <p className="text-[9px] font-black text-gray-300 uppercase mt-1">{order.data}</p>
                      </td>
                      <td className="p-6">
                        <p className="text-sm font-bold text-gray-800">{order.cliente}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{order.telefone}</p>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-1">
                          <StatusBadge status={order.status} />
                          <span className="text-[10px] text-gray-500 font-medium truncate max-w-[150px]">{order.localidade}</span>
                        </div>
                      </td>
                      <td className="p-6 text-right font-black text-sm text-gray-900">
                        AOA {order.total.toLocaleString()}
                      </td>
                      <td className="p-6">
                        <div className="flex justify-center gap-2">
                          <button 
                            title="Ver Detalhes"
                            className="p-2 bg-gray-50 text-gray-400 hover:text-[#9C7C50] hover:bg-[#9C7C50]/10 rounded-xl transition-all"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => deleteOrder(order.id)}
                            className="p-2 bg-gray-50 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    entregue: "bg-green-100 text-green-600",
    Pendente: "bg-orange-100 text-orange-600",
    processando: "bg-blue-100 text-blue-600",
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter ${styles[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}