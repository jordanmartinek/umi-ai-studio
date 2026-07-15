"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LaunchPackage } from "@/lib/bracelet/types";
import { generateLaunchPackage } from "@/lib/bracelet/launch-package-generator";
import {
  getConcept,
  getLaunchPackageForConcept,
  saveLaunchPackage,
} from "@/lib/bracelet/design-board-storage";
import { loadOrSeedBrandProfile } from "@/lib/storage";
import { useLocale } from "@/lib/i18n/locale-context";

export default function LaunchPackagePage() {
  const params = useParams<{ conceptId: string }>();
  const router = useRouter();
  const { dict, locale } = useLocale();
  const copy = dict.bracelets.launchPackage;

  const brand = useMemo(() => loadOrSeedBrandProfile(locale), [locale]);
  const concept = useMemo(() => getConcept(params.conceptId), [params.conceptId]);

  const [pkg, setPkg] = useState<LaunchPackage | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!concept) return;
    const existing = getLaunchPackageForConcept(concept.id);
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPkg(existing);
      setSaved(true);
      return;
    }
    const generated = generateLaunchPackage(concept, brand);
    setPkg(generated);
    setSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concept?.id]);

  function handleRegenerate() {
    if (!concept) return;
    const generated = generateLaunchPackage(concept, brand);
    setPkg(generated);
    setSaved(false);
  }

  function handleSave() {
    if (!pkg) return;
    saveLaunchPackage(pkg);
    setSaved(true);
  }

  if (!concept) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-espresso">{dict.generatorPage.notBuiltTitle}</h1>
        <Link href="/bracelets" className="mt-6 inline-block">
          <Button variant="secondary">
            <ArrowLeft className="h-4 w-4" /> {copy.backToConcept}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-taupe hover:text-espresso"
      >
        <ArrowLeft className="h-4 w-4" /> {copy.backToConcept}
      </button>

      <div className="mb-10 max-w-2xl">
        <p className="mb-2 font-accent text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {copy.eyebrow}
        </p>
        <h1 className="font-display text-3xl text-espresso sm:text-4xl">
          {concept.name} — {copy.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-taupe">{copy.subtitle}</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={handleRegenerate}>
          {copy.regenerate}
        </Button>
        <Button variant={saved ? "secondary" : "primary"} onClick={handleSave} disabled={saved}>
          {saved ? copy.saved : copy.save}
        </Button>
      </div>

      {pkg ? (
        <div className="space-y-10">
          <Section title={copy.sections.product}>
            <Item label={copy.fields.productName} value={pkg.product.productName} />
            <Item label={copy.fields.collectionName} value={pkg.product.collectionName} />
            <Item label={copy.fields.description} value={pkg.product.description} multiline />
            <Item label={copy.fields.shortDescription} value={pkg.product.shortDescription} multiline />
            <Item label={copy.fields.productStory} value={pkg.product.productStory} multiline />
          </Section>

          <Section title={copy.sections.marketing}>
            <Item label={copy.fields.instagramCaption} value={pkg.marketing.instagramCaption} multiline />
            <Item label={copy.fields.facebookCaption} value={pkg.marketing.facebookCaption} multiline />
            <Item label={copy.fields.pinterestDescription} value={pkg.marketing.pinterestDescription} multiline />
            <Item label={copy.fields.etsyDescription} value={pkg.marketing.etsyDescription} multiline />
            <Item label={copy.fields.shopifyDescription} value={pkg.marketing.shopifyDescription} multiline />
            <Item label={copy.fields.seoTitle} value={pkg.marketing.seoTitle} />
            <Item label={copy.fields.metaDescription} value={pkg.marketing.metaDescription} multiline />
            <Item label={copy.fields.seoKeywords} value={pkg.marketing.seoKeywords.join(", ")} />
            <Item label={copy.fields.hashtags} value={pkg.marketing.hashtags.join(" ")} />
          </Section>

          <Section title={copy.sections.photography}>
            <Item label={copy.fields.studioProductPhoto} value={pkg.photography.studioProductPhoto} multiline />
            <Item label={copy.fields.lifestylePhoto} value={pkg.photography.lifestylePhoto} multiline />
            <Item label={copy.fields.flatLay} value={pkg.photography.flatLay} multiline />
            <Item label={copy.fields.editorialCampaign} value={pkg.photography.editorialCampaign} multiline />
            <Item label={copy.fields.holidayVersion} value={pkg.photography.holidayVersion} multiline />
            <Item label={copy.fields.macroDetailShot} value={pkg.photography.macroDetailShot} multiline />
            <Item label={copy.fields.packagingShot} value={pkg.photography.packagingShot} multiline />
            <Item label={copy.fields.onWristLifestyle} value={pkg.photography.onWristLifestyle} multiline />
            <Item label={copy.fields.pinterestImage} value={pkg.photography.pinterestImage} multiline />
            <Item label={copy.fields.instagramCarousel} value={pkg.photography.instagramCarousel} multiline />
          </Section>

          <Section title={copy.sections.video}>
            <Item label={copy.fields.instagramReel} value={pkg.video.instagramReel} multiline />
            <Item label={copy.fields.tiktok} value={pkg.video.tiktok} multiline />
            <Item label={copy.fields.youtubeShorts} value={pkg.video.youtubeShorts} multiline />
            <Item label={copy.fields.behindTheScenes} value={pkg.video.behindTheScenes} multiline />
            <Item label={copy.fields.braceletMakingProcess} value={pkg.video.braceletMakingProcess} multiline />
            <Item label={copy.fields.packagingVideo} value={pkg.video.packagingVideo} multiline />
          </Section>

          <Section title={copy.sections.branding}>
            <Item label={copy.fields.packagingCardMessage} value={pkg.branding.packagingCardMessage} multiline />
            <Item label={copy.fields.thankYouCard} value={pkg.branding.thankYouCard} multiline />
            <Item label={copy.fields.collectionIntroduction} value={pkg.branding.collectionIntroduction} multiline />
            <Item label={copy.fields.websiteBannerCopy} value={pkg.branding.websiteBannerCopy} multiline />
            <Item
              label={copy.fields.emailLaunchAnnouncement}
              value={pkg.branding.emailLaunchAnnouncement}
              multiline
            />
          </Section>
        </div>
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-display text-xl text-espresso">{title}</h2>
      <Card className="divide-y divide-line p-0">{children}</Card>
    </div>
  );
}

function Item({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  const { dict } = useLocale();
  const copy = dict.bracelets.launchPackage;
  const [copied, setCopied] = useState(false);

  if (!value) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable; ignore
    }
  }

  return (
    <div className="flex items-start justify-between gap-4 p-4">
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-taupe">{label}</div>
        <p
          className={cn(
            "mt-1 text-sm leading-relaxed text-espresso",
            multiline ? "whitespace-pre-wrap" : ""
          )}
        >
          {value}
        </p>
      </div>
      <button
        onClick={handleCopy}
        className={cn(
          "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-all",
          copied
            ? "border-forest bg-forest-soft text-forest"
            : "border-line bg-white text-espresso hover:border-gold hover:bg-gold-soft/40"
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">{copied ? copy.copied : copy.copy}</span>
      </button>
    </div>
  );
}
