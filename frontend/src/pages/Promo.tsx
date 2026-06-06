import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, CheckCircle2, Sparkles } from "lucide-react";

// ─── Pixel CV dimensions ───────────────────────────────────────────────────────
const PX   = 3;
const COLS = 62;
const ROWS = 82;
const CV_W = COLS * PX;
const CV_H = ROWS * PX;

const C = {
  bg:      "#0b0e1a",
  dark:    "#1a1a2e",
  sidebar: "#16213e",
  accent:  "#00e5c8",
  accent2: "#ff6b6b",
  accent3: "#ffd93d",
  accent4: "#6c63ff",
  mid:     "#3a4060",
  mid2:    "#2a3050",
  light:   "#8892b0",
  white:   "#ccd6f6",
  bar1:    "#00e5c8",
  bar2:    "#6c63ff",
  bar3:    "#ff6b6b",
  barBg:   "#1e2540",
  tag1:    "#6c63ff",
  tag2:    "#ff6b6b",
  tag3:    "#00e5c8",
  skin:    "#f4a95a",
  skinDk:  "#d4824a",
  hair:    "#2d1b00",
  shirt:   "#6c63ff",
  dot:     "#ffd93d",
};

type Op =
  | { t: "fill"; c: number; r: number; w: number; h: number; color: string }
  | { t: "bar";  c: number; r: number; w: number; filled: number; color: string }
  | { t: "dot";  c: number; r: number; color: string };

const f = (c: number, r: number, w: number, h: number, color: string): Op =>
  ({ t: "fill", c, r, w, h, color });
const b = (c: number, r: number, w: number, filled: number, color: string): Op =>
  ({ t: "bar", c, r, w, filled, color });
const d = (c: number, r: number, color: string): Op =>
  ({ t: "dot", c, r, color });

function buildOps(): Op[] {
  const ops: Op[] = [];
  ops.push(f(0, 0, COLS, ROWS, C.bg));
  ops.push(f(0, 0, COLS, 1, C.accent));
  ops.push(f(0, ROWS-1, COLS, 1, C.accent));
  ops.push(f(0, 0, 1, ROWS, C.accent));
  ops.push(f(COLS-1, 0, 1, ROWS, C.accent));
  ops.push(f(1, 1, COLS-2, 1, C.mid2));
  ops.push(f(1, ROWS-2, COLS-2, 1, C.mid2));
  ops.push(f(1, 1, 1, ROWS-2, C.mid2));
  ops.push(f(COLS-2, 1, 1, ROWS-2, C.mid2));
  for (const ci of [2, 3]) {
    ops.push(d(ci, 2, C.dot)); ops.push(d(COLS-1-ci, 2, C.dot));
    ops.push(d(ci, ROWS-3, C.dot)); ops.push(d(COLS-1-ci, ROWS-3, C.dot));
  }
  ops.push(f(6, 2, COLS-12, 6, C.dark));
  ops.push(f(7, 3, COLS-14, 5, C.mid2));
  for (let i = 0; i < 7; i++) ops.push(f(10+i*6, 2, 3, 2, C.accent));
  const titleBlocks = [[12,4,3,2],[16,4,2,2],[19,4,3,2],[23,4,3,2],[27,4,2,2],[30,4,3,2],[34,4,2,2],[37,4,3,2],[41,4,3,2],[45,4,2,2]];
  for (const [tc,tr,tw,th] of titleBlocks) ops.push(f(tc,tr,tw,th,C.white));
  ops.push(f(2, 9, 22, ROWS-11, C.sidebar));
  ops.push(f(4, 10, 18, 16, C.mid2));
  ops.push(f(5, 11, 16, 14, C.dark));
  ops.push(d(5, 11, C.accent)); ops.push(d(20, 11, C.accent));
  ops.push(d(5, 24, C.accent)); ops.push(d(20, 24, C.accent));
  ops.push(f(10, 14, 8, 7, C.skin));
  ops.push(f(11, 13, 6, 2, C.hair));
  ops.push(f(10, 13, 2, 4, C.hair));
  ops.push(f(16, 13, 2, 4, C.hair));
  ops.push(f(11, 16, 2, 1, C.dark));
  ops.push(f(15, 16, 2, 1, C.dark));
  ops.push(f(12, 19, 4, 1, C.skinDk));
  ops.push(f(9, 21, 10, 3, C.shirt));
  ops.push(f(3, 27, 20, 1, C.accent));
  for (const [nc,nr,nw,nh] of [[4,28,2,2],[7,28,2,2],[10,28,2,2],[13,28,2,2],[16,28,2,2],[4,31,3,2],[8,31,2,2],[11,31,3,2]])
    ops.push(f(nc,nr,nw,nh,C.accent));
  for (const [sc,sr,sw,sh] of [[4,34,4,1],[9,34,3,1],[13,34,5,1],[19,34,2,1]])
    ops.push(f(sc,sr,sw,sh,C.light));
  ops.push(f(3, 37, 3, 1, C.accent2)); ops.push(f(7, 37, 8, 1, C.white));
  for (let i = 0; i < 4; i++) ops.push(f(4, 39+i*2, [14,12,15,10][i], 1, C.light));
  ops.push(f(3, 48, 3, 1, C.accent4)); ops.push(f(7, 48, 6, 1, C.white));
  const skillFills  = [0.88, 0.72, 0.65, 0.80, 0.55];
  const skillColors = [C.bar1, C.bar2, C.bar3, C.bar1, C.bar2];
  for (let i = 0; i < 5; i++) {
    ops.push(f(4, 50+i*3, 9, 1, C.light));
    ops.push(b(4, 51+i*3, 17, skillFills[i], skillColors[i]));
  }
  ops.push(f(3, 67, 3, 1, C.accent3)); ops.push(f(7, 67, 10, 1, C.white));
  const tags = [
    {c:3,r:69,w:8,color:C.tag1},{c:12,r:69,w:9,color:C.tag2},
    {c:3,r:73,w:10,color:C.tag3},{c:14,r:73,w:7,color:C.tag1},
    {c:3,r:77,w:9,color:C.tag2},{c:13,r:77,w:8,color:C.tag3},
  ];
  for (const tg of tags) {
    ops.push(f(tg.c, tg.r, tg.w, 3, tg.color));
    ops.push(f(tg.c+1, tg.r+1, tg.w-2, 1, "#fff"));
  }
  ops.push(f(24, 9, 1, ROWS-11, C.mid));
  const RX = 26;
  ops.push(d(RX, 10, C.accent3)); ops.push(f(RX+2, 10, 8, 1, C.accent3));
  ops.push(f(RX+2, 11, COLS-RX-4, 1, C.mid2));
  for (let i = 0; i < 2; i++) {
    const base = 13+i*8;
    ops.push(f(RX, base, 5, 1, C.light)); ops.push(f(RX+6, base, 10, 1, C.white));
    ops.push(f(RX+6, base+1, 7, 1, C.light)); ops.push(f(RX+6, base+2, 9, 1, C.light));
  }
  ops.push(d(RX, 30, C.accent2)); ops.push(f(RX+2, 30, 10, 1, C.accent2));
  ops.push(f(RX+2, 31, COLS-RX-4, 1, C.mid2));
  ops.push(f(RX+1, 33, 1, 30, C.mid));
  const expColors = [C.accent, C.accent4, C.accent2, C.accent3];
  for (let i = 0; i < 4; i++) {
    const base = 33+i*8;
    ops.push(d(RX+1, base, expColors[i]));
    ops.push(f(RX+3, base, 8, 1, C.light)); ops.push(f(RX+3, base+1, 14, 1, C.white));
    ops.push(f(RX+3, base+2, 11, 1, C.light)); ops.push(f(RX+3, base+3, 9, 1, C.light));
    ops.push(f(RX+3, base+4, 13, 1, C.light));
  }
  const RX2 = 45;
  ops.push(d(RX2, 10, C.accent)); ops.push(f(RX2+2, 10, 8, 1, C.accent));
  ops.push(f(RX2+2, 11, COLS-RX2-4, 1, C.mid2));
  const toolFills  = [0.92, 0.78, 0.85, 0.70, 0.60, 0.88];
  const toolColors = [C.bar1, C.bar2, C.bar3, C.bar1, C.bar2, C.bar3];
  for (let i = 0; i < 6; i++) {
    ops.push(f(RX2, 13+i*3, 12, 1, C.light));
    ops.push(b(RX2, 14+i*3, 14, toolFills[i], toolColors[i]));
  }
  ops.push(f(2, ROWS-3, COLS-4, 2, C.mid2));
  ops.push(f(3, ROWS-3, COLS-6, 1, C.accent));
  return ops;
}

function applyOp(ctx: CanvasRenderingContext2D, op: Op) {
  if (op.t === "fill") {
    ctx.fillStyle = op.color;
    ctx.fillRect(op.c * PX, op.r * PX, op.w * PX, op.h * PX);
  } else if (op.t === "bar") {
    ctx.fillStyle = C.barBg;
    ctx.fillRect(op.c * PX, op.r * PX, op.w * PX, PX);
    ctx.fillStyle = op.color;
    ctx.fillRect(op.c * PX, op.r * PX, Math.round(op.w * op.filled) * PX, PX);
  } else {
    ctx.fillStyle = op.color;
    ctx.fillRect(op.c * PX, op.r * PX, PX * 2, PX * 2);
  }
}

// ─── Floating pixel particles ──────────────────────────────────────────────────
interface Particle { x: number; y: number; vx: number; vy: number; color: string; size: number; opacity: number; }

const PARTICLE_COLORS = [C.accent, C.accent2, C.accent3, C.accent4, "#fff"];

// ─── Features data ─────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: "🧠", label: "IA Inteligente",      desc: "Contenido optimizado automáticamente",  color: "#4f7bff" },
  { icon: "🎨", label: "Plantillas Modernas", desc: "Diseños pro hechos por diseñadores",     color: "#a855f7" },
  { icon: "✏️", label: "Edición con Prompts", desc: "Personalizá en lenguaje natural",        color: "#ec4899" },
  { icon: "⬇️", label: "Exportación PDF",     desc: "Descargá listo para enviar",             color: "#06d6a0" },
];

// ─── Typing effect hook ────────────────────────────────────────────────────────
function useTyping(words: string[], speed = 60, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx]     = useState(0);
  const [charIdx, setCharIdx]     = useState(0);
  const [deleting, setDeleting]   = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    if (!deleting && charIdx < current.length) {
      const t = setTimeout(() => setCharIdx(i => i + 1), speed);
      return () => clearTimeout(t);
    }
    if (!deleting && charIdx === current.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx > 0) {
      const t = setTimeout(() => setCharIdx(i => i - 1), speed / 2);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  useEffect(() => setDisplayed(words[wordIdx].slice(0, charIdx)), [charIdx, wordIdx, words]);
  return displayed;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Promo() {
  const navigate = useNavigate();
  const cvRef    = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ ops: buildOps(), revealed: 0, lastTime: 0, rafId: 0, progress: 0 });
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  const typedWord = useTyping(["Inteligencia Artificial", "Diseño Profesional", "Un Clic", "Minutos"]);

  // ── spawn particles ────────────────────────────────────────────────────────
  useEffect(() => {
    const arr: Particle[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.04,
      vy: -Math.random() * 0.06 - 0.01,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(arr);
    setMounted(true);
  }, []);

  // ── animate particles ──────────────────────────────────────────────────────
  useEffect(() => {
    let id: number;
    function tick() {
      setParticles(prev => prev.map(p => {
        let x = p.x + p.vx;
        let y = p.y + p.vy;
        if (x < 0) x = 100; if (x > 100) x = 0;
        if (y < 0) y = 100; if (y > 100) y = 0;
        return { ...p, x, y };
      }));
      id = requestAnimationFrame(tick);
    }
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  // ── CV pixel art RAF ───────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = cvRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width  = CV_W;
    canvas.height = CV_H;
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, CV_W, CV_H);

    let frame = 0;
    function loop(ts: number) {
      const s = stateRef.current;
      if (!s.lastTime) s.lastTime = ts;
      s.lastTime = ts;
      frame++;

      if (frame % 2 === 0) {
        if (s.revealed < s.ops.length) {
          applyOp(ctx, s.ops[s.revealed]);
          s.revealed++;
        } else {
          // loop: redraw from scratch
          s.revealed = 0;
          ctx.fillStyle = C.bg;
          ctx.fillRect(0, 0, CV_W, CV_H);
        }
      }
      s.progress = Math.min(s.revealed / s.ops.length, 1);
      setProgress(s.progress);
      s.rafId = requestAnimationFrame(loop);
    }
    stateRef.current.rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(stateRef.current.rafId);
  }, []);

  const filledBars = Math.floor(progress * 12);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07090f",
        color: "#e0e8ff",
        fontFamily: "'Courier New', 'Courier', monospace",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Floating pixel particles background ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {particles.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top:  `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              opacity: p.opacity,
              imageRendering: "pixelated",
            }}
          />
        ))}
      </div>

      {/* ── Scanlines overlay ── */}
      <div
        style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
          background: "repeating-linear-gradient(to bottom,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)",
        }}
      />

      {/* ── Radial vignette ── */}
      <div
        style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          gap: 0,
        }}
      >
        {/* Top badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            border: `1px solid ${C.accent}55`,
            background: `${C.accent}11`,
            color: C.accent,
            fontSize: 11,
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: 32,
            fontWeight: "bold",
          }}
        >
          <span
            style={{
              width: 8, height: 8,
              background: C.accent,
              display: "inline-block",
              animation: "pulse 1.2s ease-in-out infinite",
            }}
          />
          Skillara AI · Gratis · Sin Registro
        </div>

        {/* Main layout: text + canvas side by side */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
            width: "100%",
            maxWidth: 1100,
          }}
        >
          {/* ─── LEFT: Headline + CTA ─── */}
          <div
            style={{
              flex: "1 1 340px",
              maxWidth: 520,
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateX(0)" : "translateX(-30px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.4rem)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-1px",
                margin: "0 0 20px",
                fontFamily: "'Courier New', monospace",
              }}
            >
              Creá tu CV con{" "}
              <br />
              <span
                style={{
                  color: C.accent,
                  textShadow: `0 0 30px ${C.accent}88`,
                  display: "inline-block",
                  minWidth: "2ch",
                }}
              >
                {typedWord}
                <span
                  style={{
                    display: "inline-block",
                    width: 3,
                    height: "1em",
                    background: C.accent,
                    marginLeft: 4,
                    verticalAlign: "middle",
                    animation: "blink 0.8s step-end infinite",
                  }}
                />
              </span>
            </h1>

            <p
              style={{
                color: C.light,
                fontSize: 15,
                lineHeight: 1.7,
                margin: "0 0 32px",
                maxWidth: 420,
              }}
            >
              Diseños modernos generados automáticamente por IA.
              Personalizá con prompts. Exportá en PDF. Listo en minutos.
            </p>

            {/* Feature pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
              {FEATURES.map(feat => (
                <div
                  key={feat.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    border: `1px solid ${feat.color}44`,
                    background: `${feat.color}11`,
                    color: feat.color,
                    fontSize: 11,
                    fontWeight: "bold",
                    letterSpacing: "1px",
                    cursor: "default",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = `${feat.color}22`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 12px ${feat.color}44`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = `${feat.color}11`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  {feat.icon} {feat.label}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              <button
                onClick={() => navigate("/builder")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 28px",
                  background: C.accent,
                  color: "#07090f",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 900,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "'Courier New', monospace",
                  boxShadow: `0 0 32px ${C.accent}66`,
                  transition: "all 0.2s",
                  imageRendering: "pixelated",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 48px ${C.accent}99`;
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 32px ${C.accent}66`;
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                <Zap size={15} />
                CREAR MI CV
                <ArrowRight size={15} />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#06d6a0" }}>
                <CheckCircle2 size={14} />
                100% gratuito
              </div>
            </div>

            {/* Social proof */}
            <p style={{ marginTop: 20, fontSize: 11, color: C.light, letterSpacing: "1px" }}>
              <Sparkles size={11} style={{ display: "inline", marginRight: 4, color: C.accent3 }} />
              +1,000 CVs generados esta semana
            </p>
          </div>

          {/* ─── RIGHT: Pixel CV canvas ─── */}
          <div
            style={{
              position: "relative",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateX(0) scale(1)" : "translateX(30px) scale(0.95)",
              transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
              flexShrink: 0,
            }}
          >
            {/* Glow behind canvas */}
            <div
              style={{
                position: "absolute",
                inset: -24,
                background: `radial-gradient(ellipse at center, ${C.accent}33 0%, transparent 70%)`,
                borderRadius: 4,
                pointerEvents: "none",
                animation: "glow-pulse 3s ease-in-out infinite",
              }}
            />

            {/* Corner bracket decorations */}
            {[
              { top: -8, left: -8,  borderTop: `2px solid ${C.accent}`, borderLeft:  `2px solid ${C.accent}` },
              { top: -8, right: -8, borderTop: `2px solid ${C.accent}`, borderRight: `2px solid ${C.accent}` },
              { bottom: -8, left: -8,  borderBottom: `2px solid ${C.accent}`, borderLeft:  `2px solid ${C.accent}` },
              { bottom: -8, right: -8, borderBottom: `2px solid ${C.accent}`, borderRight: `2px solid ${C.accent}` },
            ].map((style, i) => (
              <div key={i} style={{ position: "absolute", width: 20, height: 20, ...style }} />
            ))}

            <canvas
              ref={cvRef}
              style={{ display: "block", imageRendering: "pixelated" }}
            />

            {/* Progress bar under canvas */}
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 14,
                      height: 6,
                      border: `1px solid ${C.accent}33`,
                      background: i < filledBars ? C.accent : `${C.accent}08`,
                      boxShadow: i < filledBars ? `0 0 6px ${C.accent}88` : "none",
                      transition: "background 0.08s",
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 9, color: C.light, letterSpacing: "2px", textTransform: "uppercase" }}>
                ▶ GENERANDO CV... {Math.round(progress * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* ─── STATS row ─── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1,
            marginTop: 56,
            opacity: mounted ? 1 : 0,
            transition: "opacity 1s ease 0.5s",
          }}
        >
          {[
            { value: "4",    label: "Plantillas", color: C.accent  },
            { value: "PDF",  label: "Exportación", color: C.accent4 },
            { value: "IA",   label: "Generado",   color: C.accent3 },
            { value: "<2m",  label: "Tiempo",     color: C.accent2 },
          ].map(stat => (
            <div
              key={stat.label}
              style={{
                padding: "16px 28px",
                border: `1px solid ${stat.color}33`,
                background: `${stat.color}08`,
                textAlign: "center",
                minWidth: 90,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: stat.color,
                  textShadow: `0 0 16px ${stat.color}88`,
                  letterSpacing: "-1px",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 10, color: C.light, letterSpacing: "2px", marginTop: 4, textTransform: "uppercase" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ─── How it works ─── */}
        <div style={{ marginTop: 64, width: "100%", maxWidth: 900, padding: "0 16px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span
              style={{
                fontSize: 10,
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: C.accent3,
                fontWeight: "bold",
              }}
            >
              ▶ ¿CÓMO FUNCIONA?
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
            {[
              { n: "01", e: "🎨", t: "Elegí un diseño",  d: "Seleccioná el estilo que mejor te represente." },
              { n: "02", e: "📝", t: "Completá tus datos", d: "Experiencia, educación y habilidades." },
              { n: "03", e: "🧠", t: "La IA trabaja",    d: "CV profesional generado automáticamente." },
              { n: "04", e: "⬇️", t: "Descargá y listo", d: "Exportá en PDF y empezá a postularte." },
            ].map(step => (
              <div
                key={step.n}
                style={{
                  flex: "1 1 180px",
                  maxWidth: 220,
                  padding: "20px 16px",
                  border: `1px solid ${C.mid}`,
                  background: C.dark,
                  position: "relative",
                  cursor: "default",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = C.accent;
                  (e.currentTarget as HTMLDivElement).style.background = "#1a1a3a";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = C.mid;
                  (e.currentTarget as HTMLDivElement).style.background = C.dark;
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{step.e}</div>
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 12,
                    fontSize: 28,
                    fontWeight: 900,
                    color: `${C.accent}18`,
                    letterSpacing: "-2px",
                  }}
                >
                  {step.n}
                </div>
                <div style={{ fontSize: 12, fontWeight: "bold", color: C.white, marginBottom: 6, letterSpacing: "0.5px" }}>
                  {step.t}
                </div>
                <div style={{ fontSize: 11, color: C.light, lineHeight: 1.5 }}>
                  {step.d}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Final CTA ─── */}
        <div style={{ marginTop: 64, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              padding: "40px 48px",
              border: `1px solid ${C.accent}44`,
              background: `${C.accent}08`,
              position: "relative",
            }}
          >
            {/* Corner dots */}
            {[[0,0],[0,1],[1,0],[1,1]].map(([t,l], i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  [t ? "bottom" : "top"]: -3,
                  [l ? "right" : "left"]: -3,
                  width: 6, height: 6,
                  background: C.accent3,
                  imageRendering: "pixelated",
                }}
              />
            ))}

            <img src="/images/logo.png" alt="Skillara AI" style={{ width: 48, height: 48, borderRadius: 8 }} />
            <h2
              style={{
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                fontWeight: 900,
                margin: 0,
                color: C.white,
                letterSpacing: "-0.5px",
              }}
            >
              Empezá gratis hoy
            </h2>
            <p style={{ fontSize: 13, color: C.light, margin: 0 }}>Sin tarjeta · Sin registro</p>
            <button
              onClick={() => navigate("/builder")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 32px",
                background: "transparent",
                color: C.accent,
                border: `2px solid ${C.accent}`,
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: "3px",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "'Courier New', monospace",
                transition: "all 0.2s",
                boxShadow: `0 0 20px ${C.accent}44`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = C.accent;
                el.style.color = "#07090f";
                el.style.boxShadow = `0 0 40px ${C.accent}88`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "transparent";
                el.style.color = C.accent;
                el.style.boxShadow = `0 0 20px ${C.accent}44`;
              }}
            >
              CREAR MI CV <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p style={{ marginTop: 40, fontSize: 10, color: `${C.light}88`, letterSpacing: "2px", textAlign: "center" }}>
          SKILLARA AI © 2024 · TODOS LOS DERECHOS RESERVADOS
        </p>
      </section>

      {/* ── CSS keyframes ── */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1);   opacity: 1;   }
          50%       { transform: scale(1.4); opacity: 0.5; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1;   }
        }
      `}</style>
    </div>
  );
}