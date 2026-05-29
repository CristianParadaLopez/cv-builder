// src/components/PhotoUpload.tsx
// Subida de foto de perfil con drag & drop, preview circular y validación
// UX Pattern: Progressive disclosure with visual feedback

import { useState, useRef, useCallback } from "react";
import { Upload, X, User, AlertTriangle, CheckCircle2, Image as ImageIcon } from "lucide-react";

interface Props {
  photo: string | null; // Base64
  onPhotoChange: (photo: string | null) => void;
  mode?: "ats" | "designed";
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function PhotoUpload({ photo, onPhotoChange, mode = "designed" }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(photo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Formato no válido. Usa JPG, PNG o WebP.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "La imagen es muy grande. Máximo 2MB.";
    }
    return null;
  };

  const processFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onPhotoChange(result);
    };
    reader.readAsDataURL(file);
  }, [onPhotoChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleRemove = () => {
    setPreview(null);
    onPhotoChange(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Si es modo ATS, mostrar advertencia
  if (mode === "ats") {
    return (
      <div className="rounded-xl p-4" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" style={{ color: "#f59e0b" }} />
          <div>
            <p className="text-sm font-semibold mb-1">Modo ATS activado</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              En modo ATS no se incluye foto de perfil. Los sistemas automáticos pueden rechazar CVs con fotos.
              Si querés agregar una foto, cambiá a modo Diseñado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium" style={{ color: "var(--text-muted)" }}>
        Foto de perfil (opcional)
      </label>

      {preview ? (
        <div className="flex items-center gap-4">
          {/* Preview circular */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2"
              style={{ borderColor: "var(--accent-1)" }}>
              <img 
                src={preview} 
                alt="Foto de perfil" 
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition"
            >
              <X size={14} />
            </button>
          </div>

          <div>
            <p className="text-sm font-medium">Foto cargada</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Se mostrará en el CV diseñado
            </p>
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle2 size={12} style={{ color: "#10b981" }} />
              <span className="text-xs" style={{ color: "#10b981" }}>Lista para usar</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all"
          style={{
            borderColor: isDragging ? "var(--accent-1)" : "var(--border)",
            background: isDragging ? "rgba(37,99,235,0.05)" : "var(--bg-card2)",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            {isDragging ? <ImageIcon size={24} style={{ color: "var(--accent-1)" }} /> : <Upload size={24} style={{ color: "var(--text-muted)" }} />}
          </div>

          <p className="text-sm font-semibold mb-1">
            {isDragging ? "Soltá la imagen aquí" : "Arrastrá una foto o hacé click"}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            JPG, PNG o WebP · Máximo 2MB
          </p>

          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={14} style={{ color: "var(--text-muted)" }} />
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Fondo neutro, ropa formal, sonrisa natural
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm p-3 rounded-xl"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
          <AlertTriangle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}