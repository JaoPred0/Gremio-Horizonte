import React from 'react';
import { HelpCircle, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const faqs = [
  {
    question: "Como posso redefinir minha senha?",
    answer: "Acesse a página de login e clique em 'Esqueci minha senha'. Você receberá um e-mail com instruções para criar uma nova senha. O link expira em 24 horas."
  },
  {
    question: "Quais são as formas de pagamento aceitas?",
    answer: "Aceitamos cartões de crédito (Visa, Mastercard, American Express), PIX, boleto bancário e transferência bancária. Para empresas, também oferecemos faturamento mensal."
  },
  {
    question: "Como faço para cancelar minha assinatura?",
    answer: "Você pode cancelar a qualquer momento em Configurações > Assinatura > Cancelar plano. Seu acesso continuará ativo até o fim do período pago."
  },
  {
    question: "É possível exportar meus dados?",
    answer: "Sim! Vá em Configurações > Dados > Exportar. Você pode baixar todos os seus dados em formato CSV ou JSON. O processo pode levar alguns minutos."
  },
  {
    question: "Como entro em contato com o suporte?",
    answer: "Oferecemos suporte por e-mail (suporte@exemplo.com), chat ao vivo (disponível 24/7) e telefone em horário comercial. Tempo médio de resposta: 2 horas."
  },
  {
    question: "A plataforma possui aplicativo mobile?",
    answer: "Sim! Nosso aplicativo está disponível para iOS e Android. Baixe na App Store ou Google Play e faça login com suas credenciais."
  },
];

export default function FAQSection({ filteredFaqs }) {
  const faqsToShow = filteredFaqs || faqs;
  
  return (
    <div className="mb-24">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 badge badge-success badge-lg px-6 py-4 mb-6">
            <HelpCircle className="h-5 w-5" />
            <span className="font-bold">Perguntas Frequentes</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Dúvidas Mais Comuns
          </h2>
          <p className="text-xl opacity-70 max-w-2xl mx-auto">
            Respostas rápidas e diretas para as perguntas que recebemos com mais frequência
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {faqsToShow.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300"
          >
            <div className="card-body p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg leading-tight">
                  {faq.question}
                </h3>
              </div>
              <p className="opacity-70 leading-relaxed pl-14">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}