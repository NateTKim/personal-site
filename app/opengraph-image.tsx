import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero, withoutWordJoiners } from "@/content/profile";

// The link-preview image for every page (og:image; twitter:image is the same image, see the
// root layout): the hero's headline and sub-line on the site's background, nothing else.
// Prerendered at build time: it reads only committed files, never the request.

export const alt = withoutWordJoiners(`${hero.lead}${hero.italic} ${hero.sub}`);
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static TrueType instances from Google Fonts (the renderer, Satori, reads neither WOFF2 nor
// variable fonts), committed in fonts/ with their OFL licences. 400 is the hero's weight.
const [sans, serif] = await Promise.all([
  readFile(join(process.cwd(), "fonts/hanken-grotesk/HankenGrotesk-Regular.ttf")),
  readFile(join(process.cwd(), "fonts/newsreader/Newsreader-Italic.ttf")),
]);

// The palette from app/globals.css as plain colors (the renderer has no color-mix()).
const color = { background: "#0e0d0c", text: "#f1e9dd", muted: "#b2a796" };
// The page's vignette (body::before) at this size: the warm lift at the top (the accent at 5.5%,
// over 90% × 60% of the box), in pixels because the renderer misreads percentage sizes. Its
// darker edges are left out: at 1200 × 630 they change no pixel by more than one level in
// Chrome, and the renderer would darken the whole image with them instead.
const vignette = `radial-gradient(${0.9 * size.width}px ${0.6 * size.height}px at ${size.width / 2}px 0px, rgba(255, 181, 71, 0.055), rgba(255, 181, 71, 0) 70%)`;
// The headline's glow (--glow: the text color at 14%).
const glow = "0 0 30px rgba(241, 233, 221, 0.14)";

const leading = 1.02; // the hero headline's line height
const sansSize = 128;
const serifSize = sansSize * 1.2; // the italic phrase's scale (--serif-scale) from 768px
// The renderer can't align a sans and a serif on their baselines, so the italic is moved by the
// difference. A baseline sits (line height - ascent - descent) / 2 + ascent below its line's top;
// vertical metrics in em: Hanken Grotesk 1.0 / 0.303, Newsreader Italic 0.735 / 0.265.
const baseline = (fontSize: number, ascent: number, descent: number) =>
  ((leading - ascent - descent) * fontSize) / 2 + ascent * fontSize;
const serifShift = baseline(serifSize, 0.735, 0.265) - baseline(sansSize, 1, 0.303);

// Each word of the sub-line is its own box, so lines only break at spaces: "UW–Madison" never
// splits, and the word joiner (no glyph in these fonts) is dropped rather than drawn as a box.
const subWords = withoutWordJoiners(hero.sub).split(" ");

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 96px",
        backgroundColor: color.background,
        backgroundImage: vignette,
        fontFamily: "Hanken Grotesk",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          fontSize: sansSize,
          lineHeight: leading,
          letterSpacing: "-0.03em",
          color: color.text,
          textShadow: glow,
        }}
      >
        <span style={{ whiteSpace: "pre" }}>{hero.lead}</span>
        <span
          style={{
            position: "relative",
            top: -serifShift,
            fontFamily: "Newsreader",
            fontStyle: "italic",
            fontSize: serifSize,
          }}
        >
          {hero.italic}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          columnGap: "0.26em", // the width of a space in Hanken Grotesk
          maxWidth: 720,
          marginTop: 40,
          fontSize: 34,
          lineHeight: 1.5,
          color: color.muted,
        }}
      >
        {subWords.map((word, i) => (
          <span key={i} style={{ flexShrink: 0, whiteSpace: "nowrap" }}>
            {word}
          </span>
        ))}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Hanken Grotesk", data: sans, weight: 400, style: "normal" },
        { name: "Newsreader", data: serif, weight: 400, style: "italic" },
      ],
    },
  );
}
