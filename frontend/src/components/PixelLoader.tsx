import { useEffect, useRef, useState } from "react";

// ─── Sprites config (mantené tus GIFs) ───────────────────────────────────────
const SPRITES = [
  { src: "/sprites/CrisRun.gif",  name: "Cristian",  color: "#5a7de8" },
  { src: "/sprites/TaniaRun.gif", name: "Tania",     color: "#e8735a" },
  { src: "/sprites/LuisRun.gif",  name: "Luis",      color: "#7de85a" },
  { src: "/sprites/EuRun.gif",    name: "Berta",     color: "#e85aaa" },
  { src: "/sprites/Runmin.gif",   name: "Katherine", color: "#5ae8e8" },
];

const TASKS = [
  { spriteIdx: 0, msg: "CRISTIAN: BUILDING STRUCTURE..." },
  { spriteIdx: 1, msg: "TANIA: APPLYING COLORS..."       },
  { spriteIdx: 2, msg: "LUIS: CONFIGURING LAYOUT..."     },
  { spriteIdx: 3, msg: "BERTA: REVIEWING CONTENT..."     },
  { spriteIdx: 4, msg: "KATHERINE: FINAL TOUCHES..."     },
];

// ─── Pixel-art CV layout ops ──────────────────────────────────────────────────
const PX   = 3;
const COLS = 50;
const ROWS = 66;

const PALETTE = {
  paper:    "#faf8f5",
  dark:     "#1a1a2e",
  accent:   "#e8735a",
  accent2:  "#5a7de8",
  accent3:  "#7de85a",
  mid:      "#c8c0b0",
  photo:    "#8899aa",
  photoDk:  "#556677",
  bar:      "#e8735a",
  barBg:    "#ddd8ce",
  text:     "#3a3530",
  textMid:  "#7a7570",
  tag:      "#5a7de8",
  tagText:  "#faf8f5",
};

type Op =
  | { t: "fill"; c: number; r: number; w: number; h: number; color: string }
  | { t: "bar";  c: number; r: number; w: number; filled: number; color: string; bg: string };

function buildOps(): Op[] {
  const ops: Op[] = [];
  const fill = (c: number, r: number, w: number, h: number, color: string): Op =>
    ({ t: "fill", c, r, w, h, color });
  const bar = (c: number, r: number, w: number, filled: number): Op =>
    ({ t: "bar", c, r, w, filled, color: PALETTE.bar, bg: PALETTE.barBg });

  // background + border
  ops.push(fill(0, 0, COLS, ROWS, PALETTE.paper));
  ops.push(fill(0, 0, COLS, 1,    PALETTE.dark));
  ops.push(fill(0, ROWS-1, COLS, 1, PALETTE.dark));
  ops.push(fill(0, 0, 1, ROWS,    PALETTE.dark));
  ops.push(fill(COLS-1, 0, 1, ROWS, PALETTE.dark));

  // photo box
  ops.push(fill(14, 2, 22, 4,  PALETTE.dark));
  ops.push(fill(15, 3, 20, 3,  PALETTE.paper));
  for (let i = 0; i < 6; i++) ops.push(fill(17 + i * 2, 1, 1, 2, PALETTE.accent));
  ops.push(fill(18,  7, 4, 5,  PALETTE.photo));
  ops.push(fill(19,  6, 3, 2,  PALETTE.photoDk));
  ops.push(fill(17,  9, 7, 1,  PALETTE.photoDk));

  // name banner
  ops.push(fill(16, 13, 18, 3, PALETTE.accent));
  ops.push(fill(17, 14, 16, 2, PALETTE.accent));

  // divider
  ops.push(fill(2, 17, COLS-4, 1, PALETTE.mid));

  // about me icon + lines
  ops.push(fill(2, 18, 2, 1, PALETTE.accent));
  for (let i = 0; i < 4; i++) {
    ops.push(fill(5, 19 + i * 2, 8 + (i % 3), 1, PALETTE.text));
    ops.push(fill(5, 19 + i * 2, 2, 1, PALETTE.textMid));
  }

  // skills section
  ops.push(fill(2, 28, 2, 1, PALETTE.accent2));
  const skillBars = [0.9, 0.75, 0.6, 0.85, 0.5];
  for (let i = 0; i < 5; i++) {
    ops.push(fill(5, 29 + i * 3, 9, 1, PALETTE.text));
    ops.push(bar(5, 30 + i * 3, 16, skillBars[i]));
  }

  // tags / strengths
  const tagData = [
    { c: 2,  r: 46, w: 6  },
    { c: 9,  r: 46, w: 7  },
    { c: 17, r: 46, w: 7  },
    { c: 2,  r: 50, w: 12 },
    { c: 16, r: 50, w: 6  },
    { c: 2,  r: 54, w: 7  },
    { c: 11, r: 54, w: 8  },
  ];
  for (const td of tagData) {
    ops.push(fill(td.c, td.r, td.w, 3, PALETTE.tag));
    ops.push(fill(td.c + 1, td.r + 1, td.w - 2, 1, PALETTE.tagText));
  }

  // right column divider
  ops.push(fill(2, 42, Math.floor(COLS / 2) - 2, 1, PALETTE.mid));

  // right side – education
  const rX = Math.floor(COLS / 2) + 1;
  ops.push(fill(rX, 2, 2, 1, PALETTE.accent3));
  for (let i = 0; i < 3; i++) {
    ops.push(fill(rX, 3 + i * 5, 5,  1, PALETTE.textMid));
    ops.push(fill(rX, 4 + i * 5, 12, 1, PALETTE.text));
    ops.push(fill(rX, 5 + i * 5, 9,  1, PALETTE.textMid));
  }

  // right side – experience
  ops.push(fill(rX, 19, 2, 1, PALETTE.accent));
  for (let i = 0; i < 4; i++) {
    const base = 21 + i * 9;
    ops.push(fill(rX,     base,     8,  1, PALETTE.textMid));
    ops.push(fill(rX,     base + 1, 12, 1, PALETTE.text));
    ops.push(fill(rX,     base + 2, 10, 1, PALETTE.text));
    ops.push(fill(rX + 1, base + 3, 7,  1, PALETTE.textMid));
    ops.push(fill(rX + 1, base + 4, 9,  1, PALETTE.textMid));
    ops.push(fill(rX + 1, base + 5, 6,  1, PALETTE.textMid));
  }

  return ops;
}

// ─── Canvas helpers ───────────────────────────────────────────────────────────
function applyOp(ctx: CanvasRenderingContext2D, op: Op) {
  if (op.t === "fill") {
    ctx.fillStyle = op.color;
    ctx.fillRect(op.c * PX, op.r * PX, op.w * PX, op.h * PX);
  } else {
    // bar bg
    ctx.fillStyle = op.bg;
    ctx.fillRect(op.c * PX, op.r * PX, op.w * PX, 2 * PX);
    // bar fill
    ctx.fillStyle = op.color;
    ctx.fillRect(op.c * PX, op.r * PX, Math.round(op.w * op.filled) * PX, 2 * PX);
  }
}

// ─── Character state ──────────────────────────────────────────────────────────
interface Char {
  x: number;
  y: number;
  vx: number;
  spriteIdx: number;
  frame: number;
  img: HTMLImageElement | null;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PixelLoader() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const cvRef      = useRef<HTMLCanvasElement>(null);
  const charRef    = useRef<HTMLCanvasElement>(null);

  const [taskIdx, setTaskIdx]       = useState(0);
  const [progress, setProgress]     = useState(0);

  // We store mutable state in refs so the RAF loop doesn't need re-renders
  const stateRef = useRef({
    ops:         buildOps(),
    revealedOps: 0,
    taskIdx:     0,
    taskTimer:   0,
    lastTime:    0 as number,
    chars:       [] as Char[],
    rafId:       0,
  });

  // ── Load sprite images ──────────────────────────────────────────────────────
  useEffect(() => {
    const imgs = SPRITES.map((s, i) => {
      const img = new Image();
      img.src = s.src;
      return img;
    });

    const W = wrapRef.current?.clientWidth ?? 680;
    const H = 520;

    stateRef.current.chars = SPRITES.map((_, i) => ({
      x:         W * [0.05, 0.8, 0.3, 0.65, 0.5][i],
      y:         H * [0.55, 0.60, 0.70, 0.45, 0.80][i],
      vx:        [0.7, -0.9, 0.6, -0.5, 0.8][i] * 60,
      spriteIdx: i,
      frame:     0,
      img:       imgs[i],
    }));
  }, []);

  // ── RAF loop ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const cvCanvas   = cvRef.current!;
    const charCanvas = charRef.current!;
    const cvCtx      = cvCanvas.getContext("2d")!;
    const charCtx    = charCanvas.getContext("2d")!;

    const W    = wrapRef.current?.clientWidth ?? 680;
    const H    = 520;
    const CV_W = COLS * PX;
    const CV_H = ROWS * PX;

    cvCanvas.width   = CV_W;
    cvCanvas.height  = CV_H;
    charCanvas.width  = W;
    charCanvas.height = H;

    cvCtx.fillStyle = "#0d0d1a";
    cvCtx.fillRect(0, 0, CV_W, CV_H);

    const OPS_PER_FRAME = 3;
    const TASK_INTERVAL = 2800;
    const SPRITE_W = 48;
    const SPRITE_H = 48;

    function loop(ts: number) {
      const s  = stateRef.current;
      if (!s.lastTime) s.lastTime = ts;
      const dt = Math.min((ts - s.lastTime) / 1000, 0.05);
      s.lastTime = ts;

      // ── Task cycle ──
      s.taskTimer += dt * 1000;
      if (s.taskTimer >= TASK_INTERVAL) {
        s.taskTimer = 0;
        s.taskIdx   = (s.taskIdx + 1) % TASKS.length;
        setTaskIdx(s.taskIdx);
      }

      // ── Reveal CV ops ──
      if (s.revealedOps < s.ops.length) {
        for (let i = 0; i < OPS_PER_FRAME && s.revealedOps < s.ops.length; i++) {
          applyOp(cvCtx, s.ops[s.revealedOps]);
          s.revealedOps++;
        }
      } else {
        // restart reveal loop
        s.revealedOps = 0;
        cvCtx.fillStyle = "#0d0d1a";
        cvCtx.fillRect(0, 0, CV_W, CV_H);
      }
      setProgress(s.revealedOps / s.ops.length);

      // ── Move + draw characters ──
      charCtx.clearRect(0, 0, W, H);
      for (const c of s.chars) {
        c.x     += c.vx * dt;
        c.frame += dt * 8;
        if (c.x > W - SPRITE_W) { c.x = W - SPRITE_W; c.vx = -Math.abs(c.vx); }
        if (c.x < 0)             { c.x = 0;             c.vx =  Math.abs(c.vx); }

        if (c.img?.complete && c.img.naturalWidth) {
          charCtx.save();
          if (c.vx < 0) {
            // flip horizontally
            charCtx.scale(-1, 1);
            charCtx.drawImage(c.img, -Math.floor(c.x) - SPRITE_W, Math.floor(c.y), SPRITE_W, SPRITE_H);
          } else {
            charCtx.drawImage(c.img, Math.floor(c.x), Math.floor(c.y), SPRITE_W, SPRITE_H);
          }
          charCtx.restore();

          // name label below sprite
          charCtx.font = "bold 9px 'Courier New', monospace";
          charCtx.fillStyle = SPRITES[c.spriteIdx].color;
          charCtx.textAlign = "center";
          charCtx.fillText(
            SPRITES[c.spriteIdx].name,
            Math.floor(c.x) + SPRITE_W / 2,
            Math.floor(c.y) + SPRITE_H + 11,
          );
        }
      }

      s.rafId = requestAnimationFrame(loop);
    }

    stateRef.current.rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(stateRef.current.rafId);
  }, []);

  const currentTask   = TASKS[taskIdx];
  const currentSprite = SPRITES[currentTask.spriteIdx];
  const filledBars    = Math.floor(progress * 12);

  return (
    <div
      ref={wrapRef}
      style={{
        position:   "relative",
        width:      "100%",
        height:     520,
        background: "#0d0d1a",
        overflow:   "hidden",
        imageRendering: "pixelated",
      }}
    >
      {/* ── Pixel-art CV (fondo) ── */}
      <canvas
        ref={cvRef}
        style={{
          position:  "absolute",
          top:       "50%",
          left:      "50%",
          transform: "translate(-50%, -50%)",
          imageRendering: "pixelated",
        }}
      />

      {/* ── Personajes corriendo ── */}
      <canvas
        ref={charRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          imageRendering: "pixelated",
          zIndex: 2,
        }}
      />

      {/* ── Scanlines overlay ── */}
      <div
        style={{
          position:   "absolute",
          inset:      0,
          pointerEvents: "none",
          background: "repeating-linear-gradient(to bottom, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
          zIndex: 3,
        }}
      />

      {/* ── Vignette ── */}
      <div
        style={{
          position:   "absolute",
          inset:      0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.75) 100%)",
          zIndex: 4,
        }}
      />

      {/* ── HUD inferior ── */}
      <div
        style={{
          position:  "absolute",
          bottom:    14,
          left:      "50%",
          transform: "translateX(-50%)",
          display:   "flex",
          flexDirection: "column",
          alignItems: "center",
          gap:       6,
          zIndex:    10,
        }}
      >
        {/* Mensaje de tarea */}
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize:   11,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color:      currentSprite.color,
            textShadow: `0 0 8px ${currentSprite.color}aa`,
            margin:     0,
          }}
        >
          {currentTask.msg}
        </p>

        {/* Barra de progreso pixel art */}
        <div style={{ display: "flex", gap: 3 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                width:           18,
                height:          8,
                border:          "1px solid #333",
                background:      i < filledBars ? currentSprite.color : "#111",
                imageRendering:  "pixelated",
                transition:      "background 0.1s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}