import React, { useState, useMemo } from 'react'
import { Clock, Filter, Search, Download, Tractor, Computer, Briefcase } from 'lucide-react'

export const HorarioTurma = () => {
  const [selectedCurso, setSelectedCurso] = useState('')
  const [selectedTurno, setSelectedTurno] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Dados mockados para turmas
  const turmasData = [
    { id: 1, curso: 'info', turno: 'manhã', nome: 'Turma A INFO Manhã', descricao: 'Horários para Informática - Turno da Manhã', link: 'estudos/if/horarios-da-turma/info/1.pdf' },
    { id: 2, curso: 'info', turno: 'tarde', nome: 'Turma B INFO Tarde', descricao: 'Horários para Informática - Turno da Tarde', link: 'estudos/if/horarios-da-turma/info/2.pdf' },
    { id: 3, curso: 'adm', turno: 'manhã', nome: 'Turma A ADM Manhã', descricao: 'Horários para Administração - Turno da Manhã', link: 'estudos/if/horarios-da-turma/adm/1.pdf' },
    { id: 4, curso: 'adm', turno: 'tarde', nome: 'Turma B ADM Tarde', descricao: 'Horários para Administração - Turno da Tarde', link: 'estudos/if/horarios-da-turma/adm/2.pdf' },
    { id: 5, curso: 'agro', turno: 'manhã', nome: 'Turma A AGRO Manhã', descricao: 'Horários para Agronomia - Turno da Manhã', link: 'estudos/if/horarios-da-turma/agro/1.pdf' },
    { id: 6, curso: 'agro', turno: 'tarde', nome: 'Turma B AGRO Tarde', descricao: 'Horários para Agronomia - Turno da Tarde', link: 'estudos/if/horarios-da-turma/agro/2.pdf' },
    // Adicione mais turmas conforme necessário
  ]

  // Filtrar turmas baseado nos filtros e busca
  const filteredTurmas = useMemo(() => {
    return turmasData.filter(turma => {
      const matchesCurso = selectedCurso === '' || turma.curso === selectedCurso
      const matchesTurno = selectedTurno === '' || turma.turno === selectedTurno
      const matchesSearch = searchTerm === '' || turma.nome.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCurso && matchesTurno && matchesSearch
    })
  }, [selectedCurso, selectedTurno, searchTerm])

  const cursos = [
    { value: '', label: 'Todos os Cursos' },
    { value: 'adm', label: 'Administração (ADM)' },
    { value: 'info', label: 'Informática (INFO)' },
    { value: 'agro', label: 'Agronomia (AGRO)' }
  ]

  const turnos = [
    { value: '', label: 'Todos os Turnos' },
    { value: 'manhã', label: 'Manhã' },
    { value: 'tarde', label: 'Tarde' }
  ]

  // Função para obter ícone baseado no curso
  const getCursoIcon = (curso) => {
    switch (curso) {
      case 'adm':
        return <Briefcase className="text-white" size={24} />
      case 'info':
        return <Computer className="text-white" size={24} />
      case 'agro':
        return <Tractor className="text-white" size={24} />
      default:
        return <Clock className="text-white" size={24} />
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-base-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Horários de Turma
          </h1>
          <p className="text-sm md:text-lg opacity-70">Pesquise e baixe os horários das turmas do IF</p>
        </div>

        {/* Busca e Filtro */}
        <div className="bg-base-200 p-4 md:p-6 rounded-2xl shadow-lg mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Busca */}
            <div className="flex-1 w-full">
              <label className="input input-bordered flex items-center gap-2">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Buscar turma..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="grow"
                />
              </label>
            </div>

            {/* Botão de Filtro */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-outline btn-primary"
            >
              <Filter size={20} />
              Filtros
            </button>
          </div>
        </div>

        {/* Modal de Filtros */}
        <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Aplicar Filtros</h3>
            <div className="space-y-4">
              {/* Filtro Curso */}
              <div>
                <label className="block text-sm font-medium mb-2">Curso</label>
                <select
                  value={selectedCurso}
                  onChange={(e) => setSelectedCurso(e.target.value)}
                  className="select select-bordered w-full"
                >
                  {cursos.map(curso => (
                    <option key={curso.value} value={curso.value}>{curso.label}</option>
                  ))}
                </select>
              </div>

              {/* Filtro Turno */}
              <div>
                <label className="block text-sm font-medium mb-2">Turno</label>
                <select
                  value={selectedTurno}
                  onChange={(e) => setSelectedTurno(e.target.value)}
                  className="select select-bordered w-full"
                >
                  {turnos.map(turno => (
                    <option key={turno.value} value={turno.value}>{turno.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setIsModalOpen(false)}>Fechar</button>
            </div>
          </div>
        </div>

        {/* Cards de Turmas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTurmas.map((turma, index) => (
            <div 
              key={turma.id}
              className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in rounded-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="card-body">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                    {getCursoIcon(turma.curso)}
                  </div>
                  <div>
                    <h3 className="card-title text-lg">{turma.nome}</h3>
                    <div className="badge badge-secondary">{turma.curso.toUpperCase()}</div>
                    <div className="badge badge-accent ml-2">{turma.turno.charAt(0).toUpperCase() + turma.turno.slice(1)}</div>
                  </div>
                </div>
                <p className="text-sm opacity-70 mb-4">{turma.descricao}</p>
                <div className="card-actions justify-end">
                  <a href={turma.link} download={`horario-${turma.curso}-${turma.id}.pdf`} className="btn btn-primary btn-sm">
                    Baixar Horário <Download size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem se não houver resultados */}
        {filteredTurmas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg opacity-70">Nenhuma turma encontrada com os filtros aplicados.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}

export default HorarioTurma