import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Flag,
  Menu,
  X
} from 'lucide-react';

import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment
} from 'firebase/firestore';

import QuestionCard from '../vestpro/simulados/QuestionCard';
import QuestionGrid from '../vestpro/simulados/QuestionGrid';
import ProgressBar from '../vestpro/simulados/ProgressBar';
import SimuladoTimer from '../vestpro/simulados/SimuladoTimer';
import PauseModal from '../vestpro/simulados/PauseModal';
import ConfirmModal from '../vestpro/simulados/ConfirmModal';

// Constante de XP por dificuldade
const XP_POR_DIFICULDADE: Record<string, number> = {
  facil: 10,
  medio: 20,
  dificil: 30,
  muito_dificil: 50
};

interface Questao {
  id: string;
  materia: string;
  assunto: string;
  dificuldade: string;
  correta: string;
  [key: string]: any;
}

interface Config {
  mostrarFeedback?: boolean;
  tempoLimite?: number;
  materias?: string[];
  quantidade?: number;
  [key: string]: any;
}

export default function SimuladoProva() {
  const navigate = useNavigate();

  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [config, setConfig] = useState<Config>({});
  const [index, setIndex] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [marcadas, setMarcadas] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [tempoDecorrido, setTempoDecorrido] = useState(0);

  useEffect(() => {
    const data = sessionStorage.getItem('simuladoData');

    if (data) {
      const { questoes: q, config: c } = JSON.parse(data);
      setQuestoes(q);
      setConfig(c);
    } else {
      navigate('/simulado');
    }
  }, [navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTempoDecorrido(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const atual = questoes[index];
  const totalRespondidas = Object.keys(respostas).length;

  const responder = (alternativa: string) => {
    if (!config.mostrarFeedback || respostas[atual.id] === undefined) {
      setRespostas(prev => ({ ...prev, [atual.id]: alternativa }));
    }
  };

  const toggleMarcar = () => {
    setMarcadas(prev =>
      prev.includes(atual.id)
        ? prev.filter(id => id !== atual.id)
        : [...prev, atual.id]
    );
  };

  const navegarPara = (novoIndex: number) => {
    if (novoIndex >= 0 && novoIndex < questoes.length) {
      setIndex(novoIndex);
      setShowSidebar(false);
    }
  };

  const handleTimeUp = () => {
    finalizarSimulado();
  };

  const salvarHistorico = async ({
    questoes,
    respostas,
    config,
    tempoTotal
  }: {
    questoes: Questao[];
    respostas: Record<string, string>;
    config: Config;
    tempoTotal: number;
  }) => {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;

    if (!user) {
      console.error('Usuário não autenticado');
      return;
    }

    try {
      const agora = Timestamp.now();
      const expiraEm = Timestamp.fromMillis(
        agora.toMillis() + 7 * 24 * 60 * 60 * 1000
      );

      // Calcular acertos e XP
      const questoesAcertadas = [];
      let xpTotal = 0;

      // Para cada questão acertada, salvar na collection 'questoes_acertadas'
      for (const id of Object.keys(respostas)) {
        const questao = questoes.find(q => q.id === id);
        if (questao && respostas[id] === questao.correta) {
          const xpGanho = XP_POR_DIFICULDADE[questao.dificuldade] || 0;

          questoesAcertadas.push({
            id: questao.id,
            materia: questao.materia,
            assunto: questao.assunto,
            dificuldade: questao.dificuldade,
            xpGanho
          });

          xpTotal += xpGanho;

          // ✅ SALVAR QUESTÃO INDIVIDUAL NA COLLECTION
          await setDoc(
            doc(db, 'users', user.uid, 'questoes_acertadas', questao.id),
            {
              questaoId: questao.id,
              materia: questao.materia,
              assunto: questao.assunto,
              dificuldade: questao.dificuldade,
              xpGanho,
              acertadaEm: agora,
              simuladoData: agora
            }
          );
        }
      }

      const acertos = questoesAcertadas.length;

      console.log('💾 Salvando histórico:', {
        acertos,
        xpTotal,
        questoesAcertadas: questoesAcertadas.length
      });

      // Salvar no histórico
      await addDoc(
        collection(db, 'users', user.uid, 'historico'),
        {
          createdAt: agora,
          expiresAt: expiraEm,
          config,
          resultado: {
            totalQuestoes: questoes.length,
            acertos,
            erros: questoes.length - acertos,
            percentual: Math.round((acertos / questoes.length) * 100),
            tempoTotal,
            xpTotal,
            questoesAcertadas
          },
          respostas,
          questoesResumo: questoes.map(q => ({
            id: q.id,
            correta: q.correta
          }))
        }
      );

      console.log('✅ Histórico salvo com sucesso!');

      // ✅ ATUALIZAR XP DO USUÁRIO - CORRIGIDO
      const userXpRef = doc(db, 'user_xp', user.uid);
      const userXpDoc = await getDoc(userXpRef);

      if (userXpDoc.exists()) {
        // Atualizar XP existente
        await updateDoc(userXpRef, {
          totalXp: increment(xpTotal),
          questoesAcertadas: increment(acertos),
          updatedAt: agora
        });
        console.log(`✅ XP atualizado: +${xpTotal} (total agora: ${userXpDoc.data().totalXp + xpTotal})`);
      } else {
        // Criar documento inicial
        await setDoc(userXpRef, {
          userId: user.uid,
          totalXp: xpTotal,
          questoesAcertadas: acertos,
          xp: xpTotal, // Também salva em 'xp' para compatibilidade
          createdAt: agora,
          updatedAt: agora
        });
        console.log(`✅ Documento user_xp criado com ${xpTotal} XP`);
      }

      console.log('🎉 Tudo salvo com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao salvar histórico:', error);
      throw error;
    }
  };

  const finalizarSimulado = async () => {
    setIsRunning(false);

    const payload = {
      questoes,
      respostas,
      config,
      tempoTotal: tempoDecorrido
    };

    sessionStorage.setItem('simuladoResultado', JSON.stringify(payload));

    try {
      await salvarHistorico(payload);
      console.log('✅ Histórico salvo com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao salvar histórico:', error);
    }

    navigate('/simulado/conclusao');
  };

  const handlePause = () => {
    setIsRunning(false);
    setShowPauseModal(true);
  };

  const handleResume = () => {
    setShowPauseModal(false);
    setIsRunning(true);
  };

  const handleRestart = () => {
    setIndex(0);
    setRespostas({});
    setMarcadas([]);
    setTempoDecorrido(0);
    setShowPauseModal(false);
    setIsRunning(true);
  };

  const handleExit = () => {
    navigate('/simulado');
  };

  if (!atual) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-600"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:block">
                <span className="text-sm text-slate-500">Questão</span>
                <span className="ml-2 text-lg font-bold text-slate-800">
                  {index + 1} / {questoes.length}
                </span>
              </div>
            </div>

            <SimuladoTimer
              isRunning={isRunning}
              onPause={handlePause}
              onResume={handleResume}
              tempoLimite={config.tempoLimite}
              onTimeUp={handleTimeUp}
            />

            <button
              onClick={() => setShowConfirmModal(true)}
              className="btn btn-outline btn-primary hidden sm:flex gap-2"
            >
              <Send className="w-4 h-4" />
              Finalizar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              <ProgressBar
                total={questoes.length}
                respondidas={totalRespondidas}
                marcadas={marcadas.length}
              />
              <QuestionGrid
                questoes={questoes}
                respostas={respostas}
                marcadas={marcadas}
                currentIndex={index}
                onNavigate={navegarPara}
              />
            </div>
          </aside>

          <AnimatePresence>
            {showSidebar && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setShowSidebar(false)}
                />
                <motion.aside
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 p-4 overflow-y-auto lg:hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-slate-800">Navegação</h2>
                    <button
                      onClick={() => setShowSidebar(false)}
                      className="p-2 rounded-lg bg-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <ProgressBar
                      total={questoes.length}
                      respondidas={totalRespondidas}
                      marcadas={marcadas.length}
                    />
                    <QuestionGrid
                      questoes={questoes}
                      respostas={respostas}
                      marcadas={marcadas}
                      currentIndex={index}
                      onNavigate={navegarPara}
                    />
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <QuestionCard
                key={atual.id}
                questao={atual}
                index={index}
                total={questoes.length}
                resposta={respostas[atual.id]}
                onResponder={responder}
                marcada={marcadas.includes(atual.id)}
                onMarcar={toggleMarcar}
                showFeedback={config.mostrarFeedback}
              />
            </AnimatePresence>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => navegarPara(index - 1)}
                disabled={index === 0}
                className="btn btn-outline gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              <div className="flex items-center gap-2 sm:hidden">
                <button
                  onClick={toggleMarcar}
                  className={`p-2 rounded-lg ${
                    marcadas.includes(atual.id)
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Flag className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="btn btn-primary btn-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {index === questoes.length - 1 ? (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="btn btn-success gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline">Finalizar</span>
                </button>
              ) : (
                <button
                  onClick={() => navegarPara(index + 1)}
                  className="btn btn-primary gap-2"
                >
                  <span className="hidden sm:inline">Próxima</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </main>
        </div>
      </div>

      <PauseModal
        isOpen={showPauseModal}
        onResume={handleResume}
        onRestart={handleRestart}
        onExit={handleExit}
        tempoDecorrido={tempoDecorrido}
        questoesRespondidas={totalRespondidas}
        totalQuestoes={questoes.length}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={finalizarSimulado}
        onCancel={() => setShowConfirmModal(false)}
        questoesRespondidas={totalRespondidas}
        questoesMarcadas={marcadas.length}
        totalQuestoes={questoes.length}
      />
    </div>
  );
}