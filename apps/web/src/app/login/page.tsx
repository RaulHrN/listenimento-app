import { Suspense } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/ui/LoginForm';
import { ThemeToggle } from '@/features/theme/ui/ThemeToggle';
import { Chandelier } from '@/shared/ui/Chandelier';

export const metadata = { title: 'Bilheteria' };

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col">
      <div className="velvet-band" />
      <div className="flex justify-end px-4 pt-4">
        <ThemeToggle className="text-fg" />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          {/* cartão em arco, como uma janela de camarote */}
          <div className="arch card gilt px-9 pb-10 pt-14 text-center">
            <Chandelier size={56} className="mx-auto text-gold" />
            <Link href="/" className="mt-5 block font-display text-4xl text-fg">
              Listen<span className="italic text-accent dark:text-accent-hi">i</span>mento
            </Link>
            <p className="kicker mt-3">Bilheteria</p>
            <div aria-hidden className="mx-auto my-7 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="text-left">
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
