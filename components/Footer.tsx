import { PALETTE, DISCLAIMER_LINE } from "@/lib/constants";

// Sister sites are NOT shown on character sites. Discovery of the network
// happens on characters4ai.com only. Each character site should feel like
// it was made entirely for its own audience — not a portal to others.

export default function Footer() {
  return (
    <footer className="w-full mt-16 relative z-10">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="ink-divider mb-10" style={{ opacity: 0.6 }} />

        {/* In-character disclaimer */}
        <p
          className="serif italic text-center mb-8"
          style={{
            color: "rgba(240,232,208,0.45)",
            fontSize: "0.9rem",
            lineHeight: 1.5,
            maxWidth: 600,
            margin: "0 auto 2rem",
          }}
        >
          {DISCLAIMER_LINE}
        </p>

        {/* Legal links */}
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

        {/* Copyright */}
        <p
          className="stamp text-center"
          style={{
            color: PALETTE.cream,
            opacity: 0.4,
            fontSize: 10,
          }}
        >
          © 2026 Characters4AI
        </p>
      </div>

      <div className="bottom-stripe" />
    </footer>
  );
}
