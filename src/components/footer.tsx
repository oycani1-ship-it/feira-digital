import Link from "next/link";
import { ShoppingBag, Instagram, Facebook, Twitter } from "lucide-react";
import { useTranslation } from "@/context/language-context";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="font-headline text-2xl font-bold text-primary tracking-tight">Feira Digital</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              {t('footer.desc')}
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{t('footer.platform')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/explore" className="hover:text-primary">{t('nav.explore')}</Link></li>
              <li><Link href="/explore?sort=recent" className="hover:text-primary">{t('footer.news')}</Link></li>
              <li><Link href="/#como-funciona" className="hover:text-primary">{t('nav.howItWorks')}</Link></li>
              <li><Link href="/#faq" className="hover:text-primary">{t('footer.faq')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.forSellers')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/register" className="hover:text-primary">{t('nav.createBooth')}</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary">{t('nav.dashboard')}</Link></li>
              <li><Link href="/login" className="hover:text-primary">{t('nav.login')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Feira Digital. {t('footer.rights')}</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:underline">{t('footer.privacy')}</Link>
            <Link href="#" className="hover:underline">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
