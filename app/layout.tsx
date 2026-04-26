import type { Metadata } from "next";
import { Bebas_Neue, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "./globals.css";

const display = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const body = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://scousegpt.com"),
  title: "Tommy la — sound advice from a proper Scouse lad",
  description:
    "Chat with Tommy la — a proper Scouse lad from Liverpool who gives sound advice on anything from heartbreak to debugging code. Fanzine cut-and-paste aesthetic, warm Scouse wit.",
  openGraph: {
    title: "Tommy la — sound advice from a proper Scouse lad",
    description:
      "Sound advice on anything from heartbreak to debugging code, in proper Scouse.",
    images: ["/og.png"],
    type: "website",
    url: "https://scousegpt.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tommy la — sound advice from a proper Scouse lad",
    description:
      "Sound advice on anything from heartbreak to debugging code, in proper Scouse.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        {children}
        <Analytics />
        {plausibleDomain && (
          <Script
            defer
            strategy="afterInteractive"
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
          />
        )}
      </body>
    </html>
  );
}
