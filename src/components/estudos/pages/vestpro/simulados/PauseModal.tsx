import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, X, RotateCcw, Home } from 'lucide-react';

export default function PauseModal({ 
  isOpen, 
  onResume, 
  onRestart, 
  onExit,
  tempoDecorrido,
  questoesRespondidas,
  totalQuestoes
}) {
  const formatarTempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min}:${seg.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onResume}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 mx-4">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Pause className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Simulado Pausado</h2>
                <p className="text-slate-500">Seu progresso foi salvo. Continue quando quiser.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-slate-800">{formatarTempo(tempoDecorrido)}</p>
                  <p className="text-xs text-slate-500 mt-1">Tempo decorrido</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-slate-800">{questoesRespondidas}/{totalQuestoes}</p>
                  <p className="text-xs text-slate-500 mt-1">Questões respondidas</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={onResume}
                  className="btn btn-primary w-full h-12 rounded-xl"
                >
                  <Play className="w-5 h-5" />
                  Continuar Simulado
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onRestart}
                    className="btn btn-outline h-11 rounded-xl"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reiniciar
                  </button>
                  <button
                    onClick={onExit}
                    className="btn btn-outline btn-error h-11 rounded-xl"
                  >
                    <X className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}