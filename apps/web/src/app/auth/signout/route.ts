import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServer } from '@/shared/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
}
