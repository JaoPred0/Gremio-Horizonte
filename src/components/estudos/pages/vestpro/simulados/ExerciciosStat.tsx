import React, { useState, useEffect } from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface ExerciciosStatProps {
  showDetails?: boolean;
}

export const ExerciciosStat: React.FC<ExerciciosStatProps> = ({ showDetails = false }) => {
  const [exerciciosCompletos, setExerciciosCompletos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(100);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadExercicios(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadExercicios = async (userId: string) => {
    try {
      setLoading(true);

      // Carregar estatísticas
      const statsRef = doc(db, 'user_stats', userId);
      const statsSnap = await getDoc(statsRef);

      if (statsSnap.exists()) {
        const data = statsSnap.data();
        setExerciciosCompletos(data.exerciciosCompletos || 0);
        setMeta(data.metaExercicios || 100);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
      setLoading(false);
    }
  };

  const porcentagemMeta = Math.min((exerciciosCompletos / meta) * 100, 100);

  if (loading) {
    return (
      <div className="stat bg-base-200 shadow rounded-xl">
        <div className="stat-figure text-base-content/30">
          <div className="loading loading-spinner loading-md"></div>
        </div>
        <div className="stat-title text-base-content/60">Carregando...</div>
        <div className="stat-value text-primary">--</div>
        <div className="stat-desc text-base-content/50">Exercícios</div>
      </div>
    );
  }

  return (
    <div className="stat bg-base-200 shadow rounded-xl hover:shadow-xl hover:scale-[1.02] transition relative overflow-hidden">
      {/* Barra de progresso no fundo */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-500"
        style={{ width: `${porcentagemMeta}%` }}
      />

      <div className="stat-figure text-primary">
        <Target className="w-10 h-10" />
      </div>

      <div className="stat-title text-base-content/60">Exercícios</div>
      
      <div className="stat-value text-primary flex items-baseline gap-2">
        {exerciciosCompletos}
        {showDetails && (
          <span className="text-base text-base-content/50 font-normal">
            / {meta}
          </span>
        )}
      </div>

      <div className="stat-desc text-base-content/50 flex items-center gap-1">
        {porcentagemMeta >= 100 ? (
          <>
            <TrendingUp className="w-3 h-3 text-success" />
            Meta alcançada! 🎉
          </>
        ) : (
          <>
            {Math.round(porcentagemMeta)}% da meta
          </>
        )}
      </div>
    </div>
  );
};