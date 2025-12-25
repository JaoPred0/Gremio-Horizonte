import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, AlertCircle, GraduationCap, FileText, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CalendarioAcademico = () => {
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [tempoRestante, setTempoRestante] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const eventos = [
    { data: '2026-01-27', titulo: 'Início das Aulas', tipo: 'inicio', descricao: 'Primeiro dia letivo do semestre' },
  ];

  const feriados = [
    { data: '2025-12-25', nome: 'Natal', descricao: 'Feriado Nacional - Campus fechado' },
    { data: '2026-01-01', nome: 'Ano Novo', descricao: 'Feriado Nacional - Campus fechado' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      calcularTempoRestante();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const calcularTempoRestante = () => {
    const hoje = new Date();
    const proximoEvento = [...eventos, ...feriados.map(f => ({ data: f.data, titulo: f.nome, tipo: 'feriado' }))]
      .filter(e => new Date(e.data + 'T00:00:00') > hoje)
      .sort((a, b) => new Date(a.data) - new Date(b.data))[0];

    if (proximoEvento) {
      const dataEvento = new Date(proximoEvento.data + 'T00:00:00');
      const diff = dataEvento - hoje;

      setTempoRestante({
        dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((diff % (1000 * 60)) / 1000),
        evento: proximoEvento.titulo
      });
    }
  };

  const getDiasNoMes = (mes, ano) => {
    return new Date(ano, mes + 1, 0).getDate();
  };

  const getPrimeiroDiaSemana = (mes, ano) => {
    return new Date(ano, mes, 1).getDay();
  };

  const getEventosData = (dia, mes, ano) => {
    const dataStr = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    return eventos.filter(e => e.data === dataStr);
  };

  const getFeriadoData = (dia, mes, ano) => {
    const dataStr = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    return feriados.find(f => f.data === dataStr);
  };

  const getFeriadosDoMes = () => {
    return feriados.filter(f => {
      const dataFeriado = new Date(f.data + 'T00:00:00');
      return dataFeriado.getMonth() === mesSelecionado && dataFeriado.getFullYear() === anoSelecionado;
    });
  };

  const renderCalendario = () => {
    const diasNoMes = getDiasNoMes(mesSelecionado, anoSelecionado);
    const primeiroDia = getPrimeiroDiaSemana(mesSelecionado, anoSelecionado);
    const dias = [];

    for (let i = 0; i < primeiroDia; i++) {
      dias.push(<div key={`vazio-${i}`} className="aspect-square min-h-[70px] sm:min-h-[90px]"></div>);
    }

    for (let dia = 1; dia <= diasNoMes; dia++) {
      const eventosHoje = getEventosData(dia, mesSelecionado, anoSelecionado);
      const feriadoHoje = getFeriadoData(dia, mesSelecionado, anoSelecionado);
      const hoje = new Date();
      const ehHoje = dia === hoje.getDate() && 
                     mesSelecionado === hoje.getMonth() && 
                     anoSelecionado === hoje.getFullYear();

      dias.push(
        <motion.div
          key={dia}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: dia * 0.01 }}
          className={`aspect-square min-h-[70px] sm:min-h-[90px] border border-base-300 p-2 sm:p-3 rounded-lg cursor-pointer hover:shadow-md transition-all ${
            ehHoje ? 'bg-primary text-primary-content border-primary border-2 shadow-lg' : 
            feriadoHoje ? 'bg-error text-error-content' :
            eventosHoje.length > 0 ? 'bg-base-200' : 'bg-base-100'
          }`}
          title={feriadoHoje ? `${feriadoHoje.nome} - ${feriadoHoje.descricao}` : ''}
        >
          <div className="text-sm sm:text-lg font-bold mb-1">
            {dia}
          </div>
          {feriadoHoje && (
            <div className="text-[10px] sm:text-xs font-medium truncate">
              🎉 <span className="hidden sm:inline">{feriadoHoje.nome}</span>
            </div>
          )}
          {eventosHoje.slice(0, 2).map((evento, idx) => (
            <div
              key={idx}
              className="text-[9px] sm:text-xs mt-1 truncate font-medium"
              title={evento.titulo}
            >
              • {evento.titulo}
            </div>
          ))}
        </motion.div>
      );
    }

    return dias;
  };

  const getIconePorTipo = (tipo) => {
    switch(tipo) {
      case 'prova': return <FileText className="w-5 h-5" />;
      case 'entrega': return <BookOpen className="w-5 h-5" />;
      case 'prazo': return <AlertCircle className="w-5 h-5" />;
      case 'inicio':
      case 'fim': return <GraduationCap className="w-5 h-5" />;
      case 'feriado': return <span className="text-xl">🎉</span>;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getCorPorTipo = (tipo) => {
    switch(tipo) {
      case 'prova': return 'border-error';
      case 'entrega': return 'border-warning';
      case 'prazo': return 'border-secondary';
      case 'recesso': return 'border-success';
      case 'inicio': return 'border-info';
      case 'fim': return 'border-neutral';
      case 'feriado': return 'border-error';
      default: return 'border-base-300';
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-base-100 shadow-xl mb-4 sm:mb-6"
        >
          <div className="card-body p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-7 h-7 sm:w-9 sm:h-9 text-primary" />
              <h1 className="card-title text-xl sm:text-3xl">Calendário Acadêmico</h1>
            </div>
            <p className="text-sm sm:text-base opacity-70">Acompanhe datas importantes e eventos do semestre</p>
          </div>
        </motion.div>

        {tempoRestante.evento && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card bg-base-100 shadow-xl mb-4 sm:mb-6"
          >
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-6 h-6 text-primary" />
                <h2 className="text-lg sm:text-xl font-bold">Próximo: {tempoRestante.evento}</h2>
              </div>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
                <motion.div 
                  className="bg-base-200 rounded-xl p-4 sm:p-6 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="countdown font-mono text-3xl sm:text-5xl text-primary">
                    <span style={{"--value": tempoRestante.dias} as React.CSSProperties}>{tempoRestante.dias}</span>
                  </span>
                  <div className="text-xs sm:text-sm opacity-70 mt-2 font-semibold">dias</div>
                </motion.div>
                <motion.div 
                  className="bg-base-200 rounded-xl p-4 sm:p-6 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="countdown font-mono text-3xl sm:text-5xl text-primary">
                    <span style={{"--value": tempoRestante.horas} as React.CSSProperties}>{tempoRestante.horas}</span>
                  </span>
                  <div className="text-xs sm:text-sm opacity-70 mt-2 font-semibold">horas</div>
                </motion.div>
                <motion.div 
                  className="bg-base-200 rounded-xl p-4 sm:p-6 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="countdown font-mono text-3xl sm:text-5xl text-primary">
                    <span style={{"--value": tempoRestante.minutos} as React.CSSProperties}>{tempoRestante.minutos}</span>
                  </span>
                  <div className="text-xs sm:text-sm opacity-70 mt-2 font-semibold">min</div>
                </motion.div>
                <motion.div 
                  className="bg-base-200 rounded-xl p-4 sm:p-6 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="countdown font-mono text-3xl sm:text-5xl text-primary">
                    <span style={{"--value": tempoRestante.segundos} as React.CSSProperties}>{tempoRestante.segundos}</span>
                  </span>
                  <div className="text-xs sm:text-sm opacity-70 mt-2 font-semibold">seg</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (mesSelecionado === 0) {
                        setMesSelecionado(11);
                        setAnoSelecionado(anoSelecionado - 1);
                      } else {
                        setMesSelecionado(mesSelecionado - 1);
                      }
                    }}
                    className="btn btn-primary btn-sm sm:btn-md"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
                  <h2 className="text-lg sm:text-2xl font-bold">
                    {meses[mesSelecionado]} {anoSelecionado}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (mesSelecionado === 11) {
                        setMesSelecionado(0);
                        setAnoSelecionado(anoSelecionado + 1);
                      } else {
                        setMesSelecionado(mesSelecionado + 1);
                      }
                    }}
                    className="btn btn-primary btn-sm sm:btn-md"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia, i) => (
                    <div key={i} className="text-center font-bold text-xs sm:text-sm py-2 text-base-content opacity-70">
                      <span className="hidden sm:inline">{dia}</span>
                      <span className="sm:hidden">{dia.substring(0, 1)}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {renderCalendario()}
                </div>
              </div>
            </motion.div>

            {getFeriadosDoMes().length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card bg-base-100 shadow-xl lg:hidden"
              >
                <div className="card-body p-4">
                  <h3 className="font-bold text-lg mb-3">Feriados do Mês</h3>
                  <div className="space-y-3">
                    {getFeriadosDoMes().map((feriado, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`border-l-4 ${getCorPorTipo('feriado')} bg-base-200 p-3 rounded-r-lg`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl"></span>
                          <div className="flex-1">
                            <div className="font-bold text-base">{feriado.nome}</div>
                            <div className="text-sm opacity-70 mt-1">{feriado.descricao}</div>
                            <div className="text-xs text-primary mt-2 font-semibold">
                              {new Date(feriado.data + 'T00:00:00').toLocaleDateString('pt-BR', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long' 
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body p-4 sm:p-6">
                <h3 className="card-title text-lg sm:text-xl mb-4">Eventos</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {eventos.map((evento, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className={`border-l-4 ${getCorPorTipo(evento.tipo)} bg-base-200 p-3 rounded-r-lg cursor-pointer`}
                    >
                      <div className="flex items-start gap-3">
                        {getIconePorTipo(evento.tipo)}
                        <div className="flex-1">
                          <div className="font-bold text-sm sm:text-base">{evento.titulo}</div>
                          <div className="text-xs sm:text-sm opacity-70 mt-1">{evento.descricao}</div>
                          <div className="text-xs text-primary mt-2 font-semibold">
                            {new Date(evento.data + 'T00:00:00').toLocaleDateString('pt-BR', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}