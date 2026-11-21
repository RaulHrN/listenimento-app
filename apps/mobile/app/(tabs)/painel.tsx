import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import {
  ITEM_STATUSES,
  MEDIA_TYPES,
  MEDIA_TYPE_INFO,
  STATUS_COLORS,
  genericStatusLabel,
  getProfile,
  getStats,
  type StatsSummary,
} from '@acervo/core';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Button, ErrorText } from '@/components/ui';
import { useTheme } from '@/theme';

export default function PainelScreen() {
  const t = useTheme();
  const { signOut, session } = useAuth();
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, p] = await Promise.all([getStats(supabase), getProfile(supabase)]);
      setStats(s);
      setName(p?.display_name ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const card = [styles.card, { backgroundColor: t.card, borderColor: t.border }];

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, gap: 16 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={t.brand} />}
    >
      <Text style={{ color: t.text, fontSize: 22, fontWeight: '700' }}>Olá, {name ?? session?.user.email}</Text>
      <ErrorText>{error}</ErrorText>

      <View style={styles.grid}>
        {ITEM_STATUSES.map((s) => (
          <View key={s} style={[card, { width: '48%' }]}>
            <Text style={{ color: t.muted, fontSize: 13 }}>{genericStatusLabel(s)}</Text>
            <Text style={{ color: STATUS_COLORS[s], fontSize: 28, fontWeight: '800' }}>{stats?.byStatus[s] ?? 0}</Text>
          </View>
        ))}
      </View>

      {MEDIA_TYPES.map((mt) => {
        const info = MEDIA_TYPE_INFO[mt];
        const s = stats?.byType[mt];
        const pct = s && s.total ? s.completed / s.total : 0;
        return (
          <View key={mt} style={card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: t.text, fontWeight: '600' }}>
                {info.emoji} {info.plural}
              </Text>
              <Text style={{ color: t.muted, fontSize: 13 }}>{s?.total ?? 0} na lista</Text>
            </View>
            <View style={[styles.bar, { backgroundColor: t.chip }]}>
              <View style={{ width: `${Math.round(pct * 100)}%`, height: '100%', borderRadius: 4, backgroundColor: info.color }} />
            </View>
            <Text style={{ color: t.muted, fontSize: 12 }}>
              {s?.completed ?? 0} {info.done.toLowerCase()}s · {Math.round(pct * 100)}%{s?.avgRating ? ` · nota média ${s.avgRating}★` : ''}
            </Text>
          </View>
        );
      })}

      <Button title="Sair da conta" variant="danger" onPress={signOut} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  card: { padding: 14, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, gap: 8 },
  bar: { height: 8, borderRadius: 4, overflow: 'hidden' },
});
