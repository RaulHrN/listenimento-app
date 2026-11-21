import { redirect } from 'next/navigation';
import { getProfile } from '@acervo/core';
import { createSupabaseServer } from '@/shared/lib/supabase/server';
import { Header } from '@/widgets/header/Header';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const profile = await getProfile(supabase).catch(() => null);

  return (
    <>
      <Header displayName={profile?.display_name ?? null} />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </>
  );
}
