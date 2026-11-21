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
} from '@listenimento/core';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Brut, Button, ErrorText, Marquee, Planks, ScreenTitle } from '@/components/ui';
import { fonts, theme as t } from '@/theme';

export default function PainelScreen() {
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

  return (
    <View style={{ flex: 1 }}>
      <Planks />
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={t.brass} colors={[t.curtain]} />}
      >
        <ScreenTitle kicker={`Poltrona de ${name ?? session?.user.email ?? 'você'}`} title="Placar" />
        <ErrorText>{error}</ErrorText>

        {/* letreiro com os totais */}
        <Marquee>
          <View style={styles.grid}>
            {ITEM_STATUSES.map((s) => (
              <View key={s} style={{ width: '50%', alignItems: 'center', paddingVertical: 6 }}>
                <Text style={[styles.score, { color: STATUS_COLORS[s], textShadowColor: STATUS_COLORS[s] }]}>
                  {String(stats?.byStatus[s] ?? 0).padStart(2, '0')}
                </Text>
                <Text style={styles.scoreLabel}>{genericStatusLabel(s)}</Text>
              </View>
            ))}
          </View>
        </Marquee>

        {/* um ingresso por tipo */}
        {MEDIA_TYPES.map((mt) => {
          const info = MEDIA_TYPE_INFO[mt];
          const s = stats?.byType[mt];
          const pct = s && s.total ? s.completed / s.total : 0;
          return (
            <Brut key={mt} contentStyle={styles.ticket}>
              <View style={styles.ticketHead}>
                <Text style={styles.ticketTitle}>
                  {info.emoji} {info.plural}
                </Text>
                <Text style={styles.ticketNumber}>{String(s?.total ?? 0).padStart(3, '0')}</Text>
              </View>
              <View style={styles.bar}>
                <View style={{ width: `${Math.round(pct * 100)}%`, height: '100%', backgroundColor: info.color }} />
              </View>
              <Text style={styles.ticketFoot}>
                {s?.completed ?? 0} {info.done.toLowerCase()}s · {Math.round(pct * 100)}%{s?.avgRating ? ` · nota média ${s.avgRating}★` : ''}
              </Text>
            </Brut>
          );
        })}

        <Button title="Sair da sala" variant="danger" onPress={signOut} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  score: { fontFamily: fonts.display, fontSize: 52, lineHeight: 58, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12 },
  scoreLabel: { fontFamily: fonts.monoBold, fontSize: 11, letterSpacing: 2, color: t.muted, textTransform: 'uppercase' },
  ticket: { backgroundColor: t.paper, paddingHorizontal: 18, paddingVertical: 14, gap: 10 },
  ticketHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(12,8,6,0.3)',
    paddingBottom: 8,
  },
  ticketTitle: { fontFamily: fonts.display, fontSize: 22, color: t.ink, textTransform: 'uppercase' },
  ticketNumber: { fontFamily: fonts.monoBold, fontSize: 12, color: t.ink },
  bar: { height: 12, borderWidth: 2, borderColor: t.ink, backgroundColor: t.paperDark },
  ticketFoot: { fontFamily: fonts.mono, fontSize: 12, color: t.ink },
});
