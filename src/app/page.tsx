"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { WovenText } from "@/components/ui/woven-text";
import { StampButton } from "@/components/ui/stamp-button";
import { KraftCard } from "@/components/ui/kraft-card";
import { TornDivider } from "@/components/ui/torn-divider";
import { PriceTag } from "@/components/ui/price-tag";
import { LoomLoader } from "@/components/ui/loom-loader";
import { useTranslation } from "@/context/language-context";
import { motion, useScroll, useTransform } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { Store, ShoppingBag, ImageIcon, Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  nome: string;
  preco: number;
  imageUrl: string;
  boothNome?: string;
  boothId: string;
  categoria: string;
}

interface Booth {
  id: string;
  nome: string;
  logoUrl?: string;
  capaUrl?: string;
  categoria: string;
  localizacao: string;
  estado: string;
  avgRating?: number;
}

export default function Home() {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const heroRef = useRef<HTMLElement>(null);
  const hasFetched = useRef(false);
  
  const { scrollYProgress } = useScroll({
    target: isReady ? (heroRef as any) : undefined,
    layoutEffect: false,
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    if (heroRef.current) setIsReady(true);
    const timer = setTimeout(() => setIsLoaded(true), 1200);

    const fetchData = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      
      try {
        setLoadingData(true);
        
        const prodQuery = query(
          collection(db, "products"),
          where("isActive", "==", true),
          orderBy("createdAt", "desc"),
          limit(6)
        );
        const prodSnap = await getDocs(prodQuery);
        const fetchedProds = prodSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(fetchedProds);

        const boothQuery = query(
          collection(db, "booths"),
          where("isActive", "==", true),
          orderBy("createdAt", "desc"),
          limit(4)
        );
        const boothSnap = await getDocs(boothQuery);
        const fetchedBooths = boothSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Booth[];
        setBooths(fetchedBooths);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Erro ao carregar os dados da feira.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <LoomLoader />
      </div>
    );
  }

  const ProductSkeleton = () => (
    <div className="bg-card/50 p-6 rounded-none border border-border/20 animate-pulse">
      <div className="aspect-[3/4] bg-muted mb-6" />
      <div className="h-6 bg-muted w-3/4 mb-4" />
      <div className="flex justify-between items-center">
        <div className="h-4 bg-muted w-1/4" />
        <div className="h-8 bg-muted w-1/4" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* HERO SECTION */}
        <section ref={heroRef} className="relative min-h-[90vh] flex flex-col justify-center px-4 lg:px-12 linen-grid overflow-hidden">
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 z-10">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono-tag text-[10px] uppercase tracking-[0.3em] text-primary block mb-6"
              >
                {t('sections.legacy')}
              </motion.span>
              <WovenText 
                as="h1"
                text={t('hero.editorial')}
                className="text-6xl md:text-9xl leading-[0.85] italic text-foreground max-w-4xl"
              />
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 text-muted-foreground text-lg max-w-md leading-relaxed"
              >
                {t('hero.description')}
              </motion.p>
              <div className="mt-12">
                <Link href="/explore">
                  <StampButton>
                    {t('hero.cta')}
                  </StampButton>
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-5 relative h-[600px] lg:h-[800px]">
              <motion.div 
                style={{ y }}
                className="relative w-full h-full border border-border p-4 bg-card shadow-lg rotate-3"
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image 
                    src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&q=80&w=1000"
                    alt="Artisan Craft"
                    fill
                    priority
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute bottom-6 right-6">
                    <PriceTag price={240} artisan="Mestre Helena" origin="Vale do Jequitinhonha" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <TornDivider />

        {/* PRODUCTS SECTION (OBRAS) */}
        <section className="py-32 px-4 lg:px-12">
          <div className="container mx-auto">
            <div className="mb-24 flex flex-col items-center text-center">
              <WovenText 
                text={t('sections.legacyTitle')}
                className="text-4xl md:text-7xl italic max-w-3xl mb-8"
              />
              <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
                {t('sections.legacyDesc')}
              </p>
            </div>

            {loadingData ? (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {products.map((product, i) => (
                  <KraftCard key={product.id} className={i % 2 === 0 ? "rotate-1" : "-rotate-1"}>
                    <Link href={`/barraca/${product.boothId}`} className="block group">
                      <div className="aspect-[3/4] relative mb-6 overflow-hidden bg-muted flex items-center justify-center">
                        {product.imageUrl ? (
                          <Image 
                            src={product.imageUrl}
                            alt={product.nome ?? "Produto"}
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                          />
                        ) : (
                          <ImageIcon className="h-12 w-12 text-muted-foreground/20" />
                        )}
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-[10px] font-mono-tag uppercase tracking-widest border-none">
                            {(product.categoria ?? "").toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <h3 className="font-display text-2xl mb-1 group-hover:text-primary transition-colors">
                        {(product.nome ?? "").toUpperCase()}
                      </h3>
                      <p className="font-mono-tag text-[9px] uppercase tracking-widest text-muted-foreground mb-4">
                        {product.boothNome || "Ateliê Independente"}
                      </p>
                    </Link>
                    <div className="flex justify-end">
                      <PriceTag price={product.preco} origin={product.categoria} />
                    </div>
                  </KraftCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-muted/20 rounded-none border-2 border-dashed flex flex-col items-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/20 mb-6" />
                <h3 className="font-display text-3xl italic mb-4">Nenhum produto cadastrado ainda.</h3>
                <Link href="/register">
                  <StampButton variant="outline">Seja o primeiro artesão</StampButton>
                </Link>
              </div>
            )}
          </div>
        </section>

        <TornDivider />

        {/* FEATURED BOOTHS */}
        <section className="py-32 px-4 lg:px-12 bg-surface/30">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <span className="font-mono-tag text-[10px] uppercase tracking-[0.3em] text-secondary block mb-4">Artesãos de Alma</span>
                <WovenText 
                  text="Mestres & Oficinas"
                  className="text-4xl md:text-6xl italic"
                />
              </div>
              <Link href="/explore" className="font-mono-tag text-xs uppercase tracking-widest link-underline">
                Ver todos os artesãos
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {loadingData ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-muted animate-pulse border border-border/20" />
                ))
              ) : booths.map((booth, i) => (
                <Link key={booth.id} href={`/barraca/${booth.id}`}>
                  <motion.div 
                    whileHover={{ y: -8 }}
                    className={`relative aspect-[4/5] bg-card shadow-lg border border-border/40 overflow-hidden group ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
                  >
                    {booth.capaUrl ? (
                      <Image 
                        src={booth.capaUrl} 
                        alt={booth.nome ?? "Barraca"} 
                        fill 
                        className="object-cover grayscale group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
                         <Store className="h-12 w-12 text-muted-foreground/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full border-2 border-white overflow-hidden bg-white shrink-0">
                          {booth.logoUrl ? (
                            <Image src={booth.logoUrl} alt={booth.nome ?? "Logo"} width={40} height={40} className="object-cover" />
                          ) : (
                            <div className="h-full w-full bg-primary flex items-center justify-center text-white text-[10px]">
                              {(booth.nome ?? "B").charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-display text-white text-xl leading-none">{booth.nome}</h4>
                          <span className="font-mono-tag text-[8px] text-white/60 uppercase tracking-widest">{booth.categoria}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-[9px] text-white/80 font-mono-tag uppercase">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-2 w-2" /> {booth.localizacao}, {booth.estado}
                        </div>
                        {booth.avgRating && booth.avgRating > 0 && (
                          <div className="flex items-center gap-1 text-gold">
                            <Star className="h-2 w-2 fill-current" /> {booth.avgRating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <TornDivider />

        {/* FULL BLEED - AUTHENTICITY */}
        <section className="h-[80vh] relative overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80&w=1920"
            alt="Artisan Hands"
            fill
            className="object-cover brightness-50 grayscale"
            sizes="100vw"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <WovenText 
                text={t('sections.authenticity')}
                className="text-white text-4xl md:text-8xl italic font-light tracking-tighter"
              />
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                <Link href="/register">
                  <StampButton variant="outline" className="text-white border-white hover:bg-white/10">
                    {t('sections.pathCta')}
                  </StampButton>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <TornDivider />

        {/* CALL TO ACTION */}
        <section className="py-32 px-4 lg:px-12 bg-surface">
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="font-mono-tag text-[10px] uppercase tracking-[0.3em] text-secondary block mb-6">{t('sections.path')}</span>
              <WovenText 
                text={t('sections.pathTitle')}
                className="text-4xl md:text-7xl mb-8 italic"
              />
              <p className="text-muted-foreground text-xl leading-relaxed max-w-xl">
                {t('sections.pathDesc')}
              </p>
            </div>
            <div className="flex justify-center">
              <KraftCard className="w-full max-w-md p-12 bg-background border-primary/20">
                <h4 className="font-mono-tag text-xs uppercase tracking-widest mb-8 text-center">{t('auth.registerTitle')}</h4>
                <div className="space-y-6">
                  <div className="h-px bg-border w-full" />
                  <p className="font-display text-2xl text-center italic">{t('auth.registerSubtitle')}</p>
                  <div className="h-px bg-border w-full" />
                </div>
                <div className="mt-12 flex justify-center">
                  <Link href="/register">
                    <StampButton className="w-full">{t('nav.createBooth')}</StampButton>
                  </Link>
                </div>
              </KraftCard>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
