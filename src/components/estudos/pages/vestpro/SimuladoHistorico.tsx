import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  History,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  ChevronRight,
  Search,
  Award,
  BarChart3,
  ArrowLeft,
  Trash2,
  CheckCircle,
  X
} from 'lucide-react';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  getDoc
} from 'firebase/firestore';

export default function SimuladoHistorico() {
  const [historico, setHistorico] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('');
  const [xpTotal, setXpTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const auth = getAuth();
  const db = getFirestore();

  // 🔹 CARREGAR HISTÓRICO E XP
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Carregar histórico
        const q = query(
          collection(db, 'users', user.uid, 'historico'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const dados = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }));
        setHistorico(dados);

        // Carregar XP total do usuário
        const xpRef = doc(db, 'user_xp', user.uid);
        const xpDoc = await getDoc(xpRef);

        if (xpDoc.exists()) {
          setXpTotal(xpDoc.data().totalXp || 0);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // 🔹 REMOVER ITEM DO HISTÓRICO
  const removerHistorico = async (id: string) => {
    if (!auth.currentUser) return;

    try {
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'historico', id));
      setHistorico((prev) => prev.filter((h) => h.id !== id));
      setDeletingId(null);
    } catch (error) {
      console.error('Erro ao remover histórico:', error);
      alert('Erro ao remover simulado. Tente novamente.');
    }
  };

  // 🔹 HELPERS
  const formatarData = (timestamp: any) => {
    const d = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);

    if (d.toDateString() === hoje.toDateString()) return 'Hoje';
    if (d.toDateString() === ontem.toDateString()) return 'Ontem';

    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  };

  const formatarTempo = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    return `${min} min`;
  };

  const getDesempenhoColor = (perc: number) => {
    if (perc >= 80) return 'text-emerald-600 bg-emerald-50';
    if (perc >= 60) return 'text-blue-600 bg-blue-50';
    if (perc >= 40) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  // 🔹 ESTATÍSTICAS
  const totalSimulados = historico.length;
  const mediaAcertos =
    historico.length > 0
      ? Math.round(
          historico.reduce((acc, h) => acc + h.resultado.percentual, 0) /
            historico.length
        )
      : 0;

  const totalXpHistorico = historico.reduce(
    (acc, h) => acc + (h.resultado.xpTotal || 0),
    0
  );

  const totalQuestoes = historico.reduce(
    (acc, h) => acc + h.resultado.totalQuestoes,
    0
  );

  // Total de questões acertadas (não repetidas)
  const totalQuestoesAcertadas = historico.reduce(
    (acc, h) => acc + (h.resultado.acertos || 0),
    0
  );

  const historicoFiltrado = historico.filter((h) => {
    const materias = Array.isArray(h.config?.materias) ? h.config.materias : [];
    
    if (!filtro) return true;
    
    return materias.some((m: string) =>
      m.toLowerCase().includes(filtro.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Link to="/simulado">
              <button className="btn btn-ghost btn-circle">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <History className="w-6 h-6 text-white" />
                </div>
                Histórico de Simulados
              </h1>
              <p className="text-slate-500 mt-2">
                Acompanhe seu progresso e evolução
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cards de estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{totalSimulados}</p>
            <p className="text-xs text-slate-500">Simulados realizados</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{mediaAcertos}%</p>
            <p className="text-xs text-slate-500">Média de acertos</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {xpTotal.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">XP total acumulado</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{totalQuestoesAcertadas}</p>
            <p className="text-xs text-slate-500">Questões acertadas</p>
          </div>
        </motion.div>

        {/* Filtro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por matéria..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="input input-bordered w-full pl-10 h-11 rounded-xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Lista de simulados */}
        <div className="space-y-4">
          {historicoFiltrado.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                {filtro
                  ? 'Nenhum resultado encontrado'
                  : 'Nenhum simulado realizado ainda'}
              </h3>
              <p className="text-slate-500 mb-6">
                {filtro
                  ? 'Tente buscar por outra matéria'
                  : 'Comece agora mesmo e acompanhe seu progresso!'}
              </p>
              {!filtro && (
                <Link to="/simulado">
                  <button className="btn btn-primary rounded-xl">
                    Iniciar primeiro simulado
                  </button>
                </Link>
              )}
            </motion.div>
          ) : (
            historicoFiltrado.map((simulado, idx) => (
              <motion.div
                key={simulado.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {formatarData(simulado.createdAt)}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        {formatarTempo(simulado.resultado.tempoTotal)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.isArray(simulado.config?.materias) && simulado.config.materias.map((materia: string) => (
                        <span
                          key={materia}
                          className="badge badge-secondary rounded-lg"
                        >
                          {materia}
                        </span>
                      ))}
                      <span className="badge badge-outline rounded-lg">
                        {simulado.config?.quantidade || 0} questões
                      </span>
                    </div>

                    <div className="flex items-center gap-6 mb-4">
                      <div>
                        <p className="text-sm text-slate-500">Acertos</p>
                        <p className="text-xl font-bold text-slate-800">
                          {simulado.resultado.acertos}/
                          {simulado.resultado.totalQuestoes}
                        </p>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-xl ${getDesempenhoColor(
                          simulado.resultado.percentual
                        )}`}
                      >
                        <p className="text-2xl font-bold">
                          {simulado.resultado.percentual}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">XP ganho</p>
                        <p className="text-xl font-bold text-amber-600">
                          +{simulado.resultado.xpTotal || 0}
                        </p>
                      </div>
                    </div>

                    {/* Questões acertadas do simulado */}
                    {simulado.resultado.questoesAcertadas &&
                      simulado.resultado.questoesAcertadas.length > 0 && (
                        <details className="text-sm text-slate-600">
                          <summary className="cursor-pointer hover:text-blue-600 font-medium">
                            Ver questões acertadas neste simulado (
                            {simulado.resultado.questoesAcertadas.length})
                          </summary>
                          <div className="mt-3 space-y-2 pl-4 border-l-2 border-blue-200">
                            {simulado.resultado.questoesAcertadas.map(
                              (q: any) => (
                                <div
                                  key={q.id}
                                  className="flex items-center gap-2 text-xs bg-slate-50 p-2 rounded-lg"
                                >
                                  <span className="badge badge-xs badge-success">
                                    ✓
                                  </span>
                                  <span className="font-medium">{q.materia}</span>
                                  <span className="text-slate-400">•</span>
                                  <span>{q.assunto}</span>
                                  <span className="text-slate-400">•</span>
                                  <span className="capitalize text-slate-500">
                                    {q.dificuldade}
                                  </span>
                                  <span className="ml-auto text-amber-600 font-semibold">
                                    +{q.xpGanho} XP
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </details>
                      )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDeletingId(simulado.id)}
                      className="btn btn-ghost btn-circle btn-sm text-slate-400 hover:text-red-500 hover:bg-red-50"
                      title="Remover do histórico"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      {deletingId && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirmar exclusão</h3>
            <p className="py-4">
              Tem certeza que deseja remover este simulado do histórico?
            </p>
            <div className="modal-action">
              <button
                onClick={() => setDeletingId(null)}
                className="btn btn-ghost"
              >
                Cancelar
              </button>
              <button
                onClick={() => removerHistorico(deletingId)}
                className="btn btn-error"
              >
                Remover
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeletingId(null)} />
        </div>
      )}
    </div>
  );
}