import { Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Valance } from '@/components/ui';
import { fonts, theme as t } from '@/theme';

const icon = (emoji: string) =>
  function TabIcon({ focused }: { focused: boolean }) {
    return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>;
  };

/** Cabeçalho: letreiro com o nome + sanefa de cortina. */
function CinemaHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: t.ink, paddingTop: insets.top }}>
      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: 28,
          color: t.brass,
          textTransform: 'uppercase',
          letterSpacing: 1,
          paddingHorizontal: 16,
          paddingVertical: 8,
          textShadowColor: t.curtain,
          textShadowOffset: { width: 3, height: 3 },
          textShadowRadius: 0.1,
        }}
      >
        Listenimento
      </Text>
      <Valance />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <CinemaHeader />,
        tabBarStyle: { backgroundColor: t.ink, borderTopColor: t.brassDark, borderTopWidth: 3, height: 64 },
        tabBarActiveTintColor: t.brass,
        tabBarInactiveTintColor: t.muted,
        tabBarLabelStyle: { fontFamily: fonts.display, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
        sceneStyle: { backgroundColor: t.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Minha lista', tabBarIcon: icon('🎟️') }} />
      <Tabs.Screen name="buscar" options={{ title: 'Buscar', tabBarIcon: icon('🔦') }} />
      <Tabs.Screen name="painel" options={{ title: 'Placar', tabBarIcon: icon('🎞️') }} />
    </Tabs>
  );
}
