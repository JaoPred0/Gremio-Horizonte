import React, { useState, useEffect } from 'react';
import { Trophy, Star, Calculator, PenTool, Globe, Atom, Code, Palette, Sparkles, Award, Lock, Zap } from 'lucide-react';
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import AnimatedPage from '../../AnimatedPage';

// Hook personalizado para usar conquistas em outros componentes
export const useConquistas = () => {
    const [conquistas, setConquistas] = useState({
        totalDesbloqueadas: 0,
        totalColetadas: 0,
        total: 24 // Total de conquistas disponíveis (6 categorias x 4 conquistas)
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadConquistas = async (user: any) => {
            try {
                const conquistasRef = doc(db, "user_conquistas", user.uid);
                const conquistasSnap = await getDoc(conquistasRef);

                if (isMounted) {
                    if (conquistasSnap.exists()) {
                        const data = conquistasSnap.data();
                        setConquistas({
                            totalDesbloqueadas: data.totalDesbloqueadas || 0,
                            totalColetadas: data.totalColetadas || 0,
                            total: 24
                        });
                    } else {
                        // Se não existir documento, inicializar com zeros
                        setConquistas({
                            totalDesbloqueadas: 0,
                            totalColetadas: 0,
                            total: 24
                        });
                    }
                    setLoading(false);
                }
            } catch (error) {
                console.error('Erro ao carregar conquistas:', error);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                loadConquistas(user);
            } else {
                if (isMounted) {
                    setConquistas({
                        totalDesbloqueadas: 0,
                        totalColetadas: 0,
                        total: 24
                    });
                    setLoading(false);
                }
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    return { conquistas, loading };
};

interface ConquistaData {
    id: string;
    desbloqueada: boolean;
    coletada: boolean;
    dataDesbloqueio?: string;
    dataColeta?: string;
}

interface UserConquistas {
    uid: string;
    conquistas: { [key: string]: ConquistaData };
    totalDesbloqueadas: number;
    totalColetadas: number;
    xpTotal: number;
}

const Conquistas = () => {
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userConquistas, setUserConquistas] = useState<UserConquistas>({
        uid: '',
        conquistas: {},
        totalDesbloqueadas: 0,
        totalColetadas: 0,
        xpTotal: 0
    });
    const [hoveredConquista, setHoveredConquista] = useState<string | null>(null);
    const [showNotification, setShowNotification] = useState<any>(null);

    const categorias = [
        {
            nome: 'Matemática',
            icone: Calculator,
            cor: 'primary',
            conquistas: [
                { id: 'mat1', nome: 'Primeiro Cálculo', desc: 'Resolver sua primeira equação', xp: 10, icone: '🔢', requisito: 'Complete 1 exercício de matemática' },
                { id: 'mat2', nome: 'Mestre da Tabuada', desc: 'Acertar 50 multiplicações seguidas', xp: 25, icone: '✖️', requisito: 'Acerte 50 multiplicações sem errar' },
                { id: 'mat3', nome: 'Geometria Perfeita', desc: 'Dominar todos os teoremas básicos', xp: 50, icone: '📐', requisito: 'Estude 10 teoremas de geometria' },
                { id: 'mat4', nome: 'Calculista Supremo', desc: 'Resolver 100 problemas complexos', xp: 100, icone: '🧮', requisito: 'Resolva 100 problemas de nível avançado' }
            ]
        },
        {
            nome: 'Redação',
            icone: PenTool,
            cor: 'secondary',
            conquistas: [
                { id: 'red1', nome: 'Primeiras Palavras', desc: 'Escrever seu primeiro texto completo', xp: 10, icone: '✍️', requisito: 'Escreva uma redação de 20 linhas' },
                { id: 'red2', nome: 'Autor Dedicado', desc: 'Escrever 10 redações completas', xp: 30, icone: '📝', requisito: 'Complete 10 redações diferentes' },
                { id: 'red3', nome: 'Mestre da Gramática', desc: 'Texto perfeito sem erros', xp: 50, icone: '📚', requisito: 'Escreva uma redação sem erros gramaticais' },
                { id: 'red4', nome: 'Escritor Profissional', desc: 'Alcançar nota 1000 na redação', xp: 150, icone: '🏆', requisito: 'Receba nota máxima em uma redação' }
            ]
        },
        {
            nome: 'Ciências',
            icone: Atom,
            cor: 'accent',
            conquistas: [
                { id: 'cie1', nome: 'Jovem Cientista', desc: 'Completar primeiro experimento', xp: 15, icone: '🔬', requisito: 'Realize seu primeiro experimento científico' },
                { id: 'cie2', nome: 'Explorador da Natureza', desc: 'Estudar 20 espécies diferentes', xp: 35, icone: '🌿', requisito: 'Aprenda sobre 20 espécies de animais ou plantas' },
                { id: 'cie3', nome: 'Químico Expert', desc: 'Dominar a tabela periódica', xp: 60, icone: '⚗️', requisito: 'Memorize 50 elementos químicos' },
                { id: 'cie4', nome: 'Prêmio Nobel', desc: 'Conquistar todas as áreas da ciência', xp: 200, icone: '🧪', requisito: 'Complete todas as conquistas de ciências' }
            ]
        },
        {
            nome: 'História',
            icone: Globe,
            cor: 'warning',
            conquistas: [
                { id: 'his1', nome: 'Viajante do Tempo', desc: 'Estudar sua primeira era histórica', xp: 10, icone: '⏳', requisito: 'Estude uma era da história mundial' },
                { id: 'his2', nome: 'Conhecedor de Culturas', desc: 'Aprender sobre 15 civilizações', xp: 40, icone: '🏛️', requisito: 'Conheça 15 civilizações antigas' },
                { id: 'his3', nome: 'Guardião da História', desc: 'Memorizar 50 datas importantes', xp: 70, icone: '📜', requisito: 'Decore 50 datas históricas relevantes' },
                { id: 'his4', nome: 'Historiador Lendário', desc: 'Dominar toda a linha do tempo', xp: 180, icone: '👑', requisito: 'Complete o estudo de todas as eras' }
            ]
        },
        {
            nome: 'Programação',
            icone: Code,
            cor: 'info',
            conquistas: [
                { id: 'prog1', nome: 'Hello World', desc: 'Escrever seu primeiro código', xp: 15, icone: '💻', requisito: 'Crie seu primeiro programa' },
                { id: 'prog2', nome: 'Debugger Pro', desc: 'Resolver 25 bugs complexos', xp: 45, icone: '🐛', requisito: 'Corrija 25 erros de código' },
                { id: 'prog3', nome: 'Arquiteto de Software', desc: 'Criar 5 projetos completos', xp: 80, icone: '🏗️', requisito: 'Desenvolva 5 aplicações completas' },
                { id: 'prog4', nome: 'Hacker Ético', desc: 'Dominar 3 linguagens de programação', xp: 250, icone: '🚀', requisito: 'Seja proficiente em 3 linguagens' }
            ]
        },
        {
            nome: 'Artes',
            icone: Palette,
            cor: 'error',
            conquistas: [
                { id: 'art1', nome: 'Primeiro Traço', desc: 'Criar sua primeira obra de arte', xp: 10, icone: '🎨', requisito: 'Finalize seu primeiro desenho' },
                { id: 'art2', nome: 'Pintor Talentoso', desc: 'Completar 20 obras de arte', xp: 30, icone: '🖌️', requisito: 'Crie 20 desenhos ou pinturas' },
                { id: 'art3', nome: 'Artista Versátil', desc: 'Dominar 5 técnicas artísticas', xp: 65, icone: '🎭', requisito: 'Aprenda 5 técnicas diferentes' },
                { id: 'art4', nome: 'Da Vinci Moderno', desc: 'Criar uma obra-prima reconhecida', xp: 120, icone: '🖼️', requisito: 'Receba reconhecimento por uma obra' }
            ]
        }
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user.uid);
                loadUserConquistas(user.uid);
            } else {
                setCurrentUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const loadUserConquistas = async (uid: string) => {
        try {
            const conquistasRef = doc(db, "user_conquistas", uid);
            const conquistasSnap = await getDoc(conquistasRef);

            if (conquistasSnap.exists()) {
                setUserConquistas(conquistasSnap.data() as UserConquistas);
            } else {
                // Inicializar documento se não existir
                const initialData: UserConquistas = {
                    uid,
                    conquistas: {},
                    totalDesbloqueadas: 0,
                    totalColetadas: 0,
                    xpTotal: 0
                };
                await setDoc(conquistasRef, initialData);
                setUserConquistas(initialData);
            }
        } catch (error) {
            console.error('Erro ao carregar conquistas:', error);
        } finally {
            setLoading(false);
        }
    };

    const desbloquearConquista = async (conquistaId: string) => {
        if (!currentUser) return;

        const conquista = userConquistas.conquistas[conquistaId];
        if (conquista?.desbloqueada) return;

        try {
            const conquistasRef = doc(db, "user_conquistas", currentUser);
            const novaConquista: ConquistaData = {
                id: conquistaId,
                desbloqueada: true,
                coletada: false,
                dataDesbloqueio: new Date().toISOString()
            };

            await updateDoc(conquistasRef, {
                [`conquistas.${conquistaId}`]: novaConquista,
                totalDesbloqueadas: increment(1)
            });

            setUserConquistas(prev => ({
                ...prev,
                conquistas: {
                    ...prev.conquistas,
                    [conquistaId]: novaConquista
                },
                totalDesbloqueadas: prev.totalDesbloqueadas + 1
            }));

            setShowNotification({ tipo: 'desbloqueio' });
            setTimeout(() => setShowNotification(null), 3000);
        } catch (error) {
            console.error('Erro ao desbloquear conquista:', error);
        }
    };

    const coletarXP = async (conquistaId: string, xp: number, nomeConquista: string) => {
        if (!currentUser) return;

        const conquista = userConquistas.conquistas[conquistaId];
        if (!conquista?.desbloqueada || conquista?.coletada) return;

        try {
            const conquistasRef = doc(db, "user_conquistas", currentUser);
            const xpRef = doc(db, "user_xp", currentUser);

            // Atualizar conquista
            await updateDoc(conquistasRef, {
                [`conquistas.${conquistaId}.coletada`]: true,
                [`conquistas.${conquistaId}.dataColeta`]: new Date().toISOString(),
                totalColetadas: increment(1),
                xpTotal: increment(xp)
            });

            // Atualizar XP do usuário
            const xpSnap = await getDoc(xpRef);
            if (xpSnap.exists()) {
                await updateDoc(xpRef, {
                    xp: increment(xp)
                });
            }

            setUserConquistas(prev => ({
                ...prev,
                conquistas: {
                    ...prev.conquistas,
                    [conquistaId]: {
                        ...prev.conquistas[conquistaId],
                        coletada: true,
                        dataColeta: new Date().toISOString()
                    }
                },
                totalColetadas: prev.totalColetadas + 1,
                xpTotal: prev.xpTotal + xp
            }));

            setShowNotification({ tipo: 'xp', xp, nome: nomeConquista });
            setTimeout(() => setShowNotification(null), 3000);
        } catch (error) {
            console.error('Erro ao coletar XP:', error);
        }
    };

    const totalConquistas = categorias.reduce((acc, cat) => acc + cat.conquistas.length, 0);

    if (loading) {
        return (
            <AnimatedPage>
                <div className="flex items-center justify-center min-h-screen">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            </AnimatedPage>
        );
    }

    if (!currentUser) {
        return (
            <AnimatedPage>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="card bg-base-200 shadow-xl max-w-md">
                        <div className="card-body text-center">
                            <Trophy className="w-16 h-16 mx-auto opacity-50" />
                            <h2 className="card-title justify-center">Conquistas</h2>
                            <p className="opacity-60">Faça login para ver suas conquistas</p>
                        </div>
                    </div>
                </div>
            </AnimatedPage>
        );
    }

    return (
        <AnimatedPage>
            <div className="min-h-screen p-4 sm:p-6 lg:p-8">
                {/* Notificações */}
                {showNotification && (
                    <div className="toast toast-top toast-end z-50">
                        {showNotification.tipo === 'xp' && (
                            <div className="alert alert-success">
                                <Sparkles className="w-5 h-5" />
                                <div>
                                    <div className="font-bold">+{showNotification.xp} XP Coletado!</div>
                                    <div className="text-sm">{showNotification.nome}</div>
                                </div>
                            </div>
                        )}
                        {showNotification.tipo === 'desbloqueio' && (
                            <div className="alert alert-info">
                                <Trophy className="w-5 h-5" />
                                <div>
                                    <div className="font-bold">Conquista Desbloqueada!</div>
                                    <div className="text-sm">Clique em "Coletar" para ganhar XP</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="card bg-base-200 shadow-xl mb-6">
                        <div className="card-body">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="avatar placeholder">
                                        <div className="bg-primary text-primary-content rounded-lg w-16 h-16 flex items-center justify-center">
                                            <Trophy className="w-10 h-10" />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl sm:text-4xl font-bold">Conquistas</h1>
                                        <p className="text-base-content/60">Continue estudando para desbloquear mais!</p>
                                    </div>
                                </div>
                                <div className="stats shadow">
                                    <div className="stat place-items-center">
                                        <div className="stat-title">Total</div>
                                        <div className="stat-value text-primary">{userConquistas.totalColetadas}</div>
                                        <div className="stat-desc">de {totalConquistas} conquistas</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid de Categorias */}
                    <div className="space-y-4">
                        {categorias.map((categoria, catIndex) => {
                            const Icone = categoria.icone;
                            const conquistasCat = categoria.conquistas.filter(c =>
                                userConquistas.conquistas[c.id]?.coletada
                            ).length;

                            return (
                                <div key={categoria.nome} className="collapse collapse-arrow bg-base-200 shadow-xl border-2 border-base-300">
                                    <input type="checkbox" defaultChecked={catIndex === 0} />
                                    <div className="collapse-title">
                                        <div className="flex items-center justify-between pr-4">
                                            <div className="flex items-center gap-3">
                                                <Icone className={`w-8 h-8 text-${categoria.cor}`} />
                                                <h2 className="text-xl font-bold">{categoria.nome}</h2>
                                            </div>
                                            <div className={`badge badge-${categoria.cor} badge-lg`}>
                                                {conquistasCat}/{categoria.conquistas.length}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="collapse-content">
                                        <div className="space-y-3 pt-2">
                                            {categoria.conquistas.map((conquista) => {
                                                const conquistaData = userConquistas.conquistas[conquista.id];
                                                const desbloqueada = conquistaData?.desbloqueada || false;
                                                const coletada = conquistaData?.coletada || false;
                                                const podeDesbloquear = !desbloqueada;
                                                const podeColetar = desbloqueada && !coletada;

                                                return (
                                                    <div
                                                        key={conquista.id}
                                                        className={`card ${coletada
                                                                ? 'bg-base-300 border-2 border-success'
                                                                : desbloqueada
                                                                    ? 'bg-base-300 border-2 border-primary'
                                                                    : 'bg-base-100 opacity-60'
                                                            } shadow-sm relative`}
                                                        onMouseEnter={() => setHoveredConquista(conquista.id)}
                                                        onMouseLeave={() => setHoveredConquista(null)}
                                                    >
                                                        {/* Tooltip */}
                                                        {hoveredConquista === conquista.id && (
                                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10 w-72">
                                                                <div className="card bg-neutral text-neutral-content shadow-2xl">
                                                                    <div className="card-body p-3">
                                                                        <div className="text-sm space-y-1">
                                                                            <div className="font-bold flex items-center gap-2">
                                                                                <Zap className="w-4 h-4" /> Requisito:
                                                                            </div>
                                                                            <p>{conquista.requisito}</p>
                                                                            {coletada && (
                                                                                <div className="text-success font-bold pt-2 border-t border-neutral-content/20">
                                                                                    ✓ Conquista completada!
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="card-body p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`text-4xl ${coletada ? '' : desbloqueada ? '' : 'grayscale opacity-40'}`}>
                                                                    {conquista.icone}
                                                                </div>

                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <h3 className="font-bold">{conquista.nome}</h3>
                                                                        {coletada && <Star className="w-4 h-4 text-warning fill-warning" />}
                                                                        {!desbloqueada && <Lock className="w-4 h-4 opacity-50" />}
                                                                    </div>
                                                                    <p className="text-sm opacity-60">{conquista.desc}</p>

                                                                    <div className="flex items-center gap-2 mt-2">
                                                                        <div className={`badge badge-${categoria.cor} badge-sm`}>
                                                                            +{conquista.xp} XP
                                                                        </div>

                                                                        {podeDesbloquear && (
                                                                            <button
                                                                                onClick={() => desbloquearConquista(conquista.id)}
                                                                                className="btn btn-outline btn-xs"
                                                                            >
                                                                                Desbloquear
                                                                            </button>
                                                                        )}

                                                                        {podeColetar && (
                                                                            <button
                                                                                onClick={() => coletarXP(conquista.id, conquista.xp, conquista.nome)}
                                                                                className={`btn btn-${categoria.cor} btn-sm gap-2`}
                                                                            >
                                                                                <Sparkles className="w-4 h-4" />
                                                                                Coletar
                                                                            </button>
                                                                        )}

                                                                        {coletada && (
                                                                            <div className="badge badge-success badge-sm gap-1">
                                                                                <Sparkles className="w-3 h-3" /> COLETADO
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mensagem de conclusão */}
                    {userConquistas.totalColetadas === totalConquistas && (
                        <div className="alert alert-success shadow-lg mt-8">
                            <Trophy className="w-8 h-8" />
                            <div>
                                <h3 className="font-bold text-xl">🎉 MESTRE SUPREMO! 🎉</h3>
                                <div className="text-sm">Você desbloqueou e coletou todas as conquistas!</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AnimatedPage>
    );
};

export default Conquistas;