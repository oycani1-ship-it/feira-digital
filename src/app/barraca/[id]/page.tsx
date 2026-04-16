"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { MapPin, Star, MessageSquare, Share2, Instagram, Globe, ShoppingBag, ArrowLeft } from "lucide-react";
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

const MOCK_BOOTH = {
  id: "1",
  name: "Cerâmicas da Terra",
  sellerName: "Maria Silva",
  description: "Trabalho com cerâmica artesanal há mais de 15 anos. Minhas peças são inspiradas na natureza e na cultura brasileira, utilizando argila de diferentes regiões do país. Cada peça é única e carrega um pouco da minha história.",
  category: "Cerâmicas",
  city: "Cunha",
  state: "SP",
  whatsapp: "5511999999999",
  instagram: "ceramicasdaterra",
  website: "www.ceramicasdaterra.com.br",
  averageRating: 4.8,
  totalRatings: 12,
  tags: ["Artesanal", "Sustentável", "Decoração", "Cozinha"],
  coverImageUrl: "https://picsum.photos/seed/ceramica-cover/1200/400",
  logoUrl: "https://picsum.photos/seed/logo-maria/200/200",
  products: [
    { id: "101", name: "Vaso Blue Moon", price: 150.00, description: "Vaso de cerâmica vitrificada em tom azul profundo.", imageUrl: "https://picsum.photos/seed/v1/400/400" },
    { id: "102", name: "Conjunto de Xícaras", price: 80.00, description: "Par de xícaras para café expresso.", imageUrl: "https://picsum.photos/seed/v2/400/400" },
    { id: "103", name: "Prato Rústico", price: 45.00, description: "Prato individual com acabamento natural.", imageUrl: "https://picsum.photos/seed/v3/400/400" },
  ]
};

export default function BoothDetailPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleWhatsApp = (productName?: string) => {
    const message = productName 
      ? `Olá! Vi sua barraca ${MOCK_BOOTH.name} na Feira Digital e tenho interesse no produto: ${productName}`
      : `Olá! Vi sua barraca ${MOCK_BOOTH.name} na Feira Digital e gostaria de mais informações.`;
    window.open(`https://wa.me/${MOCK_BOOTH.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Banner */}
        <div className="relative h-[300px] md:h-[400px]">
          <Image src={MOCK_BOOTH.coverImageUrl} alt={MOCK_BOOTH.name} fill className="object-cover brightness-75" />
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
                <Image src={MOCK_BOOTH.logoUrl} alt={MOCK_BOOTH.name} fill className="object-cover" />
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-headline text-4xl font-bold mb-1">{MOCK_BOOTH.name}</h1>
                    <p className="text-muted-foreground font-medium">Por {MOCK_BOOTH.sellerName}</p>
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
                    <MapPin className="h-4 w-4 text-primary" /> {MOCK_BOOTH.city}, {MOCK_BOOTH.state}
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="h-4 w-4 fill-primary" /> {MOCK_BOOTH.averageRating} ({MOCK_BOOTH.totalRatings} avaliações)
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none">{MOCK_BOOTH.category}</Badge>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed max-w-3xl">
                  {MOCK_BOOTH.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {MOCK_BOOTH.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="rounded-full px-3">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline text-3xl font-bold">Catálogo de Produtos</h2>
              <div className="h-px flex-1 mx-8 bg-muted hidden md:block" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {MOCK_BOOTH.products.map(product => (
                <Card key={product.id} className="group overflow-hidden border-none shadow-sm transition-smooth hover:shadow-xl hover:-translate-y-1">
                  <div className="relative h-64">
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition-smooth group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-smooth flex items-center justify-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="opacity-0 group-hover:opacity-100 transition-smooth bg-white text-primary hover:bg-white/90 font-bold">Ver Detalhes</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                          <div className="grid md:grid-cols-2 gap-6 pt-6">
                            <div className="relative h-80 rounded-2xl overflow-hidden">
                              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
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
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}