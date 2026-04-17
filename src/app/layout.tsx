import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/context/language-context";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { NoiseTexture } from "@/components/ui/noise-texture";

export const metadata: Metadata = {
  title: 'FEIRA | Editorial Craftsmanship',
  description: 'A curated digital stage for artisanal excellence.',
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
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased overflow-x-hidden">
        <LanguageProvider>
          <NoiseTexture />
          <CustomCursor />
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
