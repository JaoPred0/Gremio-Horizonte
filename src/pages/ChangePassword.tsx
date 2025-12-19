import { useState } from "react";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
    Lock,
    Eye,
    EyeOff,
    Shield,
    CheckCircle,
    AlertCircle,
    KeyRound,
    Sparkles,
    ShieldCheck,
    Fingerprint,
    Zap,
    Star,
    Unlock,
    ArrowRight,
    Check,
    X,
    BellRing,
    ShieldAlert
} from "lucide-react";

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [focusedInput, setFocusedInput] = useState(null);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword) {
            setError("As senhas novas não coincidem.");
            return;
        }

        if (newPassword.length < 6) {
            setError("A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }

        const user = auth.currentUser;

        if (!user || !user.email) {
            setError("Usuário não autenticado.");
            return;
        }

        try {
            setLoading(true);

            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            await reauthenticateWithCredential(user, credential);

            await updatePassword(user, newPassword);

            setSuccess("Senha alterada com sucesso!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            if (err.code === "auth/wrong-password") {
                setError("Senha atual incorreta.");
            } else if (err.code === "auth/requires-recent-login") {
                setError("Faça login novamente para alterar a senha.");
            } else {
                setError("Erro ao alterar a senha.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        if (password.length === 0) return { level: 0, text: "Digite uma senha", color: "text-base-content/40" };
        if (password.length < 6) return { level: 1, text: "Muito fraca", color: "text-error" };
        if (password.length < 8) return { level: 2, text: "Fraca", color: "text-warning" };
        if (password.length < 12) return { level: 3, text: "Boa", color: "text-info" };
        return { level: 4, text: "Excelente", color: "text-success" };
    };

    const passwordRequirements = [
        { text: "Mínimo 6 caracteres", check: newPassword.length >= 6 },
        { text: "Letra maiúscula", check: /[A-Z]/.test(newPassword) },
        { text: "Letra minúscula", check: /[a-z]/.test(newPassword) },
        { text: "Número", check: /[0-9]/.test(newPassword) },
    ];

    const strength = getPasswordStrength(newPassword);

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Animated Particles - Desktop only */}
            <div className="hidden lg:block fixed inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/20 rounded-full"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            scale: Math.random() * 0.5 + 0.5
                        }}
                        animate={{
                            y: [null, Math.random() * window.innerHeight],
                            x: [null, Math.random() * window.innerWidth],
                            scale: [null, Math.random() * 0.5 + 0.5],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex min-h-screen items-center justify-center p-8 relative z-10">
                <div className="w-full max-w-7xl flex gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex-1 space-y-8"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-full"
                        >
                            <ShieldCheck className="w-6 h-6 text-primary" />
                            <span className="text-primary font-semibold">Segurança Total</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-6xl font-bold text-base-content leading-tight"
                        >
                            Proteja sua
                            <span className="block text-primary mt-2">Conta Agora</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-xl text-base-content/70 leading-relaxed"
                        >
                            Atualize sua senha regularmente para manter sua conta segura contra acessos não autorizados.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-4"
                        >
                            {[
                                {
                                    icon: ShieldCheck,
                                    text: "Nunca compartilhe sua senha com ninguém",
                                    color: "text-primary",
                                },
                                {
                                    icon: BellRing,
                                    text: "Receba alertas sempre que sua senha for alterada",
                                    color: "text-secondary",
                                },
                                {
                                    icon: ShieldAlert,
                                    text: "Monitoramento contínuo contra acessos suspeitos",
                                    color: "text-accent",
                                },
                            ]
                                .map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 + i * 0.1 }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-base-100 flex items-center justify-center ${item.color}`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-base-content/80 text-lg">{item.text}</span>
                                    </motion.div>
                                ))}
                        </motion.div>

                        <div className="relative mt-12">
                            <motion.div
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
                            />
                            <motion.div
                                animate={{
                                    rotate: [360, 0],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex-1 max-w-xl"
                    >
                        <div className="card bg-base-100 shadow-2xl border border-base-300 overflow-hidden backdrop-blur-xl">
                            {/* Form Header */}
                            <div className="relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20"
                                    animate={{
                                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                    }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                    style={{ backgroundSize: "200% 200%" }}
                                />
                                <div className="relative p-8 backdrop-blur-sm">
                                    <motion.div
                                        initial={{ rotate: -180, scale: 0 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                                    >
                                        <Shield className="w-10 h-10 text-primary" />
                                    </motion.div>
                                    <h2 className="text-3xl font-bold text-base-content text-center">
                                        Alterar Senha
                                    </h2>
                                    <p className="text-base-content/60 text-center mt-2">
                                        Mantenha sua conta sempre protegida
                                    </p>
                                </div>
                            </div>

                            {/* Form Body */}
                            <div className="p-8 space-y-6">
                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    {/* Current Password */}
                                    <motion.div
                                        animate={focusedInput === 'current' ? { scale: 1.02 } : { scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <label className="label">
                                            <span className="label-text font-semibold text-base-content flex items-center gap-2">
                                                <Lock className="w-4 h-4" />
                                                Senha Atual
                                            </span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                className="input input-bordered w-full h-14 pl-12 pr-12 bg-base-200/50 focus:bg-base-100 border-2 focus:border-primary transition-all duration-300"
                                                placeholder="••••••••"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                onFocus={() => setFocusedInput('current')}
                                                onBlur={() => setFocusedInput(null)}
                                                required
                                            />
                                            <motion.div
                                                className="absolute left-4 top-1/2 -translate-y-1/2"
                                                animate={{ rotate: focusedInput === 'current' ? [0, -10, 10, -10, 0] : 0 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <KeyRound className="w-5 h-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
                                            </motion.div>
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary transition-colors"
                                            >
                                                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </motion.div>

                                    <div className="divider text-xs text-base-content/40">NOVA CREDENCIAL</div>

                                    {/* New Password */}
                                    <motion.div
                                        animate={focusedInput === 'new' ? { scale: 1.02 } : { scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <label className="label">
                                            <span className="label-text font-semibold text-base-content flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" />
                                                Nova Senha
                                            </span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                className="input input-bordered w-full h-14 pl-12 pr-12 bg-base-200/50 focus:bg-base-100 border-2 focus:border-primary transition-all duration-300"
                                                placeholder="••••••••"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                onFocus={() => setFocusedInput('new')}
                                                onBlur={() => setFocusedInput(null)}
                                                required
                                            />
                                            <motion.div
                                                className="absolute left-4 top-1/2 -translate-y-1/2"
                                                animate={{ rotate: focusedInput === 'new' ? 360 : 0 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <Unlock className="w-5 h-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
                                            </motion.div>
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary transition-colors"
                                            >
                                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>

                                        {/* Password Strength */}
                                        {newPassword && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="mt-3 space-y-2"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-base-content/60">Força da senha:</span>
                                                    <span className={`text-xs font-semibold ${strength.color}`}>{strength.text}</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    {[...Array(4)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ scaleX: 0 }}
                                                            animate={{ scaleX: i < strength.level ? 1 : 0.3 }}
                                                            className={`h-2 flex-1 rounded-full ${i < strength.level
                                                                ? strength.level === 1 ? "bg-error"
                                                                    : strength.level === 2 ? "bg-warning"
                                                                        : strength.level === 3 ? "bg-info"
                                                                            : "bg-success"
                                                                : "bg-base-300"
                                                                }`}
                                                            transition={{ delay: i * 0.1 }}
                                                        />
                                                    ))}
                                                </div>

                                                {/* Requirements */}
                                                <div className="grid grid-cols-2 gap-2 mt-3">
                                                    {passwordRequirements.map((req, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <motion.div
                                                                animate={req.check ? { scale: [1, 1.2, 1] } : {}}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                {req.check ? (
                                                                    <Check className="w-4 h-4 text-success" />
                                                                ) : (
                                                                    <X className="w-4 h-4 text-base-content/30" />
                                                                )}
                                                            </motion.div>
                                                            <span className={`text-xs ${req.check ? "text-success" : "text-base-content/40"}`}>
                                                                {req.text}
                                                            </span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>

                                    {/* Confirm Password */}
                                    <motion.div
                                        animate={focusedInput === 'confirm' ? { scale: 1.02 } : { scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <label className="label">
                                            <span className="label-text font-semibold text-base-content flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Confirmar Senha
                                            </span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className="input input-bordered w-full h-14 pl-12 pr-12 bg-base-200/50 focus:bg-base-100 border-2 focus:border-primary transition-all duration-300"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                onFocus={() => setFocusedInput('confirm')}
                                                onBlur={() => setFocusedInput(null)}
                                                required
                                            />
                                            <motion.div
                                                className="absolute left-4 top-1/2 -translate-y-1/2"
                                                animate={{
                                                    scale: focusedInput === 'confirm' ? [1, 1.2, 1] : 1,
                                                    rotate: confirmPassword && confirmPassword === newPassword ? [0, 360] : 0
                                                }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <ShieldCheck className="w-5 h-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
                                            </motion.div>
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </motion.div>

                                    {/* Messages */}
                                    <AnimatePresence mode="wait">
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                                className="alert alert-error"
                                            >
                                                <AlertCircle className="w-5 h-5" />
                                                <span>{error}</span>
                                            </motion.div>
                                        )}

                                        {success && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                                className="alert alert-success"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                <span>{success}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Submit Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary w-full h-16 text-lg font-bold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 group"
                                    >
                                        {loading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Sparkles className="w-6 h-6" />
                                            </motion.div>
                                        ) : (
                                            <>
                                                <Shield className="w-6 h-6" />
                                                Confirmar Alteração
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>

                                <div className="flex items-center justify-center gap-2 text-xs text-base-content/40">
                                    <Lock className="w-3 h-3" />
                                    <span>Nunca compartilhe sua senha com terceiros.</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden min-h-screen flex flex-col relative z-10">
                {/* Mobile Header */}
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="relative bg-gradient-to-br from-primary via-secondary to-accent p-6 pb-24 overflow-hidden"
                >
                    {/* Animated background shapes */}
                    <motion.div
                        animate={{
                            rotate: 360,
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"
                    />
                    <motion.div
                        animate={{
                            rotate: -360,
                            scale: [1, 1.3, 1]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"
                    />

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 mx-auto"
                        >
                            <Shield className="w-8 h-8 text-white" />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold text-white text-center mb-2"
                        >
                            Proteja Sua Conta
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-white/80 text-center text-sm"
                        >
                            Atualize sua senha com segurança
                        </motion.p>

                        {/* Security badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex justify-center gap-2 mt-6"
                        >
                            {[ShieldCheck, BellRing, ShieldAlert].map((Icon, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                                >
                                    <Icon className="w-5 h-5 text-white" />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Mobile Form Card */}
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                    className="-mt-16 flex-1 px-4 pb-8"
                >
                    <div className="card bg-base-100 shadow-2xl border border-base-300">
                        <div className="p-6 space-y-5">
                            <form onSubmit={handleChangePassword} className="space-y-5">
                                {/* Current Password - Mobile */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-primary" />
                                            Senha Atual
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            className="input input-bordered w-full h-14 pl-5 pr-12 bg-base-200/50 focus:bg-base-100 border-2 focus:border-primary"
                                            placeholder="••••••••"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40"
                                        >
                                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Divider with icon */}
                                <div className="flex items-center gap-3">
                                    <div className="h-px bg-base-300 flex-1" />
                                    <motion.div
                                        animate={{ rotate: [0, 180, 360] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Star className="w-4 h-4 text-primary" />
                                    </motion.div>
                                    <div className="h-px bg-base-300 flex-1" />
                                </div>

                                {/* New Password - Mobile */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-secondary" />
                                            Nova Senha
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            className="input input-bordered w-full h-14 pl-5 pr-12 bg-base-200/50 focus:bg-base-100 border-2 focus:border-secondary"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40"
                                        >
                                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {/* Mobile Password Strength */}
                                    {newPassword && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="mt-3"
                                        >
                                            <div className="bg-base-200 rounded-lg p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-base-content">Força:</span>
                                                    <span className={`text-sm font-bold ${strength.color}`}>{strength.text}</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    {[...Array(4)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ scaleY: 0 }}
                                                            animate={{ scaleY: i < strength.level ? 1 : 0.3 }}
                                                            className={`h-3 flex-1 rounded-full origin-bottom ${i < strength.level
                                                                ? strength.level === 1 ? "bg-error"
                                                                    : strength.level === 2 ? "bg-warning"
                                                                        : strength.level === 3 ? "bg-info"
                                                                            : "bg-success"
                                                                : "bg-base-300"
                                                                }`}
                                                            transition={{ delay: i * 0.1, type: "spring" }}
                                                        />
                                                    ))}
                                                </div>

                                                <div className="space-y-2 pt-2 border-t border-base-300">
                                                    {passwordRequirements.map((req, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            {req.check ? (
                                                                <Check className="w-5 h-5 text-success" />
                                                            ) : (
                                                                <X className="w-5 h-5 text-base-content/30" />
                                                            )}
                                                            <span className={`text-sm ${req.check ? "text-success font-medium" : "text-base-content/40"}`}>
                                                                {req.text}
                                                            </span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Confirm Password - Mobile */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-accent" />
                                            Confirmar Senha
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="input input-bordered w-full h-14 pl-5 pr-12 bg-base-200/50 focus:bg-base-100 border-2 focus:border-accent"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                        {confirmPassword && confirmPassword === newPassword && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute left-4 top-1/2 -translate-y-1/2"
                                            >
                                                <CheckCircle className="w-5 h-5 text-success" />
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* Messages - Mobile */}
                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="alert alert-error"
                                        >
                                            <AlertCircle className="w-5 h-5" />
                                            <span className="text-sm">{error}</span>
                                        </motion.div>
                                    )}

                                    {success && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="alert alert-success"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            <span className="text-sm">{success}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit Button - Mobile */}
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary w-full h-16 text-base font-bold shadow-lg shadow-primary/30"
                                >
                                    {loading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Sparkles className="w-6 h-6" />
                                        </motion.div>
                                    ) : (
                                        <>
                                            <Shield className="w-5 h-5" />
                                            Alterar Senha
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            <div className="flex items-center justify-center gap-2 text-xs text-base-content/50 pt-2">
                                <Lock className="w-3 h-3" />
                                <span>Nunca compartilhe sua senha com terceiros.</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}