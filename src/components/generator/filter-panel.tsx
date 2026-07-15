"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { FilterGroup, GeneratorBlueprint, Selections } from "@/lib/types";
import { CategorySection } from "@/components/generator/category-section";
import { FilterGroupControl } from "@/components/generator/filter-group";
import { useLocale } from "@/lib/i18n/locale-context";
import {
  loadFilterMemory,
  makeFilterKey,
  parseFilterKey,
  recordRecentFilter,
  toggleFavoriteFilter,
} from "@/lib/filter-memory";
import { translateOptionLabel } from "@/lib/i18n/translate-generator";
import { Chip } from "@/components/ui/chip";

interface Props {
  blueprint: GeneratorBlueprint;
  selections: Selections;
  onChange: (groupId: string, values: string[]) => void;
}

/**
 * Renders a generator's filters as a Lightroom/Figma-style panel: an always-
 * visible "Basics" section for uncategorized groups, followed by collapsible
 * CategorySections for everything else. Tracks per-option favorites and
 * recently-used filters in localStorage, scoped per generator.
 */
export function FilterPanel({ blueprint, selections, onChange }: Props) {
  const { dict } = useLocale();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    // One-time hydration of client-only state (localStorage) after mount.
    const memory = loadFilterMemory(blueprint.slug);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorites(new Set(memory.favorites));
    setRecents(memory.recents);
  }, [blueprint.slug]);

  function handleToggleFavorite(key: string) {
    const next = toggleFavoriteFilter(blueprint.slug, key);
    setFavorites(new Set(next.favorites));
  }

  function handleChange(groupId: string, values: string[]) {
    // Record the most recently toggled-on option as "recent" for quick reuse.
    const prev = new Set(selections[groupId] ?? []);
    const added = values.find((v) => !prev.has(v) && !v.startsWith("custom"));
    if (added) {
      const next = recordRecentFilter(blueprint.slug, makeFilterKey(groupId, added));
      setRecents(next.recents);
    }
    onChange(groupId, values);
  }

  const basics = blueprint.selectionGroups.filter((g) => !g.categoryId);
  const categories = blueprint.categories ?? [];

  const groupsByCategory = useMemo(() => {
    const map = new Map<string, FilterGroup[]>();
    for (const group of blueprint.selectionGroups) {
      if (!group.categoryId) continue;
      const list = map.get(group.categoryId) ?? [];
      list.push(group);
      map.set(group.categoryId, list);
    }
    return map;
  }, [blueprint.selectionGroups]);

  function countActive(groups: FilterGroup[]): number {
    return groups.reduce((sum, g) => sum + (selections[g.id]?.length ?? 0), 0);
  }

  const recentChips = recents
    .map((key) => {
      const { groupId, optionId } = parseFilterKey(key);
      const group = blueprint.selectionGroups.find((g) => g.id === groupId);
      const option = group?.options.find((o) => o.id === optionId);
      if (!group || !option) return null;
      return { group, option, key };
    })
    .filter((v): v is { group: FilterGroup; option: { id: string; label: string }; key: string } => v !== null)
    .slice(0, 8);

  function applyRecent(group: FilterGroup, optionId: string) {
    const current = selections[group.id] ?? [];
    if (current.includes(optionId)) return;
    const next = group.multiple ? [...current, optionId] : [optionId];
    handleChange(group.id, next);
  }

  return (
    <div className="space-y-6">
      {basics.length > 0 ? (
        <div className="space-y-6 rounded-2xl border border-line bg-white p-4">
          {basics.map((group) => (
            <FilterGroupControl
              key={group.id}
              generatorSlug={blueprint.slug}
              group={group}
              selections={selections}
              onChange={handleChange}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : null}

      {recentChips.length > 0 ? (
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-taupe">
            <Clock className="h-3.5 w-3.5" />
            {dict.generatorPage.recentlyUsed}
          </div>
          <div className="flex flex-wrap gap-2">
            {recentChips.map(({ group, option, key }) => (
              <Chip
                key={key}
                selected={(selections[group.id] ?? []).includes(option.id)}
                onClick={() => applyRecent(group, option.id)}
              >
                {translateOptionLabel(dict, blueprint.slug, group.id, option.id, option.label)}
              </Chip>
            ))}
          </div>
        </div>
      ) : null}

      {categories.map((category) => {
        const groups = groupsByCategory.get(category.id) ?? [];
        if (groups.length === 0) return null;
        return (
          <CategorySection
            key={category.id}
            label={category.label}
            helper={category.helper}
            defaultOpen={category.defaultOpen}
            activeCount={countActive(groups)}
          >
            {groups.map((group) => (
              <FilterGroupControl
                key={group.id}
                generatorSlug={blueprint.slug}
                group={group}
                selections={selections}
                onChange={handleChange}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </CategorySection>
        );
      })}
    </div>
  );
}
