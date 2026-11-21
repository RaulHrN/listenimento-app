import { Suspense } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/ui/LoginForm';
import { ThemeToggle } from '@/features/theme/ui/ThemeToggle';

export const metadata = { title: 'Bilheteria' };

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col">
      <div className="curtain-strip" />
      <div className="flex justify-end px-4 pt-4">
        <ThemeToggle className="text-fg" />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <Link href="/" className="font-marquee text-5xl text-fg [text-shadow:0_1px_0_var(--hi),0_4px_14px_rgba(0,0,0,0.15)]">
              Listenimento
            </Link>
            <p className="kicker mt-2">Bilheteria</p>
          </div>

          {/* ingresso */}
          <div className="ticket-shadow">
            <div className="ticket px-9 pb-8 pt-7">
              <div className="mb-6 flex items-center justify-between border-b border-dashed border-ticket-fg/25 pb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ticket-muted">
                <span>Admite um</span>
                <span>Fila A · 01</span>
              </div>
              <Suspense>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
