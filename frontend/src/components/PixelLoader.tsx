import { useEffect, useRef, useState } from "react";

// ─── Pixel dimensions ─────────────────────────────────────────────────────────
const PX   = 3;
const COLS = 62;
const ROWS = 82;
const CV_W = COLS * PX;   // 186px
const CV_H = ROWS * PX;   // 246px
const CONTAINER_H = 520;

// ─── Color palette ────────────────────────────────────────────────────────────
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

// ─── Op types ─────────────────────────────────────────────────────────────────
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

  // Outer border teal double
  ops.push(f(0, 0, COLS, 1, C.accent));
  ops.push(f(0, ROWS-1, COLS, 1, C.accent));
  ops.push(f(0, 0, 1, ROWS, C.accent));
  ops.push(f(COLS-1, 0, 1, ROWS, C.accent));
  ops.push(f(1, 1, COLS-2, 1, C.mid2));
  ops.push(f(1, ROWS-2, COLS-2, 1, C.mid2));
  ops.push(f(1, 1, 1, ROWS-2, C.mid2));
  ops.push(f(COLS-2, 1, 1, ROWS-2, C.mid2));

  // Corner accent dots
  for (const ci of [2, 3]) {
    ops.push(d(ci, 2, C.dot));
    ops.push(d(COLS-1-ci, 2, C.dot));
    ops.push(d(ci, ROWS-3, C.dot));
    ops.push(d(COLS-1-ci, ROWS-3, C.dot));
  }

  // Top title banner
  ops.push(f(6, 2, COLS-12, 6, C.dark));
  ops.push(f(7, 3, COLS-14, 5, C.mid2));
  for (let i = 0; i < 7; i++) ops.push(f(10+i*6, 2, 3, 2, C.accent));
  const titleBlocks = [
    [12,4,3,2],[16,4,2,2],[19,4,3,2],[23,4,3,2],
    [27,4,2,2],[30,4,3,2],[34,4,2,2],[37,4,3,2],[41,4,3,2],[45,4,2,2],
  ];
  for (const [tc,tr,tw,th] of titleBlocks) ops.push(f(tc,tr,tw,th,C.white));

  // Left sidebar
  ops.push(f(2, 9, 22, ROWS-11, C.sidebar));

  // Profile photo
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

  // Name block
  ops.push(f(3, 27, 20, 1, C.accent));
  for (const [nc,nr,nw,nh] of [[4,28,2,2],[7,28,2,2],[10,28,2,2],[13,28,2,2],[16,28,2,2],[4,31,3,2],[8,31,2,2],[11,31,3,2]])
    ops.push(f(nc,nr,nw,nh,C.accent));
  for (const [sc,sr,sw,sh] of [[4,34,4,1],[9,34,3,1],[13,34,5,1],[19,34,2,1]])
    ops.push(f(sc,sr,sw,sh,C.light));

  // About Me
  ops.push(f(3, 37, 3, 1, C.accent2));
  ops.push(f(7, 37, 8, 1, C.white));
  for (let i = 0; i < 4; i++)
    ops.push(f(4, 39+i*2, [14,12,15,10][i], 1, C.light));

  // Skills
  ops.push(f(3, 48, 3, 1, C.accent4));
  ops.push(f(7, 48, 6, 1, C.white));
  const skillFills  = [0.88, 0.72, 0.65, 0.80, 0.55];
  const skillColors = [C.bar1, C.bar2, C.bar3, C.bar1, C.bar2];
  for (let i = 0; i < 5; i++) {
    ops.push(f(4, 50+i*3, 9, 1, C.light));
    ops.push(b(4, 51+i*3, 17, skillFills[i], skillColors[i]));
  }

  // Tags
  ops.push(f(3, 67, 3, 1, C.accent3));
  ops.push(f(7, 67, 10, 1, C.white));
  const tags = [
    {c:3,r:69,w:8,color:C.tag1},{c:12,r:69,w:9,color:C.tag2},
    {c:3,r:73,w:10,color:C.tag3},{c:14,r:73,w:7,color:C.tag1},
    {c:3,r:77,w:9,color:C.tag2},{c:13,r:77,w:8,color:C.tag3},
  ];
  for (const tg of tags) {
    ops.push(f(tg.c, tg.r, tg.w, 3, tg.color));
    ops.push(f(tg.c+1, tg.r+1, tg.w-2, 1, "#fff"));
  }

  // Vertical separator
  ops.push(f(24, 9, 1, ROWS-11, C.mid));

  // Right — Education
  const RX = 26;
  ops.push(d(RX, 10, C.accent3));
  ops.push(f(RX+2, 10, 8, 1, C.accent3));
  ops.push(f(RX+2, 11, COLS-RX-4, 1, C.mid2));
  for (let i = 0; i < 2; i++) {
    const base = 13+i*8;
    ops.push(f(RX, base, 5, 1, C.light));
    ops.push(f(RX+6, base, 10, 1, C.white));
    ops.push(f(RX+6, base+1, 7, 1, C.light));
    ops.push(f(RX+6, base+2, 9, 1, C.light));
  }

  // Right — Experience
  ops.push(d(RX, 30, C.accent2));
  ops.push(f(RX+2, 30, 10, 1, C.accent2));
  ops.push(f(RX+2, 31, COLS-RX-4, 1, C.mid2));
  ops.push(f(RX+1, 33, 1, 30, C.mid));
  const expColors = [C.accent, C.accent4, C.accent2, C.accent3];
  for (let i = 0; i < 4; i++) {
    const base = 33+i*8;
    ops.push(d(RX+1, base, expColors[i]));
    ops.push(f(RX+3, base, 8, 1, C.light));
    ops.push(f(RX+3, base+1, 14, 1, C.white));
    ops.push(f(RX+3, base+2, 11, 1, C.light));
    ops.push(f(RX+3, base+3, 9, 1, C.light));
    ops.push(f(RX+3, base+4, 13, 1, C.light));
  }

  // Right mini — Tools
  const RX2 = 45;
  ops.push(d(RX2, 10, C.accent));
  ops.push(f(RX2+2, 10, 8, 1, C.accent));
  ops.push(f(RX2+2, 11, COLS-RX2-4, 1, C.mid2));
  const toolFills  = [0.92, 0.78, 0.85, 0.70, 0.60, 0.88];
  const toolColors = [C.bar1, C.bar2, C.bar3, C.bar1, C.bar2, C.bar3];
  for (let i = 0; i < 6; i++) {
    ops.push(f(RX2, 13+i*3, 12, 1, C.light));
    ops.push(b(RX2, 14+i*3, 14, toolFills[i], toolColors[i]));
  }

  // Footer bar
  ops.push(f(2, ROWS-3, COLS-4, 2, C.mid2));
  ops.push(f(3, ROWS-3, COLS-6, 1, C.accent));

  return ops;
}

// ─── Canvas render ─────────────────────────────────────────────────────────────
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

// ─── GIF sprites ─────────────────────────────────────────────────────────────
const SPRITES = [
  { src: "/sprites/ChrisRunrunReal-nobg.gif", name: "Cristian",  color: "#5a7de8" },
  { src: "/sprites/RunTaniaReal-nobg.gif",    name: "Tania",     color: "#e8735a" },
  { src: "/sprites/RunLuisRun-nobg.gif",      name: "Luis",      color: "#7de85a" },
  { src: "/sprites/RunuEu-nobg.gif",          name: "Berta",     color: "#e85aaa" },
  { src: "/sprites/Runmin-nobg.gif",          name: "Katherine", color: "#5ae8e8" },
];

const MSGS = [
  { si: 0, msg: "CRISTIAN: ARMANDO ESTRUCTURA..." },
  { si: 1, msg: "TANIA: APLICANDO COLORES..."     },
  { si: 2, msg: "LUIS: CONFIGURANDO LAYOUT..."    },
  { si: 3, msg: "BERTA: REVISANDO CONTENIDO..."   },
  { si: 4, msg: "KATHERINE: TOQUES FINALES..."    },
];

interface Runner {
  x:    number;
  y:    number;
  vx:   number;
  si:   number;
  flip: boolean;
}

const SPRITE_W = 48;
const SPRITE_H = 48;

// ─── Component ────────────────────────────────────────────────────────────────
export default function PixelLoader() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cvRef   = useRef<HTMLCanvasElement>(null);

  const [msgIdx,   setMsgIdx]   = useState(0);
  const [progress, setProgress] = useState(0);
  const [runners,  setRunners]  = useState<Runner[]>([]);

  const stateRef = useRef({
    ops:         buildOps(),
    revealedOps: 0,
    msgIdx:      0,
    msgTimer:    0,
    lastTime:    0 as number,
    rafId:       0,
    runners:     [] as Runner[],
    // CV bounds in container coordinates (set on mount)
    cvLeft:  0,
    cvRight: 0,
  });

  // ── Init: place runners ON the CV canvas area ────────────────────────────
  useEffect(() => {
    const containerW = wrapRef.current?.clientWidth ?? 680;

    // Exact pixel position of the centered canvas inside the container
    const cvLeft = Math.round((containerW - CV_W) / 2);
    const cvTop  = Math.round((CONTAINER_H - CV_H) / 2);

    // right bound so runner doesn't escape the CV
    const cvRight = cvLeft + CV_W - SPRITE_W;

    // 5 different "floors" — y positions spread vertically across the CV
    // each runner walks on a different horizontal band
    const floors    = [0.50, 0.62, 0.72, 0.40, 0.82];
    const startFrac = [0.05, 0.65, 0.20, 0.45, 0.35];

    const initial: Runner[] = SPRITES.map((_, i) => ({
      x:    cvLeft + (CV_W - SPRITE_W) * startFrac[i],
      y:    cvTop  + CV_H * floors[i] - SPRITE_H,
      vx:   [48, -60, 52, -44, 56][i],
      si:   i,
      flip: [false, true, false, true, false][i],
    }));

    stateRef.current.cvLeft  = cvLeft;
    stateRef.current.cvRight = cvRight;
    stateRef.current.runners = initial;
    setRunners(initial);
  }, []);

  // ── RAF loop — CV reveal + runner movement ───────────────────────────────
  useEffect(() => {
    const cvCanvas = cvRef.current!;
    if (!cvCanvas) return;
    const cvCtx = cvCanvas.getContext("2d")!;

    cvCanvas.width  = CV_W;
    cvCanvas.height = CV_H;
    cvCtx.fillStyle = C.bg;
    cvCtx.fillRect(0, 0, CV_W, CV_H);

    const MSG_INTERVAL = 2600;
    let frameCount = 0;

    function loop(ts: number) {
      const s = stateRef.current;
      if (!s.lastTime) s.lastTime = ts;
      const dt = Math.min((ts - s.lastTime) / 1000, 0.05);
      s.lastTime = ts;
      frameCount++;

      // Message cycle
      s.msgTimer += dt * 1000;
      if (s.msgTimer >= MSG_INTERVAL) {
        s.msgTimer = 0;
        s.msgIdx   = (s.msgIdx + 1) % MSGS.length;
        setMsgIdx(s.msgIdx);
      }

      // CV reveal: 1 op every 2 frames (slow)
      if (frameCount % 2 === 0) {
        if (s.revealedOps < s.ops.length) {
          applyOp(cvCtx, s.ops[s.revealedOps]);
          s.revealedOps++;
        } else {
          // restart when fully drawn
          if (s.msgTimer < 50) {
            s.revealedOps = 0;
            cvCtx.fillStyle = C.bg;
            cvCtx.fillRect(0, 0, CV_W, CV_H);
          }
        }
      }
      setProgress(Math.min(s.revealedOps / s.ops.length, 1));

      // Move runners — bounded within CV canvas x range
      const { cvLeft, cvRight } = s;
      const updated = s.runners.map(r => {
        let nx   = r.x + r.vx * dt;
        let vx   = r.vx;
        let flip = r.flip;
        if (nx > cvRight) { nx = cvRight; vx = -Math.abs(vx); flip = true;  }
        if (nx < cvLeft)  { nx = cvLeft;  vx =  Math.abs(vx); flip = false; }
        return { ...r, x: nx, vx, flip };
      });
      s.runners = updated;
      setRunners([...updated]);

      s.rafId = requestAnimationFrame(loop);
    }

    const s = stateRef.current;
    s.rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(s.rafId);
  }, []);

  const currentMsg    = MSGS[msgIdx];
  const currentSprite = SPRITES[currentMsg.si];
  const filledBars    = Math.floor(progress * 14);

  return (
    <div
      ref={wrapRef}
      style={{
        position:       "relative",
        width:          "100%",
        height:         CONTAINER_H,
        background:     C.bg,
        overflow:       "hidden",
        imageRendering: "pixelated",
      }}
    >
      {/* ── CV pixel art canvas — centered ── */}
      <canvas
        ref={cvRef}
        style={{
          position:       "absolute",
          top:            "50%",
          left:           "50%",
          transform:      "translate(-50%, -50%)",
          imageRendering: "pixelated",
          opacity:        0.90,
        }}
      />

      {/* ── GIF characters — positioned ON the CV ── */}
      {runners.map((r) => {
        const sp = SPRITES[r.si];
        return (
          <div
            key={r.si}
            style={{
              position:       "absolute",
              left:           r.x,
              top:            r.y,
              zIndex:         5,
              width:          SPRITE_W,
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              transform:      r.flip ? "scaleX(-1)" : "scaleX(1)",
              imageRendering: "pixelated",
            }}
          >
            <img
              src={sp.src}
              alt={sp.name}
              width={SPRITE_W}
              height={SPRITE_H}
              style={{ imageRendering: "pixelated", display: "block" }}
            />
            {/* counter-flip the label so text is always readable */}
            <span
              style={{
                display:       "block",
                transform:     r.flip ? "scaleX(-1)" : "none",
                marginTop:     2,
                fontFamily:    "'Courier New', monospace",
                fontSize:      8,
                fontWeight:    "bold",
                letterSpacing: "0.5px",
                color:         sp.color,
                textShadow:    `0 0 6px ${sp.color}bb`,
                whiteSpace:    "nowrap",
              }}
            >
              {sp.name}
            </span>
          </div>
        );
      })}

      {/* ── Scanlines ── */}
      <div
        style={{
          position:      "absolute",
          inset:         0,
          pointerEvents: "none",
          background:    "repeating-linear-gradient(to bottom,transparent,transparent 3px,rgba(0,0,0,0.10) 3px,rgba(0,0,0,0.10) 4px)",
          zIndex:        3,
        }}
      />

      {/* ── Vignette ── */}
      <div
        style={{
          position:      "absolute",
          inset:         0,
          pointerEvents: "none",
          background:    "radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,0.72) 100%)",
          zIndex:        4,
        }}
      />

      {/* ── HUD ── */}
      <div
        style={{
          position:      "absolute",
          bottom:        16,
          left:          "50%",
          transform:     "translateX(-50%)",
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          gap:           7,
          zIndex:        10,
        }}
      >
        <p
          style={{
            fontFamily:    "'Courier New', monospace",
            fontSize:      11,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color:         currentSprite.color,
            textShadow:    `0 0 10px ${currentSprite.color}99`,
            margin:        0,
          }}
        >
          ▶ {currentMsg.msg}
        </p>

        <div style={{ display: "flex", gap: 3 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              style={{
                width:     16,
                height:    8,
                border:    "1px solid rgba(0,229,200,0.25)",
                background: i < filledBars ? currentSprite.color : "rgba(0,229,200,0.04)",
                transition: "background 0.08s",
                boxShadow:  i < filledBars ? `0 0 6px ${currentSprite.color}55` : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}