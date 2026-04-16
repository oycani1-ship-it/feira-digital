
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Sparkles, Wand2, ImagePlus, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CATEGORIES } from "@/lib/constants";
import { generateProductDescription } from "@/ai/flows/generate-product-description";
import { generateProductTags } from "@/ai/flows/generate-product-tags";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Image from "next/image";

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    category: "",
    tags: [] as string[],
    isActive: true
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string].slice(0, 4)); // Limite de 4 fotos
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAiDescription = async () => {
    if (!formData.name || !formData.category || !formData.shortDescription) {
      return toast({ 
        title: "Campos necessários", 
        description: "Preencha o nome, categoria e uma breve descrição para usar a IA." 
      });
    }

    setIsGenerating(true);
    try {
      const result = await generateProductDescription({
        productName: formData.name,
        category: formData.category,
        shortDescription: formData.shortDescription,
        tags: formData.tags,
        imageUrls: images.length > 0 ? images : undefined
      });
      setFormData(prev => ({ ...prev, description: result.description }));
      toast({ title: "Descrição gerada!", description: "Sua descrição foi criada pela nossa IA considerando suas fotos." });
    } catch (err) {
      toast({ variant: "destructive", title: "Erro na IA", description: "Não foi possível gerar a descrição agora." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiTags = async () => {
    if (!formData.name || !formData.shortDescription) {
      return toast({ 
        title: "Campos necessários", 
        description: "Preencha o nome e o resumo para sugerir tags." 
      });
    }

    setIsGenerating(true);
    try {
      const result = await generateProductTags({
        productName: formData.name,
        productDescription: formData.shortDescription
      });
      setFormData(prev => ({ 
        ...prev, 
        tags: result.tags,
        category: formData.category || result.category 
      }));
      toast({ title: "Tags sugeridas!", description: "Tags e categoria atualizadas pela IA." });
    } catch (err) {
      toast({ variant: "destructive", title: "Erro na IA", description: "Não foi possível sugerir tags." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      return toast({ variant: "destructive", title: "Erro", description: "Você precisa estar logado para salvar produtos." });
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, "products"), {
        ...formData,
        price: parseFloat(formData.price),
        sellerId: user.uid,
        createdAt: serverTimestamp(),
        imageUrl: images[0] || `https://picsum.photos/seed/${Math.random()}/400/400`,
        gallery: images
      });

      toast({ title: "Sucesso!", description: "Produto cadastrado com sucesso." });
      router.push("/dashboard/produtos");
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error);
      toast({ variant: "destructive", title: "Erro ao salvar", description: "Tente novamente mais tarde." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/produtos">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold">Novo Produto</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8">
          {/* Foto do Produto */}
          <div className="space-y-4">
            <Label className="text-lg font-bold">Fotos do Produto (Máx 4)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((src, index) => (
                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-muted group">
                  <Image src={src} alt={`Preview ${index}`} fill className="object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors text-muted-foreground"
                >
                  <ImagePlus className="h-8 w-8" />
                  <span className="text-xs font-medium">Adicionar Foto</span>
                </button>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={handleFileChange}
            />
            <p className="text-xs text-muted-foreground">Arraste fotos ou clique no botão para fazer upload. Fotos reais ajudam a IA a descrever melhor sua arte.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input 
              id="name" 
              placeholder="Ex: Vaso de Cerâmica Azul Marinho" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required 
              disabled={isSaving}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select 
                value={formData.category} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                disabled={isSaving}
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
              <Label htmlFor="price">Preço (R$)</Label>
              <Input 
                id="price" 
                type="number" 
                step="0.01" 
                placeholder="0,00"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required 
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="short">Resumo para Listagem (Máx 160 chars)</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 text-primary"
                onClick={handleAiTags}
                disabled={isGenerating || isSaving}
              >
                <Sparkles className="h-3 w-3 mr-2" /> Sugerir Tags & Categoria
              </Button>
            </div>
            <Textarea 
              id="short" 
              placeholder="Uma breve frase cativante..." 
              maxLength={160}
              value={formData.shortDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              disabled={isSaving}
            />
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-none">{tag}</Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Descrição Detalhada</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 text-primary"
                onClick={handleAiDescription}
                disabled={isGenerating || isSaving}
              >
                {isGenerating ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : <Wand2 className="h-3 w-3 mr-2" />}
                Escrever com IA
              </Button>
            </div>
            <Textarea 
              id="description" 
              placeholder="Conte a história deste produto, materiais utilizados..." 
              className="min-h-[200px]"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-base">Produto Ativo</Label>
              <p className="text-sm text-muted-foreground">Visível para os clientes na sua barraca.</p>
            </div>
            <Switch 
              checked={formData.isActive}
              onCheckedChange={(val) => setFormData(prev => ({ ...prev, isActive: val }))}
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" size="lg" className="flex-1 bg-primary hover:bg-primary/90" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Salvar Produto"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()} disabled={isSaving}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
