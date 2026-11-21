import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MEDIA_TYPE_INFO, statusLabel, type ItemStatus, type MediaType } from '@listenimento/core';
import { elevation, fonts, useTheme } from '@/theme';
import { Card, Velvet } from './ui';

/**
 * Cartaz 2:3 com sombra. Sem capa: inicial em Bodoni itálico sobre o veludo,
 * como a capa de um programa de ópera.
 */
export function MediaThumb({ uri, mediaType, title, width = 60 }: { uri: string | null; mediaType: MediaType; title: string; width?: number }) {
  const t = useTheme();
  const info = MEDIA_TYPE_INFO[mediaType];
  const projected = mediaType === 'game' || mediaType === 'place' || mediaType === 'album';
  const height = width * 1.5;
  const initial = title.trim().charAt(0).toUpperCase() || '·';

  return (
    <View style={[{ width, height, borderRadius: 2, backgroundColor: '#0f0a0c' }, elevation(2, t)]}>
      <View style={{ flex: 1, borderRadius: 2, overflow: 'hidden' }}>
        {uri && !projected ? (
          <Image source={{ uri }} style={{ flex: 1 }} contentFit="cover" transition={150} />
        ) : (
          <Velvet folds={2} style={StyleSheet.absoluteFill}>
            <View style={styles.centerFill}>
              {uri ? (
                <View style={{ width: '80%', borderTopLeftRadius: 999, borderTopRightRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: '#e7cd8f' }}>
                  <Image source={{ uri }} style={{ width: '100%', aspectRatio: mediaType === 'album' ? 1 : 4 / 5 }} contentFit="cover" />
                </View>
              ) : (
                <>
                  <Text style={{ fontFamily: fonts.displayItalic, fontSize: width * 0.55, lineHeight: width * 0.7, color: '#f3ead9' }}>{initial}</Text>
                  {width >= 90 && (
                    <>
                      <View style={{ width: 24, height: 1, backgroundColor: '#e7cd8faa', marginTop: 6 }} />
                      <Text style={{ fontFamily: fonts.medium, fontSize: 8, letterSpacing: 2.4, color: '#f3ead9bb', marginTop: 8, textTransform: 'uppercase' }}>
                        {info.label}
                      </Text>
                    </>
                  )}
                </>
              )}
            </View>
          </Velvet>
        )}
        {/* luz no topo e vinheta embaixo */}
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0.08)', 'transparent', 'rgba(0,0,0,0.3)']}
          locations={[0, 0.35, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </View>
  );
}

/** Status em versaletes com um ponto na cor do tema atual. */
export function StatusPill({ status, mediaType }: { status: ItemStatus; mediaType: MediaType }) {
  const t = useTheme();
  const color = t.status[status];
  return (
    <View style={styles.tag}>
      <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: color }} />
      <Text style={{ color, fontSize: 9.5, fontFamily: fonts.medium, letterSpacing: 1.8, textTransform: 'uppercase' }}>
        {statusLabel(status, mediaType)}
      </Text>
    </View>
  );
}

export function Stars({ value, onChange, size = 11 }: { value: number | null; onChange?: (v: number | null) => void; size?: number }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = (value ?? 0) >= n;
        const star = (
          <Text
            style={{
              fontSize: size,
              color: on ? t.goldHi : t.line,
              textShadowColor: on ? t.goldHi + '77' : 'transparent',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 6,
            }}
          >
            ★
          </Text>
        );
        return onChange ? (
          <Pressable key={n} hitSlop={6} onPress={() => onChange(value === n ? null : n)} style={{ paddingHorizontal: 4 }}>
            {star}
          </Pressable>
        ) : (
          <View key={n} style={{ marginRight: 1 }}>
            {star}
          </View>
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
            <MediaThumb uri={imageUrl} mediaType={mediaType} title={title} />
            <View style={{ flex: 1, gap: 6 }}>
              <Text numberOfLines={2} style={{ color: t.fg, fontSize: 18, fontFamily: fonts.display, lineHeight: 23 }}>
                {title}
              </Text>
              {(year || subtitle) && (
                <Text numberOfLines={1} style={{ color: t.muted, fontSize: 13, fontFamily: fonts.light }}>
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
  tag: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 14 },
});
