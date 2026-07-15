"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BraceletCollection, BraceletConcept, LaunchPackage } from "@/lib/bracelet/types";
import {
  listSavedCollections,
  listSavedConcepts,
  listSavedLaunchPackages,
  removeCollection,
  removeConcept,
  removeLaunchPackage,
} from "@/lib/bracelet/design-board-storage";
import { useLocale } from "@/lib/i18n/locale-context";

type Tab = "concepts" | "collections" | "launchPackages";

export default function DesignBoardPage() {
  const { dict, locale } = useLocale();
  const copy = dict.bracelets.designBoard;

  const [tab, setTab] = useState<Tab>("concepts");
  const [concepts, setConcepts] = useState<BraceletConcept[]>([]);
  const [collections, setCollections] = useState<BraceletCollection[]>([]);
  const [launchPackages, setLaunchPackages] = useState<LaunchPackage[]>([]);

  useEffect(() => {
    // Client-only hydration from localStorage after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConcepts(listSavedConcepts());
    setCollections(listSavedCollections());
    setLaunchPackages(listSavedLaunchPackages());
  }, []);

  function handleRemoveConcept(id: string) {
    removeConcept(id);
    setConcepts(listSavedConcepts());
    setLaunchPackages(listSavedLaunchPackages());
  }

  function handleRemoveCollection(id: string) {
    removeCollection(id);
    setCollections(listSavedCollections());
  }

  function handleRemoveLaunchPackage(id: string) {
    removeLaunchPackage(id);
    setLaunchPackages(listSavedLaunchPackages());
  }

  const dateFormatter = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
    dateStyle: "medium",
  });

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "concepts", label: copy.tabConcepts, count: concepts.length },
    { id: "collections", label: copy.tabCollections, count: collections.length },
    { id: "launchPackages", label: copy.tabLaunchPackages, count: launchPackages.length },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/bracelets"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-taupe hover:text-espresso"
      >
        <ArrowLeft className="h-4 w-4" /> {copy.goToGenerator}
      </Link>

      <div className="mb-8 max-w-2xl">
        <p className="mb-2 font-accent text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {copy.eyebrow}
        </p>
        <h1 className="font-display text-3xl text-espresso sm:text-4xl">{copy.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-taupe">{copy.subtitle}</p>
      </div>

      <div className="mb-8 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id ? "bg-espresso text-cream" : "bg-white text-taupe hover:text-espresso border border-line"
            )}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {tab === "concepts" ? (
        concepts.length === 0 ? (
          <EmptyState message={copy.emptyConcepts} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {concepts.map((concept) => (
              <Card key={concept.id} className="flex flex-col justify-between p-5">
                <div>
                  <h3 className="font-display text-lg text-espresso">{concept.name}</h3>
                  <p className="mt-1 text-xs text-taupe">
                    {concept.theme} &middot; {concept.style}
                  </p>
                  <p className="mt-3 text-xs text-taupe">
                    {copy.savedOn} {dateFormatter.format(new Date(concept.createdAt))}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/bracelets/launch/${concept.id}`} className="flex-1">
                    <Button variant="secondary" className="w-full">
                      {copy.view}
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleRemoveConcept(concept.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-taupe transition-colors hover:border-red-300 hover:text-red-600"
                    aria-label={copy.delete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : null}

      {tab === "collections" ? (
        collections.length === 0 ? (
          <EmptyState message={copy.emptyCollections} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <Card key={collection.id} className="flex flex-col justify-between p-5">
                <div>
                  <h3 className="font-display text-lg text-espresso">{collection.collectionName}</h3>
                  <p className="mt-1 text-xs text-taupe">
                    {collection.theme} &middot; {collection.pieces.length} {copy.pieces}
                  </p>
                  <p className="mt-3 text-xs text-taupe">
                    {copy.savedOn} {dateFormatter.format(new Date(collection.createdAt))}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleRemoveCollection(collection.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-taupe transition-colors hover:border-red-300 hover:text-red-600"
                    aria-label={copy.delete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : null}

      {tab === "launchPackages" ? (
        launchPackages.length === 0 ? (
          <EmptyState message={copy.emptyLaunchPackages} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {launchPackages.map((pkg) => (
              <Card key={pkg.id} className="flex flex-col justify-between p-5">
                <div>
                  <h3 className="font-display text-lg text-espresso">{pkg.conceptName}</h3>
                  <p className="mt-3 text-xs text-taupe">
                    {copy.savedOn} {dateFormatter.format(new Date(pkg.createdAt))}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/bracelets/launch/${pkg.conceptId}`} className="flex-1">
                    <Button variant="secondary" className="w-full">
                      {copy.view}
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleRemoveLaunchPackage(pkg.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-taupe transition-colors hover:border-red-300 hover:text-red-600"
                    aria-label={copy.delete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : null}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
      <p className="mx-auto max-w-xs text-sm text-taupe">{message}</p>
    </div>
  );
}
