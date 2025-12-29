import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  Home,
  Eye,
  Share2,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import ResultadoDetalhado from '../vestpro/simulados/ResultadoDetalhado';
import QuestionCard from '../vestpro/simulados/QuestionCard';
import QuestionGrid from '../vestpro/simulados/QuestionGrid';

export default function SimuladoConclusao() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showRevisao, setShowRevisao] = useState(false);
  const [revisaoIndex, setRevisaoIndex] = useState(0);

  useEffect(() => {
    const resultado = sessionStorage.getItem('simuladoResultado');

    if (resultado) {
      setData(JSON.parse(resultado));
    } else {
      navigate('/simulado');
    }
  }, [navigate]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const { questoes, respostas, config, tempoTotal } = data;
  const questaoRevisao = questoes[revisaoIndex];

  return (
    <div className="min-h-screen ">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Resultado detalhado */}
        <ResultadoDetalhado
          questoes={questoes}
          respostas={respostas}
          tempoTotal={tempoTotal}
          config={config}
        />

        {/* Ações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          <Link to="/simulado" className="contents">
            <button className="btn btn-outline h-14 rounded-xl flex flex-col items-center justify-center gap-1">
              <RotateCcw className="w-5 h-5" />
              <span className="text-xs">Novo Simulado</span>
            </button>
          </Link>

          <button
            onClick={() => setShowRevisao(!showRevisao)}
            className="btn btn-outline h-14 rounded-xl flex flex-col items-center justify-center gap-1"
          >
            <Eye className="w-5 h-5" />
            <span className="text-xs">Revisar Questões</span>
          </button>

          <button
            className="btn btn-outline h-14 rounded-xl flex flex-col items-center justify-center gap-1"
            onClick={() => {
              const texto = `Resultado do Simulado:\n${Object.keys(respostas).filter(id => respostas[id] === questoes.find(q => q.id === id)?.correta).length}/${questoes.length} acertos (${Math.round((Object.keys(respostas).filter(id => respostas[id] === questoes.find(q => q.id === id)?.correta).length / questoes.length) * 100)}%)`;
              navigator.clipboard.writeText(texto);
            }}
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs">Compartilhar</span>
          </button>

          <Link to="/simulado" className="contents">
            <button className="btn btn-primary h-14 rounded-xl flex flex-col items-center justify-center gap-1">
              <Home className="w-5 h-5" />
              <span className="text-xs">Voltar ao Início</span>
            </button>
          </Link>
        </motion.div>

        {/* Seção de revisão */}
        <motion.div
          initial={false}
          animate={{ height: showRevisao ? 'auto' : 0 }}
          className="overflow-hidden mt-8"
        >
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Revisão das Questões</h2>
              <button
                onClick={() => setShowRevisao(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <ChevronUp className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <QuestionGrid
                questoes={questoes}
                respostas={respostas}
                marcadas={[]}
                currentIndex={revisaoIndex}
                onNavigate={setRevisaoIndex}
                showResults={true}
              />
            </div>

            {questaoRevisao && (
              <QuestionCard
                questao={questaoRevisao}
                index={revisaoIndex}
                total={questoes.length}
                resposta={respostas[questaoRevisao.id]}
                onResponder={() => { }}
                marcada={false}
                onMarcar={() => { }}
                showResults={true}
              />
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setRevisaoIndex(i => Math.max(0, i - 1))}
                disabled={revisaoIndex === 0}
                className="btn btn-outline"
              >
                Anterior
              </button>
              <button
                onClick={() => setRevisaoIndex(i => Math.min(questoes.length - 1, i + 1))}
                disabled={revisaoIndex === questoes.length - 1}
                className="btn btn-outline"
              >
                Próxima
              </button>
            </div>
          </div>
        </motion.div>

        {/* Botão para mostrar revisão */}
        {!showRevisao && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => setShowRevisao(true)}
            className="w-full mt-8 py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
          >
            <ChevronDown className="w-5 h-5" />
            Ver todas as questões e respostas
          </motion.button>
        )}
      </div>
    </div>
  );
}