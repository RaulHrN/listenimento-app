import type { Metadata, Viewport } from 'next';
// fontes hospedadas no próprio site (sem depender do Google Fonts)
import '@fontsource/anton/400.css';
import '@fontsource/archivo/400.css';
import '@fontsource/archivo/600.css';
import '@fontsource/archivo/800.css';
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Listenimento', template: '%s · Listenimento' },
  description: 'Sua lista de filmes, séries, jogos, livros, lugares, animes e álbuns.',
};

export const viewport: Viewport = {
  themeColor: '#170d08',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
