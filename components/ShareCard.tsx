"use client";

import { useRef } from "react";
import { Share2, Download, X } from "lucide-react";
import html2canvas from "html2canvas";
import { PALETTE, CHARACTER_NAME, DOMAIN } from "@/lib/constants";

type Props = {
  msg: { user: string; assistant: string };
  onClose: () => void;
};

export default function ShareCard({ msg, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const truncated =
    msg.assistant.length > 280
      ? msg.assistant.slice(0, 280).trimEnd() + "…"
      : msg.assistant;

  async function handleShare() {
    const node = cardRef.current;
    if (!node) return;
    try {
      const canvas = await html2canvas(node, { backgroundColor: PALETTE.bgDark });
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png")
      );
      if (!blob) return;
      const file = new File([blob], "scousegpt.png", { type: "image/png" });
      if (
        typeof navigator !== "undefined" &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          title: "Tommy la said:",
          text: truncated,
          files: [file],
        });
      } else {
        // download fallback
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "scousegpt.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {}
  }

  async function handleDownload() {
    const node = cardRef.current;
    if (!node) return;
    try {
      const canvas = await html2canvas(node, { backgroundColor: PALETTE.bgDark });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "scousegpt.png";
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch {}
  }

  return (
    <div className="share-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center gap-4"
      >
        <div
          ref={cardRef}
          className="relative"
          style={{
            width: 360,
            height: 450,
            background: PALETTE.bgDark,
            color: PALETTE.cream,
            padding: "32px 28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 30px 80px -20px rgba(0,0,0,0.85)",
          }}
        >
          {/* Top stripe — single red/black */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 8,
              background: `linear-gradient(90deg, ${PALETTE.black} 0%, ${PALETTE.black} 50%, ${PALETTE.red} 50%, ${PALETTE.red} 100%)`,
            }}
          />
          <div>
            <h2
              className="display wordmark-stamp"
              style={{ fontSize: "2.5rem", marginTop: 12 }}
            >
              scousegpt
            </h2>
            <p
              className="serif italic"
              style={{
                color: PALETTE.gold,
                fontSize: "0.85rem",
                marginTop: 4,
              }}
            >
              sound advice from a proper Scouse lad
            </p>
          </div>

          <div style={{ flex: 1, marginTop: 16 }}>
            {msg.user && (
              <p
                className="serif italic"
                style={{
                  color: "rgba(240,232,208,0.65)",
                  fontSize: "0.85rem",
                  marginBottom: 10,
                }}
              >
                — &ldquo;{msg.user}&rdquo;
              </p>
            )}
            <p
              className="serif"
              style={{
                color: PALETTE.cream,
                fontSize: "1.05rem",
                lineHeight: 1.4,
              }}
            >
              {truncated}
            </p>
          </div>

          <div className="flex justify-between items-end">
            <span
              className="serif italic"
              style={{ color: PALETTE.gold, fontSize: "0.85rem" }}
            >
              — {CHARACTER_NAME}
            </span>
            <span
              className="stamp"
              style={{ color: PALETTE.cream, opacity: 0.65 }}
            >
              {DOMAIN}
            </span>
          </div>

          {/* Bottom stripe */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 8,
              background: `linear-gradient(90deg, ${PALETTE.red} 0%, ${PALETTE.red} 50%, ${PALETTE.black} 50%, ${PALETTE.black} 100%)`,
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="serif flex items-center gap-2 px-4 py-2"
            style={{
              background: PALETTE.cream,
              color: PALETTE.ink,
              border: `2px solid ${PALETTE.black}`,
              borderRadius: 2,
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            <Share2 size={16} /> Share
          </button>
          <button
            onClick={handleDownload}
            className="serif flex items-center gap-2 px-4 py-2"
            style={{
              background: PALETTE.cream,
              color: PALETTE.ink,
              border: `2px solid ${PALETTE.black}`,
              borderRadius: 2,
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            <Download size={16} /> Save image
          </button>
          <button
            onClick={onClose}
            className="serif flex items-center gap-2 px-4 py-2"
            style={{
              background: "transparent",
              color: PALETTE.cream,
              border: `2px solid ${PALETTE.cream}`,
              borderRadius: 2,
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            <X size={16} /> Close
          </button>
        </div>
      </div>
    </div>
  );
}
