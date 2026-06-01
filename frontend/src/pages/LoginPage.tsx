import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";

export default function LoginPage() {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
        }  catch (e: any) {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold text-center mb-6">
                {isRegister ? "Crear cuenta" : "Iniciar sesión"}
            </h1>

            {error && (
                <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
                onClick={handleEmailAuth}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
                {loading ? "Cargando..." : isRegister ? "Registrarse" : "Entrar"}
            </button>

            <div className="flex items-center my-4">
                <hr className="flex-1" />
                <span className="px-3 text-gray-400 text-sm">o</span>
                <hr className="flex-1" />
            </div>

            <button
                onClick={handleGoogle}
                className="w-full border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" />
                Continuar con Google
            </button>

            <p className="text-center text-sm mt-4 text-gray-500">
                {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
                <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-blue-600 font-medium hover:underline"
                >
                    {isRegister ? "Inicia sesión" : "Regístrate"}
                </button>
            </p>
        </div>
    </div>
);
}