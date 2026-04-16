"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Package, Edit2, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  isActive: boolean;
  imageUrl: string;
  createdAt?: any;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (!firebaseUser) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchProducts = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      // Tenta com orderBy (pode falhar se o índice não existir)
      let q;
      try {
        q = query(
          collection(db, "products"),
          where("sellerId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const items: Product[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(items);
      } catch (indexError) {
        // Fallback: Query simples + ordenação local
        q = query(
          collection(db, "products"),
          where("sellerId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        const items: Product[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(items.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast({ 
        variant: "destructive", 
        title: "Erro", 
        description: "Não foi possível carregar seus produtos." 
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchProducts(user.uid);
    }
  }, [user, authLoading, fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({ title: "Produto excluído", description: "O item foi removido do seu catálogo." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível excluir o produto." });
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Verificando acesso...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">Gerencie o catálogo da sua barraca.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/dashboard/produtos/novo">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar produtos..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-2xl overflow-hidden shadow-sm bg-white">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando catálogo...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[80px]">Foto</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden border bg-muted/50">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? "default" : "secondary"} className={product.isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                        {product.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/produtos/${product.id}/editar`}>
                            <Edit2 className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Package className="h-10 w-10 mb-2 opacity-20" />
                      <p>Nenhum produto encontrado.</p>
                      <Button variant="link" asChild className="mt-2">
                         <Link href="/dashboard/produtos/novo">Cadastrar meu primeiro produto</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}