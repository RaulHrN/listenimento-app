import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import {
  ITEM_STATUSES,
  MEDIA_TYPES,
  MEDIA_TYPE_INFO,
  PALETTES,
  genericStatusLabel,
  getProfile,
  getStats,
  type StatsSummary,
} from '@listenimento/core';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Backdrop, Button, Card, Chip, ErrorText, Label, Marquee, ScreenTitle } from '@/components/ui';
import { fonts, useTheme, type ThemePreference } from '@/theme';

// o letreiro é sempre escuro, então usa as cores de status do tema escuro
const SIGN = PALETTES.dark.status;

const THEME_OPTIONS: Array<{ value: ThemePreference; label: string }> = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
];

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

  return (
    <View style={{ flex: 1 }}>
      <Backdrop />
      <ScrollView
        contentContainerStyle={{ padding: 18, gap: 22, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={t.brass} colors={[t.accent]} />}
      >
        <ScreenTitle kicker={`Olá, ${name ?? session?.user.email ?? 'você'}`} title="Placar" />
        <ErrorText>{error}</ErrorText>

        <Marquee bulbs={false}>
          <View style={styles.grid}>
            {ITEM_STATUSES.map((s) => (
              <View key={s} style={{ width: '50%', alignItems: 'center', paddingVertical: 8 }}>
                <Text style={[styles.score, { color: SIGN[s], textShadowColor: SIGN[s] + '99' }]}>
                  {String(stats?.byStatus[s] ?? 0).padStart(2, '0')}
                </Text>
                <Text style={styles.scoreLabel}>{genericStatusLabel(s)}</Text>
              </View>
            ))}
          </View>
        </Marquee>

        <View style={{ gap: 12 }}>
          {MEDIA_TYPES.map((mt) => {
            const info = MEDIA_TYPE_INFO[mt];
            const s = stats?.byType[mt];
            const pct = s && s.total ? s.completed / s.total : 0;
            return (
              <Card key={mt} level={1}>
                <View style={{ padding: 16, gap: 10 }}>
                  <View style={styles.cardHead}>
                    <Text style={[styles.cardTitle, { color: t.fg }]}>{info.plural}</Text>
                    <Text style={[styles.cardMeta, { color: t.muted }]}>{s?.total ?? 0} na lista</Text>
                  </View>
                  <View style={[styles.bar, { backgroundColor: t.line }]}>
                    <LinearGradient
                      colors={[info.color, info.color + 'bb']}
                      style={{ width: `${Math.round(pct * 100)}%`, height: '100%', borderRadius: 4 }}
                    />
                  </View>
                  <Text style={[styles.cardMeta, { color: t.muted }]}>
                    {s?.completed ?? 0} {info.done.toLowerCase()}s · {Math.round(pct * 100)}%{s?.avgRating ? ` · ${s.avgRating}★` : ''}
                  </Text>
                </View>
              </Card>
            );
          })}
        </View>

        <View>
          <Label>Tema</Label>
          <View style={{ flexDirection: 'row' }}>
            {THEME_OPTIONS.map((o) => (
              <Chip key={o.value} label={o.label} active={t.preference === o.value} onPress={() => t.setPreference(o.value)} />
            ))}
          </View>
        </View>

        <Button title="Sair da sala" variant="danger" onPress={signOut} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  score: { fontFamily: fonts.display, fontSize: 50, lineHeight: 56, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 14 },
  scoreLabel: { fontFamily: fonts.monoBold, fontSize: 10, letterSpacing: 2, color: '#a8927a', textTransform: 'uppercase' },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  cardTitle: { fontFamily: fonts.display, fontSize: 22, textTransform: 'uppercase' },
  cardMeta: { fontFamily: fonts.mono, fontSize: 12 },
  bar: { height: 8, borderRadius: 4, overflow: 'hidden' },
});
