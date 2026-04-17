import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/context/language-context";
import { ArtisanCursor } from "@/components/ui/artisan-cursor";

export const metadata: Metadata = {
  title: 'FEIRA | Artisan Craft Collective',
  description: 'A digital stage for premium handcrafted excellence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased overflow-x-hidden paper-grain">
        <LanguageProvider>
          <ArtisanCursor />
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
