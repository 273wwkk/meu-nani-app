"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Adicionado Link para navegação
import { 
  ShoppingCart, Search, Star, Filter as FilterIcon, LogOut, User as UserIcon 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthProvider"; 
import { useProducts, Product } from "@/lib/ProductContext"; 

interface Category {
  id: string;
  name: string;
}

const CosmeticsStore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const router = useRouter();
  
  const { addToCart, totalItems } = useCart();
  const { user, logout } = useAuth(); 
  const { products } = useProducts(); 

  const categories: Category[] = [
    { id: "all", name: "Todos" },
    { id: "skincare", name: "Skincare" },
    { id: "makeup", name: "Maquilhagem" },
    { id: "fragrance", name: "Perfumaria" },
    { id: "bodycare", name: "Corpo & Barba" },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const safeNavigate = (path: string) => {
    router.push(path);
  };

  const handleBuyNow = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });

    if (!user) {
      safeNavigate("/auth/login?returnTo=/products/carrinho");
    } else {
      safeNavigate("/products/carrinho"); 
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans text-black">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 
              className="text-2xl sm:text-4xl font-bold tracking-tight italic cursor-pointer" 
              style={{ color: "#9C7C50", fontFamily: "'Times New Roman', Times, serif" }}
              onClick={() => safeNavigate("/")}
            >
              Nani Cosmético
            </h1>
            
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3 border-r pr-4 border-gray-100">
                   <button 
                     onClick={() => safeNavigate("/profile")} 
                     className="flex items-center gap-3 hover:opacity-70 transition-all text-right group"
                   >
                     <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] uppercase text-gray-400 group-hover:text-[#9C7C50]">Minha Conta</span>
                        <span className="text-xs font-bold text-[#9C7C50]">{user.name}</span>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-[#9C7C50] text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-offset-2 ring-[#9C7C50]/10 group-hover:ring-[#9C7C50]/30 transition-all">
                        {user.name.charAt(0).toUpperCase()}
                     </div>
                   </button>
                   
                   <button onClick={logout} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Sair">
                    <LogOut size={18} />
                   </button>
                </div>
              ) : (
                <button 
                  onClick={() => safeNavigate("/auth/login")} 
                  className="p-2 hover:bg-gray-100 rounded-full transition border border-gray-100 group"
                >
                  <UserIcon className="w-6 h-6 text-[#9C7C50] group-hover:scale-110 transition-transform" />
                </button>
              )}

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => safeNavigate("/products/carrinho")} 
                  className="p-2 hover:bg-gray-100 rounded-full transition relative group"
                >
                  <ShoppingCart className="w-6 h-6 text-[#9C7C50] group-hover:rotate-12 transition-transform" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#710344] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 relative text-black">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="O que deseja cuidar hoje?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9D6E42]/50 bg-gray-50 text-sm text-black"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ... (Seção de Categorias mantida igual) ... */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full mr-1">
            <FilterIcon className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[10px] font-bold text-gray-500 uppercase">Filtros</span>
          </div>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap border ${
                selectedCategory === category.id 
                ? "bg-[#9D6E42] text-white border-[#9D6E42] shadow-md shadow-[#9D6E42]/30" 
                : "bg-white text-gray-600 border-gray-200 hover:border-[#9D6E42]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-none bg-white rounded-2xl shadow-sm">
              
              {/* ATUALIZAÇÃO: Clique na imagem leva para a página do produto */}
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden cursor-pointer">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {product.badge && (
                    <Badge className="absolute top-3 left-3 text-white border-0 shadow-md text-[10px]" style={{ backgroundColor: "#9C7C50" }}>
                      {product.badge}
                    </Badge>
                  )}
                </div>
              </Link>

              <CardContent className="p-5">
                {/* ATUALIZAÇÃO: Clique no nome também leva para a página do produto */}
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-bold text-gray-800 mb-2 h-12 line-clamp-2 leading-tight uppercase text-[10px] tracking-widest cursor-pointer hover:text-[#9C7C50] transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-3 h-3 fill-[#C5A267] text-[#C5A267]" />
                  <span className="text-[11px] font-bold text-gray-500">{product.rating}</span>
                </div>
                <div className="flex flex-col mb-5">
                  <span className="text-lg font-black text-gray-900">AOA {product.price.toLocaleString()}</span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleBuyNow(product)} className="w-full py-3 rounded-xl text-white font-bold text-[10px] uppercase tracking-widest transition-all hover:brightness-110 active:scale-95 shadow-md bg-black">
                    Comprar Agora
                  </button>
                  <button onClick={() => addToCart({...product, quantity: 1})} className="w-full py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-wider transition-all border-2 border-[#9D6E42] text-[#9D6E42] hover:bg-[#9D6E42] hover:text-white">
                    Adicionar ao Carrinho
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CosmeticsStore;