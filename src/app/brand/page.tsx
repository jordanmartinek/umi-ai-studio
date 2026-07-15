"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { BrandProfile, EMPTY_BRAND_PROFILE } from "@/lib/types";
import { loadOrSeedBrandProfile, saveBrandProfile } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/locale-context";

const FIELD_KEYS: (keyof BrandProfile)[] = [
  "brandName",
  "tagline",
  "voice",
  "audience",
  "products",
  "materials",
  "colorPalette",
  "mission",
  "usp",
];

const TEXTAREA_FIELDS = new Set<keyof BrandProfile>(["mission", "usp"]);

export default function BrandProfilePage() {
  const { dict } = useLocale();
  const [profile, setProfile] = useState<BrandProfile>(EMPTY_BRAND_PROFILE);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // One-time hydration of client-only state (localStorage) after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(loadOrSeedBrandProfile());
    setLoaded(true);
  }, []);

  function update(key: keyof BrandProfile, value: string) {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    saveBrandProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="mb-2 font-accent text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        {dict.brandPage.eyebrow}
      </p>
      <h1 className="font-display text-3xl text-espresso sm:text-4xl">
        {dict.brandPage.title}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-taupe">
        {dict.brandPage.subtitle}
      </p>

      <Card className="mt-8 space-y-6 p-6 sm:p-8">
        {FIELD_KEYS.map((key) => {
          const field = dict.brandPage.fields[key];
          const isTextarea = TEXTAREA_FIELDS.has(key);
          return (
            <div key={key}>
              <label className="mb-1.5 block text-sm font-semibold text-espresso">
                {field.label}
              </label>
              {isTextarea ? (
                <textarea
                  value={profile[key]}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-espresso placeholder:text-taupe-light focus:border-gold focus:outline-none"
                />
              ) : (
                <input
                  value={profile[key]}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-espresso placeholder:text-taupe-light focus:border-gold focus:outline-none"
                />
              )}
            </div>
          );
        })}

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleSave}>{dict.brandPage.save}</Button>
          {saved ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-forest">
              <Check className="h-4 w-4" /> {dict.brandPage.saved}
            </span>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
