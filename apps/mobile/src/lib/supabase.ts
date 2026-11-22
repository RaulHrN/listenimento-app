import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import type { ListenimentoClient, Database } from '@listenimento/core';

const url = (process.env.EXPO_PUBLIC_SUPABASE_URL ?? '').trim();
const anonKey = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();

/**
 * Valida a configuração ANTES de criar o cliente. Antes, um APK gerado sem
 * as variáveis chamava createClient('') ao abrir, o que lança
 * "supabaseUrl is required." e o Android fechava o app na hora.
 */
function validate(): string | null {
  if (!url || !anonKey) {
    return 'O app foi gerado sem EXPO_PUBLIC_SUPABASE_URL e/ou EXPO_PUBLIC_SUPABASE_ANON_KEY.';
  }
  if (!/^https?:\/\//.test(url)) {
    return `EXPO_PUBLIC_SUPABASE_URL inválida: "${url}". Use a URL do projeto, ex.: https://xxxx.supabase.co`;
  }
  // APKs de release bloqueiam HTTP sem TLS (cleartext); só o modo dev aceita
  if (!__DEV__ && url.startsWith('http://')) {
    return `EXPO_PUBLIC_SUPABASE_URL usa http:// ("${url}"). O Android bloqueia isso em APKs; use a URL https do Supabase Cloud.`;
  }
  return null;
}

export const supabaseConfigError = validate();

if (supabaseConfigError) console.warn(`[listenimento] ${supabaseConfigError}`);

/**
 * Cliente Supabase. Só é criado com configuração válida; com erro, o
 * _layout mostra a tela de configuração e nenhuma tela usa este objeto.
 */
export const supabase: ListenimentoClient = supabaseConfigError
  ? (null as unknown as ListenimentoClient)
  : createClient<Database>(url, anonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

// Só renova o token com o app em primeiro plano
if (!supabaseConfigError) {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}

/** Host do Supabase, para exibir em mensagens de diagnóstico. */
export const supabaseHost = (() => {
  try {
    return new URL(url).host;
  } catch {
    return url || '(vazio)';
  }
})();
