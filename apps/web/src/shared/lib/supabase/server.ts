import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@acervo/core';
import { env } from '@/shared/config/env';

/** Cliente Supabase para Server Components, Route Handlers e Server Actions. */
export async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // chamado de um Server Component: o middleware cuida de renovar a sessão
        }
      },
    },
  });
}
