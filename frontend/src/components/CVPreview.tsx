interface Props {
  html: string;
}

export default function CVPreview({ html }: Props) {
  if (!html) return null;

  return (
    <div className="w-full h-full">
      <iframe
        srcDoc={html}
        className="w-full rounded-xl border border-gray-200 shadow-md"
        style={{ height: "800px" }}
        title="Vista previa del CV"
      />
    </div>
  );
}