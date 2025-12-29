import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  BookOpen, 
  Flag, 
  FlagOff,
  CheckCircle2,
  XCircle,
  Building2,
  FileText,
  Tag,
  BarChart3
} from 'lucide-react';
import { DIFICULDADE_LABELS } from './QuestionData';

export default function QuestionCard({ 
  questao, 
  index, 
  total,
  resposta, 
  onResponder, 
  marcada,
  onMarcar,
  showFeedback = false,
  showResults = false
}) {
  const [showDica, setShowDica] = useState(false);
  const [showResolucao, setShowResolucao] = useState(false);
  
  const isCorreta = resposta === questao.correta;
  const dificuldadeInfo = DIFICULDADE_LABELS[questao.dificuldade];

  const alternativaLetras = ['A', 'B', 'C', 'D', 'E'];

  const getAlternativaStyle = (altIndex) => {
    const selecionada = resposta === altIndex;
    const correta = altIndex === questao.correta;
    
    if (showResults || (showFeedback && resposta !== undefined)) {
      if (correta) {
        return 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-200';
      }
      if (selecionada && !correta) {
        return 'bg-red-50 border-red-500 text-red-800 ring-2 ring-red-200';
      }
      return 'bg-slate-50 border-slate-200 text-slate-500';
    }
    
    if (selecionada) {
      return 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-200';
    }
    
    return 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
    >
      {/* Header com metadados */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-lg">
              {index + 1} / {total}
            </span>
            
            <span className={`text-xs font-medium px-3 py-1 rounded-full border ${dificuldadeInfo.color}`}>
              {dificuldadeInfo.label}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {questao.instituicao && (
              <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200">
                <Building2 className="w-3 h-3" />
                {questao.instituicao}
              </span>
            )}
            {questao.prova && (
              <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200">
                <FileText className="w-3 h-3" />
                {questao.prova}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-3 text-xs">
          <span className="flex items-center gap-1 text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200">
            <Tag className="w-3 h-3" />
            {questao.materia}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">{questao.assunto}</span>
        </div>
      </div>

      {/* Pergunta */}
      <div className="p-6">
        <h2 className="text-lg font-medium text-slate-800 leading-relaxed mb-6">
          {questao.pergunta}
        </h2>

        {/* Alternativas */}
        <div className="space-y-3">
          {questao.alternativas.map((alt, altIndex) => {
            const correta = altIndex === questao.correta;
            const selecionada = resposta === altIndex;
            const showIcon = (showResults || (showFeedback && resposta !== undefined)) && (correta || selecionada);
            
            return (
              <motion.button
                key={altIndex}
                whileHover={{ scale: resposta === undefined ? 1.01 : 1 }}
                whileTap={{ scale: resposta === undefined ? 0.99 : 1 }}
                onClick={() => !showResults && onResponder(altIndex)}
                disabled={showResults}
                className={`
                  w-full p-4 rounded-xl border-2 text-left transition-all
                  flex items-center gap-4
                  ${getAlternativaStyle(altIndex)}
                `}
              >
                <span className={`
                  w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm
                  ${selecionada && !showResults && !showFeedback
                    ? 'bg-blue-500 text-white' 
                    : showIcon && correta
                    ? 'bg-emerald-500 text-white'
                    : showIcon && !correta
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-100 text-slate-600'
                  }
                `}>
                  {alternativaLetras[altIndex]}
                </span>
                
                <span className="flex-1">{alt}</span>
                
                {showIcon && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {correta ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Feedback após resposta */}
        <AnimatePresence>
          {(showFeedback && resposta !== undefined) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className={`p-4 rounded-xl ${isCorreta ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isCorreta ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-emerald-700">Resposta Correta! 🎉</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-700">Resposta Incorreta</span>
                    </>
                  )}
                </div>
                {questao.resolucao && (
                  <p className="text-sm text-slate-600 mt-2">{questao.resolucao}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ações auxiliares */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={onMarcar}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              marcada 
                ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {marcada ? <FlagOff className="w-4 h-4" /> : <Flag className="w-4 h-4" />}
            {marcada ? 'Desmarcar' : 'Marcar para revisão'}
          </button>

          {questao.dica && !showResults && (
            <button
              onClick={() => setShowDica(!showDica)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showDica 
                  ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              {showDica ? 'Ocultar dica' : 'Ver dica'}
            </button>
          )}

          {questao.resolucao && showResults && (
            <button
              onClick={() => setShowResolucao(!showResolucao)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showResolucao 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {showResolucao ? 'Ocultar resolução' : 'Ver resolução'}
            </button>
          )}
        </div>

        {/* Dica expandida */}
        <AnimatePresence>
          {showDica && questao.dica && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200"
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <span className="font-medium text-purple-800">Dica:</span>
                  <p className="text-sm text-purple-700 mt-1">{questao.dica}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resolução expandida */}
        <AnimatePresence>
          {showResolucao && questao.resolucao && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
            >
              <div className="flex items-start gap-2">
                <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <span className="font-medium text-blue-800">Resolução:</span>
                  <p className="text-sm text-blue-700 mt-1">{questao.resolucao}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}