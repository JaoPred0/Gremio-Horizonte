import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary text-primary-content">
      <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="badge badge-lg bg-base-100/20 text-base-100 border-base-100/40 px-6 py-4 gap-2 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-base-100 animate-pulse"></div>
              Central de Ajuda
            </div>
          </motion.div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight">
            Como podemos<br />
            <span className="bg-gradient-to-r from-base-100 to-base-100/70 bg-clip-text text-transparent">
              ajudar você?
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Encontre respostas rápidas, tutoriais completos e suporte especializado para todas as suas dúvidas
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <div className="badge badge-lg bg-base-100/10 border-base-100/30 text-base-100">Segurança</div>
              <div className="badge badge-lg bg-base-100/10 border-base-100/30 text-base-100">Configurações</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-base-200 to-transparent"></div>
    </div>
  );
}