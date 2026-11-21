import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { MEDIA_TYPE_INFO, STATUS_COLORS, statusLabel, type ItemStatus, type MediaType } from '@listenimento/core';
import { fonts, theme as t } from '@/theme';
import { Brut, CurtainStripes } from './ui';

/** Cartaz 2:3 com moldura de latão; sem capa vira cortina com o emoji. */
export function MediaThumb({ uri, mediaType, width = 64 }: { uri: string | null; mediaType: MediaType; width?: number }) {
  const info = MEDIA_TYPE_INFO[mediaType];
  const projected = mediaType === 'game' || mediaType === 'place' || mediaType === 'album';
  const height = width * 1.5;

  return (
    <View style={{ width, height, borderWidth: 3, borderColor: t.ink, backgroundColor: t.ink }}>
      <View style={{ flex: 1, borderWidth: 1.5, borderColor: t.brassDark, overflow: 'hidden' }}>
        {uri && !projected ? (
          <Image source={{ uri }} style={{ flex: 1 }} contentFit="cover" transition={150} />
        ) : (
          <>
            <CurtainStripes stripes={10} style={StyleSheet.absoluteFill} />
            <View style={styles.centerFill}>
              {uri ? (
                <Image source={{ uri }} style={{ width: '88%', aspectRatio: mediaType === 'album' ? 1 : 16 / 9, borderWidth: 2, borderColor: t.ink }} contentFit="cover" />
              ) : (
                <Text style={{ fontSize: width / 2.8 }}>{info.emoji}</Text>
              )}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

/** Carimbo de status. */
export function StatusPill({ status, mediaType }: { status: ItemStatus; mediaType: MediaType }) {
  const color = STATUS_COLORS[status];
  return (
    <View style={[styles.stamp, { borderColor: color }]}>
      <Text style={{ color, fontSize: 10, fontFamily: fonts.monoBold, letterSpacing: 1, textTransform: 'uppercase' }}>
        {statusLabel(status, mediaType)}
      </Text>
    </View>
  );
}

export function Stars({
  value,
  onChange,
  size = 14,
  tone = 'brass',
}: {
  value: number | null;
  onChange?: (v: number | null) => void;
  size?: number;
  tone?: 'brass' | 'ink';
}) {
  const on = tone === 'ink' ? t.curtain : t.brass;
  const off = tone === 'ink' ? 'rgba(12,8,6,0.2)' : t.wood500;
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = <Text style={{ fontSize: size, color: (value ?? 0) >= n ? on : off }}>★</Text>;
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

/** Linha da lista no formato de ingresso de papel. */
export function MediaRow({ title, subtitle, year, imageUrl, mediaType, right, footer, onPress }: RowProps) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      {({ pressed }) => (
        <Brut pressed={pressed} contentStyle={styles.ticket}>
          <MediaThumb uri={imageUrl} mediaType={mediaType} />
          <View style={styles.perforation} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text numberOfLines={2} style={styles.title}>
              {title}
            </Text>
            {(year || subtitle) && (
              <Text numberOfLines={1} style={styles.subtitle}>
                {[year, subtitle].filter(Boolean).join(' · ')}
              </Text>
            )}
            {footer}
          </View>
          {right}
        </Brut>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  centerFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  stamp: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    paddingHorizontal: 6,
    paddingVertical: 1,
    backgroundColor: t.ink,
    transform: [{ rotate: '-2deg' }],
  },
  ticket: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, backgroundColor: t.paper },
  perforation: { alignSelf: 'stretch', borderLeftWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(12,8,6,0.3)' },
  title: { color: t.ink, fontSize: 15, fontFamily: fonts.bodyBold, textTransform: 'uppercase' },
  subtitle: { color: '#5a4636', fontSize: 12, fontFamily: fonts.mono },
});
