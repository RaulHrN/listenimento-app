'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { ListenimentoClient, Database } from '@listenimento/core';
import { env } from '@/shared/config/env';

let browserClient: ListenimentoClient | undefined;

/** Cliente Supabase do navegador (singleton). */
export function getSupabase(): ListenimentoClient {
  browserClient ??= createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
  return browserClient;
}
