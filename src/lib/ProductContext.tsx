"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  badge: string | null;
  description: string; // NOVO: Campo para a página de detalhes
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "rating" | "reviews">) => void;
  deleteProduct: (id: number) => void;
  updateProduct: (id: number, updatedData: Partial<Product>) => void; // NOVO: Para editar
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  // Carregar do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem("nani_products");
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      const initial: Product[] = [
        { 
          id: 1, 
          name: "Sérum Vitamina C", 
          category: "skincare", 
          price: 15500, 
          rating: 4.8, 
          reviews: 120, 
          image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400", 
          badge: "Bestseller",
          description: "Sérum iluminador de alta potência com 10% de Vitamina C pura. Ideal para uniformizar o tom da pele e combater radicais livres."
        },
      ];
      setProducts(initial);
      localStorage.setItem("nani_products", JSON.stringify(initial));
    }
  }, []);

  // Adicionar produto
  const addProduct = (newP: Omit<Product, "id" | "rating" | "reviews">) => {
    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const updated = [...products, { ...newP, id, rating: 5, reviews: 0 }];
    setProducts(updated);
    localStorage.setItem("nani_products", JSON.stringify(updated));
  };

  // NOVO: Atualizar/Editar produto
  const updateProduct = (id: number, updatedData: Partial<Product>) => {
    const updated = products.map(p => p.id === id ? { ...p, ...updatedData } : p);
    setProducts(updated);
    localStorage.setItem("nani_products", JSON.stringify(updated));
  };

  // Deletar produto
  const deleteProduct = (id: number) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem("nani_products", JSON.stringify(updated));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct, updateProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts deve ser usado dentro de ProductProvider");
  return context;
};