"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  Download,
  Heart,
  Library as LibraryIcon,
  Pencil,
  Trash2,
  Copy as DuplicateIcon,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { useLocale } from "@/lib/i18n/locale-context";
import {
  SavedPrompt,
  listSavedPrompts,
  toggleFavorite,
  duplicatePrompt,
  removePrompt,
  updatePrompt,
  downloadExport,
  ExportFormat,
} from "@/lib/library-storage";
import { cn } from "@/lib/utils";

export default function LibraryPage() {
  const { dict } = useLocale();
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    // One-time hydration of client-only state (localStorage) after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrompts(listSavedPrompts());
    setLoaded(true);
  }, []);

  function refresh() {
    setPrompts(listSavedPrompts());
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter((p) => {
      if (favoritesOnly && !p.favorite) return false;
      if (!q) return true;
      return (
        p.text.toLowerCase().includes(q) || p.sourceLabel.toLowerCase().includes(q)
      );
    });
  }, [prompts, query, favoritesOnly]);

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 max-w-2xl">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-soft text-espresso">
          <LibraryIcon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {dict.library.eyebrow}
        </p>
        <h1 className="font-display text-3xl text-espresso sm:text-4xl">
          {dict.library.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-taupe">{dict.library.subtitle}</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.library.searchPlaceholder}
          className="w-full rounded-full border border-line bg-white px-4 py-2.5 text-sm text-espresso placeholder:text-taupe-light focus:border-gold focus:outline-none sm:max-w-sm"
        />
        <div className="flex gap-2">
          <Chip selected={!favoritesOnly} onClick={() => setFavoritesOnly(false)}>
            {dict.library.filterAll}
          </Chip>
          <Chip selected={favoritesOnly} onClick={() => setFavoritesOnly(true)}>
            {dict.library.filterFavorites}
          </Chip>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-10 text-center text-sm text-taupe">
          {prompts.length === 0 ? dict.library.empty : dict.library.emptyFiltered}
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((prompt) => (
            <LibraryCard key={prompt.id} prompt={prompt} onChange={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}

function LibraryCard({ prompt, onChange }: { prompt: SavedPrompt; onChange: () => void }) {
  const { dict } = useLocale();
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(prompt.text);
  const [exportOpen, setExportOpen] = useState(false);

  const modeMeta = dict.modes[prompt.mode];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable; ignore
    }
  }

  function handleSaveEdit() {
    updatePrompt(prompt.id, draft);
    setEditing(false);
    onChange();
  }

  function handleExport(format: ExportFormat) {
    downloadExport(format, { sourceLabel: prompt.sourceLabel, mode: prompt.mode, text: prompt.text });
    setExportOpen(false);
  }

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gold-soft px-2.5 py-1 text-xs font-semibold text-espresso">
            {prompt.sourceLabel}
          </span>
          <span className="rounded-full bg-bone px-2.5 py-1 text-xs font-medium text-taupe">
            {modeMeta.label}
          </span>
          <span className="text-xs text-taupe">
            {dict.library.savedOn} {new Date(prompt.createdAt).toLocaleDateString()}
          </span>
        </div>
        <button
          onClick={() => {
            toggleFavorite(prompt.id);
            onChange();
          }}
          title={prompt.favorite ? dict.library.unfavorite : dict.library.favorite}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
            prompt.favorite ? "text-gold" : "text-taupe-light hover:text-gold"
          )}
        >
          <Heart className={cn("h-4 w-4", prompt.favorite && "fill-current")} />
        </button>
      </div>

      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={5}
          className="mb-3 w-full resize-none rounded-xl border border-line bg-white px-4 py-3 text-sm text-espresso focus:border-gold focus:outline-none"
        />
      ) : (
        <p className="mb-3 whitespace-pre-wrap text-sm leading-relaxed text-espresso">
          {prompt.text}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {editing ? (
          <>
            <button
              onClick={handleSaveEdit}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-espresso px-4 text-xs font-medium text-cream hover:bg-espresso/90"
            >
              <Check className="h-3.5 w-3.5" /> {dict.library.save}
            </button>
            <button
              onClick={() => {
                setDraft(prompt.text);
                setEditing(false);
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-xs font-medium text-taupe hover:text-espresso"
            >
              <X className="h-3.5 w-3.5" /> {dict.library.cancel}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleCopy}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-medium transition-colors",
                copied ? "bg-emerald-600 text-white" : "bg-espresso text-cream hover:bg-espresso/90"
              )}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? dict.library.copied : dict.library.copy}
            </button>
            <button
              onClick={() => setEditing(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-xs font-medium text-espresso hover:border-gold hover:bg-gold-soft/40"
            >
              <Pencil className="h-3.5 w-3.5" /> {dict.library.edit}
            </button>
            <button
              onClick={() => {
                duplicatePrompt(prompt.id);
                onChange();
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-xs font-medium text-espresso hover:border-gold hover:bg-gold-soft/40"
            >
              <DuplicateIcon className="h-3.5 w-3.5" /> {dict.library.duplicate}
            </button>
            <div className="relative">
              <button
                onClick={() => setExportOpen((v) => !v)}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-xs font-medium text-espresso hover:border-gold hover:bg-gold-soft/40"
              >
                <Download className="h-3.5 w-3.5" /> {dict.library.export}
              </button>
              {exportOpen ? (
                <div className="absolute left-0 top-full z-10 mt-2 w-44 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-lg">
                  <button
                    onClick={() => handleExport("markdown")}
                    className="block w-full px-4 py-2 text-left text-xs text-espresso hover:bg-bone"
                  >
                    Markdown (.md)
                  </button>
                  <button
                    onClick={() => handleExport("txt")}
                    className="block w-full px-4 py-2 text-left text-xs text-espresso hover:bg-bone"
                  >
                    Plain text (.txt)
                  </button>
                  <button
                    onClick={() => handleExport("json")}
                    className="block w-full px-4 py-2 text-left text-xs text-espresso hover:bg-bone"
                  >
                    JSON (.json)
                  </button>
                </div>
              ) : null}
            </div>
            <button
              onClick={() => {
                removePrompt(prompt.id);
                onChange();
              }}
              className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-taupe hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" /> {dict.library.delete}
            </button>
          </>
        )}
      </div>
    </Card>
  );
}
