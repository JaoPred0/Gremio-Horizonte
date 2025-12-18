import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import { getUserRole } from "@/data/roles";
import { roleIcons } from "@/utils/roleIcons";
import {
  UserIcon,
  EnvelopeIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

function getFirstName(user) {
  if (!user?.email) return "Usuário";
  const name = user.email.split("@")[0].split(".")[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getAccountAge(user) {
  if (!user?.metadata?.creationTime) return "-";
  const created = new Date(user.metadata.creationTime);
  const diff = Date.now() - created.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 30) return `${days} dias`;
  if (days < 365) return `${Math.floor(days / 30)} meses`;
  return `${Math.floor(days / 365)} anos`;
}

function formatDate(user) {
  if (!user?.metadata?.creationTime) return "-";
  const created = new Date(user.metadata.creationTime);
  return created.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export const Perfil = () => {
  const [user] = useAuthState(auth);
  const userRole = getUserRole(user?.email);
  const RoleIcon = roleIcons[userRole.key];

  if (!user) return null;

  const DesktopLayout = () => (
    <div className="hidden lg:flex min-h-screen">
      <div className="w-2/5 relative flex flex-col items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative z-10"
        >
          <div className={`
            w-44 h-44 rounded-3xl rotate-3
            flex items-center justify-center
            shadow-2xl
            ${userRole.color}
            relative overflow-hidden
          `}>
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            {RoleIcon ? (
              <RoleIcon className="w-20 h-20 text-white relative z-10" />
            ) : (
              <span className="text-6xl font-bold text-white relative z-10">
                {getFirstName(user).charAt(0)}
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center relative z-10"
        >
          <h1 className="text-4xl font-black tracking-tight">{getFirstName(user)}</h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full mt-3 mx-auto max-w-32"
          />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className={`mt-6 px-6 py-3 rounded-2xl text-base font-bold shadow-xl ${userRole.color} flex items-center gap-2`}
        >
          <SparklesIcon className="w-5 h-5" />
          {userRole.label}
        </motion.span>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => signOut(auth)}
          className="mt-12 btn btn-error btn-outline gap-2 shadow-lg px-8"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Sair da conta
        </motion.button>
      </div>

      <div className="flex-1 bg-base-100 p-12 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl"
        >
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">
            Informações da Conta
          </h2>
          <p className="text-base-content/60 mb-10">
            Gerencie suas informações pessoais
          </p>

          <div className="grid grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.15)" }}
              className="col-span-2 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-6 border border-primary/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <EnvelopeIcon className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-base-content/50 uppercase font-bold tracking-wider">Email</p>
                  <p className="font-bold text-lg truncate mt-1">{user.email}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -4, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.15)" }}
              className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-3xl p-6 border border-secondary/10"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                <UserIcon className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-xs text-base-content/50 uppercase font-bold tracking-wider">Nome</p>
              <p className="font-bold text-xl mt-1">{getFirstName(user)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -4, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.15)" }}
              className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-3xl p-6 border border-accent/10"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                <ClockIcon className="w-6 h-6 text-accent" />
              </div>
              <p className="text-xs text-base-content/50 uppercase font-bold tracking-wider">Tempo de conta</p>
              <p className="font-bold text-xl mt-1">{getAccountAge(user)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -4, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.15)" }}
              className="col-span-2 bg-gradient-to-br from-base-200 to-base-300 rounded-3xl p-6 border border-base-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-base-content/50 uppercase font-bold tracking-wider">Membro desde</p>
                  <p className="font-bold text-lg mt-1">{formatDate(user)}</p>
                </div>
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className={`w-10 h-10 rounded-full border-2 border-base-100 ${
                        ['bg-primary', 'bg-secondary', 'bg-accent'][i]
                      } flex items-center justify-center`}
                    >
                      <SparklesIcon className="w-4 h-4 text-white" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const MobileLayout = () => (
    <div className="lg:hidden relative flex flex-col items-center pt-32 pb-20 px-6 min-h-screen">
      
      <div className="absolute top-28 left-1/2 -translate-x-1/2 w-full max-w-2xl h-32 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveOpacityMobile" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="20%" stopColor="currentColor" stopOpacity="0.6" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="80%" stopColor="currentColor" stopOpacity="0.6" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <motion.path
            d="M0,60 Q150,20 300,60 T600,60 T900,60 T1200,60"
            fill="none"
            stroke="url(#waveOpacityMobile)"
            strokeWidth="3"
            className="text-primary"
            initial={{ pathLength: 0, pathOffset: 0 }}
            animate={{ 
              pathLength: 1,
              pathOffset: [0, -2]
            }}
            transition={{
              pathLength: { duration: 1.5, ease: "easeInOut" },
              pathOffset: { duration: 3, repeat: Infinity, ease: "linear" }
            }}
          />
          
          <motion.path
            d="M0,60 Q150,100 300,60 T600,60 T900,60 T1200,60"
            fill="none"
            stroke="url(#waveOpacityMobile)"
            strokeWidth="2.5"
            className="text-secondary"
            initial={{ pathLength: 0, pathOffset: 0 }}
            animate={{ 
              pathLength: 1,
              pathOffset: [0, 2]
            }}
            transition={{
              pathLength: { duration: 1.5, delay: 0.2, ease: "easeInOut" },
              pathOffset: { duration: 4, repeat: Infinity, ease: "linear" }
            }}
          />
        </svg>
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative z-10"
      >
        <div
          className={`
            w-28 h-28 rounded-full
            flex items-center justify-center
            shadow-2xl
            ring-4 ring-base-100
            ${userRole.color}
            relative overflow-hidden
          `}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          {RoleIcon ? (
            <RoleIcon className="w-12 h-12 text-white relative z-10" />
          ) : (
            <span className="text-4xl font-bold text-white relative z-10">
              {getFirstName(user).charAt(0)}
            </span>
          )}
        </div>
      </motion.div>

      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`mt-6 px-5 py-2 rounded-full text-sm font-bold shadow-lg ${userRole.color}`}
      >
        {userRole.label}
      </motion.span>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex flex-col gap-4 w-full max-w-md"
      >
        <motion.div
          whileHover={{ scale: 1.02, x: 4 }}
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
        >
          <div className="card-body flex-row items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-base-content/60 uppercase font-semibold">Nome</p>
              <p className="font-bold text-lg">{getFirstName(user)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, x: 4 }}
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
        >
          <div className="card-body flex-row items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <EnvelopeIcon className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-base-content/60 uppercase font-semibold">Email</p>
              <p className="font-bold truncate">{user.email}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, x: 4 }}
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
        >
          <div className="card-body flex-row items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-xs text-base-content/60 uppercase font-semibold">Conta criada há</p>
              <p className="font-bold text-lg">{getAccountAge(user)}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => signOut(auth)}
        className="mt-12 btn btn-error btn-outline gap-2 shadow-lg"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        Sair da conta
      </motion.button>
    </div>
  );

  return (
    <>
      <DesktopLayout />
      <MobileLayout />
    </>
  );
};