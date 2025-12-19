import React from 'react';
import { Mail, Phone, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactSection() {
  return (
    <div className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="card bg-gradient-to-br from-primary via-primary to-secondary text-primary-content shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
        
        <div className="card-body p-12 md:p-20 relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ainda precisa de ajuda?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Nossa equipe de suporte está pronta para ajudar você a qualquer momento
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <motion.a
              href="mailto:suporte@exemplo.com"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
              className="card bg-base-100/10 backdrop-blur-md hover:bg-base-100/20 transition-all duration-300 border-2 border-base-100/20 hover:border-base-100/40"
            >
              <div className="card-body p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-info/30 flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-10 w-10 text-info" />
                </div>
                <h3 className="font-bold text-2xl mb-2">E-mail</h3>
                <p className="text-base opacity-80 mb-4">suporte@exemplo.com</p>
                <div className="divider my-4"></div>
                <div className="flex items-center justify-center gap-2 text-sm opacity-80">
                  <Clock className="h-4 w-4" />
                  Resposta em até 2h
                </div>
              </div>
            </motion.a>

            <motion.a
              href="#"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
              className="card bg-base-100/10 backdrop-blur-md hover:bg-base-100/20 transition-all duration-300 border-2 border-base-100/20 hover:border-base-100/40"
            >
              <div className="card-body p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-success/30 flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-10 w-10 text-success" />
                </div>
                <h3 className="font-bold text-2xl mb-2">Chat ao Vivo</h3>
                <p className="text-base opacity-80 mb-4">Disponível 24/7</p>
                <div className="divider my-4"></div>
                <div className="flex items-center justify-center gap-2 text-sm text-success">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                  </span>
                  Online agora
                </div>
              </div>
            </motion.a>

            <motion.a
              href="tel:+551199999999"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
              className="card bg-base-100/10 backdrop-blur-md hover:bg-base-100/20 transition-all duration-300 border-2 border-base-100/20 hover:border-base-100/40"
            >
              <div className="card-body p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-6">
                  <Phone className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="font-bold text-2xl mb-2">Telefone</h3>
                <p className="text-base opacity-80 mb-4">+55 11 9999-9999</p>
                <div className="divider my-4"></div>
                <div className="flex items-center justify-center gap-2 text-sm opacity-80">
                  <Clock className="h-4 w-4" />
                  Seg-Sex, 9h às 18h
                </div>
              </div>
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}