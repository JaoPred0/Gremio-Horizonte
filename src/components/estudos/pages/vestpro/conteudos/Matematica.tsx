import React, { useEffect, useState } from "react";

import {
    AcademicCapIcon,
    ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";

import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import conteudosList from "@/data/conteudos/matematica.json";

const Matematica = () => {
    const [user, setUser] = useState(null);
    const [progresso, setProgresso] = useState({});
    const [loading, setLoading] = useState(true);

    // Pegar usuário autenticado
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            setUser(u);
        });
        return () => unsubscribe();
    }, []);

    // Carregar progresso do Firebase
    useEffect(() => {
        if (!user) return;

        const fetchProgress = async () => {
            try {
                const ref = doc(db, "estudos", user.uid, "matematica", "progresso");
                const snap = await getDoc(ref);
                if (snap.exists()) setProgresso(snap.data());
                setLoading(false);
            } catch (err) {
                console.error("Erro ao carregar progresso:", err);
                setLoading(false);
            }
        };

        fetchProgress();
    }, [user]);

    // Toggle item
    const toggleItem = async (id) => {
        if (!user) return;
        const updated = { ...progresso, [id]: !progresso[id] };
        setProgresso(updated);

        try {
            const ref = doc(db, "estudos", user.uid, "matematica", "progresso");
            await setDoc(ref, updated, { merge: true });
        } catch (err) {
            console.error("Erro ao salvar progresso:", err);
        }
    };

    // Progresso geral
    const todosIds = conteudosList.reduce((acc, bloco) => {
        bloco.itens.forEach((i) => acc.push(i.id));
        return acc;
    }, []);

    const total = todosIds.length;
    const feitos = todosIds.filter((id) => progresso[id]).length;
    const percent = total ? Math.round((feitos / total) * 100) : 0;

    return (
        <div className="p-4 space-y-6">

            <div className="divider">Matemática</div>

            {/* Barra de Progresso Geral */}
            <div className="bg-base-200 p-4 rounded-xl">
                <p className="text-sm font-medium mb-2">Progresso Geral</p>
                <div className="w-full bg-base-300 h-3 rounded-full overflow-hidden">
                    <div
                        className="bg-primary h-3"
                        style={{ width: `${percent}%` }}
                    />
                </div>
                <p className="text-xs mt-2 text-base-content/70">
                    {feitos} de {total} concluídos — <b>{percent}%</b>
                </p>
            </div>

            {/* Blocos */}
            {loading && <p className="text-center text-gray-500">Carregando conteúdos...</p>}

            {!loading &&
                conteudosList.map((bloco, idx) => {
                    const totalBloco = bloco.itens.length;
                    const feitosBloco = bloco.itens.filter((i) => progresso[i.id]).length;
                    const percentBloco = totalBloco ? Math.round((feitosBloco / totalBloco) * 100) : 0;

                    return (
                        <div
                            key={idx}
                            className="collapse collapse-arrow bg-base-100 rounded-xl"
                        >
                            <input type="checkbox" />
                            <div className="collapse-title font-semibold text-lg flex justify-between items-center">
                                <span>{bloco.bloco}</span>
                                <span className="text-xs text-base-content/60">{percentBloco}% concluído</span>
                            </div>

                            <div className="collapse-content space-y-2">
                                <div className="w-full bg-base-300 h-2 rounded-full overflow-hidden mb-2">
                                    <div
                                        className="bg-primary h-2"
                                        style={{ width: `${percentBloco}%` }}
                                    />
                                </div>

                                {bloco.itens.map((item) => (
                                    <label
                                        key={item.id}
                                        className="flex items-center gap-2 bg-base-100 rounded-lg p-2 cursor-pointer"
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
    );
};

export default Matematica;
