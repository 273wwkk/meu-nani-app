"use client";

import { useParams, useRouter } from "next/navigation";
import { useProducts } from "@/lib/ProductContext";
import { useCart } from "@/lib/CartContext"; 
import { useAuth } from "@/lib/AuthProvider"; 
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, Star } from "lucide-react";
import { FloatingCart } from "@/components/FloatingCart";

export default function ProductDetails() {
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  // Encontrar o produto pelo ID
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Produto não encontrado</h2>
          <button onClick={() => router.push("/")} className="text-[#9C7C50] font-bold uppercase text-xs tracking-widest underline">
            Voltar para a loja
          </button>
        </div>
      </div>
    );
  }

  // FUNÇÃO: ADICIONAR AO CARRINHO
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  // FUNÇÃO: COMPRAR AGORA
  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });

    if (!user) {
      // Redireciona para login e depois volta para o carrinho
      router.push("/auth/login?returnTo=/products/carrinho");
    } else {
      router.push("/products/carrinho");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans relative">
      {/* Carrinho flutuante que aparece ao adicionar itens */}
      <FloatingCart />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Botão de Voltar */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 mb-10 text-gray-400 hover:text-black transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-bold uppercase text-[10px] tracking-widest">Voltar à Loja</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Coluna da Imagem */}
          <div className="bg-[#F8F8F8] rounded-[40px] lg:rounded-[60px] overflow-hidden flex items-center justify-center p-8 lg:p-12 border border-gray-50 shadow-inner">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto max-h-[550px] object-contain hover:scale-110 transition-transform duration-700" 
            />
          </div>

          {/* Coluna de Informações */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[#9C7C50] font-black text-[10px] uppercase tracking-[0.3em] bg-[#9C7C50]/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.badge && (
                <span className="bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                  {product.badge}
                </span>
              )}
            </div>

            <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tighter">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-3 mb-8">
               <div className="flex text-[#C5A267]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} className={i < 4 ? "" : "text-gray-200"} />
                  ))}
               </div>
               <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">(4.9 Estrelas)</span>
            </div>

            <p className="text-4xl font-black text-gray-800 mb-10">
              AOA {product.price.toLocaleString()}
            </p>
            
            {/* Descrição Dinâmica */}
            <div className="space-y-4 mb-12">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sobre o produto</h3>
              <div className="prose prose-sm text-gray-500 leading-relaxed border-l-2 border-[#9C7C50]/20 pl-6">
                {product.description || "Este produto premium da Nani Cosmético foi formulado com os melhores ingredientes para garantir resultados excepcionais no seu cuidado diário."}
              </div>
            </div>

            {/* Ações de Compra */}
            <div className="flex flex-col gap-4 mb-12">
              <button 
                onClick={handleBuyNow}
                className="w-full bg-black text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-black/20 hover:bg-gray-800 transition-all active:scale-95"
              >
                Comprar Agora
              </button>
              
              <button 
                onClick={handleAddToCart}
                className="w-full border-2 border-[#9C7C50] text-[#9C7C50] py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-[#9C7C50] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <ShoppingBag size={20} />
                Adicionar ao Carrinho
              </button>
            </div>

            {/* Benefícios e Garantia */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl text-[#9C7C50]"><Truck size={24}/></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-900 tracking-tighter">Entrega Rápida</p>
                  <p className="text-[9px] font-bold text-gray-400">Luanda e arredores</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl text-[#9C7C50]"><ShieldCheck size={24}/></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-900 tracking-tighter">Qualidade Nani</p>
                  <p className="text-[9px] font-bold text-gray-400">100% Original</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}