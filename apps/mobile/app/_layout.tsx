import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { BodoniModa_400Regular, BodoniModa_400Regular_Italic } from '@expo-google-fonts/bodoni-moda';
import { Jost_300Light, Jost_400Regular, Jost_500Medium } from '@expo-google-fonts/jost';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { ThemeProvider, fonts, useTheme } from '@/theme';
import { supabaseConfigError, supabaseHost } from '@/lib/supabase';
import { ProblemScreen } from '@/components/ProblemScreen';

/**
 * Qualquer erro de renderização cai aqui (expo-router) em vez de fechar o app:
 * mostra a mensagem e um botão para tentar de novo.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <ProblemScreen
        title="Algo deu errado"
        message="O app encontrou um erro inesperado. Tente novamente; se continuar, envie a mensagem abaixo para o desenvolvedor."
        details={[error?.message ?? String(error)]}
        action={
          <Pressable onPress={retry} style={{ marginTop: 12, alignSelf: 'flex-start', paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#7d1222' }}>
            <Text style={{ color: '#fbf3e4', letterSpacing: 2, fontSize: 12 }}>TENTAR DE NOVO</Text>
          </Pressable>
        }
      />
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { session, loading } = useAuth();
  const t = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={t.gold} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={t.mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: t.bg },
          headerStyle: { backgroundColor: t.surface },
          headerTitleStyle: { fontFamily: fonts.display, fontSize: 20 },
          headerTintColor: t.gold,
          headerShadowVisible: false,
        }}
      >
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="item/[id]" options={{ headerShown: true, title: '', presentation: 'modal' }} />
        </Stack.Protected>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="login" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BodoniModa_400Regular,
    BodoniModa_400Regular_Italic,
    Jost_300Light,
    Jost_400Regular,
    Jost_500Medium,
  });

  // APK gerado sem as variáveis do Supabase: explica em vez de fechar
  if (supabaseConfigError) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <ProblemScreen
          title="Configuração incompleta"
          message={supabaseConfigError}
          details={[
            'No GitHub: Settings → Secrets and variables → Actions.',
            'Crie EXPO_PUBLIC_SUPABASE_URL (https://xxxx.supabase.co) e EXPO_PUBLIC_SUPABASE_ANON_KEY.',
            'Rode de novo Actions → Android APK e instale o novo APK.',
            `Valor recebido: ${supabaseHost}`,
          ]}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {/* se as fontes falharem, segue com as do sistema em vez de ficar em branco */}
        {fontsLoaded || fontError ? (
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
