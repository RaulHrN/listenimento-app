import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  MEDIA_TYPE_INFO,
  addItem,
  getSavedKeys,
  itemKey,
  searchMedia,
  statusLabel,
  type ItemStatus,
  type MediaType,
  type SearchResult,
} from '@listenimento/core';
import { supabase } from '@/lib/supabase';
import { Center, ErrorText, Input } from '@/components/ui';
import { MediaRow } from '@/components/media';
import { TypeChips } from '@/components/TypeChips';
import { useTheme } from '@/theme';

export default function BuscarScreen() {
  const t = useTheme();
  const [type, setType] = useState<MediaType>('movie');
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<Map<string, string>>(new Map());
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const reqId = useRef(0);

  const run = useCallback(async (mt: MediaType, q: string, p: number) => {
    if (q.trim().length < 2) return;
    const id = ++reqId.current;
    setLoading(true);
    setError(null);
    try {
      const res = await searchMedia(supabase, mt, q, p);
      if (id !== reqId.current) return;
      setResults((prev) => (p === 1 ? res.results : [...prev, ...res.results]));
      setHasMore(res.hasMore);
      setPage(p);
    } catch (err) {
      if (id === reqId.current) setError(err instanceof Error ? err.message : 'Erro na busca');
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSavedKeys(supabase, type).then(setSaved).catch(() => undefined);
    setResults([]);
    setHasMore(false);
    if (submitted) void run(type, submitted, 1);
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  function submit() {
    setSubmitted(query);
    void run(type, query, 1);
  }

  async function add(result: SearchResult, status: ItemStatus) {
    const key = itemKey(result);
    setSavingKey(key);
    try {
      const item = await addItem(supabase, result, status);
      setSaved((prev) => new Map(prev).set(key, item.id));
    } catch (err) {
      Alert.alert('Não foi possível salvar', err instanceof Error ? err.message : String(err));
    } finally {
      setSavingKey(null);
    }
  }

  function askStatus(result: SearchResult) {
    Alert.alert(result.title, 'Adicionar à lista como:', [
      { text: statusLabel('wishlist', result.mediaType), onPress: () => add(result, 'wishlist') },
      { text: statusLabel('in_progress', result.mediaType), onPress: () => add(result, 'in_progress') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ gap: 10, paddingTop: 12 }}>
        <TypeChips value={type} onChange={(v) => v && setType(v)} />
        <View style={{ paddingHorizontal: 16 }}>
          <Input
            placeholder={type === 'place' ? 'Digite uma cidade. Ex.: Ouro Preto' : MEDIA_TYPE_INFO[type].placeholder}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={submit}
            returnKeyType="search"
            autoCorrect={false}
          />
        </View>
        {error && (
          <View style={{ paddingHorizontal: 16 }}>
            <ErrorText>{error}</ErrorText>
          </View>
        )}
      </View>

      <FlatList
        data={results}
        keyExtractor={itemKey}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, gap: 10, flexGrow: 1 }}
        onEndReachedThreshold={0.4}
        onEndReached={() => hasMore && !loading && run(type, submitted, page + 1)}
        renderItem={({ item: r }) => {
          const key = itemKey(r);
          const savedId = saved.get(key);
          return (
            <MediaRow
              title={r.title}
              subtitle={r.subtitle}
              year={r.year}
              imageUrl={r.imageUrl}
              mediaType={r.mediaType}
              right={
                savingKey === key ? (
                  <ActivityIndicator color={t.brand} />
                ) : savedId ? (
                  <Pressable hitSlop={8} onPress={() => router.push({ pathname: '/item/[id]', params: { id: savedId } })}>
                    <Text style={{ color: '#16a34a', fontSize: 22 }}>✓</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    hitSlop={8}
                    onPress={() => askStatus(r)}
                    style={{ backgroundColor: t.brand, width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ color: t.brandText, fontSize: 20, lineHeight: 22 }}>+</Text>
                  </Pressable>
                )
              }
            />
          );
        }}
        ListFooterComponent={loading ? <ActivityIndicator color={t.brand} style={{ marginVertical: 16 }} /> : undefined}
        ListEmptyComponent={
          loading ? undefined : (
            <Center>
              <Text style={{ color: t.muted, textAlign: 'center' }}>
                {submitted ? `Nada encontrado para “${submitted}”.` : `Busque ${MEDIA_TYPE_INFO[type].plural.toLowerCase()} para adicionar à sua lista.`}
              </Text>
            </Center>
          )
        }
      />
    </View>
  );
}
