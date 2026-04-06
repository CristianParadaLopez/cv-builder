import { useNavigate } from "react-router-dom";

const features = [
  { icon: "🤖", title: "Generado con IA", desc: "La inteligencia artificial redacta y diseña tu CV automáticamente" },
  { icon: "🎨", title: "4 estilos visuales", desc: "Moderno, clásico, minimalista o creativo — vos elegís" },
  { icon: "✏️", title: "Edición por prompts", desc: "Cambiá colores, tipografía y diseño escribiendo en lenguaje natural" },
  { icon: "📄", title: "Exportá en PDF", desc: "Descargá tu CV listo para enviar a empresas o instituciones" },
];

const steps = [
  { n: "01", title: "Elegí tu estilo", desc: "Seleccioná entre 4 diseños profesionales" },
  { n: "02", title: "Completá tu info", desc: "Llenás el formulario con tus datos" },
  { n: "03", title: "La IA genera tu CV", desc: "En segundos tenés un CV profesional" },
  { n: "04", title: "Personalizá y descargá", desc: "Editá con prompts y exportá en PDF" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="flex items-center justify-between px-10 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-gray-800">ULS AI</span>
        </div>
        <button
          onClick={() => navigate("/builder")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
        >
          Crear CV gratis
        </button>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center text-center px-6 py-24 bg-gradient-to-b from-blue-50 to-white">
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          100% gratuito · Sin registro
        </span>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight max-w-3xl">
          Tu CV profesional generado por{" "}
          <span className="text-blue-600">Inteligencia Artificial</span>
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-xl">
          Completá tu información, elegí un estilo y la IA se encarga del resto.
          CV y portafolio listos en segundos.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/builder")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition shadow-lg shadow-blue-200"
          >
            Crear mi CV ahora →
          </button>
        </div>

        {/* Preview card */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-lg w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">J</div>
            <div className="text-left">
              <p className="font-bold text-gray-800 text-sm">Juan Pérez</p>
              <p className="text-gray-400 text-xs">Desarrollador Frontend</p>
            </div>
            <span className="ml-auto bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">✓ Generado</span>
          </div>
          <div className="space-y-2">
            {["Experiencia laboral", "Educación", "Habilidades", "Herramientas"].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-200 rounded-full" style={{ width: `${Math.random() * 40 + 60}%` }} />
                </div>
                <span className="text-xs text-gray-400">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-10 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Todo lo que necesitás para destacar
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STEPS */}
      <section className="bg-blue-600 px-10 py-20">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          ¿Cómo funciona?
        </h2>
        <div className="grid grid-cols-4 gap-6 max-w-4xl mx-auto">
          {steps.map((s) => (
            <div key={s.n} className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">{s.n}</span>
              </div>
              <h3 className="font-bold text-white mb-2 text-sm">{s.title}</h3>
              <p className="text-blue-100 text-xs">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center text-center px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          ¿Listo para crear tu CV?
        </h2>
        <p className="text-gray-500 mb-8">Gratis, sin registro y en menos de 2 minutos.</p>
        <button
          onClick={() => navigate("/builder")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition"
        >
          Empezar ahora →
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="text-sm text-gray-500">Skillara AI © 2026</span>
        </div>
        <p className="text-xs text-gray-400">Proyecto universitario — Herramientas de IA para el Desarrollo Web</p>
      </footer>
    </div>
  );
}