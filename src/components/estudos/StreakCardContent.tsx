import { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Adicione este componente no mesmo arquivo ou crie um arquivo separado
const StreakCardContent = () => {
  const [streakData, setStreakData] = useState({ currentStreak: 0, lastCompletedDate: '', exercisesCompletedToday: 0 });
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStreak = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'user_streaks', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setStreakData(data as any);

          const today = new Date().toDateString();
          const completedToday = data.lastCompletedDate === today && data.exercisesCompletedToday >= 5;
          setIsActive(completedToday);
        }
      } catch (error) {
        console.error('Erro ao carregar streak:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStreak();
  }, []);

  if (loading) {
    return (
      <>
        <div className="stat-figure text-base-content/30">
          <Flame size={28} className="opacity-50" />
        </div>
        <div className="stat-title">Streak</div>
        <div className="stat-value">
          <span className="loading loading-spinner loading-sm"></span>
        </div>
        <div className="stat-desc">carregando...</div>
      </>
    );
  }

  return (
    <>
      {/* Efeito de brilho quando ativo */}
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      )}

      <div className={`stat-figure ${isActive ? 'text-orange-500' : 'text-base-content/30'}`}>
        {isActive ? (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -5, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Flame className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 drop-shadow-lg" />
          </motion.div>
        ) : (
          <Flame className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 opacity-50" />
        )}
      </div>

      <div className="stat-title text-xs sm:text-sm">Streak</div>
      
      <div className={`stat-value text-2xl sm:text-3xl md:text-4xl ${isActive ? 'text-orange-500' : 'text-base-content/50'}`}>
        {streakData.currentStreak}
      </div>
      
      <div className="stat-desc flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
        <span className="text-xs sm:text-sm">
          {streakData.currentStreak === 1 ? 'dia seguido' : 'dias seguidos'}
        </span>
        {!isActive && streakData.currentStreak > 0 && (
          <span className="badge badge-warning badge-xs sm:badge-sm">Ativar hoje</span>
        )}
        {isActive && (
          <span className="badge badge-success badge-xs sm:badge-sm">✓ Ativo</span>
        )}
      </div>

      {/* Indicador visual de status */}
      <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isActive ? 'bg-orange-500 animate-pulse' : 'bg-base-content/20'}`} />
      </div>
    </>
  );
};
export default StreakCardContent;