import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServer } from '@/shared/lib/supabase/server';

/** Recebe o link de confirmação de e-mail e troca o código por sessão. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const nextParam = searchParams.get('next') ?? '/lista';
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/lista';

  if (code) {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/login`);
}
