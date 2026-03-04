"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, ShoppingCart, Trash2, Star, Check } from "lucide-react"; // Adicionado Check
import { useProducts, Product } from "@/lib/ProductContext";
import { useCart } from "@/lib/CartContext";
import Link from "next/link";

export default function WishlistPage() {
  const router = useRouter();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [addedId, setAddedId] = useState<number | null>(null); // Para feedback visual

  useEffect(() => {
    const saved = localStorage.getItem("nani_wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  const removeFromWishlist = (id: number) => {
    const updated = wishlist.filter((itemId) => itemId !== id);
    setWishlist(updated);
    localStorage.setItem("nani_wishlist", JSON.stringify(updated));
  };

  // Função de segurança para adicionar ao carrinho
  const handleAddToCart = (product: Product) => {
    if (addToCart) {
      // Garantimos que o objeto tem as propriedades básicas
      addToCart({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        quantity: 1
      });

      // Feedback visual rápido
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 2000);
    } else {
      console.error("CartContext não inicializado corretamente.");
    }
  };

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#FDFBF9] p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-3 bg-white rounded-2xl shadow-sm hover:text-[#9C7C50] transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                <Heart className="fill-[#9C7C50] text-[#9C7C50]" /> Favoritos
              </h1>
              <p className="text-gray-400 text-sm font-medium">Itens salvos na Nani Cosmético</p>
            </div>
          </div>
          
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantidade</p>
            <p className="text-xl font-black text-[#9C7C50]">{favoriteProducts.length}</p>
          </div>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="p-6">
                  <p className="text-[10px] font-black text-[#9C7C50] uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="text-lg font-black text-gray-900 mb-4 line-clamp-1">{product.name}</h3>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-black text-gray-900">
                      AOA {Number(product.price).toLocaleString()}
                    </p>
                    
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className={`p-4 rounded-2xl transition-all shadow-lg active:scale-90 ${
                        addedId === product.id ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-[#9C7C50]'
                      }`}
                    >
                      {addedId === product.id ? <Check size={18} /> : <ShoppingCart size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 border border-dashed border-gray-200 text-center shadow-sm">
            <Heart size={48} className="text-gray-200 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nada por aqui ainda</h3>
            <p className="text-gray-400 mb-8 text-sm">Explore nossa loja e salve seus favoritos.</p>
            <Link 
              href="/products"
              className="inline-block bg-black text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#9C7C50] transition-all"
            >
              Ver Produtos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}