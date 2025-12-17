import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";
import { EnvelopeIcon, ArrowLeftIcon, KeyIcon, SparklesIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess("Enviamos um link de redefinição de senha para o seu email.");
        } catch {
            setError("Não foi possível enviar o email. Verifique o endereço informado.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Mobile Layout */}
            <div className="block md:hidden min-h-screen px-5 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col min-h-[calc(100vh-4rem)]"
                >
                    {/* Back Button */}
                    <a href="/login" className="flex items-center gap-2 text-slate-500 mb-8 w-fit">
                        <ArrowLeftIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Voltar</span>
                    </a>

                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30"
                        >
                            <KeyIcon className="w-10 h-10 text-white" />
                        </motion.div>
                    </div>

                    {/* Content */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            Esqueceu a senha?
                        </h1>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Sem problemas! Digite seu email e enviaremos um link para você criar uma nova senha.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <EnvelopeIcon className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                placeholder="seu@estudante.ifms.edu.br"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-14 pl-12 pr-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            />
                        </div>

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl"
                            >
                                <p className="text-emerald-700 text-sm text-center">{success}</p>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-red-50 border border-red-200 rounded-2xl"
                            >
                                <p className="text-red-600 text-sm text-center">{error}</p>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Enviando...
                                </span>
                            ) : (
                                "Enviar link de recuperação"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400">
                            Horizonte © 2024
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Tablet Layout */}
            <div className="hidden md:flex lg:hidden min-h-screen items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-lg"
                >
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-center relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                            >
                                <KeyIcon className="w-8 h-8 text-white" />
                            </motion.div>
                            <h1 className="text-2xl font-bold text-white mb-1">
                                Recuperar Senha
                            </h1>
                            <p className="text-blue-100 text-sm">
                                Horizonte
                            </p>
                        </div>

                        {/* Form Content */}
                        <div className="p-8">
                            <p className="text-center text-slate-500 mb-8 leading-relaxed">
                                Digite o email associado à sua conta e enviaremos instruções para redefinir sua senha.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Endereço de Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <EnvelopeIcon className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="seu@estudante.ifms.edu.br"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
                                    >
                                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <SparklesIcon className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <p className="text-emerald-700 text-sm">{success}</p>
                                    </motion.div>
                                )}

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-50 border border-red-200 rounded-xl"
                                    >
                                        <p className="text-red-600 text-sm text-center">{error}</p>
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Enviando...
                                        </span>
                                    ) : (
                                        "Enviar link de recuperação"
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <a
                                    href="/login"
                                    className="flex items-center justify-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group"
                                >
                                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    <span className="font-medium">Voltar para o login</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex min-h-screen">
                {/* Left Panel - Decorative */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden flex items-center justify-center p-12"
                >
                    {/* Animated background shapes */}
                    <div className="absolute inset-0">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 90, 0]
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                        />
                        <motion.div
                            animate={{
                                scale: [1.2, 1, 1.2],
                                rotate: [90, 0, 90]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
                        />
                        <motion.div
                            animate={{
                                y: [0, -30, 0]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-md text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
                            className="w-24 h-24 mx-auto mb-8 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl"
                        >
                            <ShieldCheckIcon className="w-12 h-12 text-white" />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-4xl font-bold text-white mb-4"
                        >
                            Horizonte
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-blue-100 text-lg leading-relaxed mb-8"
                        >
                            Sua segurança é nossa prioridade. Redefina sua senha de forma rápida e segura.
                        </motion.p>

                        {/* Feature badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-wrap justify-center gap-3"
                        >
                            {["Link seguro", "Expira em 1h", "Criptografado"].map((text, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/90 border border-white/20"
                                >
                                    {text}
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    {/* Floating elements */}
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-32 right-24 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                    >
                        <EnvelopeIcon className="w-6 h-6 text-white/80" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-32 left-24 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                    >
                        <KeyIcon className="w-7 h-7 text-white/80" />
                    </motion.div>
                </motion.div>

                {/* Right Panel - Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-1/2 flex items-center justify-center p-12 bg-white"
                >
                    <div className="w-full max-w-md">
                        {/* Back link */}
                        <a
                            href="/login"
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors group mb-12"
                        >
                            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Voltar para login</span>
                        </a>

                        <div className="mb-10">
                            <h1 className="text-3xl font-bold text-slate-800 mb-3">
                                Esqueceu sua senha?
                            </h1>
                            <p className="text-slate-500 text-lg leading-relaxed">
                                Não se preocupe! Acontece com todos. Digite seu email e enviaremos um link para redefinir sua senha.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Endereço de Email
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <EnvelopeIcon className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="seu@estudante.ifms.edu.br"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-16 pl-14 pr-5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-700 text-lg placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className="flex items-start gap-4 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl"
                                >
                                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <SparklesIcon className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-emerald-800 mb-1">Email enviado!</p>
                                        <p className="text-emerald-700 text-sm">{success}</p>
                                    </div>
                                </motion.div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className="p-5 bg-red-50 border border-red-200 rounded-2xl"
                                >
                                    <p className="text-red-600 text-center">{error}</p>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Enviando...
                                    </span>
                                ) : (
                                    "Enviar link de recuperação"
                                )}
                            </button>
                        </form>

                        {/* Footer info */}
                        <div className="mt-12 pt-8 border-t border-slate-100">
                            <p className="text-center text-sm text-slate-400">
                                Lembrou sua senha?{" "}
                                <a href="/login" className="text-blue-600 font-semibold hover:underline">
                                    Fazer login
                                </a>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}