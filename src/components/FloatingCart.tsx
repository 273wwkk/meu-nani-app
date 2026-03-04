"use client";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";

export function FloatingCart() {
  const { totalItems } = useCart();
  const router = useRouter();

  // Só mostra o ícone se houver pelo menos 1 item no carrinho
  if (totalItems === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[60] animate-in fade-in slide-in-from-right-4 duration-500">
      <button
        onClick={() => router.push("/products/carrinho")}
        className="relative flex items-center justify-center w-14 h-14 bg-black text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group"
      >
        <ShoppingCart size={24} className="group-hover:rotate-12 transition-transform" />
        
        {/* Contador de Itens */}
        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#9C7C50] text-[10px] font-bold border-2 border-white">
          {totalItems}
        </span>
        
        {/* Tooltip opcional que aparece no hover */}
        <div className="absolute right-full mr-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Ver meu carrinho
        </div>
      </button>
    </div>
  );
}