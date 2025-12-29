import React, { useState, useEffect } from "react";
import { TrendingUp, Zap, Flame, Trophy, Target } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface RankType {
  key: "geral" | "xp" | "streak" | "conquistas" | "questoes";
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
  questoesAcertadas: number;
  pontuacaoTotal: number;
}

const rankTypes: RankType[] = [
  {
    key: "geral",
    label: "Rank Geral",
    icon: <TrendingUp size={28} />,
    description: "Pontuação total",
    color: "text-green-500",
  },
  {
    key: "xp",
    label: "Rank XP",
    icon: <Zap size={28} />,
    description: "Experiência acumulada",
    color: "text-yellow-500",
  },
  {
    key: "streak",
    label: "Rank Sequência",
    icon: <Flame size={28} />,
    description: "Dias consecutivos",
    color: "text-orange-500",
  },
  {
    key: "conquistas",
    label: "Rank Conquistas",
    icon: <Trophy size={28} />,
    description: "Conquistas obtidas",
    color: "text-purple-500",
  },
  {
    key: "questoes",
    label: "Rank Questões",
    icon: <Target size={28} />,
    description: "Questões acertadas",
    color: "text-blue-500",
  },
];

export const RankStat = () => {
  const [currentRankIndex, setCurrentRankIndex] = useState(0);
  const [userPositions, setUserPositions] = useState<Record<string, number>>({
    geral: 0,
    xp: 0,
    streak: 0,
    conquistas: 0,
    questoes: 0,
  });
  const [loading, setLoading] = useState(true);

  // Rotação automática
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRankIndex((prev) => (prev + 1) % rankTypes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) loadUserPositions(user.uid);
      else setLoading(false);
    });
    return () => unsub();
  }, []);

  const loadUserPositions = async (userId: string) => {
    try {
      setLoading(true);

      const usersSnap = await getDocs(collection(db, "users"));
      const xpSnap = await getDocs(collection(db, "user_xp"));
      const streakSnap = await getDocs(collection(db, "user_streaks"));
      const conquistasSnap = await getDocs(collection(db, "user_conquistas"));

      const xpMap = new Map();
      const questoesMap = new Map();
      xpSnap.forEach((doc) => {
        const d = doc.data();
        xpMap.set(doc.id, d.xp || 0);
        questoesMap.set(doc.id, d.questoesAcertadas || 0);
      });

      const streakMap = new Map();
      streakSnap.forEach((doc) =>
        streakMap.set(doc.id, doc.data().currentStreak || 0)
      );

      const conquistasMap = new Map();
      conquistasSnap.forEach((doc) =>
        conquistasMap.set(doc.id, doc.data().totalColetadas || 0)
      );

      const users: UserRanking[] = [];

      usersSnap.forEach((doc) => {
        const uid = doc.id;
        const xp = xpMap.get(uid) || 0;
        const streak = streakMap.get(uid) || 0;
        const conquistas = conquistasMap.get(uid) || 0;
        const questoesAcertadas = questoesMap.get(uid) || 0;

        const pontuacaoTotal =
          xp + streak + conquistas * 10 + questoesAcertadas * 2;

        users.push({
          uid,
          xp,
          streak,
          conquistas,
          questoesAcertadas,
          pontuacaoTotal,
        });
      });

      const rankings = {
        geral: [...users].sort(
          (a, b) => b.pontuacaoTotal - a.pontuacaoTotal
        ),
        xp: [...users].sort((a, b) => b.xp - a.xp),
        streak: [...users].sort((a, b) => b.streak - a.streak),
        conquistas: [...users].sort(
          (a, b) => b.conquistas - a.conquistas
        ),
        questoes: [...users].sort(
          (a, b) => b.questoesAcertadas - a.questoesAcertadas
        ),
      };

      setUserPositions({
        geral: rankings.geral.findIndex((u) => u.uid === userId) + 1,
        xp: rankings.xp.findIndex((u) => u.uid === userId) + 1,
        streak: rankings.streak.findIndex((u) => u.uid === userId) + 1,
        conquistas:
          rankings.conquistas.findIndex((u) => u.uid === userId) + 1,
        questoes:
          rankings.questoes.findIndex((u) => u.uid === userId) + 1,
      });

      setLoading(false);
    } catch (e) {
      console.error("Erro no rank:", e);
      setLoading(false);
    }
  };

  const currentRank = rankTypes[currentRankIndex];
  const position = userPositions[currentRank.key];

  if (loading) {
    return (
      <div className="stat bg-base-200 rounded-xl p-6">
        <div className="loading loading-spinner loading-md"></div>
      </div>
    );
  }

  return (
    <div
      onClick={() => (window.location.href = "/estudos/rank")}
      className="stat bg-base-200 shadow rounded-xl hover:scale-[1.02] transition cursor-pointer text-center"
    >
      <div className={`stat-figure ${currentRank.color}`}>
        {currentRank.icon}
      </div>
      <div className="stat-title">{currentRank.label}</div>
      <div className="stat-value text-primary">
        {position > 0 ? `${position}°` : "--"}
      </div>
      <div className="stat-desc">{currentRank.description}</div>
    </div>
  );
};
