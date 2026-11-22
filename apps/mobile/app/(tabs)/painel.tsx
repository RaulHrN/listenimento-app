import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import {
  DATA_SOURCES,
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
import { Backdrop, Button, Card, Chandelier, Chip, ErrorText, Label, NightPanel, ScreenTitle } from '@/components/ui';
import { fonts, useTheme, type ThemePreference } from '@/theme';

// o painel noturno é sempre escuro, então usa as cores de status do tema escuro
const NIGHT = PALETTES.dark.status;

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
        contentContainerStyle={{ padding: 18, gap: 26, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={t.gold} colors={[t.accent]} />}
      >
        <ScreenTitle kicker={`Ato III · ${name ?? session?.user.email ?? 'Programa'}`} title="Programa" />
        <ErrorText>{error}</ErrorText>

        <NightPanel>
          <View style={{ alignItems: 'center' }}>
            <Chandelier size={46} color="#c9a45c" />
          </View>
          <View style={styles.grid}>
            {ITEM_STATUSES.map((s) => (
              <View key={s} style={{ width: '50%', alignItems: 'center', paddingVertical: 12 }}>
                <Text style={[styles.score, { color: NIGHT[s], textShadowColor: NIGHT[s] + '66' }]}>{stats?.byStatus[s] ?? 0}</Text>
                <Text style={styles.scoreLabel}>{genericStatusLabel(s)}</Text>
              </View>
            ))}
          </View>
        </NightPanel>

        <Card level={1}>
          {MEDIA_TYPES.map((mt, i) => {
            const info = MEDIA_TYPE_INFO[mt];
            const s = stats?.byType[mt];
            const pct = s && s.total ? s.completed / s.total : 0;
            return (
              <View key={mt} style={[styles.row, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.line }]}>
                <View style={styles.rowHead}>
                  <Text style={[styles.rowTitle, { color: t.fg }]}>{info.plural}</Text>
                  <Text style={[styles.rowMeta, { color: t.muted }]}>
                    {s?.completed ?? 0}/{s?.total ?? 0}
                    {s?.avgRating ? ` · ${s.avgRating}★` : ''}
                  </Text>
                </View>
                <View style={{ height: 1, backgroundColor: t.line, marginTop: 10 }}>
                  <View style={{ width: `${Math.round(pct * 100)}%`, height: 1, backgroundColor: info.color }} />
                </View>
              </View>
            );
          })}
        </Card>

        <View>
          <Label>Tema</Label>
          <View style={{ flexDirection: 'row' }}>
            {THEME_OPTIONS.map((o) => (
              <Chip key={o.value} label={o.label} active={t.preference === o.value} onPress={() => t.setPreference(o.value)} />
            ))}
          </View>
        </View>

        <Button title="Sair" variant="ghost" onPress={signOut} />

        <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.line, paddingTop: 16 }}>
          <Label>Créditos</Label>
          <Text style={[styles.credits, { color: t.muted }]}>
            Dados e imagens de {DATA_SOURCES.map((s) => s.name).join(' · ')}. Este produto usa a API do TMDB, mas não é endossado nem
            certificado pelo TMDB.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  score: { fontFamily: fonts.display, fontSize: 48, lineHeight: 56, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 16 },
  scoreLabel: { fontFamily: fonts.medium, fontSize: 9, letterSpacing: 2.6, color: '#a8978a', textTransform: 'uppercase', marginTop: 4 },
  row: { paddingHorizontal: 18, paddingVertical: 16 },
  rowHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  rowTitle: { fontFamily: fonts.display, fontSize: 20 },
  rowMeta: { fontFamily: fonts.light, fontSize: 13 },
  credits: { fontFamily: fonts.light, fontSize: 12, lineHeight: 18 },
});
