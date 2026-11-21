import { Suspense } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/ui/LoginForm';

export const metadata = { title: 'Bilheteria' };

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col">
      <div className="curtain h-8 border-b-[3px] border-ink" />
      <div className="valance -mt-px" />

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* placa da bilheteria */}
          <div className="panel relative z-10 mx-6 px-6 py-4 text-center">
            <Link href="/" className="font-marquee block text-4xl text-brass [text-shadow:3px_3px_0_var(--color-ink)]">
              Listenimento
            </Link>
            <p className="kicker mt-1 text-paper">Bilheteria</p>
          </div>

          {/* ingresso */}
          <div className="-mt-2 drop-shadow-[8px_8px_0_#0c0806]">
            <div className="ticket px-10 pb-8 pt-9">
              <div className="mb-5 flex items-center justify-between border-b-2 border-dashed border-ink/40 pb-3 font-mono text-[11px] font-bold uppercase tracking-widest">
                <span>Admite um</span>
                <span>Fila A · Poltrona 1</span>
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
