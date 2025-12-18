import AnimatedPage from '@/components/AnimatedPage';
import React, { useState, useEffect } from 'react';
import { Check, FileText, Home, Palette, PlusSquare } from 'lucide-react';

const themes = [
    { name: "light", description: "Tema claro e limpo.", colors: ["#ffffff", "#f3f4f6", "#3b82f6"] },
    { name: "dark", description: "Tema escuro para ambientes noturnos.", colors: ["#1f2937", "#111827", "#6366f1"] },
    { name: "cupcake", description: "Tema doce e colorido.", colors: ["#faf7f5", "#efeae6", "#65c3c8"] },
    { name: "bumblebee", description: "Tema amarelo e preto vibrante.", colors: ["#ffffff", "#f9fafb", "#e0a82e"] },
    { name: "emerald", description: "Tema verde esmeralda elegante.", colors: ["#ffffff", "#f3f4f6", "#10b981"] },
    { name: "corporate", description: "Tema profissional e neutro.", colors: ["#ffffff", "#f3f4f6", "#4b6bfb"] },
    { name: "synthwave", description: "Tema retrô futurista.", colors: ["#2d1b69", "#1a1033", "#e779c1"] },
    { name: "retro", description: "Tema vintage clássico.", colors: ["#e4d8b4", "#d6c7a8", "#ef9995"] },
    { name: "cyberpunk", description: "Tema high-tech distópico.", colors: ["#ffee00", "#1a1a2e", "#ff7598"] },
    { name: "valentine", description: "Tema romântico e rosa.", colors: ["#f0d6e8", "#fae7f4", "#e96d7b"] },
    { name: "halloween", description: "Tema assustador e laranja.", colors: ["#212121", "#1f1f1f", "#f28c18"] },
    { name: "garden", description: "Tema natural e verde.", colors: ["#e9e7e7", "#d4d4d8", "#5c7f67"] },
    { name: "forest", description: "Tema florestal profundo.", colors: ["#171212", "#1d232a", "#1eb854"] },
    { name: "aqua", description: "Tema aquático refrescante.", colors: ["#345da7", "#2563eb", "#09ecf3"] },
    { name: "lofi", description: "Tema relaxante e minimalista.", colors: ["#ffffff", "#f3f4f6", "#0d0d0d"] },
    { name: "pastel", description: "Tema suave e pastel.", colors: ["#ffffff", "#f3f4f6", "#d1c1d7"] },
    { name: "fantasy", description: "Tema mágico e imaginário.", colors: ["#ffffff", "#f3f4f6", "#6e0b75"] },
    { name: "wireframe", description: "Tema esquelético e técnico.", colors: ["#ffffff", "#ebebeb", "#b8b8b8"] },
    { name: "black", description: "Tema totalmente preto.", colors: ["#000000", "#0d0d0d", "#343232"] },
    { name: "luxury", description: "Tema luxuoso e dourado.", colors: ["#09090b", "#171618", "#dca54c"] },
    { name: "dracula", description: "Tema gótico e vermelho.", colors: ["#282a36", "#1e1f29", "#ff79c6"] },
    { name: "cmyk", description: "Tema baseado em cores CMYK.", colors: ["#ffffff", "#f3f4f6", "#45AEEE"] },
    { name: "autumn", description: "Tema outonal e quente.", colors: ["#f1f1f1", "#e5e5e5", "#8C0327"] },
    { name: "business", description: "Tema corporativo sério.", colors: ["#202020", "#1c1c1c", "#1C4E80"] },
    { name: "acid", description: "Tema ácido e psicodélico.", colors: ["#fafafa", "#f3f4f6", "#FF00F4"] },
    { name: "lemonade", description: "Tema cítrico e refrescante.", colors: ["#ffffff", "#f3f4f6", "#519903"] },
    { name: "night", description: "Tema noturno escuro.", colors: ["#0f1729", "#1a1a2e", "#38bdf8"] },
    { name: "coffee", description: "Tema marrom e acolhedor.", colors: ["#20161F", "#120c12", "#DB924B"] },
    { name: "winter", description: "Tema invernal gelado.", colors: ["#ffffff", "#f3f4f6", "#047AFF"] },
    { name: "dim", description: "Tema suave e atenuado.", colors: ["#2A303C", "#242933", "#9FE88D"] },
    { name: "nord", description: "Tema nórdico frio.", colors: ["#eceff4", "#e5e9f0", "#5E81AC"] },
    { name: "sunset", description: "Tema pôr do sol laranja.", colors: ["#1a1a2e", "#16161a", "#FF865B"] },
    { name: "caramellatte", description: "Tema caramelo cremoso.", colors: ["#EFE5D8", "#e5dcd0", "#DB7706"] },
    { name: "abyss", description: "Tema abissal profundo.", colors: ["#0d1117", "#010409", "#58a6ff"] },
    { name: "silk", description: "Tema sedoso e elegante.", colors: ["#f5f5f4", "#e7e5e4", "#6d28d9"] }
];

export default function Aparencia() {
    const [theme, setTheme] = useState("light");
    const [mounted, setMounted] = useState(false);

    // Carregar tema do localStorage na inicialização
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem("selectedTheme");
        if (savedTheme && themes.some(t => t.name === savedTheme)) {
            setTheme(savedTheme);
            document.documentElement.setAttribute("data-theme", savedTheme);
        }
    }, []);


    // Aplicar tema e salvar no localStorage
    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("selectedTheme", newTheme);
    };

    if (!mounted) return null;

    return (
        <AnimatedPage>

            <div className="min-h-screen p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 md:mb-12">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-primary/10">
                                <Palette className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-base-content">Aparência</h1>
                        </div>
                        <p className="text-base-content/60 text-sm md:text-base">
                            Escolha o tema que combina com você. Tema atual: <span className="font-semibold text-primary capitalize">{theme}</span>
                        </p>
                    </div>

                    {/* Layout para PC */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {themes.map(t => (
                            <div
                                key={t.name}
                                onClick={() => handleThemeChange(t.name)}
                                className={`
                  group relative cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden
                  hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1
                  ${theme === t.name
                                        ? 'border-primary shadow-lg shadow-primary/20'
                                        : 'border-base-300 hover:border-primary/50'
                                    }
                `}
                            >
                                {/* Preview de cores */}
                                <div className="h-20 flex">
                                    {t.colors.map((color, idx) => (
                                        <div
                                            key={idx}
                                            className="flex-1 transition-all duration-300 group-hover:brightness-110"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>

                                {/* Conteúdo */}
                                <div className="p-4 bg-base-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="font-bold capitalize text-base-content">{t.name}</h2>
                                        {theme === t.name && (
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
                                                <Check className="w-4 h-4 text-primary-content" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-base-content/60 line-clamp-2">{t.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Layout para celular */}
                    <div className="md:hidden grid grid-cols-2 gap-3">
                        {themes.map(t => (
                            <button
                                key={t.name}
                                onClick={() => handleThemeChange(t.name)}
                                className={`
                  relative rounded-xl overflow-hidden transition-all duration-300 active:scale-95
                  ${theme === t.name
                                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100'
                                        : ''
                                    }
                `}
                            >
                                {/* Preview de cores */}
                                <div className="h-12 flex">
                                    {t.colors.map((color, idx) => (
                                        <div key={idx} className="flex-1" style={{ backgroundColor: color }} />
                                    ))}
                                </div>

                                {/* Nome do tema */}
                                <div className="py-2 px-3 bg-base-100 flex items-center justify-between">
                                    <span className="text-sm font-medium capitalize text-base-content">{t.name}</span>
                                    {theme === t.name && (
                                        <Check className="w-4 h-4 text-primary" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}