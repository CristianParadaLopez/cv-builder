import { useNavigate } from "react-router-dom";
import { Sparkles, FileText, Wand2, Download } from "lucide-react";

const features = [
  {
    icon: <Sparkles size={28} />,
    title: "IA Inteligente",
    desc: "Tu CV se genera automáticamente con diseño y contenido optimizado.",
  },
  {
    icon: <FileText size={28} />,
    title: "Plantillas modernas",
    desc: "Elegí entre distintos estilos visuales profesionales.",
  },
  {
    icon: <Wand2 size={28} />,
    title: "Edición con prompts",
    desc: "Personalizá colores, estilos y textos escribiendo naturalmente.",
  },
  {
    icon: <Download size={28} />,
    title: "Exportación rápida",
    desc: "Descargá tu CV listo para enviar en PDF.",
  },
];

const steps = [
  {
    number: "01",
    title: "Elegí un diseño",
    desc: "Seleccioná el estilo que mejor te represente.",
  },
  {
    number: "02",
    title: "Completá tus datos",
    desc: "Agregá experiencia, educación y habilidades.",
  },
  {
    number: "03",
    title: "La IA trabaja",
    desc: "Generamos un CV profesional automáticamente.",
  },
  {
    number: "04",
    title: "Descargá y compartí",
    desc: "Exportalo en PDF y empezá a postularte.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b1020] text-white overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#2563eb33,transparent_35%),radial-gradient(circle_at_bottom_left,#7c3aed33,transparent_35%)]" />

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
            S
          </div>
          <h1 className="text-xl font-bold tracking-wide">
            Skillara AI
          </h1>
        </div>

        <button
          onClick={() => navigate("/builder")}
          className="bg-white text-black px-5 py-2.5 rounded-xl font-semibold hover:scale-105 transition"
        >
          Crear CV
        </button>
      </nav>

      {/* HERO */}
      <section className="relative z-10 px-6 lg:px-16 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-200 mb-6">
              ✨ Gratis • IA integrada • Sin registro
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
              Creá un CV moderno con{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Inteligencia Artificial
              </span>
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed max-w-xl mb-10">
              Diseños modernos, generación automática y personalización inteligente.
              Todo listo en minutos.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/builder")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition shadow-2xl"
              >
                Empezar ahora →
              </button>

            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-blue-500/20 rounded-full" />

            <div className="relative bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
              
              {/* TOP */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold">
                  J
                </div>

                <div>
                  <h3 className="font-bold text-lg">Juan Pérez</h3>
                  <p className="text-gray-300 text-sm">
                    Frontend Developer
                  </p>
                </div>

                <div className="ml-auto bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full">
                  Generado
                </div>
              </div>

              {/* CONTENT */}
              <div className="space-y-5">
                {[
                  "Experiencia",
                  "Educación",
                  "Habilidades",
                  "Proyectos",
                ].map((item) => (
                  <div key={item}>
                    <div className="flex justify-between text-sm mb-2 text-gray-300">
                      <span>{item}</span>
                      <span>95%</span>
                    </div>

                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                        style={{
                          width: `${Math.random() * 20 + 80}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOT */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-gray-400">Diseños</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-2xl font-bold">PDF</p>
                  <p className="text-sm text-gray-400">Exportación</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 px-6 lg:px-16 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Todo lo que necesitás
          </h2>
          <p className="text-gray-400">
            Herramientas modernas para crear un CV impactante.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-5 text-blue-300">
                {feature.icon}
              </div>

              <h3 className="font-bold text-lg mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* STEPS */}
      <section className="relative z-10 px-6 lg:px-16 py-24">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-[40px] p-10 lg:p-16">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-blue-100">
              En menos de 2 minutos tendrás tu CV listo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white/10 rounded-3xl p-6 border border-white/10"
              >
                <div className="text-5xl font-black text-white/20 mb-4">
                  {step.number}
                </div>

                <h3 className="font-bold text-lg mb-3">
                  {step.title}
                </h3>

                <p className="text-blue-100 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24 text-center">
        <h2 className="text-5xl font-black mb-6">
          Empezá gratis hoy
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
          Creá un CV profesional con IA y destacate entre cientos de candidatos.
        </p>

        <button
          onClick={() => navigate("/builder")}
          className="bg-white text-black px-10 py-5 rounded-2xl text-lg font-bold hover:scale-105 transition"
        >
          Crear mi CV →
        </button>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 px-8 py-8 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
            S
          </div>

          <span className="text-gray-400 text-sm">
            Skillara AI © 2026
          </span>
        </div>

        <p className="text-gray-500 text-sm text-center">
          Plataforma universitaria impulsada con Inteligencia Artificial
        </p>
      </footer>
    </div>
  );
}