import React from 'react';
import { Zap, Users, CreditCard, Settings, Shield, Smartphone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  {
    icon: Zap,
    title: "Primeiros Passos",
    description: "Tudo que você precisa para começar",
    articles: 12,
    gradient: "from-amber-500 to-orange-500",
    links: [
      { title: "Como criar sua conta", href: "#" },
      { title: "Configuração inicial completa", href: "#" },
      { title: "Tour guiado pela plataforma", href: "#" },
    ]
  },
  {
    icon: Users,
    title: "Conta e Perfil",
    description: "Gerencie suas informações pessoais",
    articles: 8,
    gradient: "from-blue-500 to-cyan-500",
    links: [
      { title: "Editar dados do perfil", href: "#" },
      { title: "Alterar senha e email", href: "#" },
      { title: "Configurar notificações", href: "#" },
    ]
  },
  {
    icon: CreditCard,
    title: "Pagamentos",
    description: "Dúvidas sobre cobrança e faturas",
    articles: 15,
    gradient: "from-emerald-500 to-green-500",
    links: [
      { title: "Métodos de pagamento aceitos", href: "#" },
      { title: "Visualizar histórico de faturas", href: "#" },
      { title: "Processo de reembolso", href: "#" },
    ]
  },
  {
    icon: Settings,
    title: "Configurações",
    description: "Personalize sua experiência",
    articles: 10,
    gradient: "from-purple-500 to-indigo-500",
    links: [
      { title: "Preferências gerais", href: "#" },
      { title: "Conectar integrações", href: "#" },
      { title: "Configurar API e Webhooks", href: "#" },
    ]
  },
  {
    icon: Shield,
    title: "Segurança",
    description: "Proteja sua conta e dados",
    articles: 7,
    gradient: "from-rose-500 to-pink-500",
    links: [
      { title: "Autenticação de dois fatores", href: "#" },
      { title: "Gerenciar sessões ativas", href: "#" },
      { title: "Política de privacidade", href: "#" },
    ]
  },
  {
    icon: Smartphone,
    title: "App Mobile",
    description: "Suporte para dispositivos móveis",
    articles: 6,
    gradient: "from-cyan-500 to-blue-500",
    links: [
      { title: "Baixar aplicativo iOS/Android", href: "#" },
      { title: "Sincronizar dados entre dispositivos", href: "#" },
      { title: "Ativar notificações push", href: "#" },
    ]
  },
];

export default function HelpCategories({ filteredCategories }) {
  const categoriesToShow = filteredCategories || categories;
  
  return (
    <div className="mb-24">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Explore por Categoria
          </h2>
          <p className="text-xl opacity-70 max-w-2xl mx-auto">
            Navegue por tópicos organizados para encontrar exatamente o que você precisa
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoriesToShow.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            <div className="card-body p-8 relative">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="h-8 w-8" />
                </div>
                <div className="badge badge-secondary badge-lg font-bold px-4 py-3">
                  {category.articles} artigos
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <p className="opacity-70 text-base mb-6 leading-relaxed">
                {category.description}
              </p>
              
              <div className="space-y-3">
                {category.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-base-200 transition-all group/link"
                  >
                    <span className="text-sm font-medium">{link.title}</span>
                    <ArrowRight className="h-4 w-4 opacity-40 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
              
              <button className="btn btn-ghost btn-block mt-6 gap-2 group-hover:btn-primary transition-all">
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}