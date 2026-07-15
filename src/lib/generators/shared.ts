import { CONTENT_GOALS, FilterGroup, Locale, WRITING_PERSONALITIES } from "@/lib/types";
import { personalityPhrase, selectedLabelsLocalized } from "@/lib/prompt-engine";

/**
 * Shared filter groups reused across every text generator (Caption, Story,
 * Reply, Product Description, Poll). Keeping these in one place means the
 * "Writing Personality" and "Goal" taxonomies stay perfectly consistent
 * everywhere, and any future generator gets them for free.
 */

export function personalityGroup(categoryId?: string): FilterGroup {
  return {
    id: "personality",
    label: "Writing Personality",
    helper: "Combine two or three traits for a distinctive, on-brand voice.",
    multiple: true,
    searchable: true,
    optional: true,
    categoryId,
    options: WRITING_PERSONALITIES.map((p) => ({ id: p.id, label: p.label })),
  };
}

export function goalGroup(categoryId?: string): FilterGroup {
  return {
    id: "contentGoal",
    label: "Goal",
    optional: true,
    categoryId,
    options: CONTENT_GOALS.map((g) => ({ id: g.id, label: g.label })),
  };
}

/** Resolve the combined personality phrase (e.g. "an elegant yet witty tone") from selections,
 *  in the active locale. `generatorSlug` is needed to look up the correct translated trait
 *  labels from the dictionaries. */
export function resolvePersonalityPhrase(
  group: FilterGroup,
  selections: Record<string, string[]>,
  generatorSlug: string,
  locale: Locale = "en"
): string {
  const traits = selectedLabelsLocalized(group, selections, generatorSlug, locale);
  return personalityPhrase(traits, locale);
}
