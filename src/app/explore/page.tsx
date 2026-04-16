"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, Filter, X, Store as StoreIcon, Loader2 } from "lucide-react";
import { CATEGORIES, BRAZILIAN_STATES } from "@/lib/constants";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { db } from "@/lib/firebase";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [booths, setBooths] = useState<Booth[]>([]);
  const [hasMore, setHasMore] = useState(true);
  
  // Cursor de paginação usando useRef para evitar stale closures
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

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

      // Regra: O orderBy deve ser consistente com o filtro de desigualdade
      // Se houver busca, ordenamos por nomeNormalizado. Caso contrário, por createdAt.
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

      // Filtros de Categoria e Estado (Filtros client-side se multi-campo Firestore não estiver indexado)
      // Para este protótipo, vamos filtrar no client para garantir flexibilidade sem exigir dezenas de índices compostos agora
      
      if (append && lastDocRef.current) {
        if (normalizedSearch) {
          q = query(q, startAfter(lastDocRef.current));
        } else {
          q = query(q, startAfter(lastDocRef.current));
        }
      }

      const querySnapshot = await getDocs(q);
      const fetchedDocs = querySnapshot.docs;
      
      let results: Booth[] = fetchedDocs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Booth));

      // Filtros secundários client-side (Categoria e Estado)
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBooths(activeSearch, selectedCategory, selectedState);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [activeSearch, selectedCategory, selectedState, fetchBooths]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setActiveSearch(val);
  };

  const handleLoadMore = () => {
    if (!isMoreLoading && hasMore) {
      fetchBooths(activeSearch, selectedCategory, selectedState, true);
    }
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedState("all");
    setSearchTerm("");
    setActiveSearch("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-headline text-4xl font-bold mb-2">Explorar Feira</h1>
            <p className="text-muted-foreground">Encontre barracas de artesãos de todo o Brasil.</p>
          </div>
          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Nome da barraca..." 
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 space-y-8">
            <div className="sticky top-24">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filtros
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Categoria</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Estado</label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger>
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

                {(selectedCategory !== "all" || selectedState !== "all" || searchTerm) && (
                  <Button 
                    variant="ghost" 
                    className="w-full text-xs h-8 text-destructive"
                    onClick={clearFilters}
                  >
                    <X className="mr-2 h-3 w-3" /> Limpar Filtros
                  </Button>
                )}
              </div>
            </div>
          </aside>

          {/* Listings */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : booths.length > 0 ? (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {booths.map(booth => (
                    <Link key={booth.id} href={`/barraca/${booth.id}`}>
                      <Card className="group overflow-hidden border-none shadow-md transition-smooth hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                        <div className="relative h-48 bg-muted shrink-0">
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
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-white/90 text-primary border-none">{booth.category}</Badge>
                          </div>
                        </div>
                        <CardContent className="p-4 pt-8 relative flex-1 flex flex-col">
                          <div className="absolute -top-10 left-4 w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white">
                            {booth.logoUrl ? (
                              <Image src={booth.logoUrl} alt={booth.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted/50">
                                <StoreIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">{booth.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                            {booth.shortDescription || booth.description || "Sem descrição disponível."}
                          </p>
                          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mt-auto">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {booth.city}, {booth.state}</span>
                            <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {booth.averageRating || "0.0"}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button className="w-full bg-primary hover:bg-primary/90 text-sm h-9">Ver Barraca</Button>
                        </CardFooter>
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
                      className="min-w-[200px]"
                    >
                      {isMoreLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Carregando...
                        </>
                      ) : (
                        "Carregar Mais"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                <StoreIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Nenhuma barraca encontrada</h3>
                <p className="text-muted-foreground mb-6">Tente ajustar seus filtros ou busca.</p>
                <Button onClick={clearFilters}>Limpar Tudo</Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
