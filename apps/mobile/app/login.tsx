import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Backdrop, Button, Chandelier, ErrorText, GoldRule, Input, Label, Logo, VelvetBand } from '@/components/ui';
import { elevation, fonts, useTheme } from '@/theme';

export default function LoginScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: name.trim() || undefined } },
        });
        if (error) throw error;
        if (!data.session) setInfo('Conta criada! Confirme pelo e-mail e depois entre.');
      }
      // com sessão, o AuthProvider troca a navegação automaticamente
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(/invalid login/i.test(msg) ? 'E-mail ou senha incorretos.' : msg);
    } finally {
      setLoading(false);
    }
  }

  const ARCH = 180;

  return (
    <View style={{ flex: 1 }}>
      <Backdrop />
      <View style={{ height: insets.top, backgroundColor: t.accentDeep }} />
      <VelvetBand height={8} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* cartão em arco, como uma janela de camarote */}
          <View style={[{ borderTopLeftRadius: ARCH, borderTopRightRadius: ARCH, backgroundColor: t.raised }, elevation(3, t)]}>
            <LinearGradient
              colors={[t.raised, t.surface]}
              style={{ borderTopLeftRadius: ARCH, borderTopRightRadius: ARCH, borderWidth: StyleSheet.hairlineWidth, borderColor: t.line }}
            >
            <View style={[styles.inner, { borderTopLeftRadius: ARCH, borderTopRightRadius: ARCH, borderColor: t.gold + '66' }]}>
              <View style={{ alignItems: 'center' }}>
                <Chandelier size={56} />
                <View style={{ marginTop: 14 }}>
                  <Logo size={36} />
                </View>
                <Text style={[styles.kicker, { color: t.gold }]}>Bilheteria</Text>
                <View style={{ marginVertical: 22 }}>
                  <GoldRule />
                </View>
              </View>

              <View style={{ gap: 14 }}>
                {mode === 'signup' && (
                  <View>
                    <Label>Nome</Label>
                    <Input value={name} onChangeText={setName} placeholder="Como quer ser chamado" />
                  </View>
                )}
                <View>
                  <Label>E-mail</Label>
                  <Input autoCapitalize="none" keyboardType="email-address" autoComplete="email" value={email} onChangeText={setEmail} />
                </View>
                <View>
                  <Label>Senha</Label>
                  <Input secureTextEntry value={password} onChangeText={setPassword} />
                </View>
                <ErrorText>{error}</ErrorText>
                {info && <Text style={{ fontFamily: fonts.body, color: t.status.completed }}>{info}</Text>}
                <Button
                  title={mode === 'signin' ? 'Entrar' : 'Criar conta'}
                  onPress={submit}
                  loading={loading}
                  disabled={!email || password.length < 6}
                  style={{ marginTop: 6 }}
                />
                <Pressable onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
                  <Text style={[styles.switch, { color: t.muted }]}>
                    {mode === 'signin' ? 'Primeira vez? Crie sua conta' : 'Já tem conta? Entrar'}
                  </Text>
                </Pressable>
              </View>
            </View>
            </LinearGradient>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  inner: { margin: 6, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 22, paddingTop: 44, paddingBottom: 26 },
  kicker: { fontFamily: fonts.medium, fontSize: 10, letterSpacing: 3.6, textAlign: 'center', textTransform: 'uppercase', marginTop: 10 },
  switch: { textAlign: 'center', marginTop: 10, fontFamily: fonts.light, fontSize: 14 },
});
