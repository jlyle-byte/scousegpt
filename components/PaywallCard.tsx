"use client";

import { useMemo } from "react";
import Avatar from "./Avatar";
import {
  PALETTE,
  PAYWALL,
  PAYWALL_PHRASES,
  STRIPE,
  CHARACTER_NAME,
  CASE_SESSION_WARNING,
} from "@/lib/constants";

export default function PaywallCard() {
  const phrase = useMemo(
    () =>
      PAYWALL_PHRASES[Math.floor(Math.random() * PAYWALL_PHRASES.length)],
    []
  );

  return (
    <div className="msg-in">
      <div className="flex items-start gap-4 mb-4">
        <Avatar />
        <div className="flex-1">
          <p className="stamp mb-1" style={{ color: "rgba(26,20,16,0.7)" }}>
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
            {phrase}
          </p>
        </div>
      </div>

      <div className="ml-16 slide-up flex flex-col gap-3">
        <a
          href={STRIPE.beerLink}
          target="_blank"
          rel="noopener noreferrer"
          className="beer-btn flex items-center justify-center gap-3"
        >
          Buy Tommy a pint — {PAYWALL.priceBeer}
          <span
            className="text-sm opacity-70 font-normal"
            style={{ fontFamily: "inherit" }}
          >
            ({PAYWALL.messagesPerBeer} more questions)
          </span>
        </a>

        <a
          href={STRIPE.caseLink}
          target="_blank"
          rel="noopener noreferrer"
          className="case-btn flex items-center justify-center gap-2"
        >
          Buy Tommy a full session — {PAYWALL.priceCase}
          <span
            className="text-sm opacity-80"
            style={{ fontFamily: "inherit" }}
          >
            ({PAYWALL.messagesPerCase} questions)
          </span>
        </a>

        <p
          className="serif italic text-sm text-center"
          style={{ color: "rgba(26,20,16,0.6)" }}
        >
          {CASE_SESSION_WARNING}
        </p>

        <p
          className="serif italic text-sm text-center"
          style={{ color: "rgba(26,20,16,0.5)" }}
        >
          Powered by Stripe · Secure payment · No account needed
        </p>
      </div>
    </div>
  );
}
