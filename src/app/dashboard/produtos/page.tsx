"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Package, Edit2, Trash2, Search, Loader2, ImagePlus } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getDocs, deleteDoc, doc, orderBy, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/lib/constants";
import { useTranslation } from "@/context/language-context";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  isActive: boolean;
  imageUrl: string;
  description?: string;
  shortDescription?: string;
  createdAt?: any;
}

let productsCache: Product[] = [];

export default function ProductsPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    shortDescription: "",
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const fetchProducts = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      let q = query(
        collection(db, "products"),
        where("sellerId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const items: Product[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Product);
      });
      const sorted = items.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
      setProducts(sorted);
      productsCache = sorted;
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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      
      if (firebaseUser) {
        if (productsCache.length > 0) {
          setProducts(productsCache);
        }
        fetchProducts(firebaseUser.uid);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router, fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await deleteDoc(doc(db, "products", id));
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      productsCache = updated;
      toast({ title: "Produto excluído", description: "O item foi removido do seu catálogo." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível excluir o produto." });
    }
  };

  const handleEditClick = async (product: Product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      isActive: product.isActive,
    });
    setImagePreview(product.imageUrl);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !user) return;

    // Validação
    const priceValue = parseFloat(editFormData.price);
    if (!editFormData.name.trim() || isNaN(priceValue)) {
      return toast({ variant: "destructive", title: "Erro", description: "Preencha todos os campos obrigatórios." });
    }

    setIsSaving(true);
    try {
      const productRef = doc(db, "products", editingProduct.id);
      const updateData = {
        name: editFormData.name.trim(),
        price: priceValue,
        category: editFormData.category,
        description: editFormData.description.trim(),
        shortDescription: editFormData.shortDescription.trim(),
        isActive: editFormData.isActive,
        imageUrl: imagePreview || "", // Pode ser o base64 novo ou a URL antiga
        updatedAt: new Date(),
        sellerId: user.uid, // Segurança: UID garantido
      };

      await updateDoc(productRef, updateData);

      const updated = products.map(p => 
        p.id === editingProduct.id ? { ...p, ...updateData } : p
      );
      setProducts(updated);
      productsCache = updated;

      toast({ title: "Sucesso!", description: "Produto atualizado com sucesso." });
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error);
      toast({ variant: "destructive", title: "Erro ao salvar", description: "Não foi possível atualizar o produto." });
    } finally {
      setIsSaving(false);
    }
  };

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const b64 = await toBase64(file);
        setImagePreview(b64);
      } catch (err) {
        toast({ title: "Erro", description: "Falha ao processar imagem.", variant: "destructive" });
      }
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
          <h1 className="font-headline text-3xl font-bold">{t('dashboard.products.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.products.subtitle')}</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/dashboard/produtos/novo">
            <Plus className="mr-2 h-4 w-4" /> {t('dashboard.products.addBtn')}
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t('dashboard.products.searchPlaceholder')} 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-2xl overflow-hidden shadow-sm bg-white">
        {isLoading && products.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando catálogo...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[80px]">{t('dashboard.products.table.photo')}</TableHead>
                <TableHead>{t('dashboard.products.table.name')}</TableHead>
                <TableHead>{t('dashboard.products.table.category')}</TableHead>
                <TableHead>{t('dashboard.products.table.price')}</TableHead>
                <TableHead>{t('dashboard.products.table.status')}</TableHead>
                <TableHead className="text-right">{t('dashboard.products.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden border bg-muted/50">
                        {product.imageUrl ? (
                          <Image 
                            src={product.imageUrl} 
                            alt={product.name} 
                            fill 
                            sizes="48px"
                            className="object-cover" 
                          />
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
                      <Badge variant={product.isActive ? "default" : "secondary"} className={product.isActive ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : ""}>
                        {product.isActive ? t('dashboard.products.table.active') : t('dashboard.products.table.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit2 className="h-4 w-4" />
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
                      <p>{t('dashboard.products.empty')}</p>
                      <Button variant="link" asChild className="mt-2">
                         <Link href="/dashboard/produtos/novo">{t('dashboard.products.addBtn')}</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{t('dashboard.products.editModal.title')}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleUpdate} className="space-y-6 py-4">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold">{t('dashboard.products.table.photo')}</Label>
                <div className="flex items-center gap-4">
                  <div className="relative h-32 w-32 rounded-2xl overflow-hidden border-2 border-muted">
                    {imagePreview ? (
                      <Image 
                        src={imagePreview} 
                        alt="Preview" 
                        fill 
                        sizes="128px"
                        className="object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('edit-image')?.click()}
                  >
                    <ImagePlus className="mr-2 h-4 w-4" /> {t('dashboard.products.editModal.changePhoto')}
                  </Button>
                  <input 
                    id="edit-image" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={onImageChange} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-name">{t('dashboard.products.table.name')} *</Label>
                <Input 
                  id="edit-name" 
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('dashboard.products.table.category')} *</Label>
                  <Select 
                    value={editFormData.category} 
                    onValueChange={(val) => setEditFormData(prev => ({ ...prev, category: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">{t('dashboard.products.table.price')} *</Label>
                  <Input 
                    id="edit-price" 
                    type="number" 
                    step="0.01" 
                    value={editFormData.price}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, price: e.target.value }))}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-short">{t('dashboard.newProduct.summaryLabel')}</Label>
                <Textarea 
                  id="edit-short" 
                  value={editFormData.shortDescription}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">{t('dashboard.newProduct.descriptionLabel')}</Label>
                <Textarea 
                  id="edit-description" 
                  value={editFormData.description}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20">
                <div className="space-y-0.5">
                  <Label className="text-base">{t('dashboard.newProduct.activeLabel')}</Label>
                  <p className="text-xs text-muted-foreground">{t('dashboard.newProduct.activeDesc')}</p>
                </div>
                <Switch 
                  checked={editFormData.isActive}
                  onCheckedChange={(val) => setEditFormData(prev => ({ ...prev, isActive: val }))}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSaving}
              >
                {t('dashboard.products.editModal.cancelBtn')}
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('dashboard.products.editModal.saveBtn')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}