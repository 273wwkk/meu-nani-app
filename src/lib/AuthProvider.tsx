"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string; // Adicionado para o chat funcionar
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  updateUser: (newData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Carregar utilizador ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem("nani_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Erro ao carregar utilizador", e);
      }
    }
  }, []);

  // Função de Login (Cria o ID se não existir)
  const login = (name: string, email: string) => {
    const newUser: User = { 
      id: Date.now().toString(), // Gera um ID único para o chat
      name, 
      email 
    };
    setUser(newUser);
    localStorage.setItem("nani_user", JSON.stringify(newUser));
  };

  // Função de Logout
  const logout = () => {
    localStorage.removeItem("nani_user");
    setUser(null);
  };

  // Função de Atualizar Dados
  const updateUser = (newData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem("nani_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};