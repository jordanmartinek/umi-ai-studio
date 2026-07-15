import type { Metadata } from "next";
import { Inter, Fraunces, Klee_One } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { GhibliBackdrop } from "@/components/ghibli-backdrop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

// Klee One is a soft, hand-drawn Japanese-inspired typeface — used sparingly
// for small accent labels (eyebrows, badges) to lend a Ghibli-storybook
// warmth without compromising overall legibility or the premium feel.
const kleeOne = Klee_One({
  variable: "--font-klee",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Umi AI Studio",
  description:
    "An AI creative assistant that helps Umi Accessories generate professional, brand-consistent prompts for ChatGPT, Claude, Gemini, Midjourney, Ideogram, Flux, Stable Diffusion and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${kleeOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-espresso font-sans">
        <GhibliBackdrop />
        <LocaleProvider>
          <AppShell>{children}</AppShell>
        </LocaleProvider>
      </body>
    </html>
  );
}
