"use client";

import Link from "next/link";
import { ShoppingBag, Instagram, Facebook, Twitter } from "lucide-react";
import { useTranslation } from "@/context/language-context";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-card border-t mt-auto py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="font-display text-3xl font-bold text-foreground">FEIRA</span>
            </Link>
            <p className="text-muted-foreground max-w-sm font-display text-xl italic leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-mono-tag text-[10px] uppercase tracking-[0.2em] mb-8 text-primary">{t('footer.platform')}</h4>
            <ul className="space-y-4 font-mono-tag text-[10px] uppercase tracking-widest">
              <li><Link href="/explore" className="hover:text-primary transition-colors">{t('nav.explore')}</Link></li>
              <li><Link href="/explore?sort=recent" className="hover:text-primary transition-colors">{t('footer.news')}</Link></li>
              <li><Link href="/#como-funciona" className="hover:text-primary transition-colors">{t('nav.howItWorks')}</Link></li>
              <li><Link href="/#faq" className="hover:text-primary transition-colors">{t('footer.faq')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono-tag text-[10px] uppercase tracking-[0.2em] mb-8 text-primary">{t('footer.forSellers')}</h4>
            <ul className="space-y-4 font-mono-tag text-[10px] uppercase tracking-widest">
              <li><Link href="/register" className="hover:text-primary transition-colors">{t('nav.createBooth')}</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">{t('nav.dashboard')}</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">{t('nav.login')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-24 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 font-mono-tag text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <p>© {new Date().getFullYear()} FEIRA COLLECTIVE. {t('footer.rights')}</p>
          <div className="flex gap-12">
            <Link href="#" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link>
            <Link href="#" className="hover:underline">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
