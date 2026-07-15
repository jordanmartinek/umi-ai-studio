"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { dict } = useLocale();

  const navLinks = [
    { href: "/", label: dict.nav.studio },
    { href: "/library", label: dict.nav.library },
    { href: "/templates", label: dict.nav.templates },
    { href: "/enhance", label: dict.nav.enhancer },
    { href: "/brand", label: dict.nav.brand },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 border-b-2 border-gold-soft bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="storybook-border flex h-8 w-8 items-center justify-center bg-espresso text-cream">
              <Sparkles className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="font-display text-lg tracking-tight text-espresso">
              Umi AI Studio
            </span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-espresso text-cream"
                      : "text-taupe hover:bg-bone hover:text-espresso"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <LanguageToggle />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line py-8 text-center text-xs text-taupe">
        Umi AI Studio &mdash; a creative prompt assistant for Umi Accessories.
      </footer>
    </div>
  );
}

function LanguageToggle() {
  const { locale, setLocale, dict } = useLocale();

  return (
    <div
      className="flex shrink-0 items-center rounded-full border border-line bg-white p-0.5 text-xs font-semibold"
      role="group"
      aria-label={dict.nav.language}
    >
      <button
        onClick={() => setLocale("en")}
        className={cn(
          "rounded-full px-2.5 py-1.5 transition-colors",
          locale === "en" ? "bg-espresso text-cream" : "text-taupe hover:text-espresso"
        )}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <button
        onClick={() => setLocale("es")}
        className={cn(
          "rounded-full px-2.5 py-1.5 transition-colors",
          locale === "es" ? "bg-espresso text-cream" : "text-taupe hover:text-espresso"
        )}
        aria-pressed={locale === "es"}
      >
        ES
      </button>
    </div>
  );
}
