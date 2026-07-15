"use client";

import { BraceletCollection, BraceletConcept, LaunchPackage } from "@/lib/bracelet/types";

/**
 * The Design Board: localStorage persistence for saved bracelet concepts,
 * collections, and launch packages. Follows the exact same read/write
 * pattern as library-storage.ts and presets-storage.ts elsewhere in the app
 * (one JSON array per localStorage key, SSR-safe reads).
 */

const CONCEPTS_KEY = "umi.braceletConcepts.v1";
const COLLECTIONS_KEY = "umi.braceletCollections.v1";
const LAUNCH_PACKAGES_KEY = "umi.launchPackages.v1";

function readAll<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll<T>(key: string, items: T[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(items));
}

// --- Bracelet Concepts ------------------------------------------------------

export function listSavedConcepts(): BraceletConcept[] {
  return readAll<BraceletConcept>(CONCEPTS_KEY).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function saveConcept(concept: BraceletConcept): BraceletConcept {
  const all = readAll<BraceletConcept>(CONCEPTS_KEY);
  // Avoid duplicate saves if the same concept (by id) is saved twice.
  const filtered = all.filter((c) => c.id !== concept.id);
  filtered.push(concept);
  writeAll(CONCEPTS_KEY, filtered);
  return concept;
}

export function removeConcept(id: string): void {
  const all = readAll<BraceletConcept>(CONCEPTS_KEY).filter((c) => c.id !== id);
  writeAll(CONCEPTS_KEY, all);
  // Also remove any launch packages generated for this concept, so the
  // Design Board never shows an orphaned launch package.
  const packages = readAll<LaunchPackage>(LAUNCH_PACKAGES_KEY).filter((p) => p.conceptId !== id);
  writeAll(LAUNCH_PACKAGES_KEY, packages);
}

export function getConcept(id: string): BraceletConcept | undefined {
  return readAll<BraceletConcept>(CONCEPTS_KEY).find((c) => c.id === id);
}

export function isConceptSaved(id: string): boolean {
  return readAll<BraceletConcept>(CONCEPTS_KEY).some((c) => c.id === id);
}

// --- Bracelet Collections ---------------------------------------------------

export function listSavedCollections(): BraceletCollection[] {
  return readAll<BraceletCollection>(COLLECTIONS_KEY).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function saveCollection(collection: BraceletCollection): BraceletCollection {
  const all = readAll<BraceletCollection>(COLLECTIONS_KEY);
  const filtered = all.filter((c) => c.id !== collection.id);
  filtered.push(collection);
  writeAll(COLLECTIONS_KEY, filtered);
  return collection;
}

export function removeCollection(id: string): void {
  const all = readAll<BraceletCollection>(COLLECTIONS_KEY).filter((c) => c.id !== id);
  writeAll(COLLECTIONS_KEY, all);
}

export function getCollection(id: string): BraceletCollection | undefined {
  return readAll<BraceletCollection>(COLLECTIONS_KEY).find((c) => c.id === id);
}

export function isCollectionSaved(id: string): boolean {
  return readAll<BraceletCollection>(COLLECTIONS_KEY).some((c) => c.id === id);
}

// --- Launch Packages ---------------------------------------------------------

export function listSavedLaunchPackages(): LaunchPackage[] {
  return readAll<LaunchPackage>(LAUNCH_PACKAGES_KEY).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function saveLaunchPackage(pkg: LaunchPackage): LaunchPackage {
  const all = readAll<LaunchPackage>(LAUNCH_PACKAGES_KEY);
  const filtered = all.filter((p) => p.id !== pkg.id);
  filtered.push(pkg);
  writeAll(LAUNCH_PACKAGES_KEY, filtered);
  return pkg;
}

export function removeLaunchPackage(id: string): void {
  const all = readAll<LaunchPackage>(LAUNCH_PACKAGES_KEY).filter((p) => p.id !== id);
  writeAll(LAUNCH_PACKAGES_KEY, all);
}

export function getLaunchPackageForConcept(conceptId: string): LaunchPackage | undefined {
  return readAll<LaunchPackage>(LAUNCH_PACKAGES_KEY)
    .filter((p) => p.conceptId === conceptId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
}
