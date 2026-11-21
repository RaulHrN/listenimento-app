import { ScrollView, StyleSheet, View } from 'react-native';
import { MEDIA_TYPES, MEDIA_TYPE_INFO, type MediaType } from '@listenimento/core';
import { useTheme } from '@/theme';
import { Tab } from './ui';

/** Abas de tipo em versaletes, com filete dourado na ativa. */
export function TypeChips({
  value,
  onChange,
  allowAll,
}: {
  value: MediaType | null;
  onChange: (v: MediaType | null) => void;
  allowAll?: boolean;
}) {
  const t = useTheme();
  return (
    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.line }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 18 }}>
        {allowAll && <Tab label="Tudo" active={value === null} onPress={() => onChange(null)} />}
        {MEDIA_TYPES.map((m) => (
          <Tab key={m} label={MEDIA_TYPE_INFO[m].plural} active={value === m} onPress={() => onChange(m)} />
        ))}
      </ScrollView>
    </View>
  );
}
