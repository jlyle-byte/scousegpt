"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import ChatWindow from "@/components/ChatWindow";
import Footer from "@/components/Footer";
import ShareCard from "@/components/ShareCard";
import { PAYWALL } from "@/lib/constants";
import { trackEvent } from "@/lib/plausible";

type Role = "user" | "assistant";
type ChatMessage = { role: Role; content: string };

const LS_USED = "bc_prompts_used";
const LS_ALLOWED = "bc_prompts_allowed";
const LS_MESSAGES = "bc_messages";
const LS_TOKEN = "bc_token";

const BEER_CONFIRMATION =
  "Get in! Pint's landed — right la, fire away. What we sortin out?";
const CASE_CONFIRMATION =
  "A full session?! You're a sound one, you. Right, I'm settled in proper now. Ask us whatever you want.";
const ERROR_LINE =
  "Eh, line's gone funny la. Give us a minute and try again, sound?";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}
function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; max-age=31536000; path=/; SameSite=Lax`;
}
function clearCookie(name: string) {
  document.cookie = `${name}=; max-age=0; path=/; SameSite=Lax`;
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promptsUsed, setPromptsUsed] = useState(0);
  const [promptsAllowed, setPromptsAllowed] = useState(PAYWALL.freeMessages);
  const [showPaywall, setShowPaywall] = useState(false);
  const [shareMsg, setShareMsg] = useState<{
    user: string;
    assistant: string;
  } | null>(null);

  const tokenRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mountedRef = useRef(false);

  // Mount: hydrate, process Stripe redirect, restore session, fall back to free tier
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    // 1. Hydrate prior conversation
    try {
      const stored = localStorage.getItem(LS_MESSAGES);
      if (stored) {
        const parsed: ChatMessage[] = JSON.parse(stored);
        const cleaned = parsed.filter(
          (m) => !(m.role === "assistant" && !m.content?.trim())
        );
        if (cleaned.length) setMessages(cleaned);
      }
    } catch {}

    // 2. Stripe redirect
    const session = searchParams.get("session");
    const tier = searchParams.get("tier");
    if (session === "success" && (tier === "beer" || tier === "case")) {
      (async () => {
        try {
          const r = await fetch("/api/session/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tier }),
          });
          const data = await r.json();
          if (data?.token) {
            tokenRef.current = data.token;
            localStorage.setItem(LS_TOKEN, data.token);
            writeCookie(LS_TOKEN, data.token);
            setPromptsAllowed(data.promptsAllowed);
            setPromptsUsed(0);
            setShowPaywall(false);
            const confirmation =
              tier === "beer" ? BEER_CONFIRMATION : CASE_CONFIRMATION;
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: confirmation },
            ]);
            trackEvent(
              tier === "beer" ? "Payment Success Beer" : "Payment Success Case"
            );
          }
        } catch {}
        router.replace("/");
      })();
      return;
    }

    // 3. Restore session
    const existingToken = localStorage.getItem(LS_TOKEN) ?? readCookie(LS_TOKEN);
    if (existingToken) {
      (async () => {
        try {
          const r = await fetch("/api/session/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: existingToken }),
          });
          const data = await r.json();
          if (data?.valid) {
            tokenRef.current = existingToken;
            localStorage.setItem(LS_TOKEN, existingToken);
            writeCookie(LS_TOKEN, existingToken);
            setPromptsAllowed(data.promptsAllowed);
            setPromptsUsed(data.promptsUsed);
            return;
          }
          // invalid — clear
          localStorage.removeItem(LS_TOKEN);
          clearCookie(LS_TOKEN);
        } catch {}
        // fall through to free tier
        readFreeTier();
      })();
      return;
    }

    // 4. Free tier
    readFreeTier();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function readFreeTier() {
    try {
      const used = parseInt(localStorage.getItem(LS_USED) ?? "0", 10);
      const allowed = parseInt(
        localStorage.getItem(LS_ALLOWED) ?? `${PAYWALL.freeMessages}`,
        10
      );
      setPromptsUsed(isNaN(used) ? 0 : used);
      setPromptsAllowed(isNaN(allowed) ? PAYWALL.freeMessages : allowed);
    } catch {
      setPromptsUsed(0);
      setPromptsAllowed(PAYWALL.freeMessages);
    }
  }

  // Persist messages
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(LS_MESSAGES, JSON.stringify(messages));
    }
  }, [messages]);

  // Track Paywall Shown — single useEffect, no duplicates
  useEffect(() => {
    if (showPaywall) trackEvent("Paywall Shown");
  }, [showPaywall]);

  // Mobile keyboard: visualViewport
  useEffect(() => {
    const update = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--vvh", `${h}px`);
    };
    update();
    window.visualViewport?.addEventListener("resize", update);
    window.addEventListener("resize", update);
    return () => {
      window.visualViewport?.removeEventListener("resize", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    if (promptsUsed >= promptsAllowed) {
      setShowPaywall(true);
      return;
    }
    setError(null);

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content },
      { role: "assistant", content: "" },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Increment usage
    let newPromptsUsed = promptsUsed;
    if (tokenRef.current) {
      try {
        const r = await fetch("/api/session/use", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenRef.current }),
        });
        if (r.status === 404) {
          tokenRef.current = null;
          localStorage.removeItem(LS_TOKEN);
          clearCookie(LS_TOKEN);
          setMessages((prev) => prev.slice(0, -2));
          setShowPaywall(true);
          setLoading(false);
          return;
        }
        const data = await r.json();
        newPromptsUsed = data.promptsUsed;
        setPromptsUsed(newPromptsUsed);
      } catch {}
    } else {
      newPromptsUsed = promptsUsed + 1;
      setPromptsUsed(newPromptsUsed);
      try {
        localStorage.setItem(LS_USED, `${newPromptsUsed}`);
        localStorage.setItem(LS_ALLOWED, `${promptsAllowed}`);
      } catch {}
    }

    // Stream chat
    try {
      const sendable = newMessages
        .slice(0, -1)
        .filter((m, i) => !(i === newMessages.length - 2 && false));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: sendable }),
      });
      if (!res.ok || !res.body) throw new Error("bad response");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let firstChunk = true;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (firstChunk) {
          setLoading(false);
          firstChunk = false;
        }
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last && last.role === "assistant") {
            copy[copy.length - 1] = {
              role: "assistant",
              content: last.content + chunk,
            };
          }
          return copy;
        });
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        if (
          copy.length &&
          copy[copy.length - 1].role === "assistant" &&
          !copy[copy.length - 1].content
        ) {
          copy.pop();
        }
        return copy;
      });
      setError(ERROR_LINE);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
      if (newPromptsUsed >= promptsAllowed) {
        setTimeout(() => setShowPaywall(true), 800);
      }
    }
  }

  function handleShare() {
    // Last user/assistant pair
    let user = "";
    let assistant = "";
    for (let i = messages.length - 1; i >= 0; i--) {
      if (!assistant && messages[i].role === "assistant") {
        assistant = messages[i].content;
      } else if (
        assistant &&
        !user &&
        messages[i].role === "user"
      ) {
        user = messages[i].content;
        break;
      }
    }
    if (assistant) setShareMsg({ user, assistant });
  }

  const remaining = Math.max(0, promptsAllowed - promptsUsed);

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-x-hidden">
      {/* The page background is the halftone dot grid set on <body> in globals.css.
          No sunburst/smoke/vignette layers — design bible is clean dot-grid only. */}

      {shareMsg && (
        <ShareCard msg={shareMsg} onClose={() => setShareMsg(null)} />
      )}

      <Header />

      <main className="max-w-3xl w-full px-4 md:px-6 z-10">
        <ChatWindow
          ref={scrollRef}
          messages={messages}
          loading={loading}
          showPaywall={showPaywall}
          error={error}
          onSuggestion={(s: string) => sendMessage(s)}
          onShare={handleShare}
          input={input}
          onInputChange={setInput}
          onSend={() => sendMessage()}
          inputDisabled={loading || showPaywall}
          paywallActive={showPaywall}
          inputRef={inputRef}
          remaining={remaining}
          promptsAllowed={promptsAllowed}
        />
      </main>

      <Footer />
    </div>
  );
}
