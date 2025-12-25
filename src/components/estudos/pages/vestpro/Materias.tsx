import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import { conteudosData as cards } from "@/data/conteudosData";

const Materias = () => {
  const [search, setSearch] = useState("");
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  // 🔥 Carrega progresso de TODAS as matérias com timeout
  useEffect(() => {
    const fetchAllProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const startTime = Date.now();
      const newMap = {};

      // Buscar tudo em paralelo
      const promises = cards.map(async (item) => {
        try {
          const ref = doc(db, "estudos", user.uid, item.materia, "progresso");
          const snap = await getDoc(ref);

          if (snap.exists()) {
            const data = snap.data();
            const total = item.total;
            const feitos = Object.values(data).filter(Boolean).length;
            const percent = Math.round((feitos / total) * 100);
            return { id: item.id, percent };
          }
          return { id: item.id, percent: 0 };
        } catch (err) {
          return { id: item.id, percent: 0 };
        }
      });

      const results = await Promise.all(promises);
      results.forEach((r) => {
        newMap[r.id] = r.percent;
      });

      // Garantir pelo menos 1 segundo de loading para suavidade
      const elapsed = Date.now() - startTime;
      const delay = Math.max(1000 - elapsed, 0);

      setTimeout(() => {
        setProgressMap(newMap);
        setLoading(false);
      }, delay);
    };

    fetchAllProgress();
  }, [user]);

  const filteredCards = cards.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-2xl sm:text-3xl font-bold">Matérias</h1>
          <p className="text-sm sm:text-base opacity-70">Escolha uma matéria para começar a estudar</p>
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative w-full"
        >
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            placeholder="Pesquisar matéria..."
            className="input input-bordered w-full pl-12 pr-4 h-12 rounded-xl shadow-sm focus:shadow-md transition-shadow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* 🔥 SKELETON ENQUANTO CARREGA */}
          <AnimatePresence mode="wait">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="card bg-base-100 shadow-lg rounded-2xl overflow-hidden"
                >
                  <div className="p-6 space-y-4 animate-pulse">
                    <div className="flex items-start gap-4">
                      <div className="skeleton w-14 h-14 rounded-xl shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="skeleton h-5 w-3/4"></div>
                        <div className="skeleton h-3 w-full"></div>
                        <div className="skeleton h-3 w-2/3"></div>
                      </div>
                    </div>
                    <div className="skeleton h-2 w-full rounded-full"></div>
                  </div>
                </motion.div>
              ))}

            {/* 🔥 CARDS REAIS */}
            {!loading &&
              filteredCards.map((item, idx) => {
                const Icon = item.icon;
                const percent = progressMap[item.id] ?? 0;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link to={item.to} className="block group">
                      <motion.div
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative card bg-base-100 shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden transition-all cursor-pointer h-full"
                      >
                        <div className="p-6 space-y-4">
                          {/* Conteúdo */}
                          <div className="flex items-start gap-4">
                            <motion.div 
                              whileHover={{ rotate: 5, scale: 1.1 }}
                              className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors"
                            >
                              <Icon className="w-7 h-7 text-primary" />
                            </motion.div>

                            <div className="flex-1 min-w-0">
                              <h2 className="font-bold text-base sm:text-lg mb-2 line-clamp-1">
                                {item.title}
                              </h2>
                              <p className="text-xs sm:text-sm text-base-content/60 line-clamp-2 leading-relaxed">
                                {item.desc}
                              </p>
                            </div>
                          </div>

                          {/* 🔥 Progresso com label */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-base-content/70">Progresso</span>
                              <span className="font-bold text-primary">{percent}%</span>
                            </div>
                            <div className="relative w-full h-2 bg-base-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.05 }}
                                className="absolute h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Badge de conclusão */}
                        {percent === 100 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 badge badge-success badge-sm gap-1 shadow-lg"
                          >
                            ✓ Completo
                          </motion.div>
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
          </AnimatePresence>

          {/* Mensagem vazia */}
          {!loading && filteredCards.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full"
            >
              <div className="card bg-base-100 shadow-lg rounded-2xl p-12 text-center">
                <div className="space-y-3">
                  <div className="text-5xl opacity-20">📚</div>
                  <h3 className="font-bold text-lg">Nenhuma matéria encontrada</h3>
                  <p className="text-sm text-base-content/60">
                    Tente pesquisar com outros termos
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Materias;