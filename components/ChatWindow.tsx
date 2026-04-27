"use client";

import {
  forwardRef,
  type RefObject,
  type Ref,
} from "react";
import MessageBubble from "./MessageBubble";
import PaywallCard from "./PaywallCard";
import ChatInput from "./ChatInput";
import Avatar from "./Avatar";
import {
  PALETTE,
  SUGGESTIONS,
  CHARACTER_NAME,
} from "@/lib/constants";

type ChatMessage = { role: "user" | "assistant"; content: string };

type Props = {
  messages: ChatMessage[];
  loading: boolean;
  showPaywall: boolean;
  error: string | null;
  onSuggestion: (s: string) => void;
  onShare: () => void;
  input: string;
  onInputChange: (s: string) => void;
  onSend: () => void;
  inputDisabled: boolean;
  paywallActive: boolean;
  inputRef: RefObject<HTMLInputElement>;
  remaining: number;
  promptsAllowed: number;
};

const ChatWindow = forwardRef<HTMLDivElement, Props>(function ChatWindow(
  {
    messages,
    loading,
    showPaywall,
    error,
    onSuggestion,
    onShare,
    input,
    onInputChange,
    onSend,
    inputDisabled,
    paywallActive,
    inputRef,
    remaining,
    promptsAllowed,
  },
  scrollRef: Ref<HTMLDivElement>
) {
  const showSuggestions = messages.length === 0 && !showPaywall;
  const lastAssistantIdx = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant" && messages[i].content.trim())
        return i;
    }
    return -1;
  })();

  const chipBorders = [PALETTE.black, PALETTE.red, PALETTE.goldDeep];

  return (
    <div
      className="rough-card chat-panel flex flex-col relative"
      style={{ transform: "rotate(-0.3deg)" }}
    >
      <div className="stripe-accent stripe-left" />
      <div className="stripe-accent stripe-right" />

      {/* No card header — the chat starts directly with the messages region. */}

      {/* Scrollable messages */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-8 md:px-12 py-4"
      >
        {messages.length === 0 && !showPaywall && (
          <div className="msg-in flex items-start gap-4 mb-6">
            <Avatar />
            <div className="flex-1">
              <p
                className="stamp mb-1"
                style={{ color: "rgba(26,20,16,0.7)" }}
              >
                {CHARACTER_NAME}
              </p>
              <p
                className="serif"
                style={{
                  color: PALETTE.ink,
                  fontSize: "1.2rem",
                  lineHeight: 1.4,
                }}
              >
                Alright la, what's the script? Tommy here — ask us anything,
                I'll give it to ya straight.
              </p>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <MessageBubble
            key={i}
            role={m.role}
            content={m.content}
            isLastAssistant={i === lastAssistantIdx}
            onShare={onShare}
          />
        ))}

        {loading && (
          <div className="msg-in flex items-start gap-4 mb-6">
            <Avatar />
            <div className="flex items-center gap-1 pt-3">
              <span
                className="dot"
                style={{ color: PALETTE.ink, fontSize: 24 }}
              >
                ●
              </span>
              <span
                className="dot"
                style={{ color: PALETTE.red, fontSize: 24 }}
              >
                ●
              </span>
              <span
                className="dot"
                style={{ color: PALETTE.goldDeep, fontSize: 24 }}
              >
                ●
              </span>
            </div>
          </div>
        )}

        {error && (
          <p
            className="serif italic text-center my-4"
            style={{ color: PALETTE.red, fontSize: "0.95rem" }}
          >
            {error}
          </p>
        )}

        {showPaywall && <PaywallCard />}
      </div>

      {/* 3. Suggestion chips */}
      {showSuggestions && (
        <div className="px-8 md:px-12 pb-2 flex flex-wrap gap-2 justify-center">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => onSuggestion(s)}
              className="serif italic"
              style={{
                fontSize: "0.9rem",
                color: PALETTE.ink,
                background: "rgba(240,232,208,0.6)",
                border: `1.5px solid ${chipBorders[i % 3]}`,
                borderRadius: 2,
                padding: "6px 14px",
                cursor: "pointer",
                transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)`,
                transition: "transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotate(${
                  i % 2 === 0 ? -0.5 : 0.5
                }deg)`;
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* 4. Prompt counter */}
      {!showPaywall && promptsAllowed > 0 && (
        <div className="flex justify-end px-8 md:px-12 pb-1">
          <span
            className="stamp"
            style={{
              color:
                remaining <= 1
                  ? PALETTE.red
                  : "rgba(26,20,16,0.55)",
              fontSize: 9,
            }}
          >
            {remaining > 0
              ? `${remaining} question${remaining === 1 ? "" : "s"} remaining`
              : `${CHARACTER_NAME} needs a refill`}
          </span>
        </div>
      )}

      {/* 5. Input */}
      <div className="ink-divider mx-8 md:mx-12" />
      <div className="px-8 md:px-12 py-3">
        <ChatInput
          ref={inputRef}
          value={input}
          onChange={onInputChange}
          onSend={onSend}
          disabled={inputDisabled}
          paywallActive={paywallActive}
        />
      </div>
    </div>
  );
});

export default ChatWindow;
