"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  Settings, 
  ChevronRight,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/language-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const sidebarLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: t('dashboard.sidebar.general') },
    { href: "/dashboard/barraca", icon: Store, label: t('dashboard.sidebar.myBooth') },
    { href: "/dashboard/produtos", icon: Package, label: t('dashboard.sidebar.products') },
    { href: "/dashboard/conta", icon: Settings, label: t('dashboard.sidebar.account') },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Carregando painel...</p>
        </div>
      </div>
    );
  }

  if (!user) { router.replace("/login"); return null; }

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <div className="flex-1 flex flex-col md:flex-row container mx-auto px-4 py-8 gap-8">
        {/* Mobile Nav */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-4 border-b mb-4 no-scrollbar">
          {sidebarLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium",
                pathname === link.href ? "bg-primary text-white" : "bg-white text-muted-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24 space-y-1">
            {sidebarLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-smooth group",
                  pathname === link.href 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-white hover:text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon className={cn("h-5 w-5", pathname === link.href ? "text-white" : "group-hover:text-primary")} />
                  {link.label}
                </div>
                {pathname === link.href && <ChevronRight className="h-4 w-4" />}
              </Link>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border min-h-[600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
