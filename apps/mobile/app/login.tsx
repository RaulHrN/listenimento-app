import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Brut, Button, ErrorText, Input, Marquee, Planks, Valance } from '@/components/ui';
import { fonts, theme as t } from '@/theme';

export default function LoginScreen() {
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
      <Planks />
      <View style={{ paddingTop: insets.top, backgroundColor: t.ink }}>
        <Valance />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Marquee>
            <Text style={styles.kicker}>Hoje em cartaz</Text>
            <Text style={styles.title}>Listenimento</Text>
            <Text style={styles.subtitle}>Tudo que você quer assistir, jogar, ler, ouvir e visitar.</Text>
          </Marquee>

          {/* ingresso */}
          <Brut offset={6} contentStyle={styles.ticket} style={{ marginTop: 28 }}>
            <View style={[styles.notch, { left: -14 }]} />
            <View style={[styles.notch, { right: -14 }]} />
            <View style={styles.ticketHead}>
              <Text style={styles.ticketHeadText}>Admite um</Text>
              <Text style={styles.ticketHeadText}>Fila A · Poltrona 1</Text>
            </View>
            <View style={{ gap: 12 }}>
              {mode === 'signup' && <Input placeholder="Nome" value={name} onChangeText={setName} />}
              <Input placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" autoComplete="email" value={email} onChangeText={setEmail} />
              <Input placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
              <ErrorText>{error}</ErrorText>
              {info && (
                <View style={{ backgroundColor: t.brass, borderWidth: 3, borderColor: t.ink, padding: 10 }}>
                  <Text style={{ fontFamily: fonts.mono, color: t.ink }}>{info}</Text>
                </View>
              )}
              <Button
                title={mode === 'signin' ? 'Entrar na sessão' : 'Emitir meu ingresso'}
                onPress={submit}
                loading={loading}
                disabled={!email || password.length < 6}
                style={{ marginTop: 4 }}
              />
              <Pressable onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
                <Text style={styles.switch}>{mode === 'signin' ? 'Primeira vez? Crie sua conta' : 'Já tem ingresso? Entrar'}</Text>
              </Pressable>
            </View>
          </Brut>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 22 },
  kicker: { color: t.brass, fontFamily: fonts.monoBold, fontSize: 11, letterSpacing: 4, textAlign: 'center', textTransform: 'uppercase' },
  title: {
    color: t.paper,
    fontFamily: fonts.display,
    fontSize: 46,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 4,
    textShadowColor: t.curtain,
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0.1,
  },
  subtitle: { color: t.muted, fontFamily: fonts.mono, fontSize: 13, textAlign: 'center', marginTop: 6 },
  ticket: { backgroundColor: t.paper, paddingHorizontal: 24, paddingTop: 18, paddingBottom: 22, overflow: 'visible' },
  notch: { position: 'absolute', top: '50%', width: 24, height: 24, marginTop: -12, borderRadius: 12, backgroundColor: t.wood900, borderWidth: 3, borderColor: t.ink },
  ticketHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(12,8,6,0.35)',
    paddingBottom: 10,
    marginBottom: 16,
  },
  ticketHeadText: { fontFamily: fonts.monoBold, fontSize: 10, letterSpacing: 2, color: t.ink, textTransform: 'uppercase' },
  switch: { color: '#5a4636', textAlign: 'center', marginTop: 8, fontFamily: fonts.mono, textDecorationLine: 'underline' },
});
