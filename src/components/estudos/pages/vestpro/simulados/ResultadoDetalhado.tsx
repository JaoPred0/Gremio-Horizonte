import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Clock, 
  Zap, 
  TrendingUp, 
  Award,
  BookOpen,
  BarChart3,
  CheckCircle2,
  XCircle,
  MinusCircle
} from 'lucide-react';
import { DIFICULDADE_LABELS, XP_POR_DIFICULDADE } from './QuestionData';

export default function ResultadoDetalhado({ 
  questoes, 
  respostas, 
  tempoTotal,
  config 
}) {
  // Cálculos de resultado
  const totalQuestoes = questoes.length;
  const respondidas = Object.keys(respostas).length;
  const puladas = totalQuestoes - respondidas;
  
  const acertos = questoes.filter(q => respostas[q.id] === q.correta).length;
  const erros = respondidas - acertos;
  const percentual = Math.round((acertos / totalQuestoes) * 100);

  // XP calculado
  const xpGanho = questoes.reduce((total, q) => {
    if (respostas[q.id] === q.correta) {
      return total + XP_POR_DIFICULDADE[q.dificuldade];
    }
    return total;
  }, 0);

  // Estatísticas por matéria
  const estatisticasPorMateria = questoes.reduce((acc, q) => {
    if (!acc[q.materia]) {
      acc[q.materia] = { total: 0, acertos: 0, erros: 0, puladas: 0 };
    }
    acc[q.materia].total++;
    
    if (respostas[q.id] === undefined) {
      acc[q.materia].puladas++;
    } else if (respostas[q.id] === q.correta) {
      acc[q.materia].acertos++;
    } else {
      acc[q.materia].erros++;
    }
    return acc;
  }, {});

  // Estatísticas por dificuldade
  const estatisticasPorDificuldade = questoes.reduce((acc, q) => {
    if (!acc[q.dificuldade]) {
      acc[q.dificuldade] = { total: 0, acertos: 0 };
    }
    acc[q.dificuldade].total++;
    if (respostas[q.id] === q.correta) {
      acc[q.dificuldade].acertos++;
    }
    return acc;
  }, {});

  const formatarTempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min}m ${seg}s`;
  };

  const getDesempenhoLabel = (perc) => {
    if (perc >= 90) return { label: 'Excelente!', color: 'text-emerald-600', emoji: '🏆' };
    if (perc >= 70) return { label: 'Muito Bom!', color: 'text-blue-600', emoji: '⭐' };
    if (perc >= 50) return { label: 'Bom', color: 'text-amber-600', emoji: '👍' };
    return { label: 'Continue Praticando', color: 'text-orange-600', emoji: '💪' };
  };

  const desempenho = getDesempenhoLabel(percentual);

  return (
    <div className="space-y-6">
      {/* Card principal com resultado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Resultado do Simulado</h1>
              <p className="text-blue-200">Confira seu desempenho detalhado</p>
            </div>
            <div className="text-6xl">{desempenho.emoji}</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5" />
                <span className="text-sm text-blue-100">Acertos</span>
              </div>
              <p className="text-3xl font-bold">{acertos}/{totalQuestoes}</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm text-blue-100">Percentual</span>
              </div>
              <p className="text-3xl font-bold">{percentual}%</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm text-blue-100">Tempo</span>
              </div>
              <p className="text-3xl font-bold">{formatarTempo(tempoTotal)}</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm text-blue-100">XP Ganho</span>
              </div>
              <p className="text-3xl font-bold">+{xpGanho}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Resumo de respostas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-emerald-700">{acertos}</p>
          <p className="text-sm text-emerald-600">Acertos</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
          <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-red-700">{erros}</p>
          <p className="text-sm text-red-600">Erros</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
          <MinusCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-3xl font-bold text-slate-700">{puladas}</p>
          <p className="text-sm text-slate-600">Puladas</p>
        </div>
      </motion.div>

      {/* Desempenho por matéria */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 border border-slate-200"
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-800">Desempenho por Matéria</h3>
        </div>
        
        <div className="space-y-4">
          {Object.entries(estatisticasPorMateria).map(([materia, stats]) => {
            const perc = Math.round((stats.acertos / stats.total) * 100);
            return (
              <div key={materia}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{materia}</span>
                  <span className="text-sm text-slate-500">
                    {stats.acertos}/{stats.total} ({perc}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${perc}%` }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className={`h-full rounded-full ${
                      perc >= 70 ? 'bg-emerald-500' : perc >= 50 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Desempenho por dificuldade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 border border-slate-200"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-800">Desempenho por Dificuldade</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(estatisticasPorDificuldade).map(([dificuldade, stats]) => {
            const perc = Math.round((stats.acertos / stats.total) * 100);
            const info = DIFICULDADE_LABELS[dificuldade];
            return (
              <div key={dificuldade} className="text-center p-4 bg-slate-50 rounded-xl">
                <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full mb-2 ${info.color}`}>
                  {info.label}
                </span>
                <p className="text-2xl font-bold text-slate-800">{perc}%</p>
                <p className="text-xs text-slate-500">{stats.acertos}/{stats.total}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Tempo médio por questão */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tempo médio por questão</p>
              <p className="text-xl font-bold text-slate-800">
                {Math.round(tempoTotal / totalQuestoes)}s
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Questões/minuto</p>
            <p className="text-xl font-bold text-slate-800">
              {(totalQuestoes / (tempoTotal / 60)).toFixed(1)}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}