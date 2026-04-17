"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Star, MessageSquare, Share2, ArrowLeft, Loader2, Store as StoreIcon, ShoppingBag, User } from "lucide-react";
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
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, runTransaction, serverTimestamp, updateDoc, increment } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/context/language-context";

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
  sellerId: string;
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
  views?: number;
  whatsappClicks?: number;
}

export default function BoothDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useTranslation();
  const { id } = use(params);
  const { toast } = useToast();
  const [booth, setBooth] = useState<Booth | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRating, setIsRating] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const boothRef = doc(db, "booths", id);
        const boothSnap = await getDoc(boothRef);
        
        if (boothSnap.exists()) {
          const bData = boothSnap.data();
          setBooth({ 
            id: boothSnap.id, 
            ...bData,
            name: bData.nome ?? bData.name ?? "Sem nome",
            sellerName: bData.sellerName ?? "Artesão",
            category: bData.categoria ?? bData.category ?? "",
            city: bData.localizacao ?? bData.city ?? "",
            state: bData.estado ?? bData.state ?? "",
            coverImageUrl: bData.capaUrl ?? bData.coverImageUrl ?? ""
          } as Booth);
          
          await updateDoc(boothRef, {
            views: increment(1)
          });
        }

        let productsSnap = await getDocs(
          query(
            collection(db, "products"),
            where("boothId", "==", id as string),
            where("isActive", "==", true)
          )
        );
        if (productsSnap.empty) {
          productsSnap = await getDocs(
            query(
              collection(db, "products"),
              where("sellerId", "==", id as string),
              where("isActive", "==", true)
            )
          );
        }
        if (productsSnap.empty) {
          productsSnap = await getDocs(
            query(
              collection(db, "products"),
              where("sellerId", "==", id as string)
            )
          );
        }
        setProducts(
          productsSnap.docs.map(d => ({ 
            id: d.id, 
            ...d.data(),
            name: d.data().name ?? d.data().nome ?? "Sem nome",
            price: d.data().price ?? d.data().preco ?? 0,
            description: d.data().description ?? d.data().descricao ?? ""
          } as Product))
        );

        if (auth.currentUser) {
          const ratingId = `${auth.currentUser.uid}_${id}`;
          const ratingSnap = await getDoc(doc(db, "ratings", ratingId));
          if (ratingSnap.exists()) {
            setUserRating(ratingSnap.data().value);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados da barraca:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleWhatsApp = async (productName?: string) => {
    if (!booth) return;
    
    try {
      const boothRef = doc(db, "booths", id);
      await updateDoc(boothRef, {
        whatsappClicks: increment(1)
      });
    } catch (e) {
      console.error("Erro ao registrar clique:", e);
    }

    const message = productName 
      ? `Olá! Vi sua barraca ${booth.name ?? ""} na Feira Digital e tenho interesse no produto: ${productName}`
      : `Olá! Vi sua barraca ${booth.name ?? ""} na Feira Digital e gostaria de mais informações.`;
    window.open(`https://wa.me/${booth.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleRate = async (value: number) => {
    const user = auth.currentUser;
    if (!user) {
      return toast({ 
        title: "Acesso restrito", 
        description: "Você precisa estar logado para avaliar uma barraca.",
        variant: "destructive"
      });
    }

    if (user.uid === booth?.sellerId) {
      return toast({ 
        title: "Operação inválida", 
        description: "Você não pode avaliar sua própria barraca.",
        variant: "destructive"
      });
    }

    setIsRating(true);
    const ratingId = `${user.uid}_${id}`;
    const ratingRef = doc(db, "ratings", ratingId);
    const boothRef = doc(db, "booths", id);

    try {
      await runTransaction(db, async (transaction) => {
        const boothDoc = await transaction.get(boothRef);
        const existingRatingDoc = await transaction.get(ratingRef);

        if (!boothDoc.exists()) throw "Booth not found";

        const bData = boothDoc.data();
        let totalRatings = bData.totalRatings || 0;
        let sumRatings = (bData.averageRating || 0) * totalRatings;

        if (existingRatingDoc.exists()) {
          const oldVal = existingRatingDoc.data().value;
          sumRatings = sumRatings - oldVal + value;
        } else {
          totalRatings += 1;
          sumRatings += value;
        }

        const newAvg = sumRatings / totalRatings;

        transaction.set(ratingRef, {
          userId: user.uid,
          boothId: id,
          value,
          updatedAt: serverTimestamp()
        });

        transaction.update(boothRef, {
          totalRatings,
          averageRating: newAvg
        });

        setBooth(prev => prev ? ({ ...prev, totalRatings, averageRating: newAvg }) : null);
        setUserRating(value);
      });

      toast({ title: "Obrigado!", description: t('boothDetail.ratingSuccess') });
    } catch (err) {
      console.error(err);
      toast({ title: "Erro", description: t('boothDetail.ratingError'), variant: "destructive" });
    } finally {
      setIsRating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (!booth) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[400px]">
        <StoreIcon className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
        <h1 className="text-2xl font-bold mb-2">Barraca não encontrada</h1>
        <p className="text-muted-foreground mb-6">Esta barraca pode ter sido removida.</p>
        <Button asChild>
          <Link href="/explore">Voltar para Explorar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="relative h-[300px] md:h-[400px] bg-muted">
          {booth.coverImageUrl && (
            <Image 
              src={booth.coverImageUrl} 
              alt={booth.name ?? "Capa"} 
              fill 
              sizes="100vw"
              className="object-cover brightness-75" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="container mx-auto px-4 absolute bottom-8">
             <Link href="/explore" className="inline-flex items-center text-white/80 hover:text-white mb-4 text-sm font-medium transition-colors">
               <ArrowLeft className="mr-2 h-4 w-4" /> {t('boothDetail.backToExplore')}
             </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 relative -mt-16 z-10">
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white -mt-20 md:-mt-24">
                {booth.logoUrl ? (
                  <Image 
                    src={booth.logoUrl} 
                    alt={booth.name ?? "Logo"} 
                    fill 
                    sizes="(max-width: 768px) 128px, 160px"
                    className="object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/50">
                    <StoreIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-headline text-4xl font-bold mb-1">{booth.name ?? "Sem nome"}</h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2"><User className="h-4 w-4" /> {booth.sellerName ?? "Artesão"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleWhatsApp()} className="bg-primary hover:bg-primary/90 font-bold px-6 h-12 rounded-full">
                      <MessageSquare className="mr-2 h-4 w-4" /> {t('boothDetail.contactWhatsapp')}
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12"><Share2 className="h-4 w-4" /></Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-sm font-medium">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" /> {booth.city ?? ""}, {booth.state ?? ""}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> 
                    <span className="font-bold">{(booth.averageRating ?? 0).toFixed(1)}</span>
                    <span className="text-muted-foreground">({booth.totalRatings ?? 0} {t('boothDetail.evaluations')})</span>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-full px-4">{booth.category?.toUpperCase()}</Badge>
                </div>

                <p className="text-muted-foreground leading-relaxed max-w-3xl text-lg">
                  {booth.description || ""}
                </p>

                <div className="pt-6 border-t mt-6">
                  <p className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">{t('boothDetail.rateThisBooth')}</p>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        disabled={isRating}
                        onClick={() => handleRate(star)}
                        className={`transition-smooth hover:scale-110 ${isRating ? "cursor-wait opacity-50" : "cursor-pointer"}`}
                      >
                        <Star className={`h-8 w-8 ${userRating >= star ? "text-amber-500 fill-amber-500" : "text-muted/50"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline text-3xl font-bold">{t('boothDetail.catalogue')}</h2>
              <div className="h-px flex-1 mx-8 bg-muted hidden md:block" />
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                  <Card key={product.id} className="group overflow-hidden border-none shadow-md transition-smooth hover:shadow-xl hover:-translate-y-1 rounded-3xl">
                    <div className="relative h-64 bg-muted">
                      {product.imageUrl && (
                        <Image 
                          src={product.imageUrl} 
                          alt={product.name ?? "Produto"} 
                          fill 
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-smooth group-hover:scale-105" 
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-smooth flex items-center justify-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="opacity-0 group-hover:opacity-100 transition-smooth bg-white text-primary hover:bg-white/90 font-bold rounded-full">{t('boothDetail.viewDetails')}</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden">
                            <div className="grid md:grid-cols-2">
                              <div className="relative h-80 md:h-full bg-muted">
                                {product.imageUrl && (
                                  <Image 
                                    src={product.imageUrl} 
                                    alt={product.name ?? "Produto"} 
                                    fill 
                                    sizes="(max-width: 768px) 100vw, 600px"
                                    className="object-cover" 
                                  />
                                )}
                              </div>
                              <div className="p-8 space-y-6">
                                <DialogHeader>
                                  <DialogTitle className="font-headline text-4xl font-bold">{product.name ?? "Sem nome"}</DialogTitle>
                                </DialogHeader>
                                <div className="text-3xl font-bold text-primary">
                                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price ?? 0)}
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                  {product.description || ""}
                                </p>
                                <div className="pt-4 space-y-3">
                                  <Button onClick={() => handleWhatsApp(product.name)} className="w-full bg-primary hover:bg-primary/90 h-14 rounded-full text-lg font-bold">
                                    {t('boothDetail.interestBtn')}
                                  </Button>
                                  <p className="text-xs text-center text-muted-foreground">{t('boothDetail.directNegociation')}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-xl mb-1 truncate">{product.name ?? "Sem nome"}</h3>
                      <div className="text-primary font-bold text-lg">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price ?? 0)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-muted/20 rounded-[2.5rem] border-2 border-dashed">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{t('boothDetail.emptyCatalogue')}</h3>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}