import { Suspense } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/ui/LoginForm';

export const metadata = { title: 'Entrar' };

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <Link href="/" className="mb-6 block text-center text-2xl font-bold">
          Acervo
        </Link>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
