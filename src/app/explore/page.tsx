"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, Filter, X, Store as StoreIcon } from "lucide-react";
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
import { collection, getDocs } from "firebase/firestore";

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
}

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [booths, setBooths] = useState<Booth[]>([]);

  useEffect(() => {
    const fetchBooths = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "booths"));
        const fetchedBooths: Booth[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Só adicionamos se tiver o básico: nome
          if (data.name) {
            fetchedBooths.push({
              id: doc.id,
              ...data
            } as Booth);
          }
        });
        setBooths(fetchedBooths);
      } catch (error) {
        console.error("Erro ao buscar barracas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooths();
  }, []);

  const filteredBooths = booths.filter(booth => {
    const matchesSearch = booth.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || booth.category === selectedCategory;
    const matchesState = selectedState === "all" || booth.state === selectedState;
    return matchesSearch && matchesCategory && matchesState;
  });

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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="md:hidden">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 space-y-8">
            <div>
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
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedState("all");
                      setSearchTerm("");
                    }}
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
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredBooths.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBooths.map(booth => (
                  <Link key={booth.id} href={`/barraca/${booth.id}`}>
                    <Card className="group overflow-hidden border-none shadow-md transition-smooth hover:shadow-xl hover:-translate-y-1">
                      <div className="relative h-48 bg-muted">
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
                      <CardContent className="p-4 pt-8 relative">
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
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[40px]">
                          {booth.shortDescription || booth.description || "Sem descrição disponível."}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {booth.city}, {booth.state}</span>
                          <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {booth.averageRating || "N/A"}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-sm h-9">Ver Barraca</Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                <StoreIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Nenhuma barraca encontrada</h3>
                <p className="text-muted-foreground mb-6">Tente ajustar seus filtros ou busca.</p>
                <Button onClick={() => {
                  setSelectedCategory("all");
                  setSelectedState("all");
                  setSearchTerm("");
                }}>Limpar Tudo</Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}