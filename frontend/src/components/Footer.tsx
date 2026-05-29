// src/components/Footer.tsx
// Footer profesional del sistema con links a guías, about, equipo, contacto

import { Link } from "react-router-dom";
import { Code2, Send, Link as LinkIcon, Heart, ExternalLink, BookOpen, Shield, Users, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  type FooterLink = { label: string; href: string; disabled?: boolean };
  const footerLinks: Record<string, FooterLink[]> = {
    producto: [
      { label: "Crear CV", href: "/builder" },
      { label: "Guía Profesional", href: "/guia" },
      { label: "Plantillas", href: "/builder" },
      { label: "Portafolio", href: "#", disabled: true },
    ],
    recursos: [
      { label: "¿Qué es un ATS?", href: "/guia#ats" },
      { label: "Plataformas de Empleo", href: "/guia#plataformas" },
      { label: "Seguridad Laboral", href: "/guia#seguridad" },
      { label: "Preguntas Frecuentes", href: "/guia#faq" },
    ],
    empresa: [
      { label: "Sobre Skillara", href: "#about" },
      { label: "Nuestro Equipo", href: "#equipo" },
      { label: "Contacto", href: "#contacto" },
    ],
    legal: [
      { label: "Privacidad", href: "#privacidad" },
      { label: "Términos", href: "#terminos" },
    ],
  };

  return (
    <footer 
      className="relative z-10 border-t"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}
              >
                S
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Skillara <span className="opacity-50">AI</span>
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4 max-w-sm" style={{ color: "var(--text-muted)" }}>
              Generador de CVs profesionales con Inteligencia Artificial. 
              Diseñado para el mercado laboral de El Salvador y Latinoamérica.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <Code2 size={15} />, label: "GitHub" },
                { icon: <Send size={15} />, label: "Telegram" },
                { icon: <LinkIcon size={15} />, label: "LinkedIn" },
              ].map((social, i) => (
                <button 
                  key={i}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ 
                    background: "var(--bg-card2)", 
                    border: "1px solid var(--border)", 
                    color: "var(--text-muted)" 
                  }}
                  title={social.label}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link, i) => (
                  <li key={i}>
                    {link.disabled ? (
                      <span className="text-sm flex items-center gap-1" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
                        {link.label}
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
                          Pronto
                        </span>
                      </span>
                    ) : link.href.startsWith("#") ? (
                      <span className="text-sm hover:opacity-70 transition cursor-pointer" style={{ color: "var(--text-muted)" }}>
                        {link.label}
                      </span>
                    ) : (
                      <Link 
                        to={link.href}
                        className="text-sm hover:opacity-70 transition"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div 
        className="border-t px-6 lg:px-12 py-5"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <span>Skillara AI &copy; {currentYear}</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">Plataforma universitaria impulsada con IA</span>
          </div>

          <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
            <span>Hecho con</span>
            <Heart size={12} className="text-red-500 fill-red-500" />
            <span>en El Salvador</span>
          </div>

          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="flex items-center gap-1">
              <Shield size={12} /> Datos seguros
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} /> 5 integrantes
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}