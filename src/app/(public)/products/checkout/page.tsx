"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthProvider";
import { ArrowLeft, CreditCard, MapPin, CheckCircle, ShoppingBag, Home, Copy, Check } from "lucide-react";

const PROVINCIAS_ANGOLA = [
  "Luanda", "Bengo", "Benguela", "Bié", "Cabinda", "Cunene", "Huambo", 
  "Huíla", "Kuando Kubango", "Kwanza Norte", "Kwanza Sul", "Lunda Norte", 
  "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uíge", "Zaire"
];

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  // ESTADOS (Agora corretamente dentro do componente)
  const [metodoPagamento, setMetodoPagamento] = useState("referencia");
  const [isFinished, setIsFinished] = useState(false);
  const [orderID, setOrderID] = useState("");
  const [referenciaData, setReferenciaData] = useState<{ref: string, entidade: string} | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0); // Estado para fixar o valor no sucesso

  const [formData, setFormData] = useState({
    provincia: "Luanda",
    municipio: "",
    telefone: ""
  });

  // Cálculo do total atual do carrinho
  const totalGeral = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Carregar endereços salvos do Perfil
  useEffect(() => {
    const saved = localStorage.getItem("nani_addresses");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedAddresses(parsed);
      if (parsed.length > 0) {
        setFormData({
          provincia: parsed[0].city || "Luanda",
          municipio: parsed[0].street,
          telefone: parsed[0].phone
        });
      }
    }
  }, []);

  // Proteger rota de checkout
  useEffect(() => {
    if (!user) {
      const currentPath = window.location.pathname;
      router.push(`/auth/login?returnTo=${currentPath}`);
    }
  }, [user, router]);

  const gerarReferencia = () => {
    const ref = Math.floor(Math.random() * 899999999 + 100000000).toString();
    return { ref, entidade: "00542" };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinalizarPedido = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Captura o valor e o nome ANTES de limpar o carrinho
    const valorDaCompra = totalGeral;
    setFinalTotal(valorDaCompra);

    const newOrderID = `NANI-${Math.floor(Math.random() * 90000) + 10000}`;
    
    const dadosPagamento = metodoPagamento === "referencia" ? gerarReferencia() : null;
    if (dadosPagamento) setReferenciaData(dadosPagamento);

    const novoPedido = {
      id: newOrderID,
      cliente: user?.name,
      email: user?.email,
      telefone: formData.telefone,
      localidade: `${formData.provincia}, ${formData.municipio}`,
      itens: [...cart],
      total: valorDaCompra,
      status: "Pendente",
      data: new Date().toLocaleDateString('pt-PT'),
      metodo: metodoPagamento,
      pagamento: dadosPagamento
    };

    const pedidosExistentes = JSON.parse(localStorage.getItem("nani_orders") || "[]");
    localStorage.setItem("nani_orders", JSON.stringify([novoPedido, ...pedidosExistentes]));

    setOrderID(newOrderID);
    setIsFinished(true);
    
    // Pequeno delay para garantir que o estado finalTotal foi processado antes de esvaziar
    setTimeout(() => clearCart(), 100);
  };

  if (!user) return <div className="min-h-screen bg-white" />;

  // TELA DE SUCESSO
  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          {user.name.split(' ')[0]}, pedido recebido!
        </h1>
        <p className="text-gray-500 mb-8 font-medium">ID do Pedido: <span className="text-black font-bold">#{orderID}</span></p>

        {referenciaData && (
          <div className="w-full max-w-sm bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm mb-8">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Logo_Multicaixa.svg/1200px-Logo_Multicaixa.svg.png" alt="MC" className="h-5 mx-auto mb-6 opacity-70" />
            
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-gray-400">Entidade</span>
                <span className="font-black text-gray-900">{referenciaData.entidade}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-gray-400">Referência</span>
                <div className="flex items-center gap-2">
                  <span className="font-black text-gray-900 tracking-wider">{referenciaData.ref}</span>
                  <button onClick={() => copyToClipboard(referenciaData.ref)} className="text-[#9C7C50]">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center bg-[#9C7C50]/10 p-5 rounded-2xl border border-[#9C7C50]/20">
                <span className="text-[10px] font-black uppercase text-[#9C7C50]">Valor Total</span>
                <span className="font-black text-[#9C7C50] text-xl">AOA {finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Link href="/profile/orders" className="bg-black text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#9C7C50] transition-all">Ver Meus Pedidos</Link>
          <Link href="/products" className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Voltar à Loja</Link>
        </div>
      </div>
    );
  }

  // TELA DE FORMULÁRIO (CHECKOUT)
  return (
    <div className="min-h-screen bg-[#FDFBF9] pb-20">
      <header className="p-6 max-w-5xl mx-auto flex items-center justify-between">
        <button onClick={() => router.back()} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-50"><ArrowLeft size={18} /></button>
        <h1 className="text-sm font-black uppercase tracking-[0.3em]">Finalizar Compra</h1>
        <div className="w-10"></div>
      </header>

      <main className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <form onSubmit={handleFinalizarPedido} className="space-y-8">
          
          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <MapPin className="text-[#9C7C50]" /> Entrega
            </h2>
            
            {savedAddresses.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Endereços Salvos</p>
                {savedAddresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => setFormData({ provincia: addr.city, municipio: addr.street, telefone: addr.phone })}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${formData.municipio === addr.street ? 'border-[#9C7C50] bg-[#9C7C50]/5' : 'bg-white border-gray-100'}`}
                  >
                    <div className={`p-3 rounded-xl ${formData.municipio === addr.street ? 'bg-[#9C7C50] text-white' : 'bg-gray-50 text-gray-400'}`}><Home size={16} /></div>
                    <div>
                      <p className="text-xs font-black text-gray-900">{addr.label}</p>
                      <p className="text-[10px] text-gray-400">{addr.street}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white p-8 rounded-[35px] border border-gray-100 space-y-4 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Província</label>
                    <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={formData.provincia} onChange={(e) => setFormData({...formData, provincia: e.target.value})}>
                      {PROVINCIAS_ANGOLA.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Município</label>
                    <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={formData.municipio} onChange={(e) => setFormData({...formData, municipio: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Telemóvel</label>
                  <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} />
                </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <CreditCard className="text-[#9C7C50]" /> Pagamento
            </h2>
            <div className="grid gap-3">
              <button type="button" onClick={() => setMetodoPagamento("referencia")} className={`w-full p-6 rounded-[2rem] border text-left transition-all ${metodoPagamento === "referencia" ? 'border-[#9C7C50] bg-[#9C7C50]/5' : 'bg-white border-gray-50'}`}>
                <p className="text-sm font-black text-gray-900">Referência Multicaixa</p>
                <p className="text-[10px] text-gray-400 font-medium">Pague via ATM ou Express</p>
              </button>
              <button type="button" onClick={() => setMetodoPagamento("entrega")} className={`w-full p-6 rounded-[2rem] border text-left transition-all ${metodoPagamento === "entrega" ? 'border-[#9C7C50] bg-[#9C7C50]/5' : 'bg-white border-gray-50'}`}>
                <p className="text-sm font-black text-gray-900">Pagar na Entrega</p>
                <p className="text-[10px] text-gray-400 font-medium">TPA ou Numerário</p>
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#9C7C50] text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-[#9C7C50]/30 active:scale-95 transition-all">
            Finalizar • AOA {totalGeral.toLocaleString()}
          </button>
        </form>

        <aside className="h-fit sticky top-10">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">Itens</h3>
            <div className="space-y-6 mb-8 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-800">{item.quantity}x {item.name}</span>
                  <span className="font-black">AOA {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-6 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-gray-400">Total</span>
              <span className="text-2xl font-black text-[#9C7C50]">AOA {totalGeral.toLocaleString()}</span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}