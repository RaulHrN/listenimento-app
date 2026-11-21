import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import {
  ITEM_STATUSES,
  MEDIA_TYPE_INFO,
  PRIORITY_LABELS,
  getItem,
  removeItem,
  statusLabel,
  updateItem,
  type UserItem,
  type UserItemUpdate,
} from '@listenimento/core';
import { supabase } from '@/lib/supabase';
import { Button, Center, Chip, ErrorText, Input, Label } from '@/components/ui';
import { MediaThumb, Stars } from '@/components/media';
import { useTheme } from '@/theme';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default function ItemScreen() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<UserItem | null>(null);
  const [draft, setDraft] = useState<UserItemUpdate>({});
  const [tagsText, setTagsText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getItem(supabase, id)
      .then((it) => {
        setItem(it);
        if (it) {
          setDraft({
            status: it.status,
            rating: it.rating,
            priority: it.priority,
            notes: it.notes,
            started_at: it.started_at,
            finished_at: it.finished_at,
          });
          setTagsText(it.tags.join(', '));
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const set = <K extends keyof UserItemUpdate>(k: K, v: UserItemUpdate[K]) => setDraft((d) => ({ ...d, [k]: v }));

  async function save() {
    if (!item) return;
    for (const d of [draft.started_at, draft.finished_at]) {
      if (d && !DATE_RE.test(d)) return setError('Use datas no formato AAAA-MM-DD.');
    }
    setSaving(true);
    setError(null);
    try {
      const tags = [...new Set(tagsText.split(',').map((x) => x.trim().toLowerCase()).filter(Boolean))];
      await updateItem(supabase, item.id, {
        ...draft,
        tags,
        notes: draft.notes?.trim() || null,
        started_at: draft.started_at || null,
        finished_at: draft.finished_at || null,
      });
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  function confirmRemove() {
    if (!item) return;
    Alert.alert('Remover da lista?', item.title, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeItem(supabase, item.id);
            router.back();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao remover');
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <Center>
        <ActivityIndicator color={t.brand} />
      </Center>
    );
  }
  if (!item) {
    return (
      <Center>
        <Text style={{ color: t.muted }}>{error ?? 'Item não encontrado.'}</Text>
      </Center>
    );
  }

  const info = MEDIA_TYPE_INFO[item.media_type];
  const overview = typeof item.metadata.overview === 'string' ? item.metadata.overview : null;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: info.label }} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <MediaThumb uri={item.image_url} mediaType={item.media_type} width={110} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: t.muted, fontSize: 12 }}>
              {info.emoji} {info.label}
              {item.year ? ` · ${item.year}` : ''}
            </Text>
            <Text style={{ color: t.text, fontSize: 20, fontWeight: '700' }}>{item.title}</Text>
            {item.subtitle && <Text style={{ color: t.muted }}>{item.subtitle}</Text>}
          </View>
        </View>

        {overview && (
          <Text style={{ color: t.muted, lineHeight: 20 }} numberOfLines={8}>
            {overview}
          </Text>
        )}

        <View>
          <Label>Status</Label>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 }}>
            {ITEM_STATUSES.map((s) => (
              <Chip key={s} label={statusLabel(s, item.media_type)} active={draft.status === s} onPress={() => set('status', s)} />
            ))}
          </View>
        </View>

        <View>
          <Label>Nota</Label>
          <Stars value={draft.rating ?? null} onChange={(v) => set('rating', v)} size={30} />
        </View>

        <View>
          <Label>Prioridade</Label>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 }}>
            {PRIORITY_LABELS.map((l, i) => (
              <Chip key={l} label={l} active={(draft.priority ?? 0) === i} onPress={() => set('priority', i)} />
            ))}
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Label>Comecei em</Label>
            <Input placeholder="AAAA-MM-DD" value={draft.started_at ?? ''} onChangeText={(v) => set('started_at', v)} />
          </View>
          <View style={{ flex: 1 }}>
            <Label>Terminei em</Label>
            <Input placeholder="AAAA-MM-DD" value={draft.finished_at ?? ''} onChangeText={(v) => set('finished_at', v)} />
          </View>
        </View>

        <View>
          <Label>Tags (separadas por vírgula)</Label>
          <Input value={tagsText} onChangeText={setTagsText} placeholder="ex.: com a carol, férias" autoCapitalize="none" />
        </View>

        <View>
          <Label>Anotações</Label>
          <Input
            multiline
            value={draft.notes ?? ''}
            onChangeText={(v) => set('notes', v)}
            placeholder="Quem indicou, onde assistir, impressões…"
            style={{ height: 110, paddingTop: 12, textAlignVertical: 'top' }}
          />
        </View>

        <ErrorText>{error}</ErrorText>
        <Button title="Salvar" onPress={save} loading={saving} />
        <Button title="Remover da lista" variant="danger" onPress={confirmRemove} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
