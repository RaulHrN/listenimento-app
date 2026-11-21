'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabase } from '@/shared/lib/supabase/client';

type Mode = 'signin' | 'signup';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/lista';

  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    const supabase = getSupabase();

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace(next);
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name || undefined },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (error) throw error;
        if (data.session) {
          router.replace(next);
          router.refresh();
        } else {
          setInfo('Conta criada! Confira seu e-mail para confirmar o cadastro.');
        }
      }
    } catch (err) {
      setError(translateAuthError(err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      {mode === 'signup' && (
        <label className="flex flex-col gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ticket-muted">
          Nome
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como quer ser chamado" />
        </label>
      )}
      <label className="flex flex-col gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ticket-muted">
        E-mail
        <input className="input" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="flex flex-col gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ticket-muted">
        Senha
        <input
          className="input"
          type="password"
          required
          minLength={6}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {error && <p className="alert">{error}</p>}
      {info && <p className="rounded bg-[#3f7d2a]/12 px-3 py-2 font-mono text-sm text-[#2f6420] shadow-[inset_0_0_0_1px_rgba(63,125,42,0.3)]">{info}</p>}

      <button className="btn-primary mt-2 py-3 text-base" disabled={loading}>
        {loading ? 'Imprimindo…' : mode === 'signin' ? 'Entrar na sessão' : 'Emitir meu ingresso'}
      </button>

      <button
        type="button"
        className="font-mono text-sm text-ticket-muted underline decoration-1 underline-offset-4 transition hover:text-[#9b111a]"
        onClick={() => {
          setMode(mode === 'signin' ? 'signup' : 'signin');
          setError(null);
          setInfo(null);
        }}
      >
        {mode === 'signin' ? 'Primeira vez? Crie sua conta' : 'Já tem ingresso? Entrar'}
      </button>
    </form>
  );
}

function translateAuthError(message: string): string {
  if (/invalid login credentials/i.test(message)) return 'E-mail ou senha incorretos.';
  if (/already registered/i.test(message)) return 'Este e-mail já está cadastrado.';
  if (/email not confirmed/i.test(message)) return 'Confirme seu e-mail antes de entrar.';
  if (/password should be at least/i.test(message)) return 'A senha precisa ter pelo menos 6 caracteres.';
  return message;
}
