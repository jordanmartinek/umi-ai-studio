"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  Pencil,
  Save,
  SlidersHorizontal,
  Star,
  Trash2,
  Copy as DuplicateIcon,
  Upload,
  X,
} from "lucide-react";
import { CreativePreset, Selections } from "@/lib/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";
import {
  deletePreset,
  duplicatePreset,
  encodePresetForSharing,
  importSharedPreset,
  listPresets,
  renamePreset,
  savePreset,
  setDefaultPreset,
} from "@/lib/presets-storage";
import { Button } from "@/components/ui/button";

interface Props {
  generatorSlug: string;
  selections: Selections;
  onApply: (selections: Selections) => void;
}

/**
 * A compact bar above the filter panel for saving/applying Creative Presets
 * (e.g. "Umi Luxury Editorial"), plus a "Manage" button that opens the full
 * preset manager modal for rename/duplicate/delete/default/share/import.
 */
export function PresetBar({ generatorSlug, selections, onApply }: Props) {
  const { dict } = useLocale();
  const [presets, setPresets] = useState<CreativePreset[]>([]);
  const [manageOpen, setManageOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState("");
  const saveRef = useRef<HTMLDivElement>(null);

  function refresh() {
    setPresets(listPresets(generatorSlug));
  }

  useEffect(() => {
    // One-time hydration of client-only state (localStorage) after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatorSlug]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (saveRef.current && !saveRef.current.contains(e.target as Node)) {
        setSaveOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSave() {
    if (!name.trim()) return;
    savePreset({ generatorSlug, name: name.trim(), selections });
    setName("");
    setSaveOpen(false);
    refresh();
  }

  function handleApplyPreset(preset: CreativePreset) {
    onApply(preset.selections);
  }

  return (
    <div className="rounded-2xl border border-line bg-gold-soft/30 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 shrink-0 text-gold" />
        <span className="text-xs font-semibold text-espresso">{dict.presets.title}</span>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {presets.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {presets.slice(0, 4).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-espresso transition-colors hover:border-gold hover:bg-gold-soft/40"
                >
                  {preset.isDefault ? <Star className="h-3 w-3 fill-current text-gold" /> : null}
                  {preset.name}
                </button>
              ))}
            </div>
          ) : null}

          <div className="relative" ref={saveRef}>
            <Button size="sm" variant="secondary" onClick={() => setSaveOpen((v) => !v)}>
              <Save className="h-3.5 w-3.5" />
              {dict.presets.save}
            </Button>
            {saveOpen ? (
              <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-line bg-white p-3 shadow-lg">
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  placeholder={dict.presets.namePlaceholder}
                  className="mb-2 w-full rounded-lg border border-line px-3 py-2 text-sm text-espresso placeholder:text-taupe-light focus:border-gold focus:outline-none"
                />
                <Button size="sm" className="w-full" onClick={handleSave} disabled={!name.trim()}>
                  {dict.presets.saveAsNew}
                </Button>
              </div>
            ) : null}
          </div>

          <Button size="sm" variant="ghost" onClick={() => setManageOpen(true)}>
            {dict.presets.manage}
          </Button>
        </div>
      </div>

      {manageOpen ? (
        <PresetManagerModal
          generatorSlug={generatorSlug}
          presets={presets}
          onClose={() => setManageOpen(false)}
          onRefresh={refresh}
          onApply={handleApplyPreset}
        />
      ) : null}
    </div>
  );
}

function PresetManagerModal({
  generatorSlug,
  presets,
  onClose,
  onRefresh,
  onApply,
}: {
  generatorSlug: string;
  presets: CreativePreset[];
  onClose: () => void;
  onRefresh: () => void;
  onApply: (preset: CreativePreset) => void;
}) {
  const { dict } = useLocale();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [importValue, setImportValue] = useState("");
  const [importState, setImportState] = useState<"idle" | "success" | "error">("idle");

  function startRename(preset: CreativePreset) {
    setEditingId(preset.id);
    setDraftName(preset.name);
  }

  function commitRename() {
    if (editingId && draftName.trim()) {
      renamePreset(editingId, draftName.trim());
    }
    setEditingId(null);
    onRefresh();
  }

  function handleDuplicate(id: string) {
    duplicatePreset(id);
    onRefresh();
  }

  function handleDelete(id: string) {
    deletePreset(id);
    setConfirmDeleteId(null);
    onRefresh();
  }

  function handleToggleDefault(preset: CreativePreset) {
    setDefaultPreset(generatorSlug, preset.isDefault ? null : preset.id);
    onRefresh();
  }

  async function handleShare(preset: CreativePreset) {
    const code = encodePresetForSharing(preset);
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(preset.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // clipboard unavailable; ignore
    }
  }

  function handleImport() {
    if (!importValue.trim()) return;
    const imported = importSharedPreset(importValue.trim());
    if (imported && imported.generatorSlug === generatorSlug) {
      setImportState("success");
      setImportValue("");
      onRefresh();
      setTimeout(() => setImportState("idle"), 2000);
    } else {
      setImportState("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-espresso">{dict.presets.manage}</h2>
          <button onClick={onClose} className="text-taupe hover:text-espresso">
            <X className="h-5 w-5" />
          </button>
        </div>

        {presets.length === 0 ? (
          <p className="py-6 text-center text-sm text-taupe">{dict.presets.empty}</p>
        ) : (
          <div className="space-y-2">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center gap-2 rounded-xl border border-line p-3"
              >
                {editingId === preset.id ? (
                  <input
                    autoFocus
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && commitRename()}
                    onBlur={commitRename}
                    className="flex-1 rounded-lg border border-gold px-2 py-1 text-sm text-espresso focus:outline-none"
                  />
                ) : (
                  <button
                    onClick={() => onApply(preset)}
                    className="flex-1 text-left text-sm font-medium text-espresso hover:text-gold"
                  >
                    {preset.name}
                    {preset.isDefault ? (
                      <span className="ml-2 rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-semibold text-espresso">
                        {dict.presets.defaultBadge}
                      </span>
                    ) : null}
                  </button>
                )}

                <div className="flex shrink-0 items-center gap-1">
                  <IconAction
                    title={preset.isDefault ? dict.presets.unsetDefault : dict.presets.setDefault}
                    onClick={() => handleToggleDefault(preset)}
                  >
                    <Star className={cn("h-3.5 w-3.5", preset.isDefault && "fill-current text-gold")} />
                  </IconAction>
                  <IconAction title={dict.presets.rename} onClick={() => startRename(preset)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </IconAction>
                  <IconAction title={dict.presets.duplicate} onClick={() => handleDuplicate(preset.id)}>
                    <DuplicateIcon className="h-3.5 w-3.5" />
                  </IconAction>
                  <IconAction title={dict.presets.share} onClick={() => handleShare(preset)}>
                    {copiedId === preset.id ? (
                      <Check className="h-3.5 w-3.5 text-forest" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </IconAction>
                  <IconAction
                    title={dict.presets.delete}
                    onClick={() => setConfirmDeleteId(preset.id)}
                    danger
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </IconAction>
                </div>

                {confirmDeleteId === preset.id ? (
                  <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-espresso/50 p-4"
                    onClick={() => setConfirmDeleteId(null)}
                  >
                    <div
                      className="w-full max-w-sm rounded-2xl border border-line bg-white p-5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="font-display text-lg text-espresso">
                        {dict.presets.confirmDeleteTitle}
                      </h3>
                      <p className="mt-1 text-sm text-taupe">{dict.presets.confirmDeleteBody}</p>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button variant="secondary" size="sm" onClick={() => setConfirmDeleteId(null)}>
                          {dict.presets.cancel}
                        </Button>
                        <Button size="sm" onClick={() => handleDelete(preset.id)}>
                          {dict.presets.delete}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 border-t border-line pt-5">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-espresso">
            <Upload className="h-3.5 w-3.5" /> {dict.presets.import}
          </div>
          <div className="flex gap-2">
            <input
              value={importValue}
              onChange={(e) => {
                setImportValue(e.target.value);
                setImportState("idle");
              }}
              placeholder={dict.presets.importPlaceholder}
              className="flex-1 rounded-lg border border-line px-3 py-2 text-xs text-espresso placeholder:text-taupe-light focus:border-gold focus:outline-none"
            />
            <Button size="sm" onClick={handleImport} disabled={!importValue.trim()}>
              {dict.presets.importButton}
            </Button>
          </div>
          {importState === "success" ? (
            <p className="mt-1.5 text-xs font-medium text-forest">{dict.presets.importSuccess}</p>
          ) : null}
          {importState === "error" ? (
            <p className="mt-1.5 text-xs font-medium text-sunset">{dict.presets.importError}</p>
          ) : null}
        </div>

      </div>
    </div>
  );
}

function IconAction({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full text-taupe transition-colors hover:bg-bone",
        danger ? "hover:text-sunset" : "hover:text-espresso"
      )}
    >
      {children}
    </button>
  );
}
