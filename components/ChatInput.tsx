"use client";

import { forwardRef } from "react";
import { Send } from "lucide-react";
import { PALETTE, CHARACTER_NAME } from "@/lib/constants";

type Props = {
  value: string;
  onChange: (s: string) => void;
  onSend: () => void;
  disabled?: boolean;
  paywallActive?: boolean;
};

const ChatInput = forwardRef<HTMLInputElement, Props>(function ChatInput(
  { value, onChange, onSend, disabled, paywallActive },
  ref
) {
  const placeholder = paywallActive
    ? `Buy ${CHARACTER_NAME} a pint to carry on...`
    : `Speak yer mind to ${CHARACTER_NAME}...`;

  const sendDisabled = disabled || !value.trim();

  return (
    <div className="chat-input-row flex items-center gap-2 px-3 py-2">
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!sendDisabled) onSend();
          }
        }}
        disabled={disabled}
        placeholder={placeholder}
        className="serif flex-1 bg-transparent outline-none border-none"
        style={{
          color: PALETTE.ink,
          caretColor: PALETTE.red,
          fontSize: "1rem",
          padding: "6px 4px",
        }}
      />
      <button
        onClick={onSend}
        disabled={sendDisabled}
        className="send-btn"
        aria-label="Send"
      >
        <Send size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
});

export default ChatInput;
