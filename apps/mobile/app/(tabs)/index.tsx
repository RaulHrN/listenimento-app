import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ITEM_STATUSES, genericStatusLabel, listItems, type ItemStatus, type MediaType, type UserItem } from '@listenimento/core';
import { supabase } from '@/lib/supabase';
import { Backdrop, Button, Center, Chip, ErrorText, Input, ScreenTitle, textStyles } from '@/components/ui';
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
      <Backdrop />
      <View style={{ gap: 14, paddingTop: 20 }}>
        <View style={{ paddingHorizontal: 16 }}>
          <ScreenTitle kicker="Ato I · Temporada" title="Minha lista" />
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
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={t.gold} colors={[t.accent]} />}
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
                {item.priority > 0 ? (
                  <View style={{ flexDirection: 'row', gap: 2 }}>
                    {Array.from({ length: item.priority }, (_, i) => (
                      <View key={i} style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: t.goldHi }} />
                    ))}
                  </View>
                ) : null}
              </View>
            }
          />
        )}
        ListEmptyComponent={
          loading ? undefined : (
            <Center>
              <Text style={[textStyles.displayItalic, { color: t.fg, fontSize: 34 }]}>Palco vazio</Text>
              <Text style={[textStyles.light, { color: t.muted, marginTop: 8, marginBottom: 24, textAlign: 'center', fontSize: 15 }]}>
                Nenhum título na sua temporada ainda.
              </Text>
              <Button title="Montar repertório" onPress={() => router.navigate('/buscar')} />
            </Center>
          )
        }
      />
    </View>
  );
}
