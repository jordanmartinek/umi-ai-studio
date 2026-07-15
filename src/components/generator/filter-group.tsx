"use client";

import { useState } from "react";
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

interface Props {
  generatorSlug: string;
  group: FilterGroupType;
  selections: Selections;
  onChange: (groupId: string, values: string[]) => void;
}

export function FilterGroupControl({ generatorSlug, group, selections, onChange }: Props) {
  const { dict } = useLocale();
  const selected = selections[group.id] ?? [];
  const customValue =
    selected.find((v) => v.startsWith("custom:"))?.slice("custom:".length) ?? "";
  const [customText, setCustomText] = useState(customValue);
  const isCustomActive = selected.some((v) => v.startsWith("custom:") || v === "custom");

  const label = translateGroupLabel(dict, generatorSlug, group);
  const helper = translateGroupHelper(dict, generatorSlug, group);
  const placeholder = translateCustomPlaceholder(dict, generatorSlug, group);

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
      <div className="flex flex-wrap gap-2">
        {group.options.map((opt) => (
          <Chip
            key={opt.id}
            selected={selected.includes(opt.id)}
            onClick={() => toggleOption(opt.id)}
          >
            {translateOptionLabel(dict, generatorSlug, group.id, opt.id, opt.label)}
          </Chip>
        ))}
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
