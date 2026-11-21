'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { AcervoClient, Database } from '@acervo/core';
import { env } from '@/shared/config/env';

let browserClient: AcervoClient | undefined;

/** Cliente Supabase do navegador (singleton). */
export function getSupabase(): AcervoClient {
  browserClient ??= createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
  return browserClient;
}
