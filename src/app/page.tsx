"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WovenText } from "@/components/ui/woven-text";
import { StampButton } from "@/components/ui/stamp-button";
import { KraftCard } from "@/components/ui/kraft-card";
import { TornDivider } from "@/components/ui/torn-divider";
import { PriceTag } from "@/components/ui/price-tag";
import { LoomLoader } from "@/components/ui/loom-loader";
import { useTranslation } from "@/context/language-context";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
    layoutEffect: false, // Resolve o erro de hidratação quando o ref ainda não está pronto
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <LoomLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
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
                    src="https://picsum.photos/seed/artisan-1/1000/1200"
                    alt="Artisan Craft"
                    fill
                    priority
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    data-ai-hint="artisan hands"
                  />
                  <div className="absolute bottom-6 right-6">
                    <PriceTag price={2400} artisan="Mestre Helena" origin="Vale do Jequitinhonha" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <TornDivider />

        {/* FEATURE 01 - MASONRY FEEL */}
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

            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <KraftCard key={i} className={i % 2 === 0 ? "rotate-1" : "-rotate-1"}>
                  <div className="aspect-[3/4] relative mb-6 overflow-hidden">
                    <Image 
                      src={`https://picsum.photos/seed/artisan-item-${i}/600/800`}
                      alt={`Item ${i}`}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    />
                  </div>
                  <h3 className="font-display text-2xl mb-2">Obra No. 0{i}</h3>
                  <div className="flex justify-between items-end">
                    <span className="font-mono-tag text-[10px] uppercase tracking-widest text-muted-foreground">Coleção Limitada</span>
                    <PriceTag price={450 + i * 100} artisan="Mestre Pedro" />
                  </div>
                </KraftCard>
              ))}
            </div>
          </div>
        </section>

        <TornDivider />

        {/* FULL BLEED - AUTHENTICITY */}
        <section className="h-[80vh] relative overflow-hidden">
          <Image 
            src="https://picsum.photos/seed/artisan-workshop/1920/1200"
            alt="Workshop"
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

      <Footer />
    </div>
  );
}
