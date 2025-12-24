import React, { useState, useEffect } from 'react';
import { TrendingUp, Zap, Flame, Trophy, Target } from 'lucide-react';
import { db, auth } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface RankType {
    key: 'geral' | 'xp' | 'streak' | 'conquistas' | 'exercicios';
    label: string;
    icon: React.ReactNode;
    description: string;
    color: string;
}

interface UserRanking {
    uid: string;
    xp: number;
    streak: number;
    conquistas: number;
    exercicios: number;
    pontuacaoTotal: number;
}

const rankTypes: RankType[] = [
    {
        key: 'geral',
        label: 'Rank Geral',
        icon: <TrendingUp size={28} />,
        description: 'Pontuação total acumulada',
        color: 'text-green-500'
    },
    {
        key: 'xp',
        label: 'Rank XP',
        icon: <Zap size={28} />,
        description: 'Experiência acumulada',
        color: 'text-yellow-500'
    },
    {
        key: 'streak',
        label: 'Rank Sequência',
        icon: <Flame size={28} />,
        description: 'Dias consecutivos de estudo',
        color: 'text-orange-500'
    },
    {
        key: 'conquistas',
        label: 'Rank Conquistas',
        icon: <Trophy size={28} />,
        description: 'Conquistas coletadas',
        color: 'text-purple-500'
    },
    {
        key: 'exercicios',
        label: 'Rank Exercícios',
        icon: <Target size={28} />,
        description: 'Exercícios completados',
        color: 'text-blue-500'
    }
];

export const RankStat = () => {
    const [currentRankIndex, setCurrentRankIndex] = useState(0);
    const [userPositions, setUserPositions] = useState<Record<string, number>>({
        geral: 0,
        xp: 0,
        streak: 0,
        conquistas: 0,
        exercicios: 0
    });
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Rotação automática a cada 3 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRankIndex((prev) => (prev + 1) % rankTypes.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Carregar posições do usuário
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUserId(user.uid);
                loadUserPositions(user.uid);
            } else {
                setCurrentUserId(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const loadUserPositions = async (userId: string) => {
        try {
            setLoading(true);

            // Buscar todos os usuários e seus dados
            const usersSnapshot = await getDocs(collection(db, "users"));
            const xpSnapshot = await getDocs(collection(db, "user_xp"));
            const streaksSnapshot = await getDocs(collection(db, "user_streaks"));
            const conquistasSnapshot = await getDocs(collection(db, "user_conquistas"));

            // Criar mapas
            const xpMap = new Map();
            xpSnapshot.forEach(doc => {
                const data = doc.data();
                xpMap.set(doc.id, data.xp || 0);
            });

            const streaksMap = new Map();
            streaksSnapshot.forEach(doc => {
                const data = doc.data();
                streaksMap.set(doc.id, data.currentStreak || 0);
            });

            const conquistasMap = new Map();
            conquistasSnapshot.forEach(doc => {
                const data = doc.data();
                conquistasMap.set(doc.id, data.totalColetadas || 0);
            });

            // Montar dados dos usuários
            const users: UserRanking[] = [];
            usersSnapshot.forEach(doc => {
                const uid = doc.id;
                const xp = xpMap.get(uid) || 0;
                const streak = streaksMap.get(uid) || 0;
                const conquistas = conquistasMap.get(uid) || 0;
                const exercicios = 0;
                const pontuacaoTotal = xp + streak + (conquistas * 10) + exercicios;

                users.push({ uid, xp, streak, conquistas, exercicios, pontuacaoTotal });
            });

            // Ordenar e calcular posições
            const rankings = {
                geral: [...users].sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal),
                xp: [...users].sort((a, b) => b.xp - a.xp),
                streak: [...users].sort((a, b) => b.streak - a.streak),
                conquistas: [...users].sort((a, b) => b.conquistas - a.conquistas),
                exercicios: [...users].sort((a, b) => b.exercicios - a.exercicios)
            };

            const positions: Record<string, number> = {
                geral: rankings.geral.findIndex(u => u.uid === userId) + 1,
                xp: rankings.xp.findIndex(u => u.uid === userId) + 1,
                streak: rankings.streak.findIndex(u => u.uid === userId) + 1,
                conquistas: rankings.conquistas.findIndex(u => u.uid === userId) + 1,
                exercicios: rankings.exercicios.findIndex(u => u.uid === userId) + 1
            };

            setUserPositions(positions);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar posições:', error);
            setLoading(false);
        }
    };

    const currentRank = rankTypes[currentRankIndex];
    const position = userPositions[currentRank.key];

    const handleClick = () => {
        window.location.href = '/estudos/rank';
    };

    if (loading) {
        return (
            <div onClick={handleClick} className="stat bg-base-200 shadow rounded-xl hover:shadow-xl hover:scale-[1.02] transition cursor-pointer">
                <div className="stat-figure text-base-content/30">
                    <div className="loading loading-spinner loading-md"></div>
                </div>
                <div className="stat-title text-base-content/60">
                    Carregando...
                </div>
                <div className="stat-value text-primary">
                    --
                </div>
                <div className="stat-desc text-base-content/50">
                    Calculando posições
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={handleClick}
            className="
    stat
    bg-base-200
    shadow
    rounded-xl
    hover:shadow-xl hover:scale-[1.02]
    transition
    relative
    cursor-pointer

    w-full
    px-3 sm:px-6
    py-4

    flex flex-col items-center text-center
    sm:grid sm:text-left

    overflow-hidden
  "
        >
            {/* Indicador */}
            <div className="absolute top-2 right-2">
                <div className="flex gap-1">
                    {rankTypes.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 rounded-full transition-all ${index === currentRankIndex
                                    ? "bg-primary w-3"
                                    : "bg-base-content/20 w-1.5"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* ÍCONE */}
            <div
                className={`
      stat-figure
      ${currentRank.color}
      flex items-center justify-center
      mb-2 sm:mb-0
    `}
            >
                {/* 🔽 tamanho ajustado */}
                <div className="text-xl sm:text-3xl leading-none">
                    {currentRank.icon}
                </div>
            </div>

            {/* TÍTULO */}
            <div className="stat-title text-base-content/60 text-sm">
                {currentRank.label}
            </div>

            {/* VALOR */}
            <div className="stat-value text-primary text-2xl sm:text-3xl">
                {position > 0 ? `${position}°` : "--"}
            </div>

            {/* DESCRIÇÃO */}
            <div className="stat-desc text-base-content/50 text-xs px-1 sm:px-0">
                {currentRank.description}
            </div>

            {/* Badge */}
            <div className="absolute bottom-2 right-2">
                <div className="badge badge-xs badge-primary opacity-60">
                    {currentRank.key}
                </div>
            </div>
        </div>

    );
};