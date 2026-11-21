'use client';

import { useEffect, useState } from 'react';
import {
  ITEM_STATUSES,
  MEDIA_TYPE_INFO,
  PRIORITY_LABELS,
  removeItem,
  statusLabel,
  updateItem,
  type UserItem,
  type UserItemUpdate,
} from '@listenimento/core';
import { getSupabase } from '@/shared/lib/supabase/client';
import { MediaCover } from '@/entities/media/ui/MediaCover';
import { Stars } from '@/shared/ui/Stars';

interface Props {
  item: UserItem;
  onClose: () => void;
  onSaved: (item: UserItem) => void;
  onRemoved: (id: string) => void;
}

export function ItemEditor({ item, onClose, onSaved, onRemoved }: Props) {
  const supabase = getSupabase();
  const [draft, setDraft] = useState<UserItemUpdate>({
    status: item.status,
    rating: item.rating,
    priority: item.priority,
    notes: item.notes,
    tags: item.tags,
    started_at: item.started_at,
    finished_at: item.finished_at,
  });
  const [tagsText, setTagsText] = useState(item.tags.join(', '));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = <K extends keyof UserItemUpdate>(key: K, value: UserItemUpdate[K]) => setDraft((d) => ({ ...d, [key]: value }));

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const tags = tagsText
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      const updated = await updateItem(supabase, item.id, {
        ...draft,
        tags: [...new Set(tags)],
        notes: draft.notes?.trim() || null,
        started_at: draft.started_at || null,
        finished_at: draft.finished_at || null,
      });
      onSaved(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm(`Remover “${item.title}” da sua lista?`)) return;
    setSaving(true);
    try {
      await removeItem(supabase, item.id);
      onRemoved(item.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover');
      setSaving(false);
    }
  }

  const overview = typeof item.metadata.overview === 'string' ? item.metadata.overview : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-5">
          <MediaCover src={item.image_url} alt={item.title} mediaType={item.media_type} className="w-28 shrink-0 sm:w-36" />
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              {MEDIA_TYPE_INFO[item.media_type].emoji} {MEDIA_TYPE_INFO[item.media_type].label}
              {item.year ? ` · ${item.year}` : ''}
            </p>
            <h2 className="mt-1 text-xl font-bold leading-tight">{item.title}</h2>
            {item.subtitle && <p className="text-sm text-zinc-500">{item.subtitle}</p>}
            {overview && <p className="mt-3 line-clamp-5 text-sm text-zinc-600 dark:text-zinc-400">{overview}</p>}
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          <div className="flex flex-wrap gap-2">
            {ITEM_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set('status', s)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  draft.status === s ? 'border-brand-600 bg-brand-600 text-white' : 'border-zinc-300 dark:border-zinc-700'
                }`}
              >
                {statusLabel(s, item.media_type)}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              Nota
              <Stars value={draft.rating ?? null} onChange={(v) => set('rating', v)} size="lg" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Prioridade
              <select className="input" value={draft.priority ?? 0} onChange={(e) => set('priority', Number(e.target.value))}>
                {PRIORITY_LABELS.map((l, i) => (
                  <option key={l} value={i}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Comecei em
              <input type="date" className="input" value={draft.started_at ?? ''} onChange={(e) => set('started_at', e.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Terminei em
              <input type="date" className="input" value={draft.finished_at ?? ''} onChange={(e) => set('finished_at', e.target.value)} />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm">
            Tags (separadas por vírgula)
            <input className="input" value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="ex.: com a carol, férias, coop" />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Anotações
            <textarea
              className="input min-h-24"
              value={draft.notes ?? ''}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Quem indicou, onde assistir, impressões…"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-between gap-2">
            <button type="button" className="btn-danger" onClick={remove} disabled={saving}>
              Remover
            </button>
            <div className="flex gap-2">
              <button type="button" className="btn-ghost" onClick={onClose}>
                Cancelar
              </button>
              <button type="button" className="btn-primary" onClick={save} disabled={saving}>
                {saving ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
