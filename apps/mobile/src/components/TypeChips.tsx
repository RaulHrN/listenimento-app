import { ScrollView } from 'react-native';
import { MEDIA_TYPES, MEDIA_TYPE_INFO, type MediaType } from '@listenimento/core';
import { Chip } from './ui';

export function TypeChips({
  value,
  onChange,
  allowAll,
}: {
  value: MediaType | null;
  onChange: (v: MediaType | null) => void;
  allowAll?: boolean;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
      {allowAll && <Chip label="Tudo" active={value === null} onPress={() => onChange(null)} />}
      {MEDIA_TYPES.map((t) => (
        <Chip key={t} label={`${MEDIA_TYPE_INFO[t].emoji} ${MEDIA_TYPE_INFO[t].plural}`} active={value === t} onPress={() => onChange(t)} />
      ))}
    </ScrollView>
  );
}
