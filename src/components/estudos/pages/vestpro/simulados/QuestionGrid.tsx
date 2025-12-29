import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Flag, HelpCircle } from 'lucide-react';

export default function QuestionGrid({ 
  questoes, 
  respostas, 
  marcadas, 
  currentIndex, 
  onNavigate,
  showResults = false 
}) {
  const getQuestionStatus = (questao, index) => {
    const respondida = respostas[questao.id] !== undefined;
    const marcada = marcadas.includes(questao.id);
    const atual = index === currentIndex;
    
    if (showResults) {
      const correta = respostas[questao.id] === questao.correta;
      return {
        bg: correta ? 'bg-emerald-500' : (respondida ? 'bg-red-500' : 'bg-slate-300'),
        icon: correta ? Check : (respondida ? X : HelpCircle),
        ring: atual ? 'ring-2 ring-offset-2 ring-blue-500' : ''
      };
    }
    
    if (atual) {
      return { bg: 'bg-blue-500', icon: null, ring: 'ring-2 ring-offset-2 ring-blue-300' };
    }
    if (marcada) {
      return { bg: 'bg-amber-400', icon: Flag, ring: '' };
    }
    if (respondida) {
      return { bg: 'bg-emerald-500', icon: Check, ring: '' };
    }
    return { bg: 'bg-slate-200', icon: null, ring: '' };
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Navegação</h3>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            Respondida
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-amber-400" />
            Marcada
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-10 gap-2">
        {questoes.map((questao, index) => {
          const status = getQuestionStatus(questao, index);
          const Icon = status.icon;
          
          return (
            <motion.button
              key={questao.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(index)}
              className={`
                relative w-8 h-8 rounded-lg flex items-center justify-center
                text-xs font-semibold transition-all
                ${status.bg} ${status.ring}
                ${status.bg.includes('slate-2') ? 'text-slate-600' : 'text-white'}
                hover:shadow-md
              `}
            >
              {Icon ? <Icon className="w-3.5 h-3.5" /> : index + 1}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}