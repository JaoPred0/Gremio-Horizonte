import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon as SparklesSolid } from "@heroicons/react/24/solid";

const INSTITUTIONAL_DOMAIN = "@estudante.ifms.edu.br";

export const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Valida email institucional
    if (!email.toLowerCase().endsWith(INSTITUTIONAL_DOMAIN)) {
      setError(`Use um email institucional (${INSTITUTIONAL_DOMAIN})`);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (password !== confirm) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login", { replace: true });
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Esse email já está cadastrado");
      } else {
        setError("Erro ao criar conta");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full">

      {/* MOBILE ONLY */}
      <div className="lg:hidden min-h-screen flex flex-col relative overflow-hidden bg-base-100" data-theme="dark">
        {/* Elementos Visuais de Fundo - Simplificados e Mais Sutis */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.05 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.05 }}
            transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
            className="absolute bottom-20 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.05 }}
            transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary-focus rounded-full blur-3xl"
          />
        </div>

        {/* Header Mobile - Integrado no Fundo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 pt-8 pb-8 px-6 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center justify-center w-16 h-16 bg-base-200/50 backdrop-blur-sm border border-base-300 rounded-3xl shadow-xl mb-4"
          >
            <SparklesSolid className="w-8 h-8 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            className="text-3xl font-black text-base-content mb-2 drop-shadow-lg"
          >
            Criar Conta
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
            className="text-base-content/70 text-base font-medium drop-shadow-md"
          >
            Use seu email institucional
          </motion.p>
        </motion.div>

        {/* Formulário Integrado na Tela */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          className="relative z-10 flex-1 px-6 pb-8"
        >
          <form onSubmit={handleRegister} className="space-y-6 max-w-sm mx-auto">
            {/* Email Input - Design Simplificado e Mais Limpo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              className="space-y-3"
            >
              <label htmlFor="email-register" className="text-sm font-bold text-base-content ml-1">
                Email Institucional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <EnvelopeIcon className="w-5 h-5 text-base-content/60 z-10" />
                </div>
                <input
                  id="email-register"
                  type="email"
                  className="w-full pl-12 pr-4 py-4 bg-base-200/50 backdrop-blur-sm border border-base-300 rounded-2xl text-base-content text-base placeholder:text-base-content/50 focus:bg-base-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 shadow-sm"
                  placeholder={`seu${INSTITUTIONAL_DOMAIN}`}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Senha Input - Design Simplificado e Mais Limpo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
              className="space-y-3"
            >
              <label htmlFor="password-register" className="text-sm font-bold text-base-content ml-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="w-5 h-5 text-base-content/60 z-10" />
                </div>
                <input
                  id="password-register"
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-4 bg-base-200/50 backdrop-blur-sm border border-base-300 rounded-2xl text-base-content text-base placeholder:text-base-content/50 focus:bg-base-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 shadow-sm"
                  placeholder="Mínimo 6 caracteres"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-primary transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-base-content/60" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-base-content/60" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Confirmar Senha Input - Design Simplificado e Mais Limpo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
              className="space-y-3"
            >
              <label htmlFor="confirm-register" className="text-sm font-bold text-base-content ml-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CheckCircleIcon className="w-5 h-5 text-base-content/60 z-10" />
                </div>
                <input
                  id="confirm-register"
                  type={showConfirm ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-4 bg-base-200/50 backdrop-blur-sm border border-base-300 rounded-2xl text-base-content text-base placeholder:text-base-content/50 focus:bg-base-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 shadow-sm"
                  placeholder="Digite a senha novamente"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-primary transition-colors"
                  aria-label={showConfirm ? "Ocultar confirmação" : "Mostrar confirmação"}
                >
                  {showConfirm ? (
                    <EyeSlashIcon className="w-5 h-5 text-base-content/60" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-base-content/60" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Alertas */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex items-start gap-3 p-4 bg-error/10 backdrop-blur-sm border border-error/30 rounded-2xl shadow-sm"
                >
                  <ExclamationTriangleIcon className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                  <p className="text-error text-sm font-medium leading-relaxed">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botão Cadastrar */}
            <motion.button
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-focus text-secundary-content font-semibold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-3 mt-8"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Criando...</span>
                </>
              ) : (
                <>
                  <span>Cadastrar</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {/* Login */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
              className="text-center text-base-content/70 text-sm pt-4"
            >
              Já tem conta?{" "}
              <Link to="/login" className="font-bold text-primary hover:text-primary-focus transition-colors">
                Entrar
              </Link>
            </motion.p>
          </form>
        </motion.div>
      </div>

      {/* TABLET & DESKTOP - Invertido (Formulário esquerda, Imagem direita) */}
      <div className="hidden lg:grid min-h-screen grid-cols-1 lg:grid-cols-2" data-theme="dark">

        {/* LADO VISUAL - Desktop & Tablet */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex flex-col justify-between overflow-hidden bg-base-100"
        >
          {/* Imagem de fundo */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-90"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop')`,
            }}
          />

          {/* Overlay sólido */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/85 to-purple-900/90" />

          {/* Efeitos decorativos sutis */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-focus/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Conteúdo */}
          <div className="relative z-10 flex flex-col justify-center h-full px-12 xl:px-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-8 max-w-xl"
            >
              {/* Título */}
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-5xl xl:text-7xl font-black text-white leading-tight"
                >
                  Bem-vindo
                </motion.h1>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "6rem" }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="h-1.5 bg-primary rounded-full"
                />
              </div>

              {/* Descrição */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-lg xl:text-xl text-white/40 leading-relaxed"
              >
                Crie sua conta na plataforma Horizonte e tenha acesso a todas as funcionalidades disponíveis.
              </motion.p>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex flex-wrap gap-3 pt-4"
              >
                {["Colaborativo", "Organizado", "Eficiente"].map((feature) => (
                  <span
                    key={feature}
                    className="px-4 py-2 bg-base-200/50 backdrop-blur-sm rounded-xl border border-base-300 text-base-content/70 text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Footer do lado visual */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="relative z-10 px-12 xl:px-20 pb-8"
          >
            <p className="text-white/70 text-sm">
              © 2026 Horizonte. Todos os direitos reservados.
            </p>
          </motion.div>
        </motion.div>

        {/* LADO FORMULÁRIO - Desktop & Tablet */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center justify-center px-8 xl:px-16 bg-base-100"
        >
          <div className="w-full max-w-md">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-black text-base-content mb-2">
                Criar Conta
              </h2>
              <p className="text-base-content/70">
                Use seu email institucional para cadastro
              </p>
            </motion.div>

            {/* Formulário */}
            <form onSubmit={handleRegister} className="space-y-4">

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <label className="text-sm font-bold text-base-content ml-1">
                  Email Institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="w-5 h-5 text-base-content/60 z-10" />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-3 bg-base-200/50 backdrop-blur-sm border border-base-300 rounded-2xl text-base-content placeholder:text-base-content/50 focus:bg-base-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    placeholder={`seu${INSTITUTIONAL_DOMAIN}`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </motion.div>

              {/* Senha */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <label className="text-sm font-bold text-base-content ml-1">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="w-5 h-5 text-base-content/60 z-10" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-12 pr-12 py-3 bg-base-200/50 backdrop-blur-sm border border-base-300 rounded-2xl text-base-content placeholder:text-base-content/50 focus:bg-base-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    placeholder="Mínimo 6 caracteres"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5 text-base-content/60" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-base-content/60" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Confirmar Senha */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <label className="text-sm font-bold text-base-content ml-1">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CheckCircleIcon className="w-5 h-5 text-base-content/60 z-10" />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    className="w-full pl-12 pr-12 py-3 bg-base-200/50 backdrop-blur-sm border border-base-300 rounded-2xl text-base-content placeholder:text-base-content/50 focus:bg-base-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    placeholder="Digite a senha novamente"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform"
                  >
                    {showConfirm ? (
                      <EyeSlashIcon className="w-5 h-5 text-base-content/60" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-base-content/60" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Alertas */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start gap-3 p-4 bg-error/10 backdrop-blur-sm border border-error/30 rounded-2xl"
                  >
                    <ExclamationTriangleIcon className="w-5 h-5 text-error flex-shrink-0" />
                    <p className="text-error text-sm font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botão Cadastrar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="pt-2"
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-primary text-primary-content font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      <span>Criando conta...</span>
                    </>
                  ) : (
                    <>
                      <span>Cadastrar</span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="relative py-3"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-base-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-base-100 px-3 text-sm text-base-content/50">
                    ou
                  </span>
                </div>
              </motion.div>

              {/* Login */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center text-base-content/70"
              >
                Já tem conta?{" "}
                <Link
                  to="/login"
                  className="font-bold text-primary hover:text-primary-focus transition-colors"
                >
                  Fazer login
                </Link>
              </motion.p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};