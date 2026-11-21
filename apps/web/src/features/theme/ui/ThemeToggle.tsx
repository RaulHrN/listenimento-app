'use client';

import { useEffect, useState } from 'react';

type Mode = 'light' | 'dark';

/** Alterna entre "luzes acesas" (claro) e "sessão" (escuro). */
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

  const label = mode === 'dark' ? 'Acender as luzes (tema claro)' : 'Apagar as luzes (tema escuro)';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-full text-lg transition hover:scale-105 ${className}`}
      style={{
        background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18), rgba(0,0,0,0.25))',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 6px rgba(0,0,0,0.35)',
      }}
    >
      <span aria-hidden>{mode === null ? '' : mode === 'dark' ? '☀︎' : '☾'}</span>
    </button>
  );
}
