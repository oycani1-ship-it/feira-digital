"use client";

import { useEffect, useState, Suspense } from "react";
import { collection, query, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, Package, MapPin, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KraftCard } from "@/components/ui/kraft-card";
import { PriceTag } from "@/components/ui/price-tag";
import { useTranslation } from "@/context/language-context";
import { SafeArtisanImage } from "@/components/ui/safe-artisan-image";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CATEGORIAS_PLATAFORMA } from "@/lib/constants";
import Link from "next/link";

interface Product {
  id: string;
  nome: string;
  preco: number;
  imageUrl: string;
  boothId: string;
  boothNome?: string;
  categoria: string;
  isActive?: boolean;
}

function ProductsContent() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("todas");

  useEffect(() => {
    const q = query(
      collection(db, "products"),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          nome: d.nome ?? d.name ?? "Sem nome",
          preco: d.preco ?? d.price ?? 0,
          categoria: d.categoria ?? d.category ?? "",
          imageUrl: d.imageUrl ?? d.capaUrl ?? ""
        } as Product;
      });
      setProducts(data);
      setLoading(false);
    }, (err) => {
      console.error("Erro ao carregar produtos:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filtered = products.filter(p => {
    if (p.isActive === false) return false;
    const term = search.toLowerCase();
    const matchesSearch = p.nome.toLowerCase().includes(term) || p.categoria.toLowerCase().includes(term);
    const matchesCategory = categoria === "todas" || p.categoria === categoria;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16 max-w-7xl">
        <header className="mb-16 text-center md:text-left">
          <h1 className="font-display text-5xl md:text-7xl italic mb-4">{t('productsPage.title')}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">{t('productsPage.subtitle')}</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-16 items-center">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              className="pl-12 h-14 rounded-none bg-card border-border/40" 
              placeholder={t('productsPage.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger className="h-14 w-full md:w-[240px] rounded-none bg-card border-border/40 font-mono-tag text-[10px] uppercase tracking-widest">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas" className="font-mono-tag text-[10px] uppercase">Todas as Categorias</SelectItem>
                {CATEGORIAS_PLATAFORMA.map(cat => (
                  <SelectItem key={cat} value={cat} className="font-mono-tag text-[10px] uppercase">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(search || categoria !== "todas") && (
              <Button variant="ghost" onClick={() => { setSearch(""); setCategoria("todas"); }} className="h-14 px-6 rounded-none font-mono-tag text-[10px] uppercase tracking-widest">
                <X className="h-4 w-4 mr-2" /> Limpar
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
            <p className="font-mono-tag text-[10px] uppercase tracking-widest text-muted-foreground animate-pulse">Tecendo o catálogo...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 bg-surface/30 border border-dashed flex flex-col items-center">
            <Package className="h-16 w-16 text-muted-foreground/10 mb-6" />
            <h3 className="font-display text-3xl italic mb-4">{t('productsPage.noResults')}</h3>
            <p className="text-muted-foreground max-w-sm">{t('productsPage.noResultsDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((product, i) => (
              <Link key={product.id} href={`/barraca/${product.boothId}`}>
                <KraftCard className={`h-full flex flex-col ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
                  <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-muted group">
                    <SafeArtisanImage 
                      src={product.imageUrl}
                      alt={product.nome}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-card/90 backdrop-blur-sm text-primary border-none font-mono-tag text-[8px] uppercase tracking-widest">
                        {product.categoria.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h2 className="font-display text-2xl mb-1 group-hover:text-primary transition-colors uppercase break-keep">
                      {product.nome}
                    </h2>
                    <p className="font-mono-tag text-[8px] uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-1">
                       {product.boothNome || "Ateliê Independente"}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-border/40 flex justify-end">
                      <PriceTag price={product.preco} origin={product.categoria} />
                    </div>
                  </div>
                </KraftCard>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
