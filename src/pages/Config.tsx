import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  Bell,
  Paintbrush,
  Languages,
  Lock,
  HelpCircle,
  MessageSquare,
  Info,
  ChevronRight,
  Settings
} from 'lucide-react';
import configData from '@/data/configLinks.json';
import AnimatedPage from '@/components/AnimatedPage';

const iconsMap = {
  UserIcon: User,
  ShieldCheckIcon: ShieldCheck,
  BellIcon: Bell,
  PaintBrushIcon: Paintbrush,
  LanguageIcon: Languages,
  LockClosedIcon: Lock,
  QuestionMarkCircleIcon: HelpCircle,
  ChatBubbleLeftRightIcon: MessageSquare,
  InformationCircleIcon: Info
};

export const Config = () => {
  // Layout Mobile
  const MobileLayout = () => (
    <div className="lg:hidden min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-base-200 to-base-300 p-6 pb-8 mb-10 rounded-b-3xl shadow-xl"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-base-300/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Settings className="w-7 h-7 text-base-content" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-base-content">Configurações</h1>
            <p className="text-base-content/80 text-sm">Personalize sua experiência</p>
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="px-4 -mt-4 space-y-6">
        {configData.sections.map((section, sectionIdx) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIdx * 0.1 }}
          >
            <h2 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3 px-2">
              {section.title}
            </h2>
            <div className="bg-base-100 rounded-2xl shadow-lg overflow-hidden">
              {section.items.map((item, itemIdx) => {
                const Icon = iconsMap[item.icon];
                return (
                  <Link key={item.id} to={item.path}>
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex items-center gap-4 p-4
                        hover:bg-base-200 active:bg-base-300
                        transition-colors
                        ${itemIdx !== section.items.length - 1 ? 'border-b border-base-200' : ''}
                      `}
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        {Icon && <Icon className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base-content">{item.label}</p>
                        <p className="text-xs text-base-content/60 truncate">{item.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-base-content/40 flex-shrink-0" />
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Layout Desktop
  const DesktopLayout = () => (
    <div className="hidden lg:flex min-h-screen bg-base-100">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 border-r border-base-300 p-6"
      >
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Settings className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-base-content">Configurações</h1>
              <p className="text-base-content/60 text-sm">Personalize sua experiência</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {configData.sections.map((section, sectionIdx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sectionIdx * 0.1 }}
            >
              <h2 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-3">
                {section.title}
              </h2>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = iconsMap[item.icon];
                  return (
                    <Link key={item.id} to={item.path}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-100 transition-colors group"
                      >
                        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          {Icon && <Icon className="w-5 h-5 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-base-content">{item.label}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-base-content/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-4xl font-black text-base-content mb-3">Visão Geral</h2>
            <p className="text-base-content/60 text-lg">
              Gerencie todas as configurações do seu aplicativo em um só lugar
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-3 gap-6">
            {configData.sections.map((section, idx) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="bg-gradient-to-br from-base-200 to-base-300 rounded-2xl p-6 border border-base-300 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-lg font-bold text-base-content mb-4">{section.title}</h3>
                <div className="space-y-3">
                  {section.items.map((item) => {
                    const Icon = iconsMap[item.icon];
                    return (
                      <Link key={item.id} to={item.path}>
                        <motion.div
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="flex items-center gap-3 p-3 bg-base-100 rounded-xl hover:bg-base-100/80 transition-colors"
                        >
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            {Icon && <Icon className="w-4 h-4 text-primary" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-base-content truncate">{item.label}</p>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <>
      <AnimatedPage>
        <MobileLayout />
        <DesktopLayout />
      </AnimatedPage>
    </>
  );
};