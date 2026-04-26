// One-shot generator for icon.png, apple-icon.png, og.png.
// Run with: node scripts/generate-images.mjs
// Uses @resvg/resvg-js with explicit font buffers (librsvg's @font-face handling is unreliable).

import { Resvg } from "@resvg/resvg-js";
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import wawoff from "wawoff2";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const APP_DIR = join(ROOT, "app");
const PUBLIC_DIR = join(ROOT, "public");
const TMP_DIR = join(ROOT, ".font-cache");

const PALETTE = {
  bg: "#1a1612",
  red: "#c8102e",
  gold: "#d4a017",
  cream: "#f0e8d0",
  black: "#0a0807",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

await mkdir(TMP_DIR, { recursive: true });

async function fetchAndConvertFont(fontCssUrl, outTtfPath, unicodeRangeMatch) {
  const cssRes = await fetch(fontCssUrl, { headers: { "User-Agent": UA } });
  const css = await cssRes.text();
  const blocks = css.split("@font-face");
  let chosen = null;
  for (const b of blocks) {
    if (!b.includes("src:")) continue;
    if (unicodeRangeMatch && !b.includes(unicodeRangeMatch)) continue;
    chosen = b;
    break;
  }
  if (!chosen) chosen = blocks.find((b) => b.includes("src:"));
  const m = chosen.match(/url\((https?:\/\/[^)]+\.woff2)\)/);
  const fontRes = await fetch(m[1], { headers: { "User-Agent": UA } });
  const woff2Buf = Buffer.from(await fontRes.arrayBuffer());
  // resvg-js (npm build) doesn't decode woff2 — decompress to OTF/TTF first.
  const ttfBuf = Buffer.from(await wawoff.decompress(woff2Buf));
  await writeFile(outTtfPath, ttfBuf);
  return outTtfPath;
}

console.log("Fetching Bebas Neue...");
const bebasPath = await fetchAndConvertFont(
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
  join(TMP_DIR, "bebas-neue.ttf"),
  "U+0000-00FF"
);
console.log("Fetching Source Serif 4 italic...");
const serifPath = await fetchAndConvertFont(
  "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital@1&display=swap",
  join(TMP_DIR, "source-serif-italic.ttf"),
  "U+0000-00FF"
);

function renderSvg(svg, outPath, width, height) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: {
      fontFiles: [bebasPath, serifPath],
      loadSystemFonts: false,
      defaultFontFamily: "Bebas Neue",
    },
    background: "rgba(0,0,0,0)",
  });
  const png = resvg.render().asPng();
  return writeFile(outPath, png).then(() => console.log("wrote", outPath));
}

// --- Avatar / favicon ------------------------------------------------------
function avatarSvg() {
  const S = 512;
  const cx = S / 2;
  const cy = S / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">
  <rect width="${S}" height="${S}" fill="${PALETTE.bg}"/>
  <circle cx="${cx}" cy="${cy}" r="246" fill="${PALETTE.gold}"/>
  <circle cx="${cx}" cy="${cy}" r="232" fill="${PALETTE.cream}"/>
  <circle cx="${cx}" cy="${cy}" r="220" fill="${PALETTE.black}"/>
  <text x="${cx}" y="${cy + 90}" text-anchor="middle"
        font-family="Bebas Neue" font-size="280"
        fill="${PALETTE.cream}" letter-spacing="14">TL</text>
</svg>`;
}

await renderSvg(avatarSvg(), join(APP_DIR, "icon.png"), 512, 512);
await renderSvg(avatarSvg(), join(APP_DIR, "apple-icon.png"), 180, 180);

function star(cx, cy, r, fill) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.42;
    pts.push(`${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="${fill}"/>`;
}

// 12-point sparkle path from components/Asterisk.tsx (viewBox 0 0 24 24)
const ASTERISK_PATH =
  "M12 2 L13 10 L21 8 L14 12 L21 16 L13 14 L12 22 L11 14 L3 16 L10 12 L3 8 L11 10 Z";

function asterisk(cx, cy, sizePx, rotateDeg, glowColor, sharpColor) {
  const scale = sizePx / 24;
  return `
    <g transform="translate(${cx}, ${cy}) rotate(${rotateDeg}) scale(${scale}) translate(-12, -12)">
      <path d="${ASTERISK_PATH}" fill="${glowColor}" filter="url(#asterisk-glow)" opacity="0.85"/>
      <path d="${ASTERISK_PATH}" fill="${sharpColor}"/>
    </g>`;
}

function sun(cx, cy, r, fill) {
  const rays = [];
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 4) * i;
    const x1 = cx + Math.cos(angle) * (r + 2);
    const y1 = cy + Math.sin(angle) * (r + 2);
    const x2 = cx + Math.cos(angle) * (r + 6);
    const y2 = cy + Math.sin(angle) * (r + 6);
    rays.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${fill}" stroke-width="2" stroke-linecap="round"/>`);
  }
  return `<g><circle cx="${cx}" cy="${cy}" r="${r * 0.55}" fill="${fill}"/>${rays.join("")}</g>`;
}

// --- OG image (1200x630) ---------------------------------------------------
function ogSvg() {
  const W = 1200;
  const H = 630;
  // Right-side stamp positioning: text right-edge ends at W-90 (where right sun goes),
  // so we anchor text="end" at W-100 and put sun at W-80.
  // Bebas Neue is condensed. Measured against the rendered output:
  // "LIVERPOOL · THE MERSEY · BEYOND" ≈ 380px from x=92 → ends near x=472
  // "SOUND AS A POUND" ≈ 195px; right-anchored at x=1108 → starts near x=913
  const leftTrailingStarX = 492;
  const rightTextEndX = W - 92;
  const rightTextStartX = rightTextEndX - 195;
  const rightSunInnerX = rightTextStartX - 20;
  const rightSunOuterX = rightTextEndX + 20;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <pattern id="halftone" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="5" r="1.4" fill="${PALETTE.cream}" fill-opacity="0.18"/>
    </pattern>
    <radialGradient id="hm" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="white" stop-opacity="1"/>
      <stop offset="60%" stop-color="white" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
    <mask id="hmask"><rect width="${W}" height="${H}" fill="url(#hm)"/></mask>
    <filter id="asterisk-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.2"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="${PALETTE.bg}"/>

  <g mask="url(#hmask)">
    <rect width="${W}" height="${H}" fill="url(#halftone)"/>
  </g>

  <!-- Top-left stamp: ★ LIVERPOOL · THE MERSEY · BEYOND ★ -->
  ${star(70, 56, 9, PALETTE.gold)}
  <text x="92" y="64" font-family="Bebas Neue" font-size="22"
        fill="${PALETTE.gold}" letter-spacing="3.3">LIVERPOOL · THE MERSEY · BEYOND</text>
  ${star(leftTrailingStarX, 56, 9, PALETTE.gold)}

  <!-- Top-right stamp: ☀ SOUND AS A POUND ☀ -->
  ${sun(rightSunInnerX, 56, 10, PALETTE.gold)}
  <text x="${rightTextEndX}" y="64" text-anchor="end" font-family="Bebas Neue" font-size="22"
        fill="${PALETTE.gold}" letter-spacing="3.3">SOUND AS A POUND</text>
  ${sun(rightSunOuterX, 56, 10, PALETTE.gold)}

  <!-- Wordmark — single red drop shadow (3px right, 3px down, scaled up for 1200px canvas) -->
  <g transform="translate(${W / 2}, ${H / 2 - 30})">
    <text x="9" y="9" text-anchor="middle" font-family="Bebas Neue"
          font-size="240" fill="${PALETTE.red}" letter-spacing="-4">scousegpt</text>
    <text x="0" y="0" text-anchor="middle" font-family="Bebas Neue"
          font-size="240" fill="${PALETTE.cream}" letter-spacing="-4">scousegpt</text>
  </g>

  <!-- 12-point sparkle adapted from components/Asterisk.tsx — gold glow + cream sharp.
       Tucked into the upper-right of the wordmark, just past the final "t". -->
  ${asterisk(1060, 145, 90, 8, PALETTE.gold, PALETTE.cream)}

  <rect x="240" y="${H / 2 + 50}" width="${W - 480}" height="6" fill="${PALETTE.black}"/>

  <text x="${W / 2}" y="${H / 2 + 110}" text-anchor="middle"
        font-family="Source Serif 4" font-style="italic"
        font-size="34" fill="${PALETTE.gold}">sound advice from a proper Scouse lad</text>

  <rect x="240" y="${H / 2 + 130}" width="${W - 480}" height="2" fill="${PALETTE.black}"/>

  <rect x="0" y="${H - 20}" width="${W / 2}" height="20" fill="${PALETTE.black}"/>
  <rect x="${W / 2}" y="${H - 20}" width="${W / 2}" height="20" fill="${PALETTE.red}"/>
</svg>`;
}

await renderSvg(ogSvg(), join(PUBLIC_DIR, "og.png"), 1200, 630);

console.log("Done.");
