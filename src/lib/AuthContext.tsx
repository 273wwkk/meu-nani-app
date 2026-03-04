"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Recupera o usuário do navegador quando a página carrega
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setUser({ name: savedName });
    }
  }, []);

  const login = (name: string) => {
    setUser({ name });
    localStorage.setItem("userName", name);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userName");
    window.location.href = "/"; // Redireciona para o login ao sair
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};