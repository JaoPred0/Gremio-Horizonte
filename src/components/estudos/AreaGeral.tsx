import React, { useState } from 'react'
import { BookOpen, Award, Gamepad, ShoppingCart, TrendingUp, Users, Star, ArrowRight, Download } from 'lucide-react'
import { Link } from 'react-router-dom'

export const AreaGeral = () => {
    const [activeTab, setActiveTab] = useState('VestPro+')

    const tabs = [
        { id: 'IF', label: 'IF', icon: BookOpen },
        { id: 'VestPro+', label: 'VestPro+', icon: Award },
        { id: 'BaseNerd', label: 'BaseNerd', icon: Gamepad },
        { id: 'Loja', label: 'Loja', icon: ShoppingCart }
    ]

    const ifCards = [
        {
            title: 'Horários das Turmas',
            desc: 'Consulte os horários completos das turmas dos cursos técnicos integrados',
            link: '/estudos/if/horarios-da-turma',
            color: 'bg-primary',
        },
        { title: 'Calendário Acadêmico', desc: 'Acompanhe datas importantes e eventos do semestre', link: '/estudos/if/calendario-academico', color: 'bg-secondary' },
    ]

    const vestProCards = [
        {
            title: 'Matérias',
            desc: 'Acompanhe seu progresso em cada disciplina do vestibular',
            link: '/estudos/vestpro/materias',
            color: 'bg-secondary'
        },
        {
            title: 'Simulados',
            desc: 'Prepare-se com simulados completos',
            link: '/estudos/vestpro/simulados',
            color: 'bg-success'
        },
        // {
        //     title: 'Desempenho',
        //     desc: 'Veja sua evolução e identifique pontos fortes e fracos',
        //     link: '#',
        //     color: 'bg-info'
        // },
        // {
        //     title: 'Materiais de Estudo',
        //     desc: 'Acesse PDFs, resumos e conteúdos organizados',
        //     link: '#',
        //     color: 'bg-neutral'
        // },
    ]

    const baseNerdCards = [
        { title: 'Game Dev Arena', desc: 'Tutoriais completos para criar seus próprios jogos', link: '#', color: 'bg-secondary' },
        { title: 'Coding Challenges', desc: 'Resolva desafios e suba no ranking', link: '#', color: 'bg-accent', badge: 'Hot' },
        { title: 'Tech News', desc: 'Últimas notícias do mundo tech e gaming', link: '#', color: 'bg-info' },
        { title: 'Community Projects', desc: 'Colabore em projetos open source', link: '#', color: 'bg-success' }
    ]

    // Updated lojaCards to focus on downloading books, ebooks, etc., without money purchases
    const lojaCards = [
        { title: 'Livros Técnicos Gratuitos', desc: 'Baixe livros técnicos e manuais para estudo', link: '#', color: 'bg-primary', action: 'Baixar' },
        { title: 'E-books Acadêmicos', desc: 'Acesse e baixe e-books para vestibulares e cursos', link: '#', color: 'bg-secondary', action: 'Baixar', badge: 'Novo' },
        { title: 'Materiais de Apoio', desc: 'Baixe apostilas, resumos e guias de estudo', link: '#', color: 'bg-accent', action: 'Baixar' },
        { title: 'Conteúdos Extras', desc: 'Baixe vídeos, podcasts e recursos adicionais', link: '#', color: 'bg-warning', action: 'Baixar', badge: 'Popular' }
    ]

    const renderCards = (cards) => {
        return (
            <div className="grid grid-cols-2 gap-4 md:gap-6"> {/* 2x2 grid for mobile, adjust gap for better mobile spacing */}
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in rounded-lg"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="card-body p-4"> {/* Reduced padding for mobile */}
                            {card.badge && (
                                <div className="badge badge-secondary absolute top-2 right-2 text-xs">{card.badge}</div>
                            )}
                            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-2`}> {/* Smaller icon for mobile */}
                                <Star className="text-white" size={20} />
                            </div>
                            <h3 className="card-title text-sm md:text-lg">{card.title}</h3> {/* Responsive text size */}
                            <p className="text-xs md:text-sm opacity-70">{card.desc}</p>
                            <div className="card-actions justify-end mt-3">
                                <Link
                                    to={card.link}
                                    className="btn btn-primary btn-xs md:btn-sm flex items-center gap-1"
                                >
                                    {card.action || 'Ver mais'}
                                    {card.action === 'Baixar'
                                        ? <Download size={14} />
                                        : <ArrowRight size={14} />
                                    }
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="min-h-screen"> {/* Reduced padding for mobile */}
            <div className="max-w-7xl mx-auto">

                {/* Tabs - Improved for mobile with horizontal scroll if needed */}
                <div
                    className="
                        tabs tabs-boxed
                        bg-base-200
                        p-2
                        mb-6 md:mb-8
                        shadow-lg
                        rounded-2xl
                        overflow-x-auto
                        flex-nowrap
                        gap-1
                        animate-fade-in
                    "
                    style={{ animationDelay: "200ms" }}
                >
                    {tabs.map((tab) => {
                        const Icon = tab.icon

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    tab
                                    transition-all duration-300
                                    flex flex-col md:flex-row
                                    items-center justify-center
                                    gap-0.5 md:gap-2
                                    px-3 py-2 md:px-4
                                    min-w-[64px] md:min-w-0
                                    whitespace-nowrap
                                    ${activeTab === tab.id ? "tab-active" : ""}
                                    `}
                            >
                                <Icon className="w-5 h-5 md:w-5 md:h-5" />
                                <span className="text-[11px] md:text-sm font-medium leading-none">
                                    {tab.label}
                                </span>
                            </button>
                        )
                    })}
                </div>


                {/* Content Area */}
                <div className="rounded-2xl md:rounded-3xl bg-base-100 md:p-8 min-h-96 ">
                    {activeTab === 'IF' && (
                        <div className="animate-fade-in">
                            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                <BookOpen className="text-primary" size={24} />
                                <h2 className="text-2xl md:text-3xl font-bold">Instituto Federal</h2>
                            </div>
                            <p className="text-sm md:text-lg opacity-70 mb-6 md:mb-8">Acesse recursos acadêmicos, bibliotecas e projetos de pesquisa</p>
                            {renderCards(ifCards)}
                        </div>
                    )}

                    {activeTab === 'VestPro+' && (
                        <div className="animate-fade-in">
                            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                <Award className="text-secondary" size={24} />
                                <h2 className="text-2xl md:text-3xl font-bold">VestPro+</h2>
                            </div>
                            <p className="text-sm md:text-lg opacity-70 mb-6 md:mb-8">Prepare-se para vestibulares e ENEM com conteúdo exclusivo</p>
                            {renderCards(vestProCards)}
                        </div>
                    )}

                    {activeTab === 'BaseNerd' && (
                        <div className="animate-fade-in">
                            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                <Gamepad className="text-accent" size={24} />
                                <h2 className="text-2xl md:text-3xl font-bold">BaseNerd</h2>
                            </div>
                            <p className="text-sm md:text-lg opacity-70 mb-6 md:mb-8">Comunidade tech, gaming e desenvolvimento de projetos</p>
                            {renderCards(baseNerdCards)}
                        </div>
                    )}

                    {activeTab === 'Loja' && (
                        <div className="animate-fade-in">
                            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                <ShoppingCart className="text-warning" size={24} />
                                <h2 className="text-2xl md:text-3xl font-bold">Loja</h2>
                            </div>
                            <p className="text-sm md:text-lg opacity-70 mb-6 md:mb-8">Baixe livros, e-books e materiais de estudo gratuitos</p>
                            {renderCards(lojaCards)}
                        </div>
                    )}
                </div>
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

export default AreaGeral