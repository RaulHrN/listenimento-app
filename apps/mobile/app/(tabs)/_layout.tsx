import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '@/theme';

const icon = (emoji: string) =>
  function TabIcon({ focused }: { focused: boolean }) {
    return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
  };

export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: t.card },
        headerTintColor: t.text,
        tabBarStyle: { backgroundColor: t.card, borderTopColor: t.border },
        tabBarActiveTintColor: t.brand,
        tabBarInactiveTintColor: t.muted,
        sceneStyle: { backgroundColor: t.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Minha lista', tabBarIcon: icon('📋') }} />
      <Tabs.Screen name="buscar" options={{ title: 'Buscar', tabBarIcon: icon('🔎') }} />
      <Tabs.Screen name="painel" options={{ title: 'Painel', tabBarIcon: icon('📊') }} />
    </Tabs>
  );
}
