import { PALETTE, SISTER_SITES, CURRENT_SITE, DISCLAIMER_LINE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="w-full mt-16 relative z-10">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="ink-divider mb-12" style={{ opacity: 0.6 }} />

        {/* The Family */}
        <h3
          className="stamp text-center mb-6"
          style={{
            color: PALETTE.gold,
            opacity: 0.7,
            fontSize: 11,
            letterSpacing: "0.32em",
          }}
        >
          ◆ THE FAMILY ◆
        </h3>

        <ul className="grid grid-cols-3 gap-y-4 gap-x-2 md:flex md:flex-wrap md:justify-center md:gap-x-8 mb-8">
          {SISTER_SITES.map((s) => {
            const isCurrent = s.name === CURRENT_SITE;
            const baseStyle = {
              color: PALETTE.gold,
              fontSize: 11,
            } as const;
            return (
              <li key={s.name} className="text-center">
                {isCurrent ? (
                  <span
                    className="stamp"
                    style={{ ...baseStyle, opacity: 0.4, cursor: "default" }}
                    aria-current="page"
                  >
                    {s.name}
                  </span>
                ) : (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stamp transition-opacity"
                    style={{ ...baseStyle, opacity: 0.7 }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.opacity = "0.7";
                    }}
                  >
                    {s.name}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* Holding company */}
        <p
          className="stamp text-center mb-4"
          style={{
            color: PALETTE.cream,
            opacity: 0.55,
            fontSize: 10,
          }}
        >
          PART OF THE CHARACTERS4AI FAMILY ·{" "}
          <a
            href="https://characters4ai.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: PALETTE.gold, opacity: 0.85 }}
          >
            characters4ai.com
          </a>
        </p>

        {/* Legal */}
        <div className="flex justify-center gap-6 mb-6">
          <a
            href="https://characters4ai.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="stamp"
            style={{ color: PALETTE.gold, opacity: 0.6, fontSize: 10 }}
          >
            Terms of Use
          </a>
          <a
            href="https://characters4ai.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="stamp"
            style={{ color: PALETTE.gold, opacity: 0.6, fontSize: 10 }}
          >
            Privacy Policy
          </a>
          <a
            href="https://characters4ai.com/disclaimer"
            target="_blank"
            rel="noopener noreferrer"
            className="stamp"
            style={{ color: PALETTE.gold, opacity: 0.6, fontSize: 10 }}
          >
            Disclaimer
          </a>
        </div>

        {/* Disclaimer */}
        <p
          className="serif italic text-center"
          style={{
            color: "rgba(240,232,208,0.4)",
            fontSize: "0.85rem",
            lineHeight: 1.5,
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          {DISCLAIMER_LINE}
        </p>
      </div>

      <div className="bottom-stripe" />
    </footer>
  );
}
