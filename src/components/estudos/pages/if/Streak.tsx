import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Check, X, Trophy, ArrowLeft, Mail } from "lucide-react";
import confetti from "canvas-confetti";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
// import exercises from "../../data/exercises";
import AnimatedPage from "../../../AnimatedPage";

interface UserStreak {
  currentStreak: number;
  lastCompletedDate: string;
  totalDaysCompleted: number;
  exercisesCompletedToday: number;
  userEmail: string;
}

interface UserXP {
  uid: string;
  xp: number;
  level: number;
}

export const Streak = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [streakData, setStreakData] = useState<UserStreak>({
    currentStreak: 0,
    lastCompletedDate: '',
    totalDaysCompleted: 0,
    exercisesCompletedToday: 0,
    userEmail: '',
  });
  const [userXP, setUserXP] = useState<UserXP>({
    uid: "",
    xp: 0,
    level: 1
  });
  const [showCompletion, setShowCompletion] = useState(false);
  const [alreadyCompletedToday, setAlreadyCompletedToday] = useState(false);
  const [streakIncreased, setStreakIncreased] = useState(false);
  const [xpGained, setXpGained] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
        setUserEmail(user.email || "");
        loadStreakData(user.uid);
        loadUserXP(user.uid);
      } else {
        setCurrentUser(null);
        setUserEmail("");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserXP = async (uid: string) => {
    try {
      const xpRef = doc(db, "user_xp", uid);
      const xpSnap = await getDoc(xpRef);

      if (xpSnap.exists()) {
        setUserXP(xpSnap.data() as UserXP);
      } else {
        const initialXP: UserXP = {
          uid,
          xp: 0,
          level: 1
        };
        await setDoc(xpRef, initialXP);
        setUserXP(initialXP);
      }
    } catch (error) {
      console.error('Erro ao carregar XP:', error);
    }
  };

  const loadStreakData = async (uid: string) => {
    try {
      const docRef = doc(db, 'user_streaks', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as UserStreak;
        setStreakData(data);

        const today = new Date().toDateString();
        if (data.lastCompletedDate === today && data.exercisesCompletedToday >= 5) {
          setAlreadyCompletedToday(true);
        }
      } else {
        const initialData: UserStreak = {
          currentStreak: 0,
          lastCompletedDate: '',
          totalDaysCompleted: 0,
          exercisesCompletedToday: 0,
          userEmail: auth.currentUser?.email || '',
        };
        await setDoc(docRef, initialData);
        setStreakData(initialData);
      }
    } catch (error) {
      console.error('Erro ao carregar streak:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === exercises[currentExercise].correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      updateXP(10);

      setTimeout(() => {
        const newCompleted = [...completedExercises, currentExercise];
        setCompletedExercises(newCompleted);

        if (newCompleted.length === 5) {
          completeStreak();
        } else {
          nextExercise();
        }
      }, 1000);
    }
  };

  const updateXP = async (xpAmount: number) => {
    if (!currentUser) return;

    const newXp = userXP.xp + xpAmount;
    const newLevel = calculateLevel(newXp);

    const xpRef = doc(db, "user_xp", currentUser);

    await setDoc(
      xpRef,
      {
        xp: newXp,
        level: newLevel,
        updatedAt: new Date()
      },
      { merge: true }
    );

    setUserXP(prev => ({
      ...prev,
      xp: newXp,
      level: newLevel
    }));
  };

  const nextExercise = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setCurrentExercise(prev => prev + 1);
  };

  const retryExercise = () => {
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  const getXpForNextLevel = (level: number) => {
    return level * 100;
  };

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} fixed top-4 right-4 w-auto max-w-sm z-50 shadow-lg animate-in slide-in-from-top-5`;
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('animate-out', 'slide-out-to-top-5');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const completeStreak = async () => {
    if (!currentUser) return;

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let newStreak = 1;
    let increased = false;

    if (streakData.lastCompletedDate === yesterday) {
      newStreak = streakData.currentStreak + 1;
      increased = true;
    } else if (streakData.lastCompletedDate === today) {
      newStreak = streakData.currentStreak;
    } else {
      newStreak = 1;
      increased = streakData.currentStreak === 0;
    }

    const totalXpGained = 50; // 5 exercícios * 10 XP

    setStreakIncreased(increased);
    setXpGained(totalXpGained);
    setShowCompletion(true);
    triggerConfetti();

    try {
      const updatedData: UserStreak = {
        currentStreak: newStreak,
        lastCompletedDate: today,
        totalDaysCompleted: streakData.lastCompletedDate === today
          ? streakData.totalDaysCompleted
          : streakData.totalDaysCompleted + 1,
        exercisesCompletedToday: 5,
        userEmail: userEmail,
      };

      const docRef = doc(db, 'user_streaks', currentUser);
      await setDoc(docRef, updatedData, { merge: true });

      setStreakData(updatedData);
      setAlreadyCompletedToday(true);

      showToast(`🔥 Streak de ${newStreak} dias! +${totalXpGained} XP`, 'success');
    } catch (error) {
      console.error('Erro ao salvar streak:', error);
      showToast('Erro ao salvar progresso', 'info');
    }
  };

  const resetDaily = () => {
    setCurrentExercise(0);
    setCompletedExercises([]);
    setShowCompletion(false);
    setAlreadyCompletedToday(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Flame className="w-20 h-20 mx-auto mb-4 text-orange-500" />
          <h2 className="text-2xl font-bold mb-2">Faça login</h2>
          <p className="opacity-60">Entre para manter seu Foguinho ativo</p>
        </div>
      </div>
    );
  }

  if (alreadyCompletedToday || showCompletion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1.1, 1.1, 1.1, 1]
            }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <Flame className="w-32 h-32 text-orange-500 drop-shadow-lg" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full inline-block mb-4 font-bold text-xl">
              🔥 {streakData.currentStreak} dias
            </div>

            <h2 className="text-3xl font-bold mb-2">Foguinho Ativo! 🎉</h2>
            <p className="text-lg opacity-70 mb-4">
              Você completou os exercícios de hoje!
            </p>

            {xpGained > 0 && (
              <div className="bg-primary/10 px-4 py-2 rounded-lg inline-block mb-4">
                <p className="text-sm font-bold text-primary">
                  +{xpGained} XP ganhos
                </p>
              </div>
            )}

            <p className="text-sm opacity-50 mt-6">
              Volte amanhã para continuar seu Foguinho!
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="btn btn-outline mt-6 gap-2 mx-auto"
            >
              <ArrowLeft size={18} />
              Voltar
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const exercise = exercises[currentExercise];
  const progress = (completedExercises.length / 5) * 100;

  return (
    <AnimatedPage>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-500" />
                Foguinho Diário
              </h1>
              <p className="text-sm opacity-60 mt-1">
                Complete 5 exercícios para manter seu Foguinho
              </p>
              <p className="text-xs opacity-40 mt-1 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {userEmail}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold">Progresso</span>
              <span className="text-sm opacity-60">{completedExercises.length}/5</span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex gap-2 mt-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex-1 h-2 rounded-full ${completedExercises.includes(i)
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-base-300'
                    }`}
                />
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentExercise}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-base-100 rounded-3xl shadow-xl overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${exercise.color} p-6 text-white`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <exercise.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{exercise.subject}</h2>
                    <p className="text-sm opacity-90">Questão {currentExercise + 1} de 5</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-6">{exercise.question}</h3>

                <div className="space-y-3">
                  {exercise.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${selectedAnswer === index
                        ? showResult
                          ? isCorrect
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-red-500 bg-red-500/10'
                          : 'border-primary bg-primary/10'
                        : showResult && index === exercise.correctAnswer
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-base-300 hover:border-base-content/30'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {showResult && (
                          <div>
                            {index === exercise.correctAnswer ? (
                              <Check className="w-5 h-5 text-green-500" />
                            ) : selectedAnswer === index ? (
                              <X className="w-5 h-5 text-red-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`mt-6 p-4 rounded-2xl ${isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {isCorrect ? (
                          <>
                            <Check className="w-6 h-6 text-green-500" />
                            <div>
                              <p className="font-bold text-green-500">Correto! 🎉</p>
                              <p className="text-sm opacity-70">Avançando para próxima questão...</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <X className="w-6 h-6 text-red-500" />
                            <div>
                              <p className="font-bold text-red-500">Incorreto</p>
                              <p className="text-sm opacity-70">Tente novamente!</p>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-6 flex gap-3">
                  {!showResult ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={selectedAnswer === null}
                      className="flex-1 btn btn-primary btn-lg"
                    >
                      Confirmar
                    </motion.button>
                  ) : !isCorrect ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={retryExercise}
                      className="flex-1 btn btn-primary btn-lg"
                    >
                      Tentar Novamente
                    </motion.button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AnimatedPage>
  );
};