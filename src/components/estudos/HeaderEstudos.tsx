import React from "react"
import {
    TrendingUp,
    Trophy,
} from "lucide-react"
import { Link } from "react-router-dom"
import StreakCardContent from "./StreakCardContent"
import { Nivel } from "@/components/estudos/page/Nivel"
import AnimatedPage from "../AnimatedPage"
import { useConquistas } from '@/components/estudos/page/Conquistas';
import { RankStat } from "./RankStat"




export const HeaderEstudos = () => {
    const { conquistas, loading } = useConquistas();

    return (
        <AnimatedPage>
            <div className="w-full space-y-6">

                {/* CARD PRINCIPAL */}
                <Nivel />

                {/* METAS E RANKING */}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    <Link
                        to="/estudos/streak"
                        className="stat bg-base-200 shadow rounded-xl hover:shadow-xl hover:scale-[1.02] transition relative overflow-hidden"
                    >
                        <StreakCardContent />
                    </Link>

                    <Link to="/estudos/conquistas" className="stat bg-base-200 shadow rounded-xl hover:shadow-xl hover:scale-[1.02] transition">
                        <div className="stat-figure text-primary">
                            <Trophy className="w-10 h-10" />
                        </div>
                        <div className="stat-title">Conquistas</div>
                        <div className="stat-value text-primary">
                            {loading ? (
                                <span className="loading loading-spinner loading-md"></span>
                            ) : (
                                conquistas.totalColetadas
                            )}
                        </div>
                        <div className="stat-desc">
                            de {conquistas.total} conquistas
                        </div>
                    </Link>

                    <RankStat />

                    <Link to="/build" className="stat bg-base-200 shadow rounded-xl hover:shadow-xl hover:scale-[1.02] transition">
                        <div className="stat-figure text-green-500">
                            <TrendingUp size={28} />
                        </div>

                        <div className="stat-value">404</div>
                    </Link>

                </div>
            </div>
        </AnimatedPage>
    )
}
