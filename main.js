const BACKGROUND = "#101010"
const FOREGROUND = "#50FF50"
const FPS = 120;

let isPlaying = true;

function updateFavicon() {
  faviconLink.href = favicon.toDataURL("image/png");
}

favicon.width = 16;
favicon.height = 16;

const ctx = favicon.getContext("2d");
const vs = [
  { x: 0.40, y: 0.40, z: 0.40 },
  { x: -0.40, y: 0.40, z: 0.40 },
  { x: -0.40, y: -0.40, z: 0.40 },
  { x: 0.40, y: -0.40, z: 0.40 },

  { x: 0.40, y: 0.40, z: -0.40 },
  { x: -0.40, y: 0.40, z: -0.40 },
  { x: -0.40, y: -0.40, z: -0.40 },
  { x: 0.40, y: -0.40, z: -0.40 },
]

const fs = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
]

function clear() {
  ctx.fillStyle = BACKGROUND
  ctx.fillRect(0, 0, favicon.width, favicon.height)
}

function point({ x, y }) {
  const s = 20;
  ctx.fillStyle = FOREGROUND
  ctx.fillRect(x - s / 2, y - s / 2, s, s)
}

function line(p1, p2) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = FOREGROUND
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function screen(p) {
  // -1..1 => 0..2 => 0..1 => 0..w
  return {
    x: (p.x + 1) / 2 * favicon.width,
    y: (1 - (p.y + 1) / 2) * favicon.height,
  }
}

function project({ x, y, z }) {
  return {
    x: x / z,
    y: y / z,
  }
}

function translate_z({ x, y, z }, dz) {
  return { x, y, z: z + dz };
}

function rotate_xz({ x, y, z }, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: x * c - z * s,
    y,
    z: x * s + z * c,
  };
}

function rotate_yz({ x, y, z }, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x,
    y: y * c - z * s,
    z: y * s + z * c,
  };
}

let dz = 1;
let angle = 0;

function draw() {
  const dt = 1 / FPS;
  angle += Math.PI * dt;
  clear()
  for (const f of fs) {
    for (let i = 0; i < f.length; ++i) {
      const a = vs[f[i]];
      const b = vs[f[(i + 1) % f.length]];
      line(screen(project(translate_z(rotate_xz(rotate_yz(a, angle), angle), dz))),
        screen(project(translate_z(rotate_xz(rotate_yz(b, angle), angle), dz))))
    }
  }
}

requestAnimationFrame(function tick() {
  draw();
  if (isPlaying) { updateFavicon(); }
  requestAnimationFrame(tick);
});

function play() {
  isPlaying = true;
}

function pause() {
  isPlaying = false;
}