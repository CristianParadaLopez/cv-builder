import { useEffect, useState } from "react";

const sprites = [
  { src: "/sprites/cris.png", name: "Cristian" },
  { src: "/sprites/tania.png", name: "Tania" },
  { src: "/sprites/luis.png", name: "Luis" },
  { src: "/sprites/eu.png", name: "Berta" },
  { src: "/sprites/katy.png", name: "Katherine" },
];

const tasks = [
  { sprite: 0, message: "Cristian armando la estructura...", action: "🔨" },
  { sprite: 1, message: "Tania aplicando los colores...", action: "🎨" },
  { sprite: 2, message: "Luis configurando el diseño...", action: "⚙️" },
  { sprite: 3, message: "Berta revisando el contenido...", action: "📝" },
  { sprite: 4, message: "Katherine dando los toques finales...", action: "✨" },
];

interface Block {
  id: number;
  x: number;
  y: number;
  color: string;
  placed: boolean;
}

const colors = ["#2563EB", "#1E293B", "#7C3AED", "#EC4899", "#10B981"];

export default function PixelLoader() {
  const [taskIndex, setTaskIndex] = useState(0);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [walkFrame, setWalkFrame] = useState(0);
  const [spriteX, setSpriteX] = useState(0);

  useEffect(() => {
    const taskTimer = setInterval(() => {
      setTaskIndex((prev) => (prev + 1) % tasks.length);
      setSpriteX(0);
      setBlocks([]);
    }, 2500);
    return () => clearInterval(taskTimer);
  }, []);

  useEffect(() => {
    const walkTimer = setInterval(() => {
      setWalkFrame((prev) => (prev + 1) % 2);
      setSpriteX((prev) => (prev >= 200 ? 0 : prev + 4));
    }, 120);
    return () => clearInterval(walkTimer);
  }, []);

  useEffect(() => {
    const blockTimer = setInterval(() => {
      setBlocks((prev) => {
        if (prev.length >= 12) return prev;
        return [
          ...prev,
          {
            id: Date.now(),
            x: Math.floor(Math.random() * 8),
            y: Math.floor(Math.random() * 4),
            color: colors[taskIndex % colors.length],
            placed: true,
          },
        ];
      });
    }, 200);
    return () => clearInterval(blockTimer);
  }, [taskIndex]);

  const currentTask = tasks[taskIndex];
  const currentSprite = sprites[currentTask.sprite];

  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 select-none">
      <div className="relative w-full" style={{ height: 140 }}>

        {/* CV siendo construido en pixel art */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{ display: "grid", gridTemplateColumns: "repeat(8, 14px)", gap: 2 }}
        >
          {Array.from({ length: 32 }).map((_, i) => {
            const col = i % 8;
            const row = Math.floor(i / 8);
            const block = blocks.find((b) => b.x === col && b.y === row);
            return (
              <div
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: block ? block.color : "#E5E7EB",
                  imageRendering: "pixelated",
                  transition: block ? "background-color 0.1s" : "none",
                  border: "1px solid #D1D5DB",
                }}
              />
            );
          })}
        </div>

        {/* Sprite caminando */}
        <div
          className="absolute"
          style={{
            bottom: 0,
            left: `calc(10% + ${spriteX}px)`,
            transition: "left 0.1s linear",
          }}
        >
          <img
            src={currentSprite.src}
            alt={currentSprite.name}
            style={{
              width: 48,
              height: 48,
              imageRendering: "pixelated",
              transform: walkFrame === 0 ? "translateY(0px)" : "translateY(-3px)",
              transition: "transform 0.12s",
            }}
          />
          <div
            className="text-center text-xs font-bold mt-1"
            style={{ color: colors[taskIndex % colors.length], minWidth: 60, marginLeft: -6 }}
          >
            {currentSprite.name}
          </div>
        </div>

        {/* Acción flotante */}
        <div
          className="absolute text-2xl animate-bounce"
          style={{
            bottom: 52,
            left: `calc(10% + ${spriteX + 10}px)`,
            transition: "left 0.1s linear",
          }}
        >
          {currentTask.action}
        </div>
      </div>

      {/* Mensaje */}
      <p
        className="text-sm font-semibold animate-pulse text-center"
        style={{ color: colors[taskIndex % colors.length] }}
      >
        {currentTask.message}
      </p>

      {/* Barra de progreso pixel art */}
      <div className="flex gap-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 8,
              backgroundColor:
                i < Math.floor((blocks.length / 12) * 10)
                  ? colors[taskIndex % colors.length]
                  : "#E5E7EB",
              imageRendering: "pixelated",
              border: "1px solid #D1D5DB",
            }}
          />
        ))}
      </div>
    </div>
  );
}