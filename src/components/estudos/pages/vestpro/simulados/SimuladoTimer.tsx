import React, { useEffect, useState } from 'react';
import { Clock, Pause, Play, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SimuladoTimer({ 
  isRunning, 
  onPause, 
  onResume, 
  tempoLimite, // em minutos, opcional
  onTimeUp 
}) {
  const [segundos, setSegundos] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSegundos(s => {
          const novoTempo = s + 1;
          // Aviso quando faltam 5 minutos
          if (tempoLimite && (tempoLimite * 60 - novoTempo) === 300) {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 5000);
          }
          // Tempo esgotado
          if (tempoLimite && novoTempo >= tempoLimite * 60) {
            onTimeUp?.();
          }
          return novoTempo;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, tempoLimite, onTimeUp]);

  const formatarTempo = (totalSegundos) => {
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segs = totalSegundos % 60;
    
    if (horas > 0) {
      return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const tempoRestante = tempoLimite ? (tempoLimite * 60) - segundos : null;
  const porcentagemTempo = tempoLimite ? (segundos / (tempoLimite * 60)) * 100 : 0;
  const isUrgent = tempoRestante && tempoRestante < 300; // menos de 5 min

  return (
    <div className="relative">
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Restam apenas 5 minutos!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
        isUrgent 
          ? 'bg-red-50 border-2 border-red-200' 
          : 'bg-slate-50 border border-slate-200'
      }`}>
        <Clock className={`w-5 h-5 ${isUrgent ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
        
        <div className="flex flex-col">
          <span className={`font-mono text-lg font-semibold ${isUrgent ? 'text-red-600' : 'text-slate-700'}`}>
            {tempoLimite ? formatarTempo(Math.max(0, tempoRestante)) : formatarTempo(segundos)}
          </span>
          {tempoLimite && (
            <div className="w-20 h-1 bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${isUrgent ? 'bg-red-500' : 'bg-blue-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, porcentagemTempo)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </div>

        <button
          onClick={isRunning ? onPause : onResume}
          className={`p-2 rounded-lg transition-all ${
            isRunning 
              ? 'bg-slate-200 hover:bg-slate-300 text-slate-600' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}