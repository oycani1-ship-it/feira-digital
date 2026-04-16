"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Sparkles, Wand2 } from "lucide-react";
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

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    category: "",
    tags: [] as string[],
    isActive: true
  });

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
        tags: formData.tags
      });
      setFormData(prev => ({ ...prev, description: result.description }));
      toast({ title: "Descrição gerada!", description: "Sua descrição foi criada pela nossa IA." });
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
        description: "Preencha o nome e a descrição para sugerir tags." 
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Sucesso!", description: "Produto cadastrado com sucesso." });
    router.push("/dashboard/produtos");
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
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input 
              id="name" 
              placeholder="Ex: Vaso de Cerâmica Azul Marinho" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select 
                value={formData.category} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
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
                disabled={isGenerating}
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
                disabled={isGenerating}
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
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" size="lg" className="flex-1 bg-primary hover:bg-primary/90">
            Salvar Produto
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}