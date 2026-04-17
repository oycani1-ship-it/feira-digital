"use client";
import { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Store, Search, X } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useTranslation } from "@/context/language-context";
import { CATEGORIAS_PLATAFORMA, ESTADOS_BR } from "@/lib/constants";

interface Booth {
  id: string;
  nome?: string; name?: string;
  bio?: string; shortDescription?: string;
  categoria?: string; category?: string;
  localizacao?: string; state?: string;
  logoUrl?: string; capaUrl?: string; coverImageUrl?: string;
  isActive?: boolean; sellerId?: string;
  avgRating?: number; totalRatings?: number;
}

export default function ExplorePage() {
  const [allBooths, setAllBooths] = useState<Booth[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [estado, setEstado]       = useState("Brasil inteiro");
  const { t } = useTranslation();
  
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchAll() {
      setLoading(true);
      try {
        const snap = await getDocs(query(collection(db, "booths"), limit(100)));
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Booth));
        setAllBooths(data.filter(b => b.isActive !== false));
      } catch (err) {
        console.error("Erro ao buscar barracas:", err);
        try {
          const snap = await getDocs(collection(db, "booths"));
          setAllBooths(snap.docs.map(d => ({ id: d.id, ...d.data() } as Booth)));
        } catch (err2) {
          console.error("Fallback falhou:", err2);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  const normalizar = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filtered = allBooths.filter(b => {
    const nome = normalizar(b.nome || b.name || "");
    const cat  = b.categoria || b.category || "";
    const loc  = b.localizacao || b.state || "";

    const passaSearch = !search.trim() ||
      nome.includes(normalizar(search)) ||
      normalizar(cat).includes(normalizar(search));
    const passaCat    = categoria === "todas" || cat === categoria;
    const passaEstado = estado === "Brasil inteiro" || loc.includes(estado);

    return passaSearch && passaCat && passaEstado;
  });

  function limpar() {
    setSearch("");
    setCategoria("todas");
    setEstado("Brasil inteiro");
  }

  const temFiltro = search || categoria !== "todas" || estado !== "Brasil inteiro";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="mb-10">
            <h1 className="font-headline text-4xl font-bold mb-3">{t('explore.title')}</h1>
            <p className="text-muted-foreground text-lg">
              {t('explore.subtitle')}
            </p>
          </div>

          {/* Busca */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                className="pl-12 h-14 rounded-2xl bg-white border-none shadow-sm focus-visible:ring-primary"
                placeholder={t('explore.searchPlaceholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <div className="flex-1 md:w-48">
                <Select value={estado} onValueChange={setEstado}>
                  <SelectTrigger className="h-14 rounded-2xl bg-white border-none shadow-sm">
                    <SelectValue placeholder={t('explore.state')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Brasil inteiro">{t('explore.allStates')}</SelectItem>
                    {ESTADOS_BR.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 md:w-56">
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger className="h-14 rounded-2xl bg-white border-none shadow-sm">
                    <SelectValue placeholder={t('explore.category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">{t('explore.allCategories')}</SelectItem>
                    {CATEGORIAS_PLATAFORMA.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {temFiltro && (
                <Button variant="ghost" onClick={limpar} className="h-14 px-6 rounded-2xl hover:bg-white/50">
                  <X className="h-4 w-4 mr-2" /> {t('explore.clearFilters')}
                </Button>
              )}
            </div>
          </div>

          {/* Grid de resultados */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-[2rem] bg-muted animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-muted/20 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center">
              <Store className="h-16 w-16 text-muted-foreground/20 mb-6" />
              <h3 className="text-2xl font-bold mb-2">{t('explore.noResults')}</h3>
              <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
                {t('explore.noResultsDesc')}
              </p>
              <Button onClick={limpar} className="rounded-full px-8">{t('explore.clearFilters')}</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(booth => (
                <Link key={booth.id} href={`/barraca/${booth.id}`}>
                  <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-smooth hover:-translate-y-1 h-full flex flex-col rounded-[2rem] bg-white">
                    <div className="relative h-48 bg-muted shrink-0">
                      {(booth.capaUrl || booth.coverImageUrl) && (
                        <img
                          src={booth.capaUrl || booth.coverImageUrl}
                          alt={booth.nome || booth.name || "Capa"}
                          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/95 text-primary border-none font-bold backdrop-blur-sm">
                          {booth.categoria || booth.category || "Artesanato"}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6 pt-10 relative flex-1 flex flex-col">
                      <div className="absolute -top-10 left-6 w-16 h-16 rounded-2xl border-4 border-white overflow-hidden shadow-lg bg-white">
                        {booth.logoUrl ? (
                          <img src={booth.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground">
                            <Store className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      
                      <h2 className="font-headline text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {booth.nome || booth.name || "Barraca Sem Nome"}
                      </h2>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {booth.bio || booth.shortDescription || "Conheça nossa arte artesanal única."}
                      </p>
                      
                      <div className="flex flex-col gap-2 border-t pt-4 mt-auto">
                        {(booth.localizacao || booth.state) && (
                          <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                            <span>📍 {booth.localizacao || booth.state}</span>
                          </div>
                        )}
                        {booth.avgRating && booth.avgRating > 0 ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <span>⭐ {booth.avgRating.toFixed(1)} ({booth.totalRatings} {t('explore.evaluations')})</span>
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground/50">Ainda não avaliada</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
