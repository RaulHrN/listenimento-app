import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { MEDIA_TYPE_INFO, STATUS_COLORS, statusLabel, type ItemStatus, type MediaType } from '@acervo/core';
import { useTheme } from '@/theme';

export function MediaThumb({ uri, mediaType, width = 64 }: { uri: string | null; mediaType: MediaType; width?: number }) {
  const info = MEDIA_TYPE_INFO[mediaType];
  const ratio = mediaType === 'game' || mediaType === 'place' ? 16 / 9 : mediaType === 'album' ? 1 : 2 / 3;
  const style = { width, height: width / ratio, borderRadius: 10 };
  return uri ? (
    <Image source={{ uri }} style={style} contentFit="cover" transition={150} />
  ) : (
    <View style={[style, { backgroundColor: `${info.color}26`, alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ fontSize: width / 2.6 }}>{info.emoji}</Text>
    </View>
  );
}

export function StatusPill({ status, mediaType }: { status: ItemStatus; mediaType: MediaType }) {
  const color = STATUS_COLORS[status];
  return (
    <View style={[styles.pill, { backgroundColor: `${color}22` }]}>
      <Text style={{ color, fontSize: 11, fontWeight: '600' }}>{statusLabel(status, mediaType)}</Text>
    </View>
  );
}

export function Stars({ value, onChange, size = 14 }: { value: number | null; onChange?: (v: number | null) => void; size?: number }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = <Text style={{ fontSize: size, color: (value ?? 0) >= n ? '#fbbf24' : '#a1a1aa66' }}>★</Text>;
        return onChange ? (
          <Pressable key={n} hitSlop={6} onPress={() => onChange(value === n ? null : n)} style={{ paddingHorizontal: 3 }}>
            {star}
          </Pressable>
        ) : (
          <View key={n}>{star}</View>
        );
      })}
    </View>
  );
}

interface RowProps {
  title: string;
  subtitle: string | null;
  year: number | null;
  imageUrl: string | null;
  mediaType: MediaType;
  right?: React.ReactNode;
  footer?: React.ReactNode;
  onPress?: () => void;
}

export function MediaRow({ title, subtitle, year, imageUrl, mediaType, right, footer, onPress }: RowProps) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, { backgroundColor: t.card, borderColor: t.border, opacity: pressed ? 0.8 : 1 }]}
    >
      <MediaThumb uri={imageUrl} mediaType={mediaType} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text numberOfLines={2} style={{ color: t.text, fontSize: 15, fontWeight: '600' }}>
          {title}
        </Text>
        {(year || subtitle) && (
          <Text numberOfLines={1} style={{ color: t.muted, fontSize: 13 }}>
            {[year, subtitle].filter(Boolean).join(' · ')}
          </Text>
        )}
        {footer}
      </View>
      {right}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth },
});
