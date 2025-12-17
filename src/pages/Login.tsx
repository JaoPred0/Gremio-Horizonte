import { useState } from "react";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
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
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import { SparklesIcon as SparklesSolid } from "@heroicons/react/24/solid";

export const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNeedsVerification(false);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        setNeedsVerification(true);
        return;
      }

      navigate("/home", { replace: true });
    } catch {
      setError("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full">

      {/* MOBILE ONLY */}
      <div className="lg:hidden min-h-screen flex flex-col relative overflow-hidden" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/90 via-blue-800/85 to-indigo-900/90" />
        {/* Elementos Visuais de Fundo - Simplificados */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
            className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur-3xl"
          />
        </div>

        {/* Header Mobile - Integrado no Fundo Azul */}
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
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm border border-white/40 rounded-3xl shadow-2xl shadow-blue-500/50 mb-4"
          >
            <SparklesSolid className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            className="text-3xl font-black text-white mb-2 drop-shadow-lg bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
          >
            Horizonte
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
            className="text-white/80 text-base font-medium drop-shadow-md"
          >
            Acesse sua conta e explore o futuro
          </motion.p>
        </motion.div>

        {/* Formulário Integrado na Tela */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          className="relative z-10 flex-1 px-6 pb-8"
        >
          <form onSubmit={handleLogin} className="space-y-6 max-w-sm mx-auto">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              className="space-y-3"
            >
              <label htmlFor="email-mobile" className="text-sm font-bold text-white ml-1 drop-shadow-md">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                    <EnvelopeIcon className="w-5 h-5 text-white z-10" />
                  </div>
                </div>
                <input
                  id="email-mobile"
                  type="email"
                  className="w-full pl-16 pr-4 py-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border-2 border-white/30 rounded-3xl text-white text-base placeholder:text-white/60 focus:bg-gradient-to-r focus:from-white/20 focus:to-white/10 focus:border-blue-300 focus:ring-4 focus:ring-blue-300/30 focus:outline-none transition-all duration-300 shadow-lg"
                  placeholder="seu@estudante.ifms.edu.br"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Senha Input */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
              className="space-y-3"
            >
              <label htmlFor="password-mobile" className="text-sm font-bold text-white ml-1 drop-shadow-md">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                    <LockClosedIcon className="w-5 h-5 text-white z-10" />
                  </div>
                </div>
                <input
                  id="password-mobile"
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-16 pr-16 py-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border-2 border-white/30 rounded-3xl text-white text-base placeholder:text-white/60 focus:bg-gradient-to-r focus:from-white/20 focus:to-white/10 focus:border-blue-300 focus:ring-4 focus:ring-blue-300/30 focus:outline-none transition-all duration-300 shadow-lg"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-blue-300 transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5 text-white" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-white" />
                    )}
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Esqueceu senha */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
              className="flex justify-end"
            >
              <Link to="/forgot-password" className="text-sm font-bold text-white/90 hover:text-white transition-colors drop-shadow-md">
                Esqueceu a senha?
              </Link>
            </motion.div>

            {/* Alertas */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-md border border-red-400/50 rounded-3xl shadow-lg"
                >
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                  <p className="text-red-100 text-sm font-medium leading-relaxed">{error}</p>
                </motion.div>
              )}

              {needsVerification && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-md border border-amber-400/50 rounded-3xl shadow-lg"
                >
                  <ShieldCheckIcon className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-100 text-sm font-medium leading-relaxed">
                    Email não verificado. Verifique sua caixa de entrada.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botão Login */}
            <motion.button
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-white to-blue-100 text-blue-700 font-black text-base rounded-3xl shadow-2xl shadow-blue-500/50 hover:shadow-3xl hover:shadow-blue-500/60 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-3 mt-8"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {/* Criar conta */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
              className="text-center text-white/80 text-sm pt-4 drop-shadow-md"
            >
              Não tem conta?{" "}
              <Link to="/register" className="font-bold text-white hover:text-blue-200 transition-colors">
                Criar conta
              </Link>
            </motion.p>
          </form>
        </motion.div>
      </div>

      {/* TABLET & DESKTOP */}
      <div className="hidden lg:grid min-h-screen grid-cols-1 lg:grid-cols-2">

        {/* LADO VISUAL - Desktop & Tablet */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex flex-col justify-between overflow-hidden"
        >
          {/* Imagem de fundo */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop')`,
            }}
          />

          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/85 to-purple-900/90" />

          {/* Efeitos decorativos */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
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
                  Horizonte
                </motion.h1>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "6rem" }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                />
              </div>

              {/* Descrição */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-lg xl:text-xl text-white/80 leading-relaxed"
              >
                Tecnologia, organização e experiência digital em um único lugar.
                Acesse sua conta e continue evoluindo.
              </motion.p>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex flex-wrap gap-3 pt-4"
              >
                {["Grêmio", "Aprendizado", "Intuitivo"].map((feature) => (
                  <span
                    key={feature}
                    className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white/70 text-sm"
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
            <p className="text-white/40 text-sm">
              © 2026 Horizonte. Todos os direitos reservados.
            </p>
          </motion.div>
        </motion.div>

        {/* LADO FORMULÁRIO - Desktop & Tablet */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center justify-center px-8 xl:px-16 bg-slate-50"
        >
          <div className="w-full max-w-md">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                Bem-vindo
              </h2>
              <p className="text-slate-600">
                Entre com suas credenciais
              </p>
            </motion.div>

            {/* Formulário */}
            <form onSubmit={handleLogin} className="space-y-4">

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    placeholder="seu@estudante.ifms.edu.br"
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
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-12 pr-12 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    placeholder="••••••••"
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
                      <EyeSlashIcon className="w-5 h-5 text-slate-400" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Esqueceu senha */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex justify-end"
              >
                <Link
                  to="/forgot-password"
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </motion.div>

              {/* Alertas */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
                  >
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </motion.div>
                )}

                {needsVerification && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start gap-3 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl"
                  >
                    <ShieldCheckIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <p className="text-amber-700 text-sm font-medium">
                      Seu email ainda não foi verificado. Confira a caixa de spam do Gmail.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botão Login */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="pt-2"
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      <span>Entrando...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar</span>
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
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-slate-50 px-3 text-sm text-slate-500">
                    ou
                  </span>
                </div>
              </motion.div>

              {/* Criar conta */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center text-slate-600"
              >
                Não tem conta?{" "}
                <Link
                  to="/register"
                  className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Criar conta
                </Link>
              </motion.p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};