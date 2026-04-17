
"use client";

import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Store, Sparkles, Heart, LayoutDashboard } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const featuredCategories = CATEGORIES.slice(0, 8);
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[650px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src={heroImage?.imageUrl || "https://picsum.photos/seed/feira-hero/1200/600"} 
              alt="Feira de Artesanato"
              fill
              sizes="100vw"
              className="object-cover brightness-[0.4]"
              priority
              data-ai-hint="artisan craft fair pottery"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              O coração do artesanato,<br /><span className="text-secondary">agora no digital.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-12 duration-1000">
              Descubra peças únicas feitas com amor por artesãos brasileiros. 
              Sua próxima descoberta artesanal está a um clique de distância.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-16 duration-1000">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg h-14 px-8 w-full sm:w-auto" asChild>
                <Link href="/explore">Começar a Explorar <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              
              <Button size="lg" variant="secondary" className="text-lg h-14 px-8 w-full sm:w-auto font-bold shadow-lg" asChild>
                <Link href={user ? "/dashboard" : "/login"}>
                  <LayoutDashboard className="mr-2 h-5 w-5" /> Acessar Minha Barraca
                </Link>
              </Button>

              {!user && (
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20 text-lg h-14 px-8 w-full sm:w-auto" asChild>
                  <Link href="/register">Abrir minha Barraca</Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Categorias Populares</h2>
              <p className="text-muted-foreground">Encontre o que você procura entre diversas artes e especialidades.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
              {featuredCategories.map((cat, i) => (
                <Link key={cat} href={`/explore?category=${encodeURIComponent(cat)}`} className="group">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center transition-smooth group-hover:bg-primary group-hover:scale-110 shadow-sm overflow-hidden relative">
                       <Image 
                        src={`https://picsum.photos/seed/cat-${i}/200/200`}
                        alt={cat}
                        fill
                        sizes="80px"
                        className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                       />
                    </div>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{cat}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="como-funciona" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2">
                <h2 className="font-headline text-4xl font-bold mb-8">Transforme seu talento em um negócio digital.</h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">1</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Crie seu Perfil</h3>
                      <p className="text-muted-foreground">Cadastre-se e monte sua barraca virtual em poucos minutos. Adicione fotos, história e sua localização.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">2</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Adicione seus Produtos</h3>
                      <p className="text-muted-foreground">Use nossa IA para gerar descrições atraentes e tags que ajudam os clientes a encontrar sua arte.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">3</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Comece a Vender</h3>
                      <p className="text-muted-foreground">Receba contatos diretos pelo WhatsApp e gerencie suas vendas sem intermediários ou taxas abusivas.</p>
                    </div>
                  </div>
                </div>
                <Button className="mt-12 bg-primary hover:bg-primary/90" size="lg" asChild>
                  <Link href="/register">Criar minha Barraca Agora</Link>
                </Button>
              </div>
              <div className="lg:w-1/2 relative h-[500px] w-full">
                <div className="absolute top-0 right-0 w-4/5 h-4/5 rounded-2xl overflow-hidden shadow-2xl">
                  <Image 
                    src="https://picsum.photos/seed/artisan-working/600/600" 
                    fill 
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover" 
                    alt="Artesão trabalhando" 
                    data-ai-hint="artisan working" 
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-3/5 h-3/5 rounded-2xl border-8 border-white overflow-hidden shadow-2xl">
                  <Image 
                    src="https://picsum.photos/seed/product-detail/600/600" 
                    fill 
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover" 
                    alt="Produto artesanal" 
                    data-ai-hint="craft product" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Benefits */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Store className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Autenticidade</h3>
                <p className="text-muted-foreground">Cada barraca é um world único, com histórias reais por trás de cada criação.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Tecnologia com IA</h3>
                <p className="text-muted-foreground">Ferramentas inteligentes para ajudar você a descrever e categorizar seus produtos.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Direto ao Ponto</h3>
                <p className="text-muted-foreground">Negociação direta com o artesão via WhatsApp, sem complicação ou taxas extras.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
