import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ITEM_STATUSES, genericStatusLabel, listItems, type ItemStatus, type MediaType, type UserItem } from '@acervo/core';
import { supabase } from '@/lib/supabase';
import { Button, Center, Chip, ErrorText, Input } from '@/components/ui';
import { MediaRow, Stars, StatusPill } from '@/components/media';
import { TypeChips } from '@/components/TypeChips';
import { useTheme } from '@/theme';

export default function ListaScreen() {
  const t = useTheme();
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [status, setStatus] = useState<ItemStatus | null>(null);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await listItems(supabase, { mediaType, status, search, limit: 200 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }, [mediaType, status, search]);

  // recarrega ao voltar para a aba (ex.: depois de editar ou adicionar)
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(load, search ? 300 : 0);
      return () => clearTimeout(timer);
    }, [load, search]),
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ gap: 10, paddingTop: 12 }}>
        <View style={{ paddingHorizontal: 16 }}>
          <Input placeholder="Filtrar pelo título…" value={search} onChangeText={setSearch} />
        </View>
        <TypeChips value={mediaType} onChange={setMediaType} allowAll />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          <Chip label="Todos" active={status === null} onPress={() => setStatus(null)} />
          {ITEM_STATUSES.map((s) => (
            <Chip key={s} label={genericStatusLabel(s)} active={status === s} onPress={() => setStatus(s)} />
          ))}
        </ScrollView>
        {error && (
          <View style={{ paddingHorizontal: 16 }}>
            <ErrorText>{error}</ErrorText>
          </View>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 10, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={t.brand} />}
        renderItem={({ item }) => (
          <MediaRow
            title={item.title}
            subtitle={item.subtitle}
            year={item.year}
            imageUrl={item.image_url}
            mediaType={item.media_type}
            onPress={() => router.push({ pathname: '/item/[id]', params: { id: item.id } })}
            footer={
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <StatusPill status={item.status} mediaType={item.media_type} />
                {item.rating ? <Stars value={item.rating} size={12} /> : null}
                {item.priority > 0 ? <Text style={{ color: '#f59e0b', fontWeight: '700' }}>{'!'.repeat(item.priority)}</Text> : null}
              </View>
            }
          />
        )}
        ListEmptyComponent={
          loading ? undefined : (
            <Center>
              <Text style={{ color: t.muted, marginBottom: 16 }}>Nada por aqui ainda.</Text>
              <Button title="Buscar algo para adicionar" onPress={() => router.navigate('/buscar')} />
            </Center>
          )
        }
      />
    </View>
  );
}
