import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { AccentBar, Chandelier, Logo } from '@/components/ui';
import { elevation, fonts, useTheme } from '@/theme';

/** Ícones geométricos de traço fino (modernismo). */
function TabIcon({ name, color }: { name: 'lista' | 'buscar' | 'programa'; color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.3} strokeLinecap="round">
      {name === 'lista' && (
        <>
          <Line x1="7" y1="7" x2="20" y2="7" />
          <Line x1="7" y1="12" x2="20" y2="12" />
          <Line x1="7" y1="17" x2="20" y2="17" />
          <Circle cx="3.5" cy="7" r="0.9" fill={color} />
          <Circle cx="3.5" cy="12" r="0.9" fill={color} />
          <Circle cx="3.5" cy="17" r="0.9" fill={color} />
        </>
      )}
      {name === 'buscar' && (
        <>
          <Circle cx="10.5" cy="10.5" r="6.5" />
          <Line x1="15.5" y1="15.5" x2="21" y2="21" />
        </>
      )}
      {/* arco de proscênio */}
      {name === 'programa' && (
        <>
          <Path d="M4 21V11a8 8 0 0 1 16 0v10" />
          <Line x1="2" y1="21" x2="22" y2="21" />
          <Circle cx="12" cy="11" r="1.4" fill={color} />
        </>
      )}
    </Svg>
  );
}

/** Cabeçalho: filete carmim + barra com lustre e logotipo. */
function OperaHeader() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ zIndex: 10, backgroundColor: t.bg }}>
      <View style={{ height: insets.top, backgroundColor: t.bg }} />
      <AccentBar />
      <View style={[styles.bar, { borderBottomColor: t.line }]}>
        <Chandelier size={24} />
        <Logo size={22} />
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs
      screenOptions={{
        header: () => <OperaHeader />,
        tabBarStyle: {
          backgroundColor: t.raised,
          borderTopColor: t.line,
          height: 64,
          paddingTop: 6,
          ...elevation(3, t),
        },
        tabBarActiveTintColor: t.fg,
        tabBarInactiveTintColor: t.muted,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 9, letterSpacing: 1.8, textTransform: 'uppercase' },
        sceneStyle: { backgroundColor: t.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Minha lista', tabBarIcon: ({ color }) => <TabIcon name="lista" color={String(color)} /> }} />
      <Tabs.Screen name="buscar" options={{ title: 'Buscar', tabBarIcon: ({ color }) => <TabIcon name="buscar" color={String(color)} /> }} />
      <Tabs.Screen name="painel" options={{ title: 'Programa', tabBarIcon: ({ color }) => <TabIcon name="programa" color={String(color)} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
});
