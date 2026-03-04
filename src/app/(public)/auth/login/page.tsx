"use client";

import { LogIn, UserPlus, CheckCircle2, ArrowRight, AlertCircle, KeyRound, ArrowLeft } from "lucide-react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import { useAuth } from "@/lib/AuthProvider"; 

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth(); 
  
  const returnTo = searchParams.get("returnTo");

  // Estados de visualização
  const [view, setView] = useState<"login" | "register" | "forgot">("login");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Para mensagens temporárias (ex: senha redefinida)
  
  // Campos do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Limpa estados ao trocar de tela
  const switchView = (newView: "login" | "register" | "forgot") => {
    setView(newView);
    setError("");
    setSuccessMessage("");
    // Opcional: Limpar campos se quiser
    // setPassword(""); 
  };

  const handleFinalSuccessRedirect = () => {
  // Admin sempre vai para o dashboard
  if (email === "admin@nanicosmetico.com" && password === "admin123") {
    router.push("/dashboard");
  } else {
    // Clientes normais
    const destination = returnTo || "/products";
    router.push(destination);
  }
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccessMessage("");

  // --- LOGIN ADMIN ---
  if (view === "login" && email === "admin@nanicosmetico.com" && password === "admin123") {
    // Aqui você poderia salvar estado de admin se quiser
    router.push("/admin/dashboard"); 
    return; // Para não continuar com lógica de cliente
  }

  // --- LOGIN CLIENTE ---
  if (view === "login") {
    const storedUserJSON = localStorage.getItem(`user_${email}`);

    if (!storedUserJSON) {
      setError("Esta conta não existe. Crie uma conta primeiro.");
      return;
    }

    const storedUser = JSON.parse(storedUserJSON);

    if (storedUser.password !== password) {
      setError("A palavra-passe está incorreta.");
      return;
    }

    login(storedUser.name, email);
    const destination = returnTo || "/products";
    router.push(destination); 
  } 
  
  // --- REGISTRO DE NOVO CLIENTE ---
  else if (view === "register") {
    if (localStorage.getItem(`user_${email}`)) {
      setError("Este email já está registado. Faça login.");
      return;
    }

    const newUser = { name, email, password };
    localStorage.setItem(`user_${email}`, JSON.stringify(newUser));

    login(name, email);
    setIsSuccess(true); // Mostra tela de sucesso
  }

  // --- RECUPERAÇÃO DE SENHA ---
  else if (view === "forgot") {
    const storedUserJSON = localStorage.getItem(`user_${email}`);
    
    if (!storedUserJSON) {
      setError("Não encontramos nenhuma conta com este email.");
      return;
    }

    const userData = JSON.parse(storedUserJSON);
    userData.password = password; // Atualiza senha
    localStorage.setItem(`user_${email}`, JSON.stringify(userData));

    setSuccessMessage("Senha redefinida com sucesso! Faça login agora.");
    switchView("login"); // Volta para login
    setPassword(""); // Limpa campo
  }
};
  

  return (
    <div className="w-full max-w-md px-8 py-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transition-all">
      {isSuccess ? (
        // TELA DE SUCESSO DO REGISTO
        <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Conta Criada!</h2>
          <p className="text-gray-500 mt-2 mb-8 text-sm">
            Sua conta foi criada com sucesso, <span className="font-bold text-[#9C7C50]">{name}</span>.
          </p>
          <button 
            onClick={handleFinalSuccessRedirect} 
            className="flex items-center justify-center gap-2 w-full bg-[#9C7C50] text-white font-bold py-4 rounded-xl hover:bg-[#866a43] transition-all shadow-lg"
          >
            {returnTo ? "Continuar para o Checkout" : "Começar a Comprar"}
            <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <>
          {/* CABEÇALHO DO FORMULÁRIO */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-[#9C7C50] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-[#9C7C50]/30">
              <span className="text-white font-bold text-2xl italic">N</span>
            </div>
            <h2 className="text-2xl font-bold dark:text-white text-gray-800">
              {view === "login" && "Bem-vinda de volta!"}
              {view === "register" && "Criar sua Conta"}
              {view === "forgot" && "Recuperar Acesso"}
            </h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Nani Cosmético</p>
          </div>

          {/* MENSAGENS DE ERRO E SUCESSO */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold animate-in slide-in-from-top-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2 text-green-700 text-xs font-bold animate-in slide-in-from-top-2">
              <CheckCircle2 size={16} />
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* CAMPO NOME (SÓ NO REGISTO) */}
            {view === "register" && (
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[10px] text-gray-400 uppercase ml-1">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Como deseja ser chamada?"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-100 rounded-xl px-4 py-3 text-sm w-full outline-none focus:ring-2 focus:ring-[#9C7C50]/20 bg-gray-50 dark:bg-gray-800 dark:text-white"
                />
              </div>
            )}

            {/* CAMPO EMAIL (SEMPRE VISÍVEL) */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[10px] text-gray-400 uppercase ml-1">Email</label>
              <input
                type="email"
                placeholder="exemplo@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-100 rounded-xl px-4 py-3 text-sm w-full outline-none focus:ring-2 focus:ring-[#9C7C50]/20 bg-gray-50 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* CAMPO SENHA (LOGIN, REGISTO E RECUPERAÇÃO) */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[10px] text-gray-400 uppercase ml-1">
                {view === "forgot" ? "Nova Palavra-passe" : "Palavra-passe"}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-100 rounded-xl px-4 py-3 text-sm w-full outline-none focus:ring-2 focus:ring-[#9C7C50]/20 bg-gray-50 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* ESQUECEU A SENHA LINK (SÓ NO LOGIN) */}
            {view === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchView("forgot")}
                  className="text-xs text-gray-400 hover:text-[#9C7C50] font-medium transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            {/* BOTÃO PRINCIPAL */}
            <button 
              type="submit"
              className="flex items-center justify-center gap-x-2 w-full bg-[#9C7C50] hover:bg-[#866a43] text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 mt-4"
            >
              {view === "login" && <><LogIn size={20} /> Entrar na Loja</>}
              {view === "register" && <><UserPlus size={20} /> Finalizar Cadastro</>}
              {view === "forgot" && <><KeyRound size={20} /> Redefinir Senha</>}
            </button>
          </form>

          {/* RODAPÉ DE NAVEGAÇÃO */}
          <div className="mt-8 text-center border-t pt-6 border-gray-50">
            {view === "login" && (
              <button onClick={() => switchView("register")} className="text-[#9C7C50] font-bold text-sm hover:underline">
                Ainda não é cliente? Registe-se
              </button>
            )}
            
            {view === "register" && (
              <button onClick={() => switchView("login")} className="text-[#9C7C50] font-bold text-sm hover:underline">
                Já é nossa cliente? Faça Login
              </button>
            )}

            {view === "forgot" && (
              <button onClick={() => switchView("login")} className="flex items-center justify-center gap-2 text-gray-500 font-bold text-sm hover:text-black transition-colors">
                <ArrowLeft size={16} /> Voltar para o Login
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-[url('https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=1600')] bg-cover bg-center">
      <div className="backdrop-blur-sm min-h-screen p-6 bg-black/40 flex items-center justify-center">
        <Suspense fallback={<div className="text-white">Carregando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}