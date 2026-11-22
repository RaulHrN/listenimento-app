import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PALETTES } from '@listenimento/core';

// Usa só a paleta e fontes do sistema: esta tela precisa funcionar mesmo
// quando tema, fontes ou navegação ainda não carregaram.
const t = PALETTES.dark;

interface Props {
  title: string;
  message: string;
  details?: string[];
  action?: React.ReactNode;
}

/** Tela de diagnóstico mostrada no lugar do app quando algo impede o início. */
export function ProblemScreen({ title, message, details, action }: Props) {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.bar} />
        <Text style={styles.kicker}>Listenimento</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        {details?.map((d) => (
          <Text key={d} style={styles.detail}>
            • {d}
          </Text>
        ))}
        {action}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: t.bg },
  content: { padding: 28, paddingTop: 48, gap: 14 },
  bar: { width: 48, height: 3, backgroundColor: t.accentHi, marginBottom: 8 },
  kicker: { color: t.gold, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' },
  title: { color: t.fg, fontSize: 28, fontWeight: '600' },
  message: { color: t.fg, opacity: 0.85, fontSize: 15, lineHeight: 22 },
  detail: { color: t.muted, fontSize: 13, lineHeight: 20 },
});
