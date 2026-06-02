import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/config.ts";
import { ArrowLeft, Sun, Moon } from "lucide-react";

export default function LoginPage() {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [dark, setDark] = useState(() => {
        const saved = localStorage.getItem("skillara-theme");
        if (saved) return saved === "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    const handleEmailAuth = async () => {
        setError("");
        setLoading(true);
        try {
            if (isRegister) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            navigate("/dashboard");
        } catch (e: any) {
            const code = e.code;
            if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
                setError("Contraseña incorrecta o el usuario no existe. ¿Ya te registraste?");
            } else if (code === "auth/user-not-found") {
                setError("No existe una cuenta con ese email. Registrate primero.");
            } else if (code === "auth/email-already-in-use") {
                setError("Ya existe una cuenta con ese email. Iniciá sesión.");
            } else if (code === "auth/weak-password") {
                setError("La contraseña debe tener al menos 6 caracteres.");
            } else {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError("");
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/dashboard");
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: "var(--bg)", color: "var(--text)" }}>

            {/* ══════════════════════════════════════════════════════
                LEFT SIDE — Logo (desktop)
            ══════════════════════════════════════════════════════ */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-8"
                style={{ background: "var(--bg)" }}>
                
                <div className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{ background: "radial-gradient(circle at center, var(--glow-1), transparent 60%)" }} />

                <div className="relative z-10 w-full max-w-sm">
                    <img
                        src="/images/logotext.png"
                        alt="Skillara AI"
                        className="w-full h-auto object-contain drop-shadow-2xl"
                    />
                </div>

                <button onClick={() => navigate("/")}
                    className="absolute top-5 left-5 flex items-center gap-2 text-sm font-medium transition"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
                    <ArrowLeft size={16} />
                    Volver
                </button>
            </div>

            {/* ══════════════════════════════════════════════════════
                RIGHT SIDE — Login form
            ══════════════════════════════════════════════════════ */}
            <div className="flex-1 relative flex flex-col">

                {/* BG Glow */}
                <div className="fixed inset-0 pointer-events-none lg:left-1/2">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
                        style={{ background: "radial-gradient(circle, var(--glow-1), transparent 70%)", transform: "translate(20%,-20%)" }} />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20"
                        style={{ background: "radial-gradient(circle, var(--glow-2), transparent 70%)", transform: "translate(-20%,20%)" }} />
                </div>

                {/* Header mobile: logo + volver + tema */}
                <div className="lg:hidden relative z-10 flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate("/")}
                            className="flex items-center gap-1.5 text-sm font-medium transition"
                            style={{ color: "var(--text-muted)" }}>
                            <ArrowLeft size={14} />
                            <span className="hidden sm:inline">Volver</span>
                        </button>
                    </div>
                    <img src="/images/logotext.png" alt="Skillara AI" className="h-6 w-auto object-contain absolute left-1/2 -translate-x-1/2" />
                    <button onClick={() => setDark(!dark)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:scale-110"
                        style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                        {dark ? <Sun size={14} /> : <Moon size={14} />}
                    </button>
                </div>

                {/* Header desktop: tema + volver */}
                <div className="hidden lg:flex relative z-10 items-center justify-end px-8 py-5 gap-3">
                    <button onClick={() => setDark(!dark)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition hover:scale-110"
                        style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                        title={dark ? "Modo claro" : "Modo oscuro"}>
                        {dark ? <Sun size={17} /> : <Moon size={17} />}
                    </button>
                    <button onClick={() => navigate("/")}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl font-semibold transition hover:scale-105"
                        style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text)" }}>
                        <ArrowLeft size={15} />
                        Volver al inicio
                    </button>
                </div>

                {/* Form */}
                <div className="relative z-10 flex-1 flex items-center justify-center px-5 py-4 lg:py-8">
                    <div className="w-full max-w-sm">

                        {/* Mobile: logo + título */}
                        <div className="lg:hidden text-center mb-5">
                            <img 
                                src="/images/logotext.png" 
                                alt="Skillara AI" 
                                className="h-14 w-auto object-contain mx-auto mb-2"
                            />
                            <h1 className="text-xl font-black tracking-tight mb-1">
                                {isRegister ? "Crear cuenta" : "Bienvenido"}
                            </h1>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                {isRegister ? "Registrate para guardar tus CVs" : "Iniciá sesión para acceder a tus CVs"}
                            </p>
                        </div>

                        {/* Desktop: título */}
                        <div className="hidden lg:block mb-5">
                            <h1 className="text-2xl font-black tracking-tight mb-1">
                                {isRegister ? "Crear cuenta" : "Bienvenido de vuelta"}
                            </h1>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                {isRegister ? "Registrate para guardar tus CVs en la nube" : "Iniciá sesión para acceder a tus CVs guardados"}
                            </p>
                        </div>

                        <div className="glass-card rounded-2xl p-5 lg:p-6 shadow-2xl"
                            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

                            {error && (
                                <div className="rounded-xl p-2.5 mb-3 text-xs font-medium flex items-center gap-2"
                                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
                                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                                        Correo electrónico
                                    </label>
                                    <input type="email" placeholder="tu@email.com" value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field w-full py-2.5 text-sm" style={{ background: "var(--bg-card2)" }} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                                        Contraseña
                                    </label>
                                    <input type="password" placeholder="••••••••" value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-field w-full py-2.5 text-sm" style={{ background: "var(--bg-card2)" }} />
                                </div>
                            </div>

                            <button onClick={handleEmailAuth} disabled={loading}
                                className="w-full mt-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))", color: "white" }}>
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Cargando...
                                    </span>
                                ) : (
                                    isRegister ? "Registrarse" : "Iniciar sesión"
                                )}
                            </button>

                            <div className="flex items-center my-4">
                                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                                <span className="px-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>o</span>
                                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                            </div>

                            <button onClick={handleGoogle}
                                className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text)" }}>
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" />
                                Continuar con Google
                            </button>

                            <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>
                                {isRegister ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"}{" "}
                                <button onClick={() => setIsRegister(!isRegister)}
                                    className="font-semibold transition hover:opacity-80" style={{ color: "var(--accent-1)" }}>
                                    {isRegister ? "Iniciá sesión" : "Registrate"}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}