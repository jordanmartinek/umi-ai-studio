"use client";

import { useMemo, useState } from "react";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { SectionLabel } from "@/components/ui/section";
import { PromptOutput } from "@/components/generator/prompt-output";
import { useLocale } from "@/lib/i18n/locale-context";
import { loadOrSeedBrandProfile } from "@/lib/storage";
import { enhancePrompt, EnhancerContentType, guessContentType } from "@/lib/enhancer";
import { GenerationMode } from "@/lib/types";

export default function EnhancePage() {
  const { dict } = useLocale();
  const brand = useMemo(() => loadOrSeedBrandProfile(), []);

  const [input, setInput] = useState("");
  const [contentType, setContentType] = useState<EnhancerContentType>("image");
  const [contentTypeTouched, setContentTypeTouched] = useState(false);
  const [results, setResults] = useState<Record<GenerationMode, string> | null>(null);

  function handleInputChange(value: string) {
    setInput(value);
    if (!contentTypeTouched && value.trim().length > 8) {
      setContentType(guessContentType(value));
    }
  }

  function handleContentTypeChange(type: EnhancerContentType) {
    setContentType(type);
    setContentTypeTouched(true);
  }

  function handleEnhance() {
    if (!input.trim()) return;
    setResults(enhancePrompt(input, contentType, brand));
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 max-w-2xl">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-soft text-espresso">
          <Wand2 className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {dict.enhance.eyebrow}
        </p>
        <h1 className="font-display text-3xl text-espresso sm:text-4xl">
          {dict.enhance.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-taupe">{dict.enhance.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
        <div className="space-y-8">
          <div>
            <SectionLabel>{dict.enhance.contentTypeLabel}</SectionLabel>
            <div className="flex flex-wrap gap-2">
              <Chip
                selected={contentType === "image"}
                onClick={() => handleContentTypeChange("image")}
              >
                {dict.enhance.contentTypeImage}
              </Chip>
              <Chip
                selected={contentType === "text"}
                onClick={() => handleContentTypeChange("text")}
              >
                {dict.enhance.contentTypeText}
              </Chip>
            </div>
          </div>

          <div>
            <SectionLabel>{dict.enhance.inputLabel}</SectionLabel>
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={dict.enhance.inputPlaceholder}
              rows={6}
              className="w-full resize-none rounded-xl border border-line bg-white px-4 py-3 text-sm text-espresso placeholder:text-taupe-light focus:border-gold focus:outline-none"
            />
          </div>

          <Button
            size="lg"
            onClick={handleEnhance}
            disabled={!input.trim()}
            className="w-full sm:w-auto"
          >
            <Wand2 className="h-4 w-4" />
            {dict.enhance.enhanceButton}
          </Button>
          {!input.trim() ? (
            <p className="text-xs text-taupe">{dict.enhance.inputRequired}</p>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <PromptOutput results={results} sourceSlug="enhancer" sourceLabel="Enhancer" />
        </div>
      </div>
    </div>
  );
}
