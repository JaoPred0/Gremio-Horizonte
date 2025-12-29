import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  Settings,
  BookOpen,
  Target,
  Clock,
  Shuffle,
  Building2,
  FileText,
  ChevronRight,
  Sparkles,
  Zap,
  Filter,
  X,
  History
} from 'lucide-react';
import {
  questoes,
  getMaterias,
  getAssuntos,
  getInstituicoes,
  DIFICULDADE_LABELS
} from '../vestpro/simulados/QuestionData';

export default function Simulado() {
  const navigate = useNavigate();
  const [materiasSelecionadas, setMateriasSelecionadas] = useState([]);
  const [assuntosSelecionados, setAssuntosSelecionados] = useState([]);
  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState('');
  const [dificuldade, setDificuldade] = useState('misto');
  const [quantidade, setQuantidade] = useState(10);
  const [misturar, setMisturar] = useState(true);
  const [tempoLimite, setTempoLimite] = useState(false);
  const [minutosPorQuestao, setMinutosPorQuestao] = useState(2);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);

  const materias = getMaterias();
  const instituicoes = getInstituicoes();
  const assuntosDisponiveis = useMemo(() => {
    if (materiasSelecionadas.length === 0) return getAssuntos(null);
    return materiasSelecionadas.flatMap(m => getAssuntos(m));
  }, [materiasSelecionadas]);

  const questoesFiltradas = useMemo(() => {
    return questoes.filter(q => {
      const materiaMatch = materiasSelecionadas.length === 0 || materiasSelecionadas.includes(q.materia);
      const assuntoMatch = assuntosSelecionados.length === 0 || assuntosSelecionados.includes(q.assunto);
      const dificuldadeMatch = dificuldade === 'misto' || q.dificuldade === dificuldade;
      const instituicaoMatch = !instituicaoSelecionada || q.instituicao === instituicaoSelecionada;
      return materiaMatch && assuntoMatch && dificuldadeMatch && instituicaoMatch;
    });
  }, [materiasSelecionadas, assuntosSelecionados, dificuldade, instituicaoSelecionada]);

  const toggleMateria = (materia) => {
    setMateriasSelecionadas(prev =>
      prev.includes(materia)
        ? prev.filter(m => m !== materia)
        : [...prev, materia]
    );
    setAssuntosSelecionados([]);
  };

  const toggleAssunto = (assunto) => {
    setAssuntosSelecionados(prev =>
      prev.includes(assunto)
        ? prev.filter(a => a !== assunto)
        : [...prev, assunto]
    );
  };

  const iniciarSimulado = () => {
    let questoesParaSimulado = [...questoesFiltradas];

    if (misturar) {
      questoesParaSimulado.sort(() => Math.random() - 0.5);
    }

    questoesParaSimulado = questoesParaSimulado.slice(0, quantidade);

    const config = {
      materias: materiasSelecionadas,
      assuntos: assuntosSelecionados,
      instituicao: instituicaoSelecionada,
      dificuldade,
      quantidade,
      misturar,
      tempoLimite: tempoLimite ? quantidade * minutosPorQuestao : null,
      mostrarFeedback
    };

    // Salvar no sessionStorage para a página de prova
    sessionStorage.setItem('simuladoData', JSON.stringify({
      questoes: questoesParaSimulado,
      config
    }));

    navigate('/simulado/prova');
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Target className="w-6 h-6 text-white" />
                </div>
                Configurar Simulado
              </h1>
              <p className="text-slate-500 mt-2">Monte seu simulado personalizado e teste seus conhecimentos</p>
            </div>

            <Link to="/simulado/historico">
              <button className="btn btn-outline gap-2">
                <History className="w-4 h-4" />
                Histórico
              </button>
            </Link>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coluna de filtros */}
          <div className="lg:col-span-2 space-y-6">
            {/* Matérias */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-slate-800">Matérias</h2>
                {materiasSelecionadas.length > 0 && (
                  <span className="badge badge-secondary ml-auto">
                    {materiasSelecionadas.length} selecionada(s)
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {materias.map(materia => (
                  <button
                    key={materia}
                    onClick={() => toggleMateria(materia)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${materiasSelecionadas.includes(materia)
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {materia}
                  </button>
                ))}
              </div>

              {materiasSelecionadas.length > 0 && (
                <button
                  onClick={() => setMateriasSelecionadas([])}
                  className="text-xs text-slate-500 hover:text-slate-700 mt-3 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Limpar seleção
                </button>
              )}
            </motion.div>

            {/* Assuntos */}
            {assuntosDisponiveis.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-purple-600" />
                  <h2 className="font-semibold text-slate-800">Assuntos</h2>
                  <span className="text-xs text-slate-400 ml-2">(opcional)</span>
                </div>

                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {[...new Set(assuntosDisponiveis)].map(assunto => (
                    <button
                      key={assunto}
                      onClick={() => toggleAssunto(assunto)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${assuntosSelecionados.includes(assunto)
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {assunto}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Instituição */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-amber-600" />
                <h2 className="font-semibold text-slate-800">Instituição</h2>
                <span className="text-xs text-slate-400 ml-2">(opcional)</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setInstituicaoSelecionada('')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!instituicaoSelecionada
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  Todas
                </button>
                {instituicoes.map(inst => (
                  <button
                    key={inst}
                    onClick={() => setInstituicaoSelecionada(inst)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${instituicaoSelecionada === inst
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {inst}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Dificuldade */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-orange-600" />
                <h2 className="font-semibold text-slate-800">Dificuldade</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setDificuldade('misto')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${dificuldade === 'misto'
                      ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Misto
                </button>
                {Object.entries(DIFICULDADE_LABELS).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setDificuldade(key)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${dificuldade === key
                        ? info.color + ' shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent'
                      }`}
                  >
                    {info.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Quantidade e opções */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-slate-600" />
                <h2 className="font-semibold text-slate-800">Configurações</h2>
              </div>

              {/* Quantidade */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-700">
                    Quantidade de questões
                  </label>
                  <span className="text-2xl font-bold text-blue-600">{quantidade}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={Math.min(50, questoesFiltradas.length)}
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  step={5}
                  className="range range-primary w-full"
                />
                <p className="text-xs text-slate-400 mt-2">
                  {questoesFiltradas.length} questões disponíveis com os filtros atuais
                </p>
              </div>

              {/* Opções */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shuffle className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-700">Misturar questões</p>
                      <p className="text-xs text-slate-500">Ordem aleatória das questões</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={misturar}
                    onChange={(e) => setMisturar(e.target.checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-700">Tempo limite</p>
                      <p className="text-xs text-slate-500">
                        {tempoLimite
                          ? `${quantidade * minutosPorQuestao} minutos (${minutosPorQuestao} min/questão)`
                          : 'Sem limite de tempo'}
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={tempoLimite}
                    onChange={(e) => setTempoLimite(e.target.checked)}
                  />
                </div>

                {tempoLimite && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Minutos por questão</span>
                      <span className="font-semibold text-slate-700">{minutosPorQuestao} min</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={minutosPorQuestao}
                      onChange={(e) => setMinutosPorQuestao(Number(e.target.value))}
                      step={0.5}
                      className="range range-primary w-full"
                    />
                  </motion.div>
                )}

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-700">Feedback imediato</p>
                      <p className="text-xs text-slate-500">Ver se acertou após cada questão</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={mostrarFeedback}
                    onChange={(e) => setMostrarFeedback(e.target.checked)}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Coluna lateral - Resumo */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-6"
            >
              <h3 className="font-semibold text-slate-800 mb-4">Resumo do Simulado</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Questões</span>
                  <span className="font-semibold text-slate-700">{quantidade}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Disponíveis</span>
                  <span className={`font-semibold ${questoesFiltradas.length < quantidade ? 'text-red-500' : 'text-emerald-600'}`}>
                    {questoesFiltradas.length}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Tempo estimado</span>
                  <span className="font-semibold text-slate-700">
                    {tempoLimite
                      ? `${quantidade * minutosPorQuestao} min`
                      : `~${quantidade * 2} min`
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Dificuldade</span>
                  <span className="font-semibold text-slate-700">
                    {dificuldade === 'misto' ? 'Misto' : DIFICULDADE_LABELS[dificuldade]?.label}
                  </span>
                </div>

                {materiasSelecionadas.length > 0 && (
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500 block mb-2">Matérias selecionadas:</span>
                    <div className="flex flex-wrap gap-1">
                      {materiasSelecionadas.map(m => (
                        <span key={m} className="badge badge-secondary text-xs">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={iniciarSimulado}
                disabled={questoesFiltradas.length === 0}
                className="btn btn-primary w-full h-14 rounded-xl font-semibold text-base"
              >
                <Play className="w-5 h-5" />
                Iniciar Simulado
                <ChevronRight className="w-5 h-5" />
              </button>

              {questoesFiltradas.length < quantidade && (
                <p className="text-xs text-red-500 text-center mt-3">
                  Não há questões suficientes. Ajuste os filtros.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}