import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Flag } from 'lucide-react';

export default function ProgressBar({ 
  total, 
  respondidas, 
  marcadas,
  acertos = null // para modo resultado
}) {
  const porcentagem = (respondidas / total) * 100;
  const porcentagemAcertos = acertos !== null ? (acertos / total) * 100 : null;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Progresso</h3>
        <span className="text-sm text-slate-500">
          {respondidas} de {total} questões
        </span>
      </div>

      {/* Barra principal */}
      <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${porcentagem}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            acertos !== null 
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
              : 'bg-gradient-to-r from-blue-400 to-blue-500'
          }`}
        />
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Respondidas</p>
            <p className="font-semibold text-slate-700">{respondidas}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <Flag className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Marcadas</p>
            <p className="font-semibold text-slate-700">{marcadas}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <Circle className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Restantes</p>
            <p className="font-semibold text-slate-700">{total - respondidas}</p>
          </div>
        </div>
      </div>

      {/* Barra de acertos (modo resultado) */}
      {porcentagemAcertos !== null && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Taxa de acertos</span>
            <span className="text-sm font-semibold text-emerald-600">
              {Math.round(porcentagemAcertos)}%
            </span>
          </div>
          <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${porcentagemAcertos}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}