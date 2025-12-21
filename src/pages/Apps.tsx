import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { appsData } from '@/components/apps/appsData';
import { LayoutGrid } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import SearchBar from '@/components/apps/SearchBar';
import AppGrid from '@/components/apps/AppGrid';

export default function Apps() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const filteredApps = useMemo(() => {
        if (!searchQuery.trim()) return appsData;

        const query = searchQuery.toLowerCase().trim();
        return appsData.filter(
            (app) =>
                app.name.toLowerCase().includes(query) ||
                app.description.toLowerCase().includes(query) ||
                app.category.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-base-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                            <LayoutGrid className="w-7 h-7 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-base-content">Aplicativos</h1>
                        <p className="text-base-content/60 mt-2">
                            Explore nossa coleção de aplicativos
                        </p>
                    </motion.div>

                    <SearchBar value={searchQuery} onChange={setSearchQuery} />

                    {!isLoading && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-base-content/50 mb-4"
                        >
                            {filteredApps.length} {filteredApps.length === 1 ? 'aplicativo' : 'aplicativos'} encontrado{filteredApps.length !== 1 ? 's' : ''}
                        </motion.p>
                    )}

                    <AppGrid apps={filteredApps} isLoading={isLoading} />
                </div>
            </div>
        </AnimatedPage>
    );
}