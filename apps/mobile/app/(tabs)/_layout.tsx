import { Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CurtainStrip, WoodBar } from '@/components/ui';
import { elevation, fonts, useTheme } from '@/theme';

const icon = (emoji: string) =>
  function TabIcon({ focused }: { focused: boolean }) {
    return <Text style={{ fontSize: 19, opacity: focused ? 1 : 0.4 }}>{emoji}</Text>;
  };

/** Cabeçalho: fachada de madeira com o nome iluminado + faixa de cortina. */
function CinemaHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ zIndex: 10 }}>
      <WoodBar style={{ paddingTop: insets.top }}>
        <Text
          style={{
            fontFamily: fonts.display,
            fontSize: 24,
            color: '#e8bd63',
            textTransform: 'uppercase',
            letterSpacing: 1,
            paddingHorizontal: 18,
            paddingVertical: 10,
            textShadowColor: 'rgba(255,200,110,0.45)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 10,
          }}
        >
          Listenimento
        </Text>
      </WoodBar>
      <CurtainStrip />
    </View>
  );
}

export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs
      screenOptions={{
        header: () => <CinemaHeader />,
        tabBarStyle: {
          backgroundColor: t.raised,
          borderTopColor: t.line,
          height: 62,
          ...elevation(3, t),
        },
        tabBarActiveTintColor: t.accentHi,
        tabBarInactiveTintColor: t.muted,
        tabBarLabelStyle: { fontFamily: fonts.monoBold, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
        sceneStyle: { backgroundColor: t.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Minha lista', tabBarIcon: icon('🎟️') }} />
      <Tabs.Screen name="buscar" options={{ title: 'Buscar', tabBarIcon: icon('🔦') }} />
      <Tabs.Screen name="painel" options={{ title: 'Placar', tabBarIcon: icon('🎞️') }} />
    </Tabs>
  );
}
