import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Klee_One } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { GhibliBackdrop } from "@/components/ghibli-backdrop";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

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
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Umi Studio",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4ea6bb",
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
        <ServiceWorkerRegistration />
        <LocaleProvider>
          <AppShell>{children}</AppShell>
        </LocaleProvider>
      </body>
    </html>
  );
}
