"use client";

import { GenerationMode } from "@/lib/types";

export interface SavedPrompt {
  id: string;
  /** Generator slug (e.g. "image", "caption") or "enhancer" for enhanced prompts. */
  sourceSlug: string;
  /** Human-readable label for the source, e.g. "Image", "Caption", "Enhancer". */
  sourceLabel: string;
  mode: GenerationMode;
  text: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

const LIBRARY_KEY = "umi.promptLibrary.v1";

function readAll(): SavedPrompt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LIBRARY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(prompts: SavedPrompt[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LIBRARY_KEY, JSON.stringify(prompts));
}

export function listSavedPrompts(): SavedPrompt[] {
  return readAll().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function savePrompt(input: {
  sourceSlug: string;
  sourceLabel: string;
  mode: GenerationMode;
  text: string;
}): SavedPrompt {
  const now = new Date().toISOString();
  const entry: SavedPrompt = {
    id: makeId(),
    favorite: false,
    createdAt: now,
    updatedAt: now,
    ...input,
  };
  const all = readAll();
  all.push(entry);
  writeAll(all);
  return entry;
}

export function updatePrompt(id: string, text: string): void {
  const all = readAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], text, updatedAt: new Date().toISOString() };
  writeAll(all);
}

export function toggleFavorite(id: string): void {
  const all = readAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], favorite: !all[idx].favorite };
  writeAll(all);
}

export function duplicatePrompt(id: string): SavedPrompt | undefined {
  const all = readAll();
  const source = all.find((p) => p.id === id);
  if (!source) return undefined;
  const now = new Date().toISOString();
  const copy: SavedPrompt = { ...source, id: makeId(), createdAt: now, updatedAt: now, favorite: false };
  all.push(copy);
  writeAll(all);
  return copy;
}

export function removePrompt(id: string): void {
  const all = readAll().filter((p) => p.id !== id);
  writeAll(all);
}

// --- Export helpers -------------------------------------------------------

export function toMarkdown(prompt: SavedPrompt): string {
  return `### ${prompt.sourceLabel} — ${prompt.mode}\n\n${prompt.text}\n`;
}

export function toPlainText(prompt: SavedPrompt): string {
  return prompt.text;
}

export function toJson(prompt: SavedPrompt): string {
  return JSON.stringify(prompt, null, 2);
}

export type ExportFormat = "markdown" | "txt" | "json";

export function buildExport(
  format: ExportFormat,
  prompt: { sourceLabel: string; mode: GenerationMode; text: string }
): { content: string; filename: string; mimeType: string } {
  const slug = prompt.sourceLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  switch (format) {
    case "markdown":
      return {
        content: `### ${prompt.sourceLabel} — ${prompt.mode}\n\n${prompt.text}\n`,
        filename: `umi-${slug}-${prompt.mode}.md`,
        mimeType: "text/markdown",
      };
    case "json":
      return {
        content: JSON.stringify(prompt, null, 2),
        filename: `umi-${slug}-${prompt.mode}.json`,
        mimeType: "application/json",
      };
    case "txt":
    default:
      return {
        content: prompt.text,
        filename: `umi-${slug}-${prompt.mode}.txt`,
        mimeType: "text/plain",
      };
  }
}

export function downloadExport(format: ExportFormat, prompt: {
  sourceLabel: string;
  mode: GenerationMode;
  text: string;
}): void {
  if (typeof window === "undefined") return;
  const { content, filename, mimeType } = buildExport(format, prompt);
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
