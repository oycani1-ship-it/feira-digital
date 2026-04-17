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
          views: data.views || 0,
          averageRating: data.averageRating || 0,
          totalRatings: data.totalRatings || 0,
          whatsappClicks: data.whatsappClicks || 0
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="font-headline text-3xl font-bold mb-2">{t('dashboard.home.welcome')}, {user?.displayName?.split(' ')[0] || "Artesão"}!</h1>
        <p className="text-muted-foreground">{t('dashboard.home.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-primary/70">{t('dashboard.home.stats.views')}</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.views}</div>
            <p className="text-[10px] text-muted-foreground mt-1">{t('dashboard.home.stats.viewsDesc')}</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-primary/70">{t('dashboard.home.stats.products')}</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
            <p className="text-[10px] text-muted-foreground mt-1">{t('dashboard.home.stats.productsDesc')}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-primary/70">{t('dashboard.home.stats.rating')}</CardTitle>
            <Star className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rating.toFixed(1)}</div>
            <p className="text-[10px] text-muted-foreground mt-1">{t('dashboard.home.stats.ratingDesc').replace('{count}', stats.totalRatings.toString())}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-primary/70">{t('dashboard.home.stats.clicks')}</CardTitle>
            <MessageCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clicks}</div>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              {t('dashboard.home.stats.clicksDesc')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="font-bold text-xl">{t('dashboard.home.quickActions.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button asChild className="h-16 justify-between px-6" variant="outline">
              <Link href="/dashboard/produtos/novo">
                <span className="flex items-center gap-3 font-bold"><Plus className="h-5 w-5 text-primary" /> {t('dashboard.home.quickActions.newProduct')}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
            <Button asChild className="h-16 justify-between px-6" variant="outline">
              <Link href="/dashboard/barraca">
                <span className="flex items-center gap-3 font-bold"><Store className="h-5 w-5 text-primary" /> {t('dashboard.home.quickActions.editBooth')}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
            <Button asChild className="h-16 justify-between px-6" variant="outline">
              <Link href={user ? `/barraca/${user.uid}` : "/explore"}>
                <span className="flex items-center gap-3 font-bold"><ExternalLink className="h-5 w-5 text-primary" /> {t('dashboard.home.quickActions.viewPublic')}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-bold text-xl">{t('dashboard.home.tips.title')}</h2>
          <Card className="border-none bg-muted/30">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 bg-primary text-white rounded-lg flex items-center justify-center font-bold">!</div>
                <div>
                  <h4 className="font-bold mb-1">{t('dashboard.home.tips.tip1Title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('dashboard.home.tips.tip1Desc')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
