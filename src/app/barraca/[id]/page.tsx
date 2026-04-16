"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { MapPin, Star, MessageSquare, Share2, Instagram, Globe, ShoppingBag, ArrowLeft, Loader2, Store as StoreIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

interface Booth {
  id: string;
  name: string;
  sellerName: string;
  description: string;
  category: string;
  city: string;
  state: string;
  whatsapp: string;
  instagram?: string;
  website?: string;
  averageRating?: number;
  totalRatings?: number;
  tags?: string[];
  coverImageUrl?: string;
  logoUrl?: string;
}

export default function BoothDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [booth, setBooth] = useState<Booth | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Booth Details
        const boothRef = doc(db, "booths", id);
        const boothSnap = await getDoc(boothRef);
        
        if (boothSnap.exists()) {
          setBooth({ id: boothSnap.id, ...boothSnap.data() } as Booth);
        }

        // Fetch Booth Products
        const productsQuery = query(
          collection(db, "products"),
          where("sellerId", "==", id),
          where("isActive", "==", true)
        );
        const productsSnap = await getDocs(productsQuery);
        const fetchedProducts: Product[] = [];
        productsSnap.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Erro ao carregar dados da barraca:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleWhatsApp = (productName?: string) => {
    if (!booth) return;
    const message = productName 
      ? `Olá! Vi sua barraca ${booth.name} na Feira Digital e tenho interesse no produto: ${productName}`
      : `Olá! Vi sua barraca ${booth.name} na Feira Digital e gostaria de mais informações.`;
    window.open(`https://wa.me/${booth.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground font-medium">Carregando barraca...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booth) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <StoreIcon className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
          <h1 className="text-2xl font-bold mb-2">Barraca não encontrada</h1>
          <p className="text-muted-foreground mb-6">Esta barraca pode ter sido removida ou o link está incorreto.</p>
          <Button asChild>
            <Link href="/explore">Voltar para Explorar</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Banner */}
        <div className="relative h-[300px] md:h-[400px] bg-muted">
          {booth.coverImageUrl && (
            <Image src={booth.coverImageUrl} alt={booth.name} fill className="object-cover brightness-75" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="container mx-auto px-4 absolute bottom-8">
             <Link href="/explore" className="inline-flex items-center text-white/80 hover:text-white mb-4 text-sm font-medium transition-colors">
               <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Explorar
             </Link>
          </div>
        </div>

        {/* Profile Info */}
        <div className="container mx-auto px-4 relative -mt-16 z-10">
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white -mt-20 md:-mt-24">
                {booth.logoUrl ? (
                  <Image src={booth.logoUrl} alt={booth.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/50">
                    <StoreIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-headline text-4xl font-bold mb-1">{booth.name}</h1>
                    <p className="text-muted-foreground font-medium">Por {booth.sellerName}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleWhatsApp()} className="bg-primary hover:bg-primary/90 font-bold">
                      <MessageSquare className="mr-2 h-4 w-4" /> Contato WhatsApp
                    </Button>
                    <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm font-medium">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" /> {booth.city}, {booth.state}
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="h-4 w-4 fill-primary" /> {booth.averageRating || 0} ({booth.totalRatings || 0} avaliações)
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none">{booth.category}</Badge>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed max-w-3xl">
                  {booth.description}
                </p>

                {booth.tags && booth.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {booth.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="rounded-full px-3">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline text-3xl font-bold">Catálogo de Produtos</h2>
              <div className="h-px flex-1 mx-8 bg-muted hidden md:block" />
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                  <Card key={product.id} className="group overflow-hidden border-none shadow-sm transition-smooth hover:shadow-xl hover:-translate-y-1">
                    <div className="relative h-64 bg-muted">
                      {product.imageUrl && (
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition-smooth group-hover:scale-105" />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-smooth flex items-center justify-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="opacity-0 group-hover:opacity-100 transition-smooth bg-white text-primary hover:bg-white/90 font-bold">Ver Detalhes</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl">
                            <div className="grid md:grid-cols-2 gap-6 pt-6">
                              <div className="relative h-80 rounded-2xl overflow-hidden bg-muted">
                                {product.imageUrl && (
                                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                                )}
                              </div>
                              <div className="space-y-4">
                                <DialogHeader>
                                  <DialogTitle className="font-headline text-3xl font-bold">{product.name}</DialogTitle>
                                </DialogHeader>
                                <div className="text-2xl font-bold text-primary">
                                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                </div>
                                <p className="text-muted-foreground">
                                  {product.description}
                                </p>
                                <div className="pt-4 space-y-3">
                                  <Button onClick={() => handleWhatsApp(product.name)} className="w-full bg-primary hover:bg-primary/90 h-12 text-lg font-bold">
                                    Interesse neste produto
                                  </Button>
                                  <p className="text-xs text-center text-muted-foreground">O artesão será contatado diretamente pelo WhatsApp.</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                      <div className="text-primary font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-bold mb-2">Nenhum produto cadastrado</h3>
                <p className="text-muted-foreground">Fique de olho! O artesão deve atualizar seu catálogo em breve.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}