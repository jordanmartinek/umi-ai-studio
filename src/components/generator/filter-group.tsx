"use client";

import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import { FilterGroup as FilterGroupType, Selections } from "@/lib/types";
import { Chip } from "@/components/ui/chip";
import { SectionLabel } from "@/components/ui/section";
import { useLocale } from "@/lib/i18n/locale-context";
import {
  translateCustomPlaceholder,
  translateGroupHelper,
  translateGroupLabel,
  translateOptionLabel,
} from "@/lib/i18n/translate-generator";
import { cn } from "@/lib/utils";
import { makeFilterKey } from "@/lib/filter-memory";

interface Props {
  generatorSlug: string;
  group: FilterGroupType;
  selections: Selections;
  onChange: (groupId: string, values: string[]) => void;
  favorites?: Set<string>;
  onToggleFavorite?: (key: string) => void;
}

const SEARCH_THRESHOLD = 8;

export function FilterGroupControl({
  generatorSlug,
  group,
  selections,
  onChange,
  favorites,
  onToggleFavorite,
}: Props) {
  const { dict } = useLocale();
  const selected = selections[group.id] ?? [];
  const customValue =
    selected.find((v) => v.startsWith("custom:"))?.slice("custom:".length) ?? "";
  const [customText, setCustomText] = useState(customValue);
  const [query, setQuery] = useState("");
  const isCustomActive = selected.some((v) => v.startsWith("custom:") || v === "custom");

  const label = translateGroupLabel(dict, generatorSlug, group);
  const helper = translateGroupHelper(dict, generatorSlug, group);
  const placeholder = translateCustomPlaceholder(dict, generatorSlug, group);

  const showSearch = group.searchable ?? group.options.length > SEARCH_THRESHOLD;

  const visibleOptions = useMemo(() => {
    if (!showSearch || !query.trim()) return group.options;
    const q = query.trim().toLowerCase();
    return group.options.filter((opt) => {
      const translated = translateOptionLabel(dict, generatorSlug, group.id, opt.id, opt.label);
      return translated.toLowerCase().includes(q) || opt.label.toLowerCase().includes(q);
    });
  }, [showSearch, query, group.options, group.id, dict, generatorSlug]);

  // Free-text groups (e.g. "paste the customer's comment") render as a
  // standalone textarea with no chips at all.
  if (group.freeText) {
    const value = customText;
    function updateFreeText(text: string) {
      setCustomText(text);
      onChange(group.id, text ? [`custom:${text}`] : []);
    }
    return (
      <div>
        <SectionLabel helper={helper}>{label}</SectionLabel>
        <textarea
          value={value}
          onChange={(e) => updateFreeText(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-espresso placeholder:text-taupe-light focus:border-gold focus:outline-none"
        />
      </div>
    );
  }

  function toggleOption(optionId: string) {
    const isSelected = selected.includes(optionId);
    if (group.multiple) {
      const next = isSelected
        ? selected.filter((v) => v !== optionId)
        : [...selected.filter((v) => !v.startsWith("custom")), optionId];
      onChange(group.id, next);
    } else {
      onChange(group.id, isSelected ? [] : [optionId]);
    }
  }

  function toggleCustom() {
    if (isCustomActive) {
      onChange(
        group.id,
        selected.filter((v) => !v.startsWith("custom"))
      );
    } else {
      const base = group.multiple ? selected.filter((v) => !v.startsWith("custom")) : [];
      onChange(group.id, [...base, customText ? `custom:${customText}` : "custom"]);
    }
  }

  function updateCustomText(text: string) {
    setCustomText(text);
    if (isCustomActive) {
      const base = selected.filter((v) => !v.startsWith("custom") && v !== "custom");
      onChange(group.id, [...base, text ? `custom:${text}` : "custom"]);
    }
  }

  return (
    <div>
      <SectionLabel helper={helper}>{label}</SectionLabel>
      {showSearch ? (
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-taupe-light" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.generatorPage.searchFilters}
            className="w-full rounded-full border border-line bg-bone/40 px-9 py-2 text-xs text-espresso placeholder:text-taupe-light focus:border-gold focus:outline-none"
          />
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {visibleOptions.map((opt) => {
          const key = makeFilterKey(group.id, opt.id);
          const isFav = favorites?.has(key);
          return (
            <div key={opt.id} className="group relative">
              <Chip selected={selected.includes(opt.id)} onClick={() => toggleOption(opt.id)}>
                {translateOptionLabel(dict, generatorSlug, group.id, opt.id, opt.label)}
              </Chip>
              {onToggleFavorite ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(key);
                  }}
                  title={dict.generatorPage.toggleFavorite}
                  className={cn(
                    "absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-taupe-light opacity-0 shadow-sm transition-opacity group-hover:opacity-100",
                    isFav && "text-gold opacity-100"
                  )}
                >
                  <Star className={cn("h-2.5 w-2.5", isFav && "fill-current")} />
                </button>
              ) : null}
            </div>
          );
        })}
        {visibleOptions.length === 0 ? (
          <p className="text-xs text-taupe-light">{dict.generatorPage.noMatches}</p>
        ) : null}
        {group.allowCustom ? (
          <Chip selected={isCustomActive} onClick={toggleCustom}>
            {dict.generatorPage.customLabel}
          </Chip>
        ) : null}
      </div>
      {group.allowCustom && isCustomActive ? (
        <input
          value={customText}
          onChange={(e) => updateCustomText(e.target.value)}
          placeholder={placeholder}
          className="mt-3 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-espresso placeholder:text-taupe-light focus:border-gold focus:outline-none"
        />
      ) : null}
    </div>
  );
}
