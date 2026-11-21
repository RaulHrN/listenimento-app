import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MEDIA_TYPES, MEDIA_TYPE_INFO } from '@listenimento/core';
import { supabase } from '@/lib/supabase';
import { Button, ErrorText, Input } from '@/components/ui';
import { useTheme } from '@/theme';

export default function LoginScreen() {
  const t = useTheme();
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <Text style={styles.emojis}>{MEDIA_TYPES.map((m) => MEDIA_TYPE_INFO[m].emoji).join(' ')}</Text>
        <Text style={[styles.title, { color: t.text }]}>Listenimento</Text>
        <Text style={[styles.subtitle, { color: t.muted }]}>Tudo que você quer assistir, jogar, ler, ouvir e visitar.</Text>

        <View style={styles.form}>
          {mode === 'signup' && <Input placeholder="Nome" value={name} onChangeText={setName} />}
          <Input placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" autoComplete="email" value={email} onChangeText={setEmail} />
          <Input placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
          <ErrorText>{error}</ErrorText>
          {info && <Text style={{ color: '#16a34a' }}>{info}</Text>}
          <Button title={mode === 'signin' ? 'Entrar' : 'Criar conta'} onPress={submit} loading={loading} disabled={!email || password.length < 6} />
          <Pressable onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
            <Text style={{ color: t.muted, textAlign: 'center', marginTop: 8 }}>
              {mode === 'signin' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  emojis: { fontSize: 26, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 34, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center', marginTop: 6, marginBottom: 28 },
  form: { gap: 12 },
});
