"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CreditCard } from "lucide-react";

export default function Carrinho() {
  const { cart, addToCart, decreaseQuantity, removeFromCart, totalItems } = useCart();

  const totalGeral = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#F7F7F7] font-sans text-gray-700">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/products" className="flex items-center gap-2 text-[#9C7C50] font-bold">
            <ArrowLeft size={20} />
            Voltar para Loja
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Meu Carrinho</h1>
          <div className="flex items-center gap-2 text-[#9C7C50]">
            <ShoppingBag size={24} />
            <span className="font-bold">{totalItems}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Seu carrinho está vazio</h2>
            <Link href="/products" className="inline-block bg-[#9D6E42] text-white px-8 py-3 rounded-xl font-bold mt-6">
              Começar a Comprar
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de Produtos */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 border border-gray-100">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                    <p className="text-[#9D6E42] font-bold text-xl">AOA {item.price.toFixed(2)}</p>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button onClick={() => decreaseQuantity(item.id)} className="p-2 hover:bg-gray-100">
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-bold">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="p-2 hover:bg-gray-100">
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => removeFromCart(item.id)} className="p-3 text-red-400 hover:text-red-600">
                    <Trash2 size={22} />
                  </button>
                </div>
              ))}
            </div>

            {/* Resumo e Botão de Checkout */}
            <div className="bg-white p-6 rounded-2xl shadow-md h-fit border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Resumo</h2>
              <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-4">
                <span>Total</span>
                <span style={{ color: "#9D6E42" }}>AOA {totalGeral.toFixed(2)}</span>
              </div>
              
              <Link href="/products/checkout">
                <button className="w-full mt-8 bg-[#9D6E42] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#710344] transition-colors">
                  <CreditCard size={20} />
                  Ir para o Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}