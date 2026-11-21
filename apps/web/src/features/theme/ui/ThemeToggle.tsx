'use client';

import { useEffect, useState } from 'react';

type Mode = 'light' | 'dark';

/** Alterna entre "foyer de dia" (claro) e "noite de estreia" (escuro). */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    setMode(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

    // segue o sistema enquanto a pessoa não escolher um tema
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme')) return;
      const next: Mode = e.matches ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      setMode(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  function toggle() {
    const next: Mode = mode === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* modo privado */
    }
    setMode(next);
  }

  const label = mode === 'dark' ? 'Tema claro' : 'Tema escuro';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`grid h-8 w-8 place-items-center rounded-full border border-current/25 transition hover:border-current/60 ${className}`}
    >
      {/* meia-lua geométrica: metade cheia = tema atual */}
      <span aria-hidden className="relative block h-3.5 w-3.5 overflow-hidden rounded-full border border-current">
        {mode && <span className={`absolute inset-y-0 w-1/2 bg-current ${mode === 'dark' ? 'right-0' : 'left-0'}`} />}
      </span>
    </button>
  );
}
