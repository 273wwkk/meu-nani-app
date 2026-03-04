"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, Clock, CheckCircle2, Truck, ExternalLink } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  cliente: string;
  email: string;
  total: number;
  status: string;
  data: string;
  itens: OrderItem[];
}

export default function CustomerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca os pedidos salvos no localStorage
    const savedOrders = localStorage.getItem("nani_orders");
    if (savedOrders) {
      const allOrders: Order[] = JSON.parse(savedOrders);
      
      // Se você tiver um sistema de login, filtraria aqui pelo email do user:
      // const userEmail = localStorage.getItem("user_email");
      // const userOrders = allOrders.filter(o => o.email === userEmail);
      
      setOrders(allOrders.reverse()); // Mostra os mais recentes primeiro
    }
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF9] p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 mb-8 text-gray-400 hover:text-[#9C7C50] transition-colors group"
        >
          <div className="p-2 rounded-full group-hover:bg-[#9C7C50]/10 transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="font-bold uppercase text-[10px] tracking-[0.2em]">Voltar</span>
        </button>

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="p-5 bg-white rounded-[2rem] text-[#9C7C50] shadow-sm border border-gray-100">
              <Package size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Meus Pedidos</h1>
              <p className="text-gray-400 text-sm font-medium">Histórico de compras na Nani Cosmético</p>
            </div>
          </div>
          
          <div className="bg-[#9C7C50]/10 px-6 py-3 rounded-2xl">
            <p className="text-[10px] font-black text-[#9C7C50] uppercase tracking-widest">Total de Pedidos</p>
            <p className="text-xl font-black text-[#9C7C50]">{orders.length}</p>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9C7C50]"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Cabeçalho do Card */}
                <div className="p-6 md:p-8 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 bg-gray-50/30">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">ID do Pedido</span>
                    <p className="font-bold text-gray-900">#{order.id}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Data da Compra</span>
                    <p className="font-bold text-gray-900">{order.data}</p>
                  </div>
                  <div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Total Pago</span>
                    <p className="text-lg font-black text-[#9C7C50]">AOA {order.total.toLocaleString()}</p>
                  </div>
                </div>

                {/* Itens do Pedido */}
                <div className="p-6 md:p-8">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Itens do Pacote</h4>
                  <div className="space-y-3">
                    {order.itens?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-lg text-[10px] font-black text-gray-500">
                            {item.quantity}x
                          </span>
                          <span className="font-bold text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-gray-400 font-medium">AOA {item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer do Card */}
                <div className="px-8 py-4 bg-gray-50/50 flex justify-end">
                   <button className="flex items-center gap-2 text-[10px] font-black text-[#9C7C50] uppercase tracking-tighter hover:bg-[#9C7C50] hover:text-white px-4 py-2 rounded-xl transition-all border border-[#9C7C50]/20">
                     <Clock size={14} /> Detalhes do Rastreio
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 border border-dashed border-gray-200 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-400 max-w-xs mx-auto mb-8 text-sm leading-relaxed">
              Parece que você ainda não realizou nenhuma compra. Explore nosso catálogo e encontre o produto ideal para você!
            </p>
            <button 
              onClick={() => router.push("/products")}
              className="bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#9C7C50] transition-all"
            >
              Ir para a Loja
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    "Pendente": { icon: <Clock size={12} />, style: "bg-orange-50 text-orange-600 border-orange-100" },
    "Enviado": { icon: <Truck size={12} />, style: "bg-blue-50 text-blue-600 border-blue-100" },
    "Concluído": { icon: <CheckCircle2 size={12} />, style: "bg-green-50 text-green-600 border-green-100" },
  };

  const config = configs[status] || configs["Pendente"];

  return (
    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${config.style}`}>
      {config.icon}
      <span className="text-[10px] font-black uppercase tracking-tighter">{status}</span>
    </div>
  );
}