import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { ME } from "@/lib/data";

const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Instrument_Serif({
  subsets: ["latin"], weight: "400", style: ["normal", "italic"],
  variable: "--font-display", display: "swap",
});

export const metadata: Metadata = {
  title: `${ME.name} · ${ME.role}`,
  description: ME.lede,
  openGraph: { title: `${ME.name} · ${ME.role}`, description: ME.lede, type: "website" },
};

export const viewport: Viewport = { themeColor: "#08080b", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-fg focus:px-4 focus:py-2 focus:font-medium focus:text-bg"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
