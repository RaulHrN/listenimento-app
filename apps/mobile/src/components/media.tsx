import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MEDIA_TYPE_INFO, statusLabel, type ItemStatus, type MediaType } from '@listenimento/core';
import { elevation, fonts, useTheme } from '@/theme';
import { Card, Velvet } from './ui';

/** Cartaz 2:3 com sombra; sem capa vira veludo com o emoji do tipo. */
export function MediaThumb({ uri, mediaType, width = 60 }: { uri: string | null; mediaType: MediaType; width?: number }) {
  const t = useTheme();
  const info = MEDIA_TYPE_INFO[mediaType];
  const projected = mediaType === 'game' || mediaType === 'place' || mediaType === 'album';
  const height = width * 1.5;

  return (
    <View style={[{ width, height, borderRadius: 4, backgroundColor: '#0d0805' }, elevation(2, t)]}>
      <View style={{ flex: 1, borderRadius: 4, overflow: 'hidden' }}>
        {uri && !projected ? (
          <Image source={{ uri }} style={{ flex: 1 }} contentFit="cover" transition={150} />
        ) : (
          <Velvet folds={2} style={StyleSheet.absoluteFill}>
            <View style={styles.centerFill}>
              {uri ? (
                <Image
                  source={{ uri }}
                  style={{ width: '86%', aspectRatio: mediaType === 'album' ? 1 : 16 / 9, borderRadius: 2 }}
                  contentFit="cover"
                />
              ) : (
                <Text style={{ fontSize: width / 2.8, opacity: 0.9 }}>{info.emoji}</Text>
              )}
            </View>
          </Velvet>
        )}
        {/* luz no topo e vinheta embaixo */}
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0.12)', 'transparent', 'rgba(0,0,0,0.35)']}
          locations={[0, 0.35, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </View>
  );
}

/** Etiqueta de status discreta, na cor do tema atual. */
export function StatusPill({ status, mediaType }: { status: ItemStatus; mediaType: MediaType }) {
  const t = useTheme();
  const color = t.status[status];
  return (
    <View style={[styles.tag, { backgroundColor: color + '1f', borderColor: color + '4d' }]}>
      <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: color }} />
      <Text style={{ color, fontSize: 10, fontFamily: fonts.monoBold, letterSpacing: 1, textTransform: 'uppercase' }}>
        {statusLabel(status, mediaType)}
      </Text>
    </View>
  );
}

export function Stars({ value, onChange, size = 13 }: { value: number | null; onChange?: (v: number | null) => void; size?: number }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = (value ?? 0) >= n;
        const star = (
          <Text
            style={{
              fontSize: size,
              color: on ? t.brassHi : t.line,
              textShadowColor: on ? 'rgba(0,0,0,0.35)' : 'transparent',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 1,
            }}
          >
            ★
          </Text>
        );
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

/** Linha da lista: cartão elevado com o cartaz em destaque. */
export function MediaRow({ title, subtitle, year, imageUrl, mediaType, right, footer, onPress }: RowProps) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      {({ pressed }) => (
        <Card level={pressed ? 1 : 2} style={{ transform: [{ scale: pressed ? 0.99 : 1 }] }}>
          <View style={styles.row}>
            <MediaThumb uri={imageUrl} mediaType={mediaType} />
            <View style={{ flex: 1, gap: 5 }}>
              <Text numberOfLines={2} style={{ color: t.fg, fontSize: 15, fontFamily: fonts.bodyBold }}>
                {title}
              </Text>
              {(year || subtitle) && (
                <Text numberOfLines={1} style={{ color: t.muted, fontSize: 12, fontFamily: fonts.mono }}>
                  {[year, subtitle].filter(Boolean).join(' · ')}
                </Text>
              )}
              {footer}
            </View>
            {right}
          </View>
        </Card>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  centerFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  tag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12 },
});
