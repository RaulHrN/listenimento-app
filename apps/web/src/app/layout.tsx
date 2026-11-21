import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Listenimento', template: '%s · Listenimento' },
  description: 'Sua lista de filmes, séries, jogos, livros, lugares, animes e álbuns.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
