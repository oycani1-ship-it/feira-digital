"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { TextReveal } from "@/components/ui/text-reveal";
import { ArrowRight, MoveUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "@/context/language-context";

export default function Home() {
  const { t } = useTranslation();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1.3]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navbar />
      
      <main>
        {/* HERO - Asymmetric Luxury */}
        <section ref={heroRef} className="relative min-h-screen flex items-end pb-24 px-4 lg:px-12 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <motion.div style={{ y, scale }} className="relative w-full h-full">
              <Image 
                src="https://picsum.photos/seed/editorial-1/1920/1080"
                alt="Editorial Craft"
                fill
                priority
                className="object-cover grayscale brightness-[0.7]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-background/10 mix-blend-multiply" />
            </motion.div>
          </div>

          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-8 gap-8 relative z-10">
            <div className="lg:col-span-5">
              <TextReveal 
                as="h1"
                text="The singular resonance of raw craftsmanship."
                className="text-6xl md:text-8xl text-white leading-[0.9] max-w-4xl"
              />
            </div>
            <div className="lg:col-span-3 flex flex-col justify-end items-start lg:items-end">
              <p className="text-white/80 text-lg mb-8 max-w-sm lg:text-right">
                A curated digital stage for artisanal excellence. Where every stitch narrates a lineage of mastery.
              </p>
              <MagneticButton>
                <Link href="/explore" className="bg-primary text-white px-12 py-5 rounded-none flex items-center gap-4 group transition-expo">
                  <span className="text-sm font-bold uppercase tracking-widest">Begin Discovery</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-expo" />
                </Link>
              </MagneticButton>
            </div>
          </div>
        </section>

        {/* SECTION DIVIDER - Scissor Cut */}
        <div className="h-px bg-border w-full scale-x-0 origin-left" data-cursor="cut" />

        {/* FEATURE 01 - Editorial Grid */}
        <section className="py-32 px-4 lg:px-12 bg-background">
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="aspect-[4/5] relative overflow-hidden group">
                <Image 
                  src="https://picsum.photos/seed/editorial-2/1000/1250"
                  alt="Craft"
                  fill
                  className="object-cover transition-expo scale-110 group-hover:scale-100 grayscale hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>
            <div className="lg:col-span-7 lg:pl-12 order-1 lg:order-2">
              <span className="text-primary font-bold uppercase text-xs tracking-widest mb-6 block">Legacy & Form</span>
              <TextReveal 
                text="Curated collections that transcend the ephemeral."
                className="text-4xl md:text-6xl mb-8"
              />
              <p className="text-muted-foreground text-xl leading-relaxed max-w-xl mb-12">
                We bridge the gap between ancient techniques and contemporary sensibilities. No mass production. No compromises. Just pure human intention.
              </p>
              <Link href="/explore" className="link-underline font-bold text-sm uppercase tracking-widest">
                Explore Collections
              </Link>
            </div>
          </div>
        </section>

        {/* FULL BLEED MOMENT */}
        <section className="h-[70vh] relative overflow-hidden">
          <Image 
            src="https://picsum.photos/seed/editorial-3/1920/800"
            alt="Process"
            fill
            className="object-cover grayscale opacity-80"
            sizes="100vw"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <TextReveal 
              text="Authenticity is the ultimate luxury."
              className="text-white text-4xl md:text-7xl text-center px-4 italic"
            />
          </div>
        </section>

        {/* FEATURE 02 - Inverted Grid */}
        <section className="py-32 px-4 lg:px-12 bg-background">
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 pr-12">
              <span className="text-primary font-bold uppercase text-xs tracking-widest mb-6 block">The Artisan Path</span>
              <TextReveal 
                text="Direct dialogue with master makers."
                className="text-4xl md:text-6xl mb-8"
              />
              <p className="text-muted-foreground text-xl leading-relaxed max-w-xl mb-12">
                Connect directly via WhatsApp. Negotiate the soul of your acquisition without middlemen. A marketplace built on trust and transparency.
              </p>
              <MagneticButton>
                <Link href="/register" className="border border-foreground px-12 py-5 text-sm font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-expo">
                  Join as an Artisan
                </Link>
              </MagneticButton>
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] relative overflow-hidden group">
                <Image 
                  src="https://picsum.photos/seed/editorial-4/1000/1250"
                  alt="Handmade"
                  fill
                  className="object-cover transition-expo scale-110 group-hover:scale-100 grayscale hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
