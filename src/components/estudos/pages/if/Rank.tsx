import { useState, useEffect } from 'react';
import { Trophy, Zap, Flame, Award, Crown, Medal, TrendingUp, User, CheckCircle } from 'lucide-react';
import { db, auth } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import AnimatedPage from '@/components/AnimatedPage';
import { formatUserNameWithCustom } from '@/utils/formatUserName';
import { getUserRole } from '@/data/roles';
import { roleIcons } from '@/utils/roleIcons';
import { LEVEL_XP } from '@/components/estudos/data/levelXp';

interface UserRanking {
  uid: string;
  displayName: string;
  photoURL?: string;
  email?: string;
  xp: number;
  level: number;
  streak: number;
  conquistas: number;
  questoesAcertadas: number;
  pontuacaoTotal: number;
}

// Função para calcular o nível baseado no XP total
const calculateLevel = (totalXP: number): number => {
  let accumulatedXP = 0;
  
  for (let level = 1; level <= 100; level++) {
    const xpNeeded = LEVEL_XP[level] || 500;
    accumulatedXP += xpNeeded;
    
    if (totalXP < accumulatedXP) {
      return level;
    }
  }
  
  return 100; // Nível máximo
};

export const Rank = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'xp' | 'streak' | 'conquistas' | 'questoesAcertadas' | 'geral'>('geral');
  const [rankings, setRankings] = useState<{
    xp: UserRanking[];
    streak: UserRanking[];
    conquistas: UserRanking[];
    questoesAcertadas: UserRanking[];
    geral: UserRanking[];
  }>({
    xp: [],
    streak: [],
    conquistas: [],
    questoesAcertadas: [],
    geral: []
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
        loadRankings();
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadRankings = async () => {
    try {
      setLoading(true);

      // Buscar todos os usuários e seus dados
      const usersSnapshot = await getDocs(collection(db, "users"));
      const xpSnapshot = await getDocs(collection(db, "user_xp"));
      const streaksSnapshot = await getDocs(collection(db, "user_streaks"));
      const conquistasSnapshot = await getDocs(collection(db, "user_conquistas"));

      // Criar mapa de XP e questões
      const xpMap = new Map();
      xpSnapshot.forEach(doc => {
        const data = doc.data();
        xpMap.set(doc.id, {
          xp: data.totalXp || 0,
          questoesAcertadas: data.questoesAcertadas || 0
        });
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
        const userData = doc.data();
        const uid = doc.id;

        const xpData = xpMap.get(uid) || { xp: 0, questoesAcertadas: 0 };
        const totalXP = xpData.xp;
        const questoesAcertadas = xpData.questoesAcertadas;
        const level = calculateLevel(totalXP);
        const streak = streaksMap.get(uid) || 0;
        const conquistas = conquistasMap.get(uid) || 0;

        // Calcular pontuação total: XP + Sequência + (Conquistas × 10) + (Questões × 2)
        const pontuacaoTotal = totalXP + streak + (conquistas * 10) + (questoesAcertadas * 2);

        users.push({
          uid,
          displayName: formatUserNameWithCustom(userData.email),
          photoURL: userData.photoURL,
          email: userData.email,
          xp: totalXP,
          level,
          streak,
          conquistas,
          questoesAcertadas,
          pontuacaoTotal
        });
      });

      // Ordenar por cada critério
      setRankings({
        xp: [...users].sort((a, b) => b.xp - a.xp),
        streak: [...users].sort((a, b) => b.streak - a.streak),
        conquistas: [...users].sort((a, b) => b.conquistas - a.conquistas),
        questoesAcertadas: [...users].sort((a, b) => b.questoesAcertadas - a.questoesAcertadas),
        geral: [...users].sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal)
      });

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar rankings:', error);
      setLoading(false);
    }
  };

  const getMedalColor = (position: number) => {
    switch (position) {
      case 0: return 'text-warning';
      case 1: return 'text-base-content/70';
      case 2: return 'text-orange-600';
      default: return 'text-base-content/50';
    }
  };

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0: return <Crown className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 1: return <Medal className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 2: return <Medal className="w-5 h-5 sm:w-6 sm:h-6" />;
      default: return <span className="text-sm sm:text-lg font-bold">#{position + 1}</span>;
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'xp': return <Zap className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'streak': return <Flame className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'conquistas': return <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'questoesAcertadas': return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'geral': return <Award className="w-4 h-4 sm:w-5 sm:h-5" />;
      default: return null;
    }
  };

  const getValueByTab = (user: UserRanking, tab: string) => {
    switch (tab) {
      case 'xp': return `${user.xp.toLocaleString()} XP`;
      case 'streak': return `${user.streak} dias`;
      case 'conquistas': return `${user.conquistas}/24`;
      case 'questoesAcertadas': return `${user.questoesAcertadas} acertos`;
      case 'geral': return `${user.pontuacaoTotal.toLocaleString()} pts`;
      default: return '';
    }
  };

  const getUserRoleIcon = (email?: string) => {
    const userRole = getUserRole(email);
    const RoleIcon = roleIcons[userRole.key] || User;
    return RoleIcon;
  };

  const getUserRoleColor = (email?: string) => {
    const userRole = getUserRole(email);
    return userRole.color || 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
  };

  const currentRanking = rankings[activeTab];

  if (loading) {
    return (
      <AnimatedPage>
        <div className="flex items-center justify-center min-h-screen">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </AnimatedPage>
    );
  }

  if (currentRanking.length === 0) {
    return (
      <AnimatedPage>
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="card bg-base-200 shadow-xl max-w-md w-full">
            <div className="card-body text-center">
              <Trophy className="w-12 h-12 sm:w-16 sm:h-16 mx-auto opacity-50" />
              <h2 className="card-title justify-center text-lg sm:text-xl">Nenhum usuário encontrado</h2>
              <p className="opacity-60 text-sm sm:text-base">Seja o primeiro a aparecer no ranking!</p>
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen p-3 sm:p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="card bg-base-200 shadow-xl mb-4 sm:mb-6">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-xl w-12 sm:w-16 flex items-center justify-center shadow-lg ring-2 ring-primary/30">
                      <Trophy className="w-7 h-7 sm:w-10 sm:h-10 drop-shadow-sm" />
                    </div>
                  </div>

                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Rankings</h1>
                    <p className="text-xs sm:text-sm text-base-content/60">Veja sua posição e dos melhores</p>
                  </div>
                </div>
                <div className="stats shadow bg-base-100 text-center">
                  <div className="stat py-3 px-4 sm:py-4 sm:px-6">
                    <div className="stat-title text-xs">Total</div>
                    <div className="stat-value text-2xl sm:text-3xl text-primary">{currentRanking.length}</div>
                    <div className="stat-desc text-xs">estudantes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-base-200 shadow-xl mb-4 sm:mb-6 p-2 rounded-box">
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              <button
                className={`btn btn-sm ${activeTab === 'geral' ? 'btn-primary' : 'btn-ghost'} flex-col h-auto py-2`}
                onClick={() => setActiveTab('geral')}
              >
                {getTabIcon('geral')}
                <span className="text-xs mt-1">Geral</span>
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'xp' ? 'btn-primary' : 'btn-ghost'} flex-col h-auto py-2`}
                onClick={() => setActiveTab('xp')}
              >
                {getTabIcon('xp')}
                <span className="text-xs mt-1">XP</span>
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'streak' ? 'btn-primary' : 'btn-ghost'} flex-col h-auto py-2`}
                onClick={() => setActiveTab('streak')}
              >
                {getTabIcon('streak')}
                <span className="text-xs mt-1">Foguinho</span>
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'conquistas' ? 'btn-primary' : 'btn-ghost'} flex-col h-auto py-2`}
                onClick={() => setActiveTab('conquistas')}
              >
                {getTabIcon('conquistas')}
                <span className="text-xs mt-1">Conquistas</span>
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'questoesAcertadas' ? 'btn-primary' : 'btn-ghost'} flex-col h-auto py-2`}
                onClick={() => setActiveTab('questoesAcertadas')}
              >
                {getTabIcon('questoesAcertadas')}
                <span className="text-xs mt-1">Questões</span>
              </button>
            </div>
          </div>

          {/* Top 3 Pódio */}
          {currentRanking.length >= 3 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
              {currentRanking.slice(0, 3).map((user, index) => {
                const positions = [1, 0, 2];
                const actualPosition = positions.indexOf(index);
                const RoleIcon = getUserRoleIcon(user.email);

                return (
                  <div
                    key={user.uid}
                    className={`card bg-base-200 shadow-xl ${actualPosition === 1 ? 'order-2' : actualPosition === 0 ? 'order-1' : 'order-3'}`}
                  >
                    <div className="card-body p-2 sm:p-4 items-center text-center">
                      <div className={`${getMedalColor(index)} mb-1 sm:mb-2`}>
                        {getMedalIcon(index)}
                      </div>
                      <div className="avatar">
                        <div className="w-10 sm:w-14 lg:w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName} />
                          ) : (
                            <div className={`${getUserRoleColor(user.email)} flex items-center justify-center rounded-full`}>
                              <RoleIcon className="w-5 sm:w-7 lg:w-8 drop-shadow-sm" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <RoleIcon className="w-3 h-3 sm:w-4 sm:h-4 opacity-60" />
                        <h3 className="font-semibold text-xs sm:text-sm capitalize truncate">{user.displayName}</h3>
                      </div>
                      <div className={`badge ${index === 0 ? 'badge-warning' : 'badge-ghost'} badge-xs sm:badge-sm`}>
                        <span className="text-xs">{getValueByTab(user, activeTab)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Lista de Rankings */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="table table-sm sm:table-md">
                  <thead>
                    <tr>
                      <th className="w-12 sm:w-16">Pos.</th>
                      <th>Usuário</th>
                      <th className="text-right">Pontuação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRanking.map((user, index) => {
                      const RoleIcon = getUserRoleIcon(user.email);

                      return (
                        <tr
                          key={user.uid}
                          className={`hover ${currentUser === user.uid ? 'bg-primary/10' : ''}`}
                        >
                          <td>
                            <div className={`flex items-center justify-center ${getMedalColor(index)}`}>
                              {index < 3 ? getMedalIcon(index) : `#${index + 1}`}
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="avatar">
                                <div className="w-8 sm:w-10 rounded-full">
                                  {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName} />
                                  ) : (
                                    <div className={`${getUserRoleColor(user.email)} flex items-center justify-center w-full h-full rounded-full`}>
                                      <RoleIcon className="w-4 sm:w-5 drop-shadow-sm" />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                  <RoleIcon className="w-3 h-3 sm:w-4 sm:h-4 opacity-60 flex-shrink-0" />
                                  <h1 className="font-semibold text-xs sm:text-sm capitalize truncate">
                                    {user.displayName}
                                  </h1>
                                  {currentUser === user.uid && (
                                    <span className="badge badge-primary badge-xs sm:badge-sm">Você</span>
                                  )}
                                </div>
                                <div className="text-xs opacity-60">
                                  Nível {user.level}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-right">
                            <div className="font-bold flex items-center justify-end gap-1 sm:gap-2 text-xs sm:text-sm">
                              {getTabIcon(activeTab)}
                              <span className="whitespace-nowrap">{getValueByTab(user, activeTab)}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Info sobre pontuação geral */}
          {activeTab === 'geral' && (
            <div className="alert alert-info shadow-lg mt-4 sm:mt-6">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-sm sm:text-base">Como funciona a pontuação geral?</h3>
                <div className="text-xs sm:text-sm">
                  XP + Sequência + (Conquistas × 10) + (Questões Acertadas × 2)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};