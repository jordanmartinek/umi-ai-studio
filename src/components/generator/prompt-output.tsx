"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy, Save, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { GenerationMode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale-context";
import { downloadExport, savePrompt, ExportFormat } from "@/lib/library-storage";

interface Props {
  results: Record<GenerationMode, string> | null;
  /** Identifies where this prompt came from, e.g. "image", "caption", "enhancer". */
  sourceSlug: string;
  /** Human-readable label for the source, used in the library and exports. */
  sourceLabel: string;
}

const MODE_IDS: GenerationMode[] = ["reliable", "creative", "viral"];

export function PromptOutput({ results, sourceSlug, sourceLabel }: Props) {
  const { dict } = useLocale();
  const [active, setActive] = useState<GenerationMode>("reliable");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Reset transient "copied"/"saved" state whenever a brand-new result set
  // arrives, using React's recommended render-time state adjustment pattern
  // (rather than an effect) to avoid a redundant extra render.
  const [prevResults, setPrevResults] = useState(results);
  if (results !== prevResults) {
    setPrevResults(results);
    setSaved(false);
    setCopied(false);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!results) {
    return (
      <Card className="flex h-full min-h-[360px] flex-col items-center justify-center gap-3 border-dashed p-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-soft text-espresso">
          <Sparkles className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <p className="max-w-xs text-sm text-taupe">{dict.promptOutput.emptyHint}</p>
      </Card>
    );
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(results![active]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable; ignore
    }
  }

  function handleSave() {
    savePrompt({ sourceSlug, sourceLabel, mode: active, text: results![active] });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function handleExport(format: ExportFormat) {
    downloadExport(format, { sourceLabel, mode: active, text: results![active] });
    setExportOpen(false);
  }

  return (
    <Card className="flex h-full flex-col p-6">
      <div className="mb-4 flex gap-2">
        {MODE_IDS.map((modeId) => {
          const mode = dict.modes[modeId];
          return (
            <button
              key={modeId}
              onClick={() => {
                setActive(modeId);
                setSaved(false);
                setCopied(false);
              }}
              className={cn(
                "flex-1 rounded-xl border px-3 py-2.5 text-left transition-all",
                active === modeId
                  ? "border-gold bg-gold-soft/40"
                  : "border-line bg-white hover:border-taupe-light"
              )}
            >
              <div className="text-sm font-semibold text-espresso">{mode.label}</div>
              <div className="mt-0.5 text-[11px] leading-tight text-taupe">
                {mode.description}
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative flex-1 rounded-xl border border-line bg-bone/50 p-5">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-espresso">
          {results[active]}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleCopy}
          className={cn(
            "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-sm font-medium transition-all",
            copied ? "bg-forest text-white" : "bg-espresso text-cream hover:bg-espresso/90"
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? dict.promptOutput.copied : dict.promptOutput.copy}
        </button>

        <button
          onClick={handleSave}
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium transition-all",
            saved
              ? "border-forest bg-forest-soft text-forest"
              : "border-line bg-white text-espresso hover:border-gold hover:bg-gold-soft/40"
          )}
          title={dict.promptOutput.save}
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span className="hidden sm:inline">
            {saved ? dict.promptOutput.saved : dict.promptOutput.save}
          </span>
        </button>

        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setExportOpen((v) => !v)}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-line bg-white px-4 text-sm font-medium text-espresso transition-all hover:border-gold hover:bg-gold-soft/40"
          >
            {dict.promptOutput.export}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {exportOpen ? (
            <div className="absolute right-0 bottom-full z-10 mb-2 w-48 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-lg">
              <button
                onClick={() => handleExport("markdown")}
                className="block w-full px-4 py-2 text-left text-sm text-espresso hover:bg-bone"
              >
                {dict.promptOutput.exportMarkdown}
              </button>
              <button
                onClick={() => handleExport("txt")}
                className="block w-full px-4 py-2 text-left text-sm text-espresso hover:bg-bone"
              >
                {dict.promptOutput.exportTxt}
              </button>
              <button
                onClick={() => handleExport("json")}
                className="block w-full px-4 py-2 text-left text-sm text-espresso hover:bg-bone"
              >
                {dict.promptOutput.exportJson}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
