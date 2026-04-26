import Avatar from "./Avatar";
import { PALETTE, CHARACTER_NAME } from "@/lib/constants";

type Props = {
  role: "user" | "assistant";
  content: string;
  isLastAssistant?: boolean;
  onShare?: () => void;
};

export default function MessageBubble({
  role,
  content,
  isLastAssistant,
  onShare,
}: Props) {
  if (role === "user") {
    return (
      <div className="msg-in flex justify-end mb-5">
        <div
          className="serif italic"
          style={{
            color: PALETTE.ink,
            maxWidth: "80%",
            fontSize: "1.05rem",
            lineHeight: 1.5,
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="msg-in flex items-start gap-4 mb-6">
      <Avatar />
      <div className="flex-1 min-w-0">
        <p
          className="stamp mb-1"
          style={{ color: "rgba(26,20,16,0.7)" }}
        >
          {CHARACTER_NAME}
        </p>
        <div
          className="serif"
          style={{
            color: PALETTE.ink,
            fontSize: "1.2rem",
            lineHeight: 1.4,
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          {content}
        </div>
        {isLastAssistant && content.trim() && onShare && (
          <button
            onClick={onShare}
            className="serif italic mt-2"
            style={{
              color: PALETTE.goldDeep,
              fontSize: "0.85rem",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
              cursor: "pointer",
              background: "transparent",
              border: "none",
              padding: 0,
            }}
          >
            Share this la
          </button>
        )}
      </div>
    </div>
  );
}
