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
} from "@heroicons/react/24/outline";

function getFirstName(user: any) {
  if (!user?.email) return "Usuário";
  const name = user.email.split("@")[0].split(".")[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getAccountAge(user: any) {
  if (!user?.metadata?.creationTime) return "-";
  const created = new Date(user.metadata.creationTime);
  const diff = Date.now() - created.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 30) return `${days} dias`;
  if (days < 365) return `${Math.floor(days / 30)} meses`;
  return `${Math.floor(days / 365)} anos`;
}

export const Perfil = () => {
  const [user] = useAuthState(auth);
  const userRole = getUserRole(user?.email);
  const RoleIcon = roleIcons[userRole.key];

  if (!user) return null;

  return (
    <div className="relative flex flex-col items-center pt-32 pb-20 px-6 min-h-screen">
      
      {/* ONDA ANIMADA */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 w-full max-w-2xl h-32 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveOpacity" x1="0%" y1="0%" x2="100%" y2="0%">
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
            stroke="url(#waveOpacity)"
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
            stroke="url(#waveOpacity)"
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
};