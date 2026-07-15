"use client";

import { FilterMemory, EMPTY_FILTER_MEMORY } from "@/lib/types";

const MEMORY_KEY_PREFIX = "umi.filterMemory.v1.";
const MAX_RECENTS = 12;

function keyFor(generatorSlug: string): string {
  return `${MEMORY_KEY_PREFIX}${generatorSlug}`;
}

export function loadFilterMemory(generatorSlug: string): FilterMemory {
  if (typeof window === "undefined") return EMPTY_FILTER_MEMORY;
  try {
    const raw = window.localStorage.getItem(keyFor(generatorSlug));
    if (!raw) return EMPTY_FILTER_MEMORY;
    const parsed = JSON.parse(raw);
    return {
      favorites: Array.isArray(parsed?.favorites) ? parsed.favorites : [],
      recents: Array.isArray(parsed?.recents) ? parsed.recents : [],
    };
  } catch {
    return EMPTY_FILTER_MEMORY;
  }
}

function writeFilterMemory(generatorSlug: string, memory: FilterMemory): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(keyFor(generatorSlug), JSON.stringify(memory));
}

export function toggleFavoriteFilter(generatorSlug: string, key: string): FilterMemory {
  const memory = loadFilterMemory(generatorSlug);
  const isFav = memory.favorites.includes(key);
  const next: FilterMemory = {
    ...memory,
    favorites: isFav ? memory.favorites.filter((k) => k !== key) : [...memory.favorites, key],
  };
  writeFilterMemory(generatorSlug, next);
  return next;
}

export function recordRecentFilter(generatorSlug: string, key: string): FilterMemory {
  const memory = loadFilterMemory(generatorSlug);
  const next: FilterMemory = {
    ...memory,
    recents: [key, ...memory.recents.filter((k) => k !== key)].slice(0, MAX_RECENTS),
  };
  writeFilterMemory(generatorSlug, next);
  return next;
}

export function makeFilterKey(groupId: string, optionId: string): string {
  return `${groupId}:${optionId}`;
}

export function parseFilterKey(key: string): { groupId: string; optionId: string } {
  const idx = key.indexOf(":");
  return { groupId: key.slice(0, idx), optionId: key.slice(idx + 1) };
}
