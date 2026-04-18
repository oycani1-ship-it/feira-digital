"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, Globe, Menu, X, LogOut, LayoutDashboard, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/context/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const router = useRouter();
  const { t, setLanguage } = useTranslation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2" data-cursor="stitch">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span className="font-display text-2xl font-bold text-foreground tracking-tight">FEIRA</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/explore" className="font-mono-tag text-[10px] uppercase tracking-widest hover:text-primary transition-colors">{t('nav.explore')}</Link>
            <Link href="/produtos" className="font-mono-tag text-[10px] uppercase tracking-widest hover:text-primary transition-colors">{t('nav.products')}</Link>
            <Link href="/#como-funciona" className="font-mono-tag text-[10px] uppercase tracking-widest hover:text-primary transition-colors">{t('nav.howItWorks')}</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" data-cursor="stitch">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem onClick={() => setLanguage('pt-BR')} className="font-mono-tag text-[10px] uppercase">Português (BR)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en-US')} className="font-mono-tag text-[10px] uppercase">English (US)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('es-ES')} className="font-mono-tag text-[10px] uppercase">Español (ES)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-cursor="stitch">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                    <AvatarFallback className="bg-muted text-xs font-mono-tag">{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border-border" align="end">
                <DropdownMenuLabel className="font-mono-tag text-[10px] uppercase px-3 py-2">
                  {user.displayName || "Artesão"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer font-mono-tag text-[10px] uppercase">
                    <LayoutDashboard className="mr-2 h-3 w-3" />
                    {t('nav.dashboard')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive font-mono-tag text-[10px] uppercase cursor-pointer">
                  <LogOut className="mr-2 h-3 w-3" />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden sm:inline-flex font-mono-tag text-[10px] uppercase px-4 hover:text-primary transition-colors">
                {t('nav.login')}
              </Link>
              <Link href="/register" className="bg-primary text-primary-foreground font-mono-tag text-[10px] uppercase px-6 py-2 tracking-widest hover:brightness-110 transition-all">
                {t('nav.createBooth')}
              </Link>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden p-8 bg-background border-b flex flex-col gap-6 animate-in slide-in-from-top-4">
          <Link href="/explore" className="font-mono-tag text-[10px] uppercase tracking-widest" onClick={() => setIsOpen(false)}>{t('nav.explore')}</Link>
          <Link href="/produtos" className="font-mono-tag text-[10px] uppercase tracking-widest" onClick={() => setIsOpen(false)}>{t('nav.products')}</Link>
          <Link href="/#como-funciona" className="font-mono-tag text-[10px] uppercase tracking-widest" onClick={() => setIsOpen(false)}>{t('nav.howItWorks')}</Link>
          {!user && (
            <Link href="/login" className="font-mono-tag text-[10px] uppercase tracking-widest border-t pt-6" onClick={() => setIsOpen(false)}>{t('nav.login')}</Link>
          )}
        </div>
      )}
    </nav>
  );
}
