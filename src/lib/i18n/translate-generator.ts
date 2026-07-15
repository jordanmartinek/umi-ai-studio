import { Dictionary } from "@/lib/i18n/dictionaries";
import { FilterGroup } from "@/lib/types";

/**
 * Generator blueprints (src/lib/generators/*) always store canonical English
 * option labels, because those labels are also used by the prompt-composition
 * logic — and English remains the most reliable language for prompting most
 * AI image/text models regardless of the UI language.
 *
 * These helpers translate the *display* labels shown in the UI (chips,
 * section headers, placeholders) based on the active locale, while leaving
 * the underlying group/option ids — and the English strings used inside
 * composed prompts — untouched.
 */

type GeneratorDict = Dictionary["generators"][keyof Dictionary["generators"]];

function getGeneratorDict(dict: Dictionary, generatorSlug: string): GeneratorDict | undefined {
  const key = camelCase(generatorSlug);
  return (dict.generators as Record<string, GeneratorDict>)[key];
}

function camelCase(slug: string): string {
  return slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

export function translateGroupLabel(
  dict: Dictionary,
  generatorSlug: string,
  group: FilterGroup
): string {
  const genDict = getGeneratorDict(dict, generatorSlug);
  const groupDict = genDict?.groups[group.id as keyof typeof genDict.groups] as
    | { label?: string }
    | undefined;
  return groupDict?.label ?? group.label;
}

export function translateGroupHelper(
  dict: Dictionary,
  generatorSlug: string,
  group: FilterGroup
): string | undefined {
  const genDict = getGeneratorDict(dict, generatorSlug);
  const groupDict = genDict?.groups[group.id as keyof typeof genDict.groups] as
    | { helper?: string }
    | undefined;
  return groupDict?.helper ?? group.helper;
}

export function translateCustomPlaceholder(
  dict: Dictionary,
  generatorSlug: string,
  group: FilterGroup
): string {
  const genDict = getGeneratorDict(dict, generatorSlug);
  const groupDict = genDict?.groups[group.id as keyof typeof genDict.groups] as
    | { customPlaceholder?: string }
    | undefined;
  return (
    groupDict?.customPlaceholder ??
    group.customPlaceholder ??
    dict.generatorPage.customPlaceholderDefault
  );
}

export function translateOptionLabel(
  dict: Dictionary,
  generatorSlug: string,
  groupId: string,
  optionId: string,
  fallback: string
): string {
  const genDict = getGeneratorDict(dict, generatorSlug);
  const groupDict = genDict?.groups[groupId as keyof typeof genDict.groups] as
    | { options?: Record<string, string> }
    | undefined;
  return groupDict?.options?.[optionId] ?? fallback;
}

export function translatePlatformLabel(dict: Dictionary, platformId: string, fallback: string): string {
  return (dict.platforms as Record<string, string>)[platformId] ?? fallback;
}
