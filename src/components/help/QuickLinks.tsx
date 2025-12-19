import React from 'react';
import { Video, FileText, BookOpen, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const quickLinks = [
  { 
    icon: Video, 
    title: "Tutoriais em Vídeo", 
    description: "Aprenda visualmente com nossos guias",
    color: "from-rose-500 to-pink-500",
    href: "#" 
  },
  { 
    icon: FileText, 
    title: "Documentação", 
    description: "Guias técnicos detalhados",
    color: "from-blue-500 to-cyan-500",
    href: "#" 
  },
  { 
    icon: BookOpen, 
    title: "Blog & Artigos", 
    description: "Dicas, truques e novidades",
    color: "from-amber-500 to-orange-500",
    href: "#" 
  },
  { 
    icon: MessageCircle, 
    title: "Comunidade", 
    description: "Fórum e discussões",
    color: "from-purple-500 to-indigo-500",
    href: "#" 
  },
];

export default function QuickLinks() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-16 mb-24">
      {quickLinks.map((link, index) => (
        <motion.a
          key={index}
          href={link.href}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-base-300 overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
          <div className="card-body p-8 relative">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${link.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <link.icon className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">{link.title}</h3>
            <p className="text-base opacity-70 leading-relaxed">{link.description}</p>
          </div>
        </motion.a>
      ))}
    </div>
  );
}