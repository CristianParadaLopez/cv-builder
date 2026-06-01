interface Props {
  html: string;
}

export default function CVPreview({ html }: Props) {
  // Guard DENTRO de la función (no fuera)
  if (!html) return null;

  return (
    <div className="w-full h-full">
      <iframe
        srcDoc={html}
        className="w-full rounded-xl border border-gray-200 shadow-md"
        style={{ height: "842px" }} // ← A4 real: 794px ancho × 842px alto (96dpi)
        title="Vista previa del CV"
        // allow-same-origin es necesario para que Playwright/scripts internos funcionen
        // NO agregar allow-top-navigation ni allow-forms para seguridad
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
}