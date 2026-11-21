import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ITEM_STATUSES, genericStatusLabel, listItems, type ItemStatus, type MediaType, type UserItem } from '@listenimento/core';
import { supabase } from '@/lib/supabase';
import { Button, Center, Chip, ErrorText, Input, Planks, ScreenTitle, textStyles } from '@/components/ui';
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
      <Planks />
      <View style={{ gap: 12, paddingTop: 14 }}>
        <View style={{ paddingHorizontal: 16 }}>
          <ScreenTitle kicker="Programação da casa" title="Minha lista" />
        </View>
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
        contentContainerStyle={{ padding: 16, gap: 14, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={t.brass} colors={[t.curtain]} />}
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
                {item.rating ? <Stars value={item.rating} size={12} tone="ink" /> : null}
                {item.priority > 0 ? <Text style={[textStyles.display, { color: t.curtain, fontSize: 16 }]}>{'!'.repeat(item.priority)}</Text> : null}
              </View>
            }
          />
        )}
        ListEmptyComponent={
          loading ? undefined : (
            <Center>
              <Text style={[textStyles.display, { color: t.paper, fontSize: 34 }]}>Sala vazia</Text>
              <Text style={[textStyles.mono, { color: t.muted, marginTop: 6, marginBottom: 20, textAlign: 'center' }]}>
                Nenhum título em cartaz por aqui ainda.
              </Text>
              <Button title="Buscar algo" onPress={() => router.navigate('/buscar')} />
            </Center>
          )
        }
      />
    </View>
  );
}
