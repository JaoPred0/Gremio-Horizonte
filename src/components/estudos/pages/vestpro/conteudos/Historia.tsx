import React, { useEffect, useState } from "react";

import {
    AcademicCapIcon,
    ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";

import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import conteudosList from "@/data/conteudos/historia.json";

const Historia = () => {
    const [progresso, setProgresso] = useState({});
    const [loading, setLoading] = useState(true);

    const user = auth.currentUser;

    /* 🔥 Carregar progresso do Firebase */
    useEffect(() => {
        const fetchProgress = async () => {
            if (!user) return;

            const ref = doc(db, "estudos", user.uid, "historia", "progresso");
            const snap = await getDoc(ref);

            if (snap.exists()) setProgresso(snap.data());
            else setProgresso({});

            setLoading(false);
        };

        fetchProgress();
    }, [user]);

    /* 🔥 Salvar progresso no Firebase */
    const toggleItem = async (id) => {
        if (!user) return;

        const updated = {
            ...progresso,
            [id]: !progresso[id],
        };

        setProgresso(updated);

        const ref = doc(db, "estudos", user.uid, "historia", "progresso");
        await setDoc(ref, updated, { merge: true });
    };

    /* 📊 Progresso geral */
    const todosIds = conteudosList.flatMap((b) => b.itens.map((i) => i.id));
    const total = todosIds.length;
    const feitos = todosIds.filter((id) => progresso[id]).length;
    const percent = Math.round((feitos / total) * 100);

    return (
        <div className="p-4 space-y-6">

            <div className="divider">História</div>

            {/* Barra de Progresso Geral */}
            <div className="bg-base-200/60 backdrop-blur-md p-5 rounded-2xl shadow-lg">
                <p className="text-sm font-medium mb-2">Progresso Geral</p>

                <div className="w-full bg-base-300 h-3 rounded-full overflow-hidden">
                    <div
                        className="bg-primary h-3 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                    />
                </div>

                <p className="text-xs mt-2 text-base-content/70">
                    {feitos} de {total} concluídos — <b>{percent}%</b>
                </p>
            </div>

            {/* Blocos */}
            <div className="space-y-4">
                {loading && <p>Carregando...</p>}

                {!loading &&
                    conteudosList.map((bloco, index) => {
                        const totalBloco = bloco.itens.length;
                        const feitosBloco = bloco.itens.filter(
                            (i) => progresso[i.id]
                        ).length;

                        const percentBloco = Math.round(
                            (feitosBloco / totalBloco) * 100
                        );

                        return (
                            <div
                                key={index}
                                className="collapse collapse-arrow bg-base-100/60 backdrop-blur-xl shadow-md rounded-2xl transition-all"
                            >
                                <input type="checkbox" />

                                {/* Título do bloco */}
                                <div className="collapse-title font-semibold text-lg flex justify-between items-center">
                                    <span>{bloco.bloco}</span>
                                    <span className="text-xs text-base-content/60">
                                        {percentBloco}% concluído
                                    </span>
                                </div>

                                {/* Conteúdo dentro do accordion */}
                                <div className="collapse-content space-y-3 animate-fadeIn">
                                    {/* Barra do bloco */}
                                    <div className="w-full bg-base-300 h-2 rounded-full overflow-hidden mb-2">
                                        <div
                                            className="bg-primary h-2 transition-all duration-500"
                                            style={{ width: `${percentBloco}%` }}
                                        ></div>
                                    </div>

                                    {bloco.itens.map((item) => (
                                        <label
                                            key={item.id}
                                            className="flex items-center gap-3 bg-base-100/80 backdrop-blur rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                checked={progresso[item.id] || false}
                                                onChange={() => toggleItem(item.id)}
                                            />
                                            <span className="text-sm">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Historia;