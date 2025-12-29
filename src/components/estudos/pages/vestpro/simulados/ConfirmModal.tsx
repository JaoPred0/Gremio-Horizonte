import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Flag, XCircle } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onConfirm, 
  onCancel,
  questoesRespondidas,
  questoesMarcadas,
  totalQuestoes
}) {
  const naoRespondidas = totalQuestoes - questoesRespondidas;
  const hasWarning = naoRespondidas > 0 || questoesMarcadas > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onCancel}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 mx-4">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  hasWarning ? 'bg-amber-100' : 'bg-emerald-100'
                }`}>
                  {hasWarning ? (
                    <AlertTriangle className="w-8 h-8 text-amber-600" />
                  ) : (
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Finalizar Simulado?
                </h2>
                <p className="text-slate-500">
                  {hasWarning 
                    ? 'Você ainda tem questões pendentes' 
                    : 'Você completou todas as questões!'}
                </p>
              </div>

              {hasWarning && (
                <div className="space-y-3 mb-6">
                  {naoRespondidas > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="text-sm text-red-700">
                        <strong>{naoRespondidas}</strong> questão(ões) não respondida(s)
                      </span>
                    </div>
                  )}
                  {questoesMarcadas > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <Flag className="w-5 h-5 text-amber-500" />
                      <span className="text-sm text-amber-700">
                        <strong>{questoesMarcadas}</strong> questão(ões) marcada(s) para revisão
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="btn btn-outline flex-1 h-12 rounded-xl"
                >
                  Voltar e revisar
                </button>
                <button
                  onClick={onConfirm}
                  className="btn btn-primary flex-1 h-12 rounded-xl"
                >
                  Finalizar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}