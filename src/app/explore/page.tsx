"use client";
import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store, Search, X, Loader2 } from "lucide-react";
import Image from "next/image";

const CATEGORIAS = [
  "Alimentação","Acessórios","Bijouterias e Joias","Bolsas e Couros",
  "Brinquedos e Bonecas","Cama/Mesa/Banho","Cerâmicas","Confecção Feminina",
  "Confecção Infantil","Decoração","Doces e Salgados","Fantasias",
  "Moda Artesanal","Móveis e Puffs","Quadros e Molduras","Roupas",
  "Sapatos e Calçados","Tapetes e Redes","Velas Decorativas","Outros"
];

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
  "SP","SE","TO"
];

interface Booth {
  id: string;
  nome?: string;
  name?: string;
  bio?: string;
  description?: string;
  shortDescription?: string;
  categoria?: string;
  category?: string;
  localizacao?: string;
  city?: string;
  state?: string;
  logoUrl?: string;
  capaUrl?: string;
  coverImageUrl?: string;
  isActive?: boolean;
  sellerId?: string;
}

export default function ExplorePage() {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [filtered, setFiltered] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [estadoFiltro, setEstadoFiltro] = useState("Brasil inteiro");

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const q = query(collection(db, "booths"), limit(100));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Booth));
        
        // Filtra no cliente: mostra tudo exceto isActive explicitamente false
        // Isso ajuda a mostrar barracas que ainda não tem o campo isActive
        const ativas = data.filter(b => b.isActive !== false);
        setBooths(ativas);
        setFiltered(ativas);
      } catch (err) {
        console.error("Erro ao buscar barracas:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  useEffect(() => {
    let result = [...booths];
    if (search.trim()) {
      const s = search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      result = result.filter(b => {
        const nomeBooth = (b.nome || b.name || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const catBooth = (b.categoria || b.category || "").toLowerCase();
        return nomeBooth.includes(s) || catBooth.includes(s);
      });
    }
    if (categoriaFiltro && categoriaFiltro !== "todas") {
      result = result.filter(b => (b.categoria || b.category || "") === categoriaFiltro);
    }
    if (estadoFiltro && estadoFiltro !== "Brasil inteiro") {
      result = result.filter(b => {
        const loc = (b.localizacao || b.state || "").toLowerCase();
        return loc.includes(estadoFiltro.toLowerCase());
      });
    }
    setFiltered(result);
  }, [search, categoriaFiltro, estadoFiltro, booths]);

  function limparFiltros() {
    setSearch("");
    setCategoriaFiltro("todas");
    setEstadoFiltro("Brasil inteiro");
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-headline">Explorar Feira</h1>
          <p className="text-muted-foreground">Artesanato autêntico direto de quem faz.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 h-12 rounded-full border-none shadow-sm"
              placeholder="Nome da barraca ou categoria..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
              <SelectTrigger className="w-40 h-12 rounded-full bg-white border-none shadow-sm">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Brasil inteiro">Brasil inteiro</SelectItem>
                {ESTADOS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
              <SelectTrigger className="w-52 h-12 rounded-full bg-white border-none shadow-sm">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as categorias</SelectItem>
                {CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            {(search || categoriaFiltro !== "todas" || estadoFiltro !== "Brasil inteiro") && (
              <Button variant="ghost" onClick={limparFiltros} className="h-12 rounded-full">
                <X className="h-4 w-4 mr-1" /> Limpar
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 rounded-[2rem] bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-muted/20 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center">
            <Store className="h-16 w-16 text-muted-foreground/20 mb-6" />
            <h3 className="text-2xl font-bold mb-2">Nenhuma barraca encontrada</h3>
            <p className="text-muted-foreground mb-8 max-w-xs mx-auto">Tente ajustar seus filtros ou busca para encontrar artesãos.</p>
            <Button onClick={limparFiltros} className="rounded-full px-8">Limpar todos os filtros</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(booth => (
              <Link key={booth.id} href={`/barraca/${booth.id}`}>
                <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-smooth hover:-translate-y-1 h-full flex flex-col rounded-[2rem] bg-white">
                  <div className="relative h-48 bg-muted shrink-0">
                    {(booth.capaUrl || booth.coverImageUrl) && (
                      <Image 
                        src={booth.capaUrl || booth.coverImageUrl || ""} 
                        alt={booth.nome || booth.name || "Barraca"} 
                        fill 
                        className="object-cover transition-smooth group-hover:scale-105"
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
                        <Image src={booth.logoUrl} alt="Logo" fill className="object-cover" />
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
                      {booth.bio || booth.description || booth.shortDescription || "Conheça nossa arte artesanal única."}
                    </p>
                    {(booth.localizacao || booth.state || booth.city) && (
                      <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground border-t pt-4 mt-auto">
                        <span className="flex items-center gap-1">📍 {booth.city}{booth.city && (booth.localizacao || booth.state) ? ', ' : ''}{booth.localizacao || booth.state}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
