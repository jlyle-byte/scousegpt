import Image from "next/image";
import { STAMPS, CHARACTER_TAGLINE, PALETTE } from "@/lib/constants";

export default function Header() {
  return (
    <header className="w-full max-w-3xl px-6 pt-12 pb-8 relative z-10">
      {/* Top row: gold stamp microtype. Right is the hero — visibly larger
          than the left supporting stamp. */}
      <div className="flex items-end justify-between mb-6 gap-4">
        <span
          className="stamp"
          style={{ fontSize: 19.5, letterSpacing: "0.2em" }}
        >
          {STAMPS.left}
        </span>
        <span
          className="stamp"
          style={{
            fontSize: 27,
            letterSpacing: "0.25em",
            fontWeight: 700,
          }}
        >
          {STAMPS.right}
        </span>
      </div>

      {/* Wordmark — title.png with integrated sparkle and red drop shadow.
          The image asset IS the wordmark; no CSS text shadow, no drift. */}
      <div className="flex justify-center">
        <Image
          src="/title.png"
          alt="ScouseGPT"
          width={1200}
          height={300}
          priority
          className="w-full max-w-[500px] md:max-w-[600px] h-auto"
        />
      </div>

      {/* Tagline — italic serif, mustard gold, between solid 40%-gold rules */}
      <div className="mt-6">
        <div className="rule-tagline" />
        <div className="py-3 flex justify-center">
          <span
            className="serif italic"
            style={{
              color: PALETTE.gold,
              fontSize: "clamp(0.9375rem, 2.2vw, 1.125rem)",
              lineHeight: 1.3,
            }}
          >
            {CHARACTER_TAGLINE}
          </span>
        </div>
        <div className="rule-tagline" />
      </div>

    </header>
  );
}
