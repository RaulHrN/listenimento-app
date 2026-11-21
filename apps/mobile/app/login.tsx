import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Backdrop, Button, CurtainStrip, ErrorText, Input } from '@/components/ui';
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
        if (!data.session) setInfo('Ingresso emitido! Confirme pelo e-mail e depois entre.');
      }
      // com sessão, o AuthProvider troca a navegação automaticamente
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(/invalid login/i.test(msg) ? 'E-mail ou senha incorretos.' : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Backdrop />
      <View style={{ paddingTop: insets.top, backgroundColor: t.accentDeep }}>
        <CurtainStrip height={10} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text
            style={[
              styles.title,
              {
                color: t.fg,
                textShadowColor: t.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
              },
            ]}
          >
            Listenimento
          </Text>
          <Text style={[styles.kicker, { color: t.brass }]}>Bilheteria</Text>

          {/* ingresso de papel com sombra e recortes */}
          <View style={[{ marginTop: 28, borderRadius: 6 }, elevation(3, t)]}>
            <LinearGradient colors={['#fbf4e2', t.ticket, t.ticket]} locations={[0, 0.3, 1]} style={styles.ticket}>
              <View style={[styles.notch, { left: -12, backgroundColor: t.bg }]} />
              <View style={[styles.notch, { right: -12, backgroundColor: t.bg }]} />
              <View style={styles.ticketHead}>
                <Text style={[styles.ticketHeadText, { color: t.ticketMuted }]}>Admite um</Text>
                <Text style={[styles.ticketHeadText, { color: t.ticketMuted }]}>Fila A · 01</Text>
              </View>
              <View style={{ gap: 12 }}>
                {mode === 'signup' && <Input placeholder="Nome" value={name} onChangeText={setName} />}
                <Input placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" autoComplete="email" value={email} onChangeText={setEmail} />
                <Input placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
                <ErrorText>{error}</ErrorText>
                {info && <Text style={{ fontFamily: fonts.mono, color: '#2f6420' }}>{info}</Text>}
                <Button
                  title={mode === 'signin' ? 'Entrar na sessão' : 'Emitir meu ingresso'}
                  onPress={submit}
                  loading={loading}
                  disabled={!email || password.length < 6}
                  style={{ marginTop: 4 }}
                />
                <Pressable onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
                  <Text style={[styles.switch, { color: t.ticketMuted }]}>
                    {mode === 'signin' ? 'Primeira vez? Crie sua conta' : 'Já tem ingresso? Entrar'}
                  </Text>
                </Pressable>
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
  title: {
    fontFamily: fonts.display,
    fontSize: 46,
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  kicker: { fontFamily: fonts.monoBold, fontSize: 11, letterSpacing: 4, textAlign: 'center', textTransform: 'uppercase', marginTop: 4 },
  ticket: { borderRadius: 6, paddingHorizontal: 24, paddingTop: 18, paddingBottom: 22 },
  notch: { position: 'absolute', top: '50%', width: 24, height: 24, marginTop: -12, borderRadius: 12 },
  ticketHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(35,21,13,0.25)',
    paddingBottom: 10,
    marginBottom: 18,
  },
  ticketHeadText: { fontFamily: fonts.monoBold, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },
  switch: { textAlign: 'center', marginTop: 8, fontFamily: fonts.mono, textDecorationLine: 'underline' },
});
