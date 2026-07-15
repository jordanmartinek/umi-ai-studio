"use client";

import { CreativePreset, Selections } from "@/lib/types";

const PRESETS_KEY = "umi.creativePresets.v1";

function readAll(): CreativePreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PRESETS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(presets: CreativePreset[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function listPresets(generatorSlug: string): CreativePreset[] {
  return readAll()
    .filter((p) => p.generatorSlug === generatorSlug)
    .sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return a.name.localeCompare(b.name);
    });
}

export function getDefaultPreset(generatorSlug: string): CreativePreset | undefined {
  return listPresets(generatorSlug).find((p) => p.isDefault);
}

export function savePreset(input: {
  generatorSlug: string;
  name: string;
  selections: Selections;
}): CreativePreset {
  const now = new Date().toISOString();
  const preset: CreativePreset = {
    id: makeId(),
    generatorSlug: input.generatorSlug,
    name: input.name,
    selections: input.selections,
    isDefault: false,
    createdAt: now,
    updatedAt: now,
  };
  const all = readAll();
  all.push(preset);
  writeAll(all);
  return preset;
}

export function renamePreset(id: string, name: string): void {
  const all = readAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], name, updatedAt: new Date().toISOString() };
  writeAll(all);
}

export function updatePresetSelections(id: string, selections: Selections): void {
  const all = readAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], selections, updatedAt: new Date().toISOString() };
  writeAll(all);
}

export function duplicatePreset(id: string): CreativePreset | undefined {
  const all = readAll();
  const source = all.find((p) => p.id === id);
  if (!source) return undefined;
  const now = new Date().toISOString();
  const copy: CreativePreset = {
    ...source,
    id: makeId(),
    name: `${source.name} (copy)`,
    isDefault: false,
    createdAt: now,
    updatedAt: now,
  };
  all.push(copy);
  writeAll(all);
  return copy;
}

export function deletePreset(id: string): void {
  const all = readAll().filter((p) => p.id !== id);
  writeAll(all);
}

export function setDefaultPreset(generatorSlug: string, id: string | null): void {
  const all = readAll().map((p) => {
    if (p.generatorSlug !== generatorSlug) return p;
    return { ...p, isDefault: p.id === id };
  });
  writeAll(all);
}

/** Encodes a preset as a shareable, URL-safe string (base64 JSON). */
export function encodePresetForSharing(preset: CreativePreset): string {
  const payload = {
    generatorSlug: preset.generatorSlug,
    name: preset.name,
    selections: preset.selections,
  };
  const json = JSON.stringify(payload);
  if (typeof window !== "undefined" && "btoa" in window) {
    return window.btoa(unescape(encodeURIComponent(json)));
  }
  return Buffer.from(json, "utf-8").toString("base64");
}

/** Decodes a shared preset string back into a savable payload. Returns null if invalid. */
export function decodeSharedPreset(
  encoded: string
): { generatorSlug: string; name: string; selections: Selections } | null {
  try {
    const json =
      typeof window !== "undefined" && "atob" in window
        ? decodeURIComponent(escape(window.atob(encoded)))
        : Buffer.from(encoded, "base64").toString("utf-8");
    const parsed = JSON.parse(json);
    if (
      typeof parsed?.generatorSlug === "string" &&
      typeof parsed?.name === "string" &&
      typeof parsed?.selections === "object"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function importSharedPreset(encoded: string): CreativePreset | null {
  const decoded = decodeSharedPreset(encoded);
  if (!decoded) return null;
  return savePreset(decoded);
}
