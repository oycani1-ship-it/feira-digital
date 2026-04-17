
"use client";
import { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KraftCard } from "@/components/ui/kraft-card";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Store, Search, X, MapPin, Star, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useTranslation } from "@/context/language-context";
import { CATEGORIAS_PLATAFORMA, ESTADOS_BR } from "@/lib/constants";
import { LoomLoader } from "@/components/ui/loom-loader";

interface Booth {
  id: string;
  nome: string;
  bio?: string;
  categoria: string;
  localizacao: string;
  estado: string;
  logoUrl?: string;
  capaUrl?: string;
  isActive?: boolean;
  avgRating?: number;
  totalRatings?: number;
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
        const q = query(
          collection(db, "booths"), 
          where("isActive", "==", true),
          orderBy("createdAt", "desc"),
          limit(100)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Booth));
        setAllBooths(data);
      } catch (err) {
        console.error("Error fetching booths:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  const normalizar = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filtered = allBooths.filter(b => {
    const nome = normalizar(b.nome || "");
    const cat  = b.categoria || "";
    const loc  = b.localizacao || "";
    const uf   = b.estado || "";

    const passaSearch = !search.trim() ||
      nome.includes(normalizar(search)) ||
      normalizar(cat).includes(normalizar(search));
    const passaCat    = categoria === "todas" || cat === categoria;
    const passaEstado = estado === "Brasil inteiro" || uf === estado;

    return passaSearch && passaCat && passaEstado;
  });

  function limpar() {
    setSearch("");
    setCategoria("todas");
    setEstado("Brasil inteiro");
  }

  const temFiltro = search || categoria !== "todas" || estado !== "Brasil inteiro";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="mb-12 text-center md:text-left">
            <h1 className="font-display text-5xl md:text-7xl italic mb-4">{t('explore.title')}</h1>
            <p className="text-muted-foreground text-lg font-body max-w-2xl">
              {t('explore.subtitle')}
            </p>
          </div>

          {/* Busca e Filtros */}
          <div className="flex flex-col lg:flex-row gap-4 mb-16">
            <div className="relative flex-1 group" data-cursor="stitch">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                className="pl-12 h-14 rounded-none bg-card border-border/40 focus-visible:ring-primary shadow-sm"
                placeholder={t('explore.searchPlaceholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[140px]">
                <Select value={estado} onValueChange={setEstado}>
                  <SelectTrigger className="h-14 rounded-none bg-card border-border/40 font-mono-tag text-[10px] uppercase tracking-widest">
                    <SelectValue placeholder={t('explore.state')} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Brasil inteiro" className="font-mono-tag text-[10px] uppercase">{t('explore.allStates')}</SelectItem>
                    {ESTADOS_BR.map(e => <SelectItem key={e} value={e} className="font-mono-tag text-[10px] uppercase">{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 min-w-[180px]">
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger className="h-14 rounded-none bg-card border-border/40 font-mono-tag text-[10px] uppercase tracking-widest">
                    <SelectValue placeholder={t('explore.category')} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="todas" className="font-mono-tag text-[10px] uppercase">{t('explore.allCategories')}</SelectItem>
                    {CATEGORIAS_PLATAFORMA.map(c => <SelectItem key={c} value={c} className="font-mono-tag text-[10px] uppercase">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {temFiltro && (
                <Button variant="ghost" onClick={limpar} className="h-14 px-6 rounded-none hover:bg-muted font-mono-tag text-[10px] uppercase tracking-widest">
                  <X className="h-4 w-4 mr-2" /> {t('explore.clearFilters')}
                </Button>
              )}
            </div>
          </div>

          {/* Grid de resultados */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-muted animate-pulse border border-border/20" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32 bg-surface/30 rounded-none border border-dashed flex flex-col items-center">
              <Store className="h-16 w-16 text-muted-foreground/10 mb-6" />
              <h3 className="font-display text-4xl italic mb-4">{t('explore.noResults')}</h3>
              <p className="text-muted-foreground mb-12 max-w-sm font-body">
                {t('explore.noResultsDesc')}
              </p>
              <Button onClick={limpar} variant="outline" className="rounded-none px-12 h-12 font-mono-tag text-[10px] uppercase tracking-widest">
                {t('explore.clearFilters')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filtered.map((booth, i) => (
                <Link key={booth.id} href={`/barraca/${booth.id}`}>
                  <KraftCard className={`h-full flex flex-col ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'}`} dataCursor="inspect">
                    <div className="relative h-56 mb-8 overflow-hidden bg-muted group">
                      {booth.capaUrl ? (
                        <Image
                          src={booth.capaUrl}
                          alt={booth.nome}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                          <Store className="h-16 w-16" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-card/90 backdrop-blur-sm text-primary border-none font-mono-tag text-[8px] uppercase tracking-widest">
                          {booth.categoria}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="relative flex-1 flex flex-col">
                      <div className="absolute -top-14 left-0 w-16 h-16 rounded-none border-2 border-background overflow-hidden shadow-lg bg-card">
                        {booth.logoUrl ? (
                          <Image src={booth.logoUrl} alt="Logo" width={64} height={64} className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xl font-display">
                            {booth.nome.charAt(0)}
                          </div>
                        )}
                      </div>
                      
                      <h2 className="font-display text-3xl mb-3 mt-4 group-hover:text-primary transition-colors">
                        {booth.nome}
                      </h2>
                      
                      <p className="text-sm text-muted-foreground font-body line-clamp-2 mb-8 leading-relaxed">
                        {booth.bio || "Conheça nossa arte artesanal única e as histórias por trás de cada peça."}
                      </p>
                      
                      <div className="mt-auto pt-6 border-t border-border/40 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-mono-tag text-[9px] uppercase tracking-widest text-muted-foreground">
                          <MapPin className="h-3 w-3 text-primary" />
                          {booth.localizacao}, {booth.estado}
                        </div>
                        {booth.avgRating && booth.avgRating > 0 ? (
                          <div className="flex items-center gap-1.5 font-mono-tag text-[9px] uppercase tracking-widest text-gold">
                            <Star className="h-3 w-3 fill-current" />
                            {booth.avgRating.toFixed(1)}
                          </div>
                        ) : (
                          <span className="font-mono-tag text-[8px] uppercase tracking-tighter text-muted-foreground/40">Nova na feira</span>
                        )}
                      </div>
                    </div>
                  </KraftCard>
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
