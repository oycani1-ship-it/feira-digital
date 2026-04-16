"use client";

import { useState } from "react";
import { Plus, Package, Edit2, Trash2, Search, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const MOCK_PRODUCTS = [
  { id: "1", name: "Vaso de Barro Terracota", price: 85.00, category: "Cerâmicas", isActive: true, imageUrl: "https://picsum.photos/seed/p1/50/50" },
  { id: "2", name: "Cesto de Palha M", price: 45.90, category: "Decoração", isActive: true, imageUrl: "https://picsum.photos/seed/p2/50/50" },
  { id: "3", name: "Bolsa Bordada Flor", price: 120.00, category: "Acessórios", isActive: false, imageUrl: "https://picsum.photos/seed/p3/50/50" },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden border">
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
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
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
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
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}