"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Eye, Package, Star, MessageCircle, ArrowUpRight, Plus, ExternalLink, Loader2, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "@/context/language-context";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { WovenText } from "@/components/ui/woven-text";

export default function DashboardHome() {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    views: 0,
    products: 0,
    rating: 0,
    totalRatings: 0,
    clicks: 0
  });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchStats(currentUser.uid);
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  const fetchStats = async (uid: string) => {
    try {
      const boothRef = doc(db, "booths", uid);
      const boothSnap = await getDoc(boothRef);
      
      let boothData = {
        views: 0,
        averageRating: 0,
        totalRatings: 0,
        whatsappClicks: 0
      };

      if (boothSnap.exists()) {
        const data = boothSnap.data();
        boothData = {
          views: data.views ?? 0,
          averageRating: data.averageRating ?? 0,
          totalRatings: data.totalRatings ?? 0,
          whatsappClicks: data.whatsappClicks ?? 0
        };
      }

      const productsQuery = query(
        collection(db, "products"),
        where("sellerId", "==", uid)
      );
      const productsSnap = await getDocs(productsQuery);
      const productCount = productsSnap.size;

      setStats({
        views: boothData.views,
        products: productCount,
        rating: boothData.averageRating,
        totalRatings: boothData.totalRatings,
        clicks: boothData.whatsappClicks
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const quickActions = [
    {
      href: "/dashboard/produtos/novo",
      icon: Plus,
      label: t('dashboard.home.quickActions.newProduct'),
      color: "bg-primary text-primary-foreground"
    },
    {
      href: "/dashboard/barraca",
      icon: Store,
      label: t('dashboard.home.quickActions.editBooth'),
      color: "bg-surface text-foreground border border-border"
    },
    {
      href: user ? `/barraca/${user.uid}` : "/explore",
      icon: ExternalLink,
      label: t('dashboard.home.quickActions.viewPublic'),
      color: "bg-surface text-foreground border border-border"
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header>
        <WovenText 
          as="h1"
          text={`${t('dashboard.home.welcome')}, ${user?.displayName?.split(' ')[0] || "Artesão"}!`}
          className="text-4xl md:text-5xl font-display mb-3"
        />
        <p className="text-muted-foreground max-w-2xl">
          {t('dashboard.home.subtitle')}
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('dashboard.home.stats.views'), val: stats.views ?? 0, icon: Eye, desc: t('dashboard.home.stats.viewsDesc') },
          { label: t('dashboard.home.stats.products'), val: stats.products ?? 0, icon: Package, desc: t('dashboard.home.stats.productsDesc') },
          { label: t('dashboard.home.stats.rating'), val: (stats.rating ?? 0).toFixed(1), icon: Star, desc: t('dashboard.home.stats.ratingDesc').replace('{count}', (stats.totalRatings ?? 0).toString()) },
          { label: t('dashboard.home.stats.clicks'), val: stats.clicks ?? 0, icon: MessageCircle, desc: t('dashboard.home.stats.clicksDesc') },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm bg-surface overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-mono-tag text-[10px] uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display mb-1">{stat.val}</div>
                <p className="text-[10px] font-mono-tag text-muted-foreground uppercase tracking-tighter">{stat.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Quick Actions */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-display text-2xl italic">{t('dashboard.home.quickActions.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => (
              <MagneticButton key={i} className="w-full">
                <Link 
                  href={action.href}
                  className={`flex items-center justify-between w-full h-20 px-6 rounded-none transition-all duration-300 group ${action.color}`}
                  data-cursor="stitch"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-full group-hover:scale-110 transition-transform">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono-tag text-[10px] uppercase tracking-widest font-bold">{action.label}</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </Link>
              </MagneticButton>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="font-display text-2xl italic">{t('dashboard.home.tips.title')}</h2>
          <Card className="border-border/50 bg-surface/50 dog-ear p-2">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 bg-primary text-primary-foreground flex items-center justify-center font-display italic text-xl">!</div>
                <div>
                  <h4 className="font-bold mb-1 text-sm">{t('dashboard.home.tips.tip1Title')}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t('dashboard.home.tips.tip1Desc')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}