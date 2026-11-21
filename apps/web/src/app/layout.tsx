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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#efe7da' },
    { media: '(prefers-color-scheme: dark)', color: '#120b07' },
  ],
};

// Aplica o tema antes da primeira pintura (sem "piscar"):
// preferência salva → senão, o tema do sistema.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
