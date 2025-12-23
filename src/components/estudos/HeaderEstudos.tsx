import React from "react"
import {
    Flame,
    Trophy,
    Clock,
    Star,
    Target,
    TrendingUp,
    Medal
} from "lucide-react"
import { Link } from "react-router-dom"
import StreakCardContent  from "./StreakCardContent"
export const HeaderEstudos = () => {
    return (
        <div className="w-full space-y-6">

            {/* CARD PRINCIPAL */}
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">

                    {/* TOPO */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        {/* TÍTULO */}
                        <div>
                            <h1 className="text-3xl font-bold">📚 Estudos</h1>
                            <p className="opacity-70">Seu progresso geral</p>
                        </div>

                        {/* PERFIL */}
                        <div className="flex items-center gap-4">
                            <div className="avatar">
                                <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src="https://i.pravatar.cc/100" />
                                </div>
                            </div>

                            <div>
                                <div className="badge badge-primary badge-lg gap-2">
                                    <Trophy size={16} />
                                    Nível 8
                                </div>
                                <p className="text-xs opacity-60 mt-1">XP atual: 3.420</p>
                            </div>
                        </div>
                    </div>

                    {/* XP */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span>Progresso de XP</span>
                            <span>68%</span>
                        </div>
                        <progress
                            className="progress progress-primary w-full"
                            value={68}
                            max={100}
                        />
                    </div>

                </div>
            </div>

            {/* STATS */}
            {/* METAS E RANKING */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <Link
                    to="/estudos/streak"
                    className="stat bg-base-200 shadow rounded-xl hover:shadow-xl hover:scale-[1.02] transition relative overflow-hidden"
                >
                    <StreakCardContent />
                </Link>

                <Link to="/estudos/conquistas" className="stat bg-base-200 shadow rounded-xl hover:shadow-xl hover:scale-[1.02] transition">
                    <div className="stat-figure text-blue-500">
                        🏆
                    </div>
                    <div className="stat-title">Conquistas</div>
                    <div className="stat-value">7</div>
                    <div className="stat-desc">desbloqueadas</div>
                </Link>

                <Link to="/estudos/xp" className="stat bg-base-200 shadow rounded-xl hover:shadow-xl hover:scale-[1.02] transition">
                    <div className="stat-figure text-yellow-500">
                        <Star size={28} />
                    </div>
                    <div className="stat-title">XP</div>
                    <div className="stat-value">3.420</div>
                    <div className="stat-desc">+240 hoje</div>
                </Link>

                <Link to="/estudos/metas" className="stat bg-base-200 shadow rounded-xl hover:shadow-xl hover:scale-[1.02] transition">
                    <div className="stat-figure text-green-500">
                        <TrendingUp size={28} />
                    </div>
                    <div className="stat-title">Meta semanal</div>
                    <div className="stat-value">82%</div>
                    <div className="stat-desc">quase lá</div>
                </Link>

            </div>
            <div className="grid md:grid-cols-2 gap-6">

                {/* METAS */}
                <div className="card bg-base-200 shadow">
                    <div className="card-body">
                        <h2 className="card-title gap-2">
                            <Target size={20} />
                            Metas de hoje
                        </h2>

                        <ul className="space-y-2">
                            <li className="flex justify-between items-center">
                                <span>📐 Matemática</span>
                                <progress className="progress progress-success w-32" value={80} max={100} />
                            </li>

                            <li className="flex justify-between items-center">
                                <span>📖 Português</span>
                                <progress className="progress progress-warning w-32" value={45} max={100} />
                            </li>

                            <li className="flex justify-between items-center">
                                <span>💻 Programação</span>
                                <progress className="progress progress-primary w-32" value={60} max={100} />
                            </li>
                        </ul>
                    </div>
                </div>

                {/* RANKING */}
                <div className="card bg-base-200 shadow">
                    <div className="card-body">
                        <h2 className="card-title gap-2">
                            <Medal size={20} />
                            Ranking semanal
                        </h2>

                        <ol className="space-y-2">
                            <li className="flex justify-between">
                                <span>🥇 Você</span>
                                <span>1º lugar</span>
                            </li>
                            <li className="flex justify-between opacity-70">
                                <span>🥈 Ana</span>
                                <span>2º lugar</span>
                            </li>
                            <li className="flex justify-between opacity-70">
                                <span>🥉 Carlos</span>
                                <span>3º lugar</span>
                            </li>
                        </ol>
                    </div>
                </div>

            </div>

        </div>
    )
}
