"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, X, Store as StoreIcon, Loader2, SlidersHorizontal } from "lucide-react";
import { CATEGORIES, BRAZILIAN_STATES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  QueryDocumentSnapshot,
  DocumentData
} from "firebase/firestore";

interface Booth {
  id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  category: string;
  city: string;
  state: string;
  averageRating?: number;
  totalRatings?: number;
  coverImageUrl?: string;
  logoUrl?: string;
  nameNormalizado?: string;
}

const PAGE_SIZE = 9;

const normalizarParaBusca = (str: string) => {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("categoria") || "all");
  const [selectedState, setSelectedState] = useState(searchParams.get("estado") || "all");
  
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [booths, setBooths] = useState<Booth[]>([]);
  const [hasMore, setHasMore] = useState(true);
  
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

  // 1. PADRÃO: AGUARDA AUTENTICAÇÃO SER CONFIRMADA
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const updateURL = useCallback((search: string, category: string, state: string) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category !== "all") params.set("categoria", category);
    if (state !== "all") params.set("estado", state);
    
    const queryString = params.toString();
    router.replace(`/explore${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [router]);

  const fetchBooths = useCallback(async (search: string, category: string, state: string, append = false) => {
    if (append) setIsMoreLoading(true);
    else {
      setIsLoading(true);
      setBooths([]);
      lastDocRef.current = null;
    }

    try {
      const boothsRef = collection(db, "booths");
      let q;

      const normalizedSearch = normalizarParaBusca(search);

      if (normalizedSearch) {
        q = query(
          boothsRef,
          where("nameNormalizado", ">=", normalizedSearch),
          where("nameNormalizado", "<=", normalizedSearch + "\uf8ff"),
          orderBy("nameNormalizado"),
          limit(PAGE_SIZE)
        );
      } else {
        q = query(
          boothsRef,
          orderBy("updatedAt", "desc"),
          limit(PAGE_SIZE)
        );
      }

      if (append && lastDocRef.current) {
        q = query(q, startAfter(lastDocRef.current));
      }

      const querySnapshot = await getDocs(q);
      const fetchedDocs = querySnapshot.docs;
      
      let results: Booth[] = fetchedDocs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Booth));

      if (category !== "all") {
        results = results.filter(b => b.category === category);
      }
      if (state !== "all") {
        results = results.filter(b => b.state === state);
      }

      setBooths(prev => append ? [...prev, ...results] : results);
      lastDocRef.current = fetchedDocs.length > 0 ? fetchedDocs[fetchedDocs.length - 1] : null;
      setHasMore(fetchedDocs.length === PAGE_SIZE);

    } catch (error) {
      console.error("Erro ao buscar barracas:", error);
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  }, []);

  // 2. SÓ BUSCA QUANDO authLoading === false
  useEffect(() => {
    if (authLoading) return;

    const delayDebounceFn = setTimeout(() => {
      fetchBooths(searchTerm, selectedCategory, selectedState);
      updateURL(searchTerm, selectedCategory, selectedState);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory, selectedState, fetchBooths, updateURL, authLoading]);

  const handleLoadMore = () => {
    if (!isMoreLoading && hasMore) {
      fetchBooths(searchTerm, selectedCategory, selectedState, true);
    }
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedState("all");
    setSearchTerm("");
  };

  const removeFilter = (type: 'q' | 'cat' | 'state') => {
    if (type === 'q') setSearchTerm("");
    if (type === 'cat') setSelectedCategory("all");
    if (type === 'state') setSelectedState("all");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="font-headline text-4xl font-bold mb-2">Explorar Feira</h1>
            <p className="text-muted-foreground">Artesanato autêntico direto de quem faz.</p>
          </div>
          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Nome da barraca..." 
                className="pl-10 h-12 bg-white rounded-full border-none shadow-sm focus-visible:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {(selectedCategory !== "all" || selectedState !== "all" || searchTerm) && (
          <div className="flex flex-wrap gap-2 mb-8">
            {searchTerm && (
              <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-none gap-2">
                Busca: {searchTerm} <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter('q')} />
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-none gap-2">
                {selectedCategory} <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter('cat')} />
              </Badge>
            )}
            {selectedState !== "all" && (
              <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-none gap-2">
                Estado: {selectedState} <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter('state')} />
              </Badge>
            )}
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={clearFilters}>
              Limpar tudo
            </Button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-72 space-y-8">
            <div className="sticky top-24 bg-white p-6 rounded-3xl border shadow-sm">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filtros
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Estado</label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="bg-muted/30 border-none">
                      <SelectValue placeholder="Brasil inteiro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Brasil inteiro</SelectItem>
                      {BRAZILIAN_STATES.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Categorias</label>
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => setSelectedCategory("all")}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === "all" ? "bg-primary text-white font-bold" : "hover:bg-muted"}`}
                    >
                      Todas as categorias
                    </button>
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat ? "bg-primary text-white font-bold" : "hover:bg-muted"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:hidden mb-6">
             <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full bg-white border-none shadow-sm">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="all">Todas as categorias</SelectItem>
                   {CATEGORIES.map(cat => (
                     <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                   ))}
                </SelectContent>
             </Select>
          </div>

          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-56 w-full rounded-3xl" />
                    <Skeleton className="h-6 w-3/4 rounded-full" />
                    <Skeleton className="h-4 w-1/2 rounded-full" />
                  </div>
                ))}
              </div>
            ) : booths.length > 0 ? (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {booths.map(booth => (
                    <Link key={booth.id} href={`/barraca/${booth.id}`}>
                      <Card className="group overflow-hidden border-none shadow-sm transition-smooth hover:shadow-xl hover:-translate-y-1 h-full flex flex-col bg-white">
                        <div className="relative h-56 bg-muted shrink-0">
                          {booth.coverImageUrl ? (
                             <Image 
                              src={booth.coverImageUrl} 
                              alt={booth.name} 
                              fill 
                              className="object-cover transition-smooth group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <StoreIcon className="h-12 w-12 text-muted-foreground/20" />
                            </div>
                          )}
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-white/95 text-primary border-none font-bold backdrop-blur-sm">{booth.category}</Badge>
                          </div>
                        </div>
                        <CardContent className="p-5 pt-8 relative flex-1 flex flex-col">
                          <div className="absolute -top-10 left-6 w-16 h-16 rounded-2xl border-4 border-white overflow-hidden shadow-lg bg-white">
                            {booth.logoUrl ? (
                              <Image src={booth.logoUrl} alt={booth.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted/50">
                                <StoreIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-headline text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{booth.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                            {booth.shortDescription || booth.description || "Conheça nossa arte artesanal."}
                          </p>
                          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mt-auto pt-4 border-t">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" /> {booth.city}, {booth.state}</span>
                            <span className="flex items-center gap-1">
                              <Star className={`h-3 w-3 ${booth.averageRating ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`} /> 
                              {booth.averageRating ? booth.averageRating.toFixed(1) : "N/A"} 
                              {booth.totalRatings ? <span className="font-normal">({booth.totalRatings})</span> : null}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
                
                {hasMore && (
                  <div className="flex justify-center pb-8">
                    <Button 
                      variant="outline" 
                      onClick={handleLoadMore} 
                      disabled={isMoreLoading}
                      className="min-w-[200px] rounded-full h-12"
                    >
                      {isMoreLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Carregando...
                        </>
                      ) : (
                        "Ver mais barracas"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-24 bg-muted/20 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                  <StoreIcon className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Nenhuma barraca encontrada</h3>
                <p className="text-muted-foreground mb-8 max-w-xs mx-auto">Tente ajustar seus filtros ou termos de busca para encontrar artesãos.</p>
                <Button onClick={clearFilters} className="rounded-full px-8">Limpar todos os filtros</Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}