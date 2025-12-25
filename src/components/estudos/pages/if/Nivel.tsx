import { Trophy, Zap } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { db, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { LEVEL_XP } from "../../data/levelXp";
import AnimatedPage from '../../../AnimatedPage';

interface UserXP {
    uid: string;
    xp: number;
    level: number;
}

interface UserStreak {
    currentStreak: number;
    lastCompletedDate: string;
    totalDaysCompleted: number;
}

export const Nivel = () => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [userXP, setUserXP] = useState<UserXP>({
        uid: "",
        xp: 0,
        level: 1
    });
    const [streakData, setStreakData] = useState<UserStreak>({
        currentStreak: 0,
        lastCompletedDate: '',
        totalDaysCompleted: 0
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user.uid);
                loadUserData(user.uid);
            } else {
                setCurrentUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const loadUserData = async (uid: string) => {
        try {
            // Carregar XP
            const xpRef = doc(db, "user_xp", uid);
            const xpSnap = await getDoc(xpRef);

            if (xpSnap.exists()) {
                setUserXP(xpSnap.data() as UserXP);
            }

            // Carregar Streak
            const streakRef = doc(db, "user_streaks", uid);
            const streakSnap = await getDoc(streakRef);

            if (streakSnap.exists()) {
                setStreakData(streakSnap.data() as UserStreak);
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calcula XP necessário para o próximo nível
    const getXpForNextLevel = (level: number) => {
        return LEVEL_XP[level] ?? LEVEL_XP[10]; // fallback para nível alto
    };
    const getTotalXpUntilLevel = (level: number) => {
        let total = 0;
        for (let i = 1; i < level; i++) {
            total += LEVEL_XP[i] ?? 0;
        }
        return total;
    };

    // Calcula XP atual dentro do nível
    const getCurrentLevelXP = () => {
        const previousLevelsXP = getTotalXpUntilLevel(userXP.level);
        return userXP.xp - previousLevelsXP;
    };

    const calculateLevelFromXP = (xp: number) => {
        let level = 1;
        let remainingXP = xp;

        while (LEVEL_XP[level] && remainingXP >= LEVEL_XP[level]) {
            remainingXP -= LEVEL_XP[level];
            level++;
        }

        return {
            level,
            xpInCurrentLevel: remainingXP,
            xpForNextLevel: LEVEL_XP[level] ?? LEVEL_XP[100]
        };
    };

    const { level, xpInCurrentLevel, xpForNextLevel } =
        calculateLevelFromXP(userXP.xp);

    const progress = Math.min(
        (xpInCurrentLevel / xpForNextLevel) * 100,
        100
    );

    // Calcula progresso percentual no nível atual
    const getLevelProgress = () => {
        const xpNeeded = getXpForNextLevel(userXP.level);
        const currentXP = getCurrentLevelXP();
        return Math.min((currentXP / xpNeeded) * 100, 100);
    };


    if (loading) {
        return (
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                    <div className="flex items-center justify-center py-8">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                    <div className="text-center py-8">
                        <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="opacity-60">Faça login para ver seu progresso</p>
                    </div>
                </div>
            </div>
        );
    }

    const currentLevelXP = getCurrentLevelXP();
    const xpForNext = getXpForNextLevel(userXP.level);

    return (
        <AnimatedPage>
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">

                    {/* TOPO */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        {/* TÍTULO */}
                        <div>
                            <h1 className="text-3xl font-bold">📚 Estudos</h1>
                            <p className="opacity-70">Seu progresso geral</p>
                        </div>

                        {/* PERFIL */}
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="badge badge-primary badge-lg gap-2">
                                    <Trophy size={16} />
                                    Nível {level}
                                </div>

                                <p className="text-xs opacity-60 mt-1">
                                    XP total: {userXP.xp.toLocaleString('pt-BR')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* XP PROGRESS */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center gap-1">
                                <Zap size={14} className="text-primary" />
                                Progresso de XP
                            </span>
                            <span className="font-bold">
                                {xpInCurrentLevel} / {xpForNextLevel} XP
                            </span>

                        </div>
                        <progress
                            className="progress progress-primary w-full"
                            value={progress}
                            max={100}
                        />
                        <p className="text-xs opacity-60 mt-1 text-right">
                            {Math.round(progress)}% para o nível {level + 1}
                        </p>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};